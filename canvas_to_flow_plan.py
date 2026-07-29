"""
Canvas to FlowPlan Converter
Converts the ReactFlow canvas data format to FlowBuilder-compatible flow_plan.json.
Usage: python canvas_to_flow_plan.py canvas_data.json [output_plan.json]
"""
import json
import sys
import uuid

# ── Type mapping: Canvas node type → FlowBuilder component type ──
TYPE_MAP = {
    "message": "message_text",
    "template": "message_template",
    "eval_response": "evaluate_buttons",
    "condition": "conditional",
    "jump": "jump",
    "end": "typification",
    "delay": "wait",
    "save_field": "save_field",
    "location": "location",
    "smarton": "smarton_generic",
    "format": "formatter_text",
    "tag": "tag",
    "customer_stage": "stage",
    "typification": "typification",
    "assign_group": "assignation",
    "crm": "http_v2",
    "payment": "http_v2",
    "database_api": "http_v2",
    "meta_capi": "http_v2",
}


def short_id(prefix="n"):
    return f"{prefix}_{uuid.uuid4().hex[:8]}"


def convert(canvas_data):
    """Main converter: canvas nodes/edges → flow_plan.json"""

    nodes = canvas_data.get("nodes", [])
    edges = canvas_data.get("edges", [])
    project = canvas_data.get("project", {})
    comments = canvas_data.get("comments", [])

    plan = {
        "name": project.get("name", "Untitled"),
        "platform": "whatsapp",
        "mode": "create",
        "nodes": [],
        "edges": []
    }

    # Map canvas node IDs to FlowBuilder node IDs
    id_map = {}  # canvas_id → flowbuilder_id
    nodes_by_id = {}  # canvas_id → canvas node

    for node in nodes:
        nodes_by_id[node["id"]] = node

    # ── Always start with a bot node ──
    bot_id = short_id("bot")
    plan["nodes"].append({
        "id": bot_id,
        "type": "bot",
        "params": {"label": f"{project.get('name','Bot')} #1"},
        "section": "Flujo principal"
    })

    prev_fb_id = bot_id
    prev_port = "out"

    # ── Find starting node (no incoming edges) ──
    target_ids = {e["target"] for e in edges}
    start_nodes = [n for n in nodes if n["id"] not in target_ids]

    if not start_nodes:
        # Fallback: use first node
        start_node = nodes[0] if nodes else None
    else:
        start_node = start_nodes[0]

    if not start_node:
        print("No nodes found in canvas data")
        return plan

    # ── Convert nodes in order, following edges ──
    visited = set()
    edge_map = {}  # source_id → [(target_id, source_handle)]
    for e in edges:
        src = e["source"]
        if src not in edge_map:
            edge_map[src] = []
        edge_map[src].append((e["target"], e.get("sourceHandle", "out")))

    # BFS/DFS to process nodes in flow order
    def process_node(canvas_id, parent_fb_id, parent_port, port_index=None):
        if canvas_id in visited:
            return
        visited.add(canvas_id)

        node = nodes_by_id.get(canvas_id)
        if not node:
            return

        data = node.get("data", {})
        canvas_type = data.get("type", node.get("type", "message"))
        fb_type = TYPE_MAP.get(canvas_type, "message_text")

        nid = short_id("cn")
        id_map[canvas_id] = nid

        label = data.get("label", "")[:30] or canvas_type
        description = data.get("description", "")

        # Build FlowBuilder node params based on type
        params = _build_params(canvas_type, fb_type, data, label, description)

        plan["nodes"].append({
            "id": nid,
            "type": fb_type,
            "params": params,
            "section": "Flujo principal"
        })

        # Connect from parent
        if port_index is not None:
            plan["edges"].append({
                "from": parent_fb_id,
                "port": parent_port,
                "port_index": port_index,
                "to": nid
            })
        else:
            plan["edges"].append({
                "from": parent_fb_id,
                "port": parent_port,
                "to": nid
            })

        # Process children
        children = edge_map.get(canvas_id, [])
        if canvas_type == "eval_response":
            options = data.get("options", [])
            connected_indices = set()
            for idx, (target_id, handle) in enumerate(children):
                connected_indices.add(idx)
                process_node(target_id, nid, "button", idx)
            # Connect unconnected options to a default close
            for idx in range(len(options)):
                if idx not in connected_indices:
                    _add_default_close(plan, nid, "button", f"Opcion {idx+1}", idx)
            # other → end
            _add_default_close(plan, nid, "other")
            # no_answer → recovery message then close
            _add_recovery_close(plan, nid, "Timeout menu")

        elif canvas_type == "condition":
            connected_indices = set()
            for idx, (target_id, handle) in enumerate(children):
                connected_indices.add(idx)
                process_node(target_id, nid, "out", idx)
            # other
            _add_default_close(plan, nid, "other")

        elif canvas_type == "smarton":
            intents = data.get("options", [])
            connected_indices = set()
            for idx, (target_id, handle) in enumerate(children):
                connected_indices.add(idx)
                process_node(target_id, nid, "message_body", idx)
            for idx in range(len(intents)):
                if idx not in connected_indices:
                    _add_default_close(plan, nid, "message_body", f"Intencion {idx+1}", idx)
            _add_default_close(plan, nid, "other")
            _add_recovery_close(plan, nid, "Timeout Smarton")

        elif fb_type == "http_v2":
            # HTTP nodes: children may be success/failure
            has_success = False
            has_failure = False
            for target_id, handle in children:
                if handle and "fail" in handle.lower():
                    has_failure = True
                elif handle and ("success" in handle.lower() or "out" in handle.lower()):
                    has_success = True
                process_node(target_id, nid, handle if handle in ("success", "failure") else "success")
                if handle in ("success", "failure"):
                    if handle == "success": has_success = True
                    if handle == "failure": has_failure = True
            if not has_success:
                _add_default_close(plan, nid, "success", "HTTP OK")
            if not has_failure:
                _add_error_recovery(plan, nid)

        else:
            for target_id, handle in children:
                process_node(target_id, nid, "out")
            # If terminal node type (typification, assignation, end) - no additional connections needed
            if fb_type in ("typification", "assignation", "save_field", "tag", "stage", "flowchart_end"):
                pass  # Terminal nodes, no output needed

    # ── Start processing ──
    process_node(start_node["id"], bot_id, "out")

    # ── Handle orphaned nodes ──
    for node in nodes:
        if node["id"] not in visited:
            process_node(node["id"], bot_id, "out")

    return plan


