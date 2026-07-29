import json, subprocess, sys, os

# ═════════════════════════════════════════════════
# 1. DATOS DEL SETUP (lo que llena el onboarding)
# ═════════════════════════════════════════════════
project = {
    "name": "Banco Digital v1",
    "clientName": "Banco Digital",
    "industry": "Servicios Financieros",
    "objective": "Atender consultas de productos financieros, verificar identidad del cliente, y derivar solicitudes de préstamo a asesores especializados. Reducir tiempo de respuesta en WhatsApp de 15 min a menos de 2 min.",
    "description": "Profesional, formal y confiable. Sin emojis. Lenguaje claro y directo. Dirigirse al cliente por su apellido. Respuestas concisas, máximo 3 líneas.",
    "author": "Equipo Onboarding"
}

# ═════════════════════════════════════════════════
# 2. FLUJO DISEÑADO EN CANVAS (14 nodos)
# ═════════════════════════════════════════════════
nodes = [
    {"id":"n1","data":{"type":"message","label":"Bienvenida","description":"Buenos dias Sr./Sra. {{client.last_name}}. Bienvenido a Banco Digital. Soy su asistente virtual. En que puedo ayudarle?"}},
    {"id":"n2","data":{"type":"eval_response","label":"Menu Principal","options":["Prestamos","Tarjetas","Inversiones","Estado de cuenta","Hablar con asesor"]}},
    
    # Rama: Préstamos
    {"id":"n3","data":{"type":"save_field","label":"Tipo de prestamo","fieldName":"custom_tipo_prestamo"}},
    {"id":"n4","data":{"type":"eval_response","label":"Monto aproximado","options":["Menos de $5,000","$5,000 - $20,000","Mas de $20,000"]}},
    {"id":"n5","data":{"type":"save_field","label":"Monto","fieldName":"custom_monto"}},
    {"id":"n6","data":{"type":"save_field","label":"Nombre completo","fieldName":"custom_nombre"}},
    {"id":"n7","data":{"type":"crm","label":"Verificar cliente","systemName":"Core Bancario","method":"GET","url":"https://api.bancodigital.com/v1/clientes/{{client.identificacion}}"}},
    {"id":"n8","data":{"type":"customer_stage","label":"Lead","fieldName":"lead"}},
    {"id":"n9","data":{"type":"assign_group","label":"Asignar asesor","systemName":"Asesores Prestamos"}},
    {"id":"n10","data":{"type":"typification","label":"Prestamo solicitado","description":"Cliente completo formulario de prestamo"}},
    
    # Rama: Estado de cuenta
    {"id":"n11","data":{"type":"save_field","label":"Numero de cuenta","fieldName":"custom_numero_cuenta"}},
    {"id":"n12","data":{"type":"crm","label":"Consultar saldo","systemName":"Core Bancario","method":"GET","url":"https://api.bancodigital.com/v1/cuentas/{{flow_field.var_numero_cuenta}}"}},
    {"id":"n13","data":{"type":"typification","label":"Consulta resuelta","description":"Cliente consulto estado de cuenta"}},
    
    # Rama: Hablar con asesor
    {"id":"n14","data":{"type":"assign_group","label":"Asignar atencion","systemName":"Atencion al Cliente"}},
    {"id":"n15","data":{"type":"typification","label":"Transferido","description":"Cliente transferido a asesor humano"}},
]

edges = [
    {"source":"n1","target":"n2"},
    {"source":"n2","target":"n3"},       # Prestamos
    {"source":"n3","target":"n4"},
    {"source":"n4","target":"n5"},
    {"source":"n5","target":"n6"},
    {"source":"n6","target":"n7"},
    {"source":"n7","target":"n8"},
    {"source":"n8","target":"n9"},
    {"source":"n9","target":"n10"},
    {"source":"n2","target":"n11"},      # Estado de cuenta
    {"source":"n11","target":"n12"},
    {"source":"n12","target":"n13"},
    {"source":"n2","target":"n14"},      # Hablar con asesor
    {"source":"n14","target":"n15"},
]

canvas_data = {"project": project, "nodes": nodes, "edges": edges}

print("=" * 60)
print("BANCO DIGITAL v1 — Prueba completa")
print("=" * 60)
print(f"Cliente:     {project['clientName']}")
print(f"Industria:   {project['industry']}")
print(f"Objetivo:    {project['objective'][:80]}...")
print(f"Tono:        {project['description'][:80]}...")
print(f"Nodos:       {len(nodes)}")
print(f"Conexiones:  {len(edges)}")
print(f"Variables:   custom_tipo_prestamo, custom_monto, custom_nombre, custom_numero_cuenta")
print(f"Integracion: Core Bancario (2 endpoints)")
print(f"Tipificaciones: Prestamo solicitado, Consulta resuelta, Transferido")
print(f"Asignaciones:  Asesores Prestamos, Atencion al Cliente")

# Save input
with open("test_banco_input.json", "w", encoding="utf-8") as f:
    json.dump(canvas_data, f, indent=2, ensure_ascii=False)

# ═════════════════════════════════════════════════
# 3. CONVERTIR A FLOW_PLAN
# ═════════════════════════════════════════════════
r = subprocess.run([sys.executable, "canvas_to_flow_plan.py", "test_banco_input.json", "test_banco_plan.json"], 
                   capture_output=True, text=True)
print(f"\n{r.stdout.strip()}")

# ═════════════════════════════════════════════════
# 4. VALIDAR CON LA SKILL FLOWBUILDER
# ═════════════════════════════════════════════════
skill = r"..\..\.opencode\skills\atom-flowbuilder-skill\builders"

for step, args in [
    ("plan_validator", ["test_banco_plan.json"]),
    ("assembler", ["test_banco_plan.json", "test_banco_real.json"]),
    ("real_validator", ["test_banco_real.json"]),
    ("layout_check", ["test_banco_real.json"]),
]:
    r2 = subprocess.run([sys.executable, f"{skill}\\{step}"] + args, capture_output=True, text=True)
    lines = [l for l in r2.stdout.split('\n') if l.strip()]
    if step == "plan_validator":
        errors = sum(1 for l in lines if 'ERROR' in l.upper())
        warns = sum(1 for l in lines if 'WARN' in l.upper())
        print(f"{step}: {errors} errores, {warns} warns")
    else:
        print(f"{step}: {lines[-1] if lines else 'OK'}")

# ═════════════════════════════════════════════════
# 5. MOSTRAR RESULTADO
# ═════════════════════════════════════════════════
print("\n" + "=" * 60)
print("RESULTADO FINAL")
print("=" * 60)

with open("test_banco_plan.json", encoding="utf-8") as f:
    plan = json.load(f)
print(f"FlowPlan: {len(plan['nodes'])} nodos, {len(plan['edges'])} conexiones")

if os.path.exists("test_banco_real.json"):
    with open("test_banco_real.json", encoding="utf-8") as f:
        real = json.load(f)
    cells = len(real.get("cells", []))
    print(f"real.json: {cells} cells -> LISTO PARA SUBIR A ATOM")
else:
    print("ERROR: No se genero real.json")