def _build_params(canvas_type, fb_type, data, label, description):
    """Build FlowBuilder-compatible params from canvas node data."""
    params = {"label": label}

    if fb_type == "message_text":
        params["text"] = description or label

    elif fb_type == "evaluate_buttons":
        options = data.get("options", [])
        params["values"] = [o[:20] for o in options]
        params["no_answer_minutes"] = 30
        params["no_answer_period"] = "minutos"

    elif fb_type == "conditional":
        field = data.get("fieldName", "var_default")
        options = data.get("options", [])
        condition_if = data.get("conditionIf", "Si")
        condition_else = data.get("conditionElse", "No")
        branches = []
        if condition_if:
            branches.append({"label": condition_if[:30], "operator": "equal_to", "values": [condition_if[:30]]})
        params["field"] = field
        params["branches"] = branches

    elif fb_type == "jump":
        params["target"] = data.get("targetId", "")

    elif fb_type == "typification":
        params["name"] = label[:20] if label else "Cierre"
        params["description"] = description or label

    elif fb_type == "wait":
        params["minutes"] = data.get("delayMinutes", 0)

    elif fb_type == "save_field":
        params["field"] = data.get("fieldName", "var_field")

    elif fb_type == "smarton_generic":
        params["description"] = description or label
        params["prompt"] = _build_smarton_prompt(data, label, description)
        options = data.get("options", [])
        params["intents"] = [{"name": o[:30], "description": o} for o in options]
        params["no_answer_minutes"] = 30
        params["no_answer_period"] = "minutos"

    elif fb_type == "formatter_text":
        params["output_field"] = data.get("fieldName", "var_formatted")
        params["prompt"] = data.get("prompt", "Formatear datos")

    elif fb_type == "stage":
        keyword = data.get("fieldName", "awareness")
        params["keyword"] = keyword

    elif fb_type == "assignation":
        params["group"] = data.get("systemName", label)

    elif fb_type == "http_v2":
        system = data.get("systemName", "API")
        params["label"] = label[:30]
        params["method"] = data.get("method", "GET")
        params["url"] = data.get("url", "")
        params["auth"] = {"type": "bearer", "token_source": f"var_{system.lower().replace(' ','_')}_token"}

    elif fb_type == "message_template":
        params["text"] = description or label
        params["template_name"] = data.get("templateName", label)

    elif fb_type == "tag":
        params["name"] = label[:20]

    return params


def _build_smarton_prompt(data, label, description):
    system = data.get("systemName", "")
    return f"""## 1. Rol e Identidad
Eres un asistente IA especializado en {label}.

## 2. Tono y Estilo de Comunicacion
* Voz: profesional y amable
* Formato WhatsApp: mensajes cortos, *negrita con UN solo asterisco*.
* UNA SOLA PREGUNTA A LA VEZ.

## 3. Restricciones
* No inventes datos.
* Si el usuario se desvia, retoma con amabilidad.

## 4. Dominio
{description or label}

## 5. Flujo de la Conversacion
1. Presenta opciones sobre {label}.
2. Guia al usuario paso a paso.

## 6. Cierre
Cuando el usuario este satisfecho, ofrece siguiente paso."""


def _add_default_close(plan, from_id, port, label="Cierre default", port_index=None):
    suffix = short_id("")[-4:]
    close_id = short_id("cls")
    plan["nodes"].append({
        "id": close_id,
        "type": "typification",
        "params": {"label": f"{label[:16]} {suffix}", "name": label[:20], "description": label},
        "section": "Flujo principal"
    })
    edge = {"from": from_id, "port": port, "to": close_id}
    if port_index is not None:
        edge["port_index"] = port_index
    plan["edges"].append(edge)


def _add_recovery_close(plan, from_id, label="Timeout"):
    """Add recovery message before closing on timeout."""
    msg_id = short_id("rec")
    plan["nodes"].append({
        "id": msg_id,
        "type": "message_text",
        "params": {"label": f"Recupero {label}"[:30], "text": "Parece que estas ocupado. Cuando gustes retomar, aqui estare."},
        "section": "Flujo principal"
    })
    plan["edges"].append({"from": from_id, "port": "no_answer", "to": msg_id})
    _add_default_close(plan, msg_id, "out", label)


def _add_error_recovery(plan, from_id):
    """Add empathetic error message + close for HTTP failures."""
    suffix = short_id("")[-4:]
    msg_id = short_id("err")
    plan["nodes"].append({
        "id": msg_id,
        "type": "message_text",
        "params": {"label": f"Error API {suffix}", "text": "Estoy teniendo problemas para procesar tu solicitud. Te conectare con un asesor."},
        "section": "Flujo principal"
    })
    plan["edges"].append({"from": from_id, "port": "failure", "to": msg_id})
    _add_default_close(plan, msg_id, "out", f"Error sistema {suffix}")


# ── CLI ──────────────────────────────────────────────
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python canvas_to_flow_plan.py canvas_data.json [output_plan.json]")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else "flow_plan.json"

    with open(input_file, "r", encoding="utf-8") as f:
        canvas_data = json.load(f)

    plan = convert(canvas_data)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(plan, f, indent=2, ensure_ascii=False)

    print(f"flow_plan.json generado: {output_file}")
    print(f"  {len(plan['nodes'])} nodos, {len(plan['edges'])} conexiones")
