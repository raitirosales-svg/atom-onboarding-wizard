import { Node, Edge } from '@xyflow/react';
import { FlowPlan, FlowPlanNode, FlowPlanEdge, WhatsAppNodeData, NodeType } from '../types';

const TYPE_MAP: Record<NodeType, string> = {
  message: 'message_text',
  template: 'message_template',
  eval_response: 'evaluate_buttons',
  condition: 'conditional',
  jump: 'jump',
  typification: 'typification',
  delay: 'wait',
  save_field: 'save_field',
  smarton: 'smarton_generic',
  format: 'formatter_text',
  tag: 'tag',
  customer_stage: 'stage',
  assign_group: 'assignation',
  crm: 'http_v2',
};

function shortId(prefix = 'n'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 10)}`;
}

export function convertCanvasToFlowPlan(
  nodes: Node<WhatsAppNodeData>[],
  edges: Edge[],
  projectName: string
): FlowPlan {
  const plan: FlowPlan = {
    name: projectName || 'Sin Título',
    platform: 'whatsapp',
    mode: 'create',
    nodes: [],
    edges: [],
  };

  const botId = shortId('bot');
  plan.nodes.push({
    id: botId,
    type: 'bot',
    params: { label: `${projectName || 'Bot'} #1` },
    section: 'Flujo principal',
  });

  const nodesById = new Map<string, Node<WhatsAppNodeData>>();
  nodes.forEach((n) => nodesById.set(n.id, n));

  const targetIds = new Set(edges.map((e) => e.target));
  const startNodes = nodes.filter((n) => !targetIds.has(n.id));
  const startNode = startNodes[0] || nodes[0];

  if (!startNode) return plan;

  const visited = new Set<string>();
  const edgeMap = new Map<string, Array<{ target: string; handle: string }>>();

  edges.forEach((e) => {
    if (!edgeMap.has(e.source)) {
      edgeMap.set(e.source, []);
    }
    edgeMap.get(e.source)!.push({
      target: e.target,
      handle: e.sourceHandle || 'out',
    });
  });

  function processNode(
    canvasId: string,
    parentFbId: string,
    parentPort: string,
    portIndex?: number
  ) {
    if (visited.has(canvasId)) return;
    visited.add(canvasId);

    const node = nodesById.get(canvasId);
    if (!node) return;

    const data = node.data;
    const canvasType = data.nodeType || 'message';
    const fbType = TYPE_MAP[canvasType] || 'message_text';

    const nid = shortId('cn');

    const label = (data.label || canvasType).substring(0, 30);
    const description = data.description || '';

    const params: Record<string, unknown> = { label };

    if (fbType === 'message_text') {
      params.text = description || label;
    } else if (fbType === 'evaluate_buttons') {
      const options = data.options || ['Opción 1', 'Opción 2'];
      params.values = options.map((o) => o.substring(0, 20));
      params.no_answer_minutes = data.noAnswerMinutes || 30;
      params.no_answer_period = 'minutos';
    } else if (fbType === 'conditional') {
      params.field = data.fieldName || 'var_default';
      const condIf = data.conditionIf || 'Si';
      params.branches = [
        {
          label: condIf.substring(0, 30),
          operator: 'equal_to',
          values: [condIf.substring(0, 30)],
        },
      ];
    } else if (fbType === 'typification') {
      params.name = label.substring(0, 20);
      params.description = description || label;
    } else if (fbType === 'wait') {
      params.minutes = data.delayMinutes || 5;
    } else if (fbType === 'save_field') {
      params.field = data.fieldName || 'var_field';
    } else if (fbType === 'smarton_generic') {
      params.description = description || label;
      params.prompt =
        data.prompt ||
        `Eres un asistente IA de WhatsApp especializado en ${label}.\nInstrucciones: Responde de forma concisa y profesional.`;
      const intents = data.options || ['Consulta', 'Soporte'];
      params.intents = intents.map((i) => ({
        name: i.substring(0, 30),
        description: i,
      }));
      params.no_answer_minutes = 30;
      params.no_answer_period = 'minutos';
    } else if (fbType === 'http_v2') {
      params.label = label.substring(0, 30);
      params.method = data.method || 'GET';
      params.url = data.url || 'https://api.ejemplo.com/v1/webhook';
      params.auth = {
        type: 'bearer',
        token_source: `var_${(data.systemName || 'api').toLowerCase().replace(/\s+/g, '_')}_token`,
      };
    } else if (fbType === 'message_template') {
      params.text = description || label;
      params.template_name = data.templateName || label;
    } else if (fbType === 'stage') {
      params.keyword = data.fieldName || 'awareness';
    } else if (fbType === 'assignation') {
      params.group = data.systemName || label;
    } else if (fbType === 'tag') {
      params.name = label.substring(0, 20);
    }

    plan.nodes.push({
      id: nid,
      type: fbType,
      params,
      section: 'Flujo principal',
    });

    // Add Edge from parent
    const edgeObj: FlowPlanEdge = {
      from: parentFbId,
      port: parentPort,
      to: nid,
    };
    if (portIndex !== undefined) {
      edgeObj.port_index = portIndex;
    }
    plan.edges.push(edgeObj);

    // Process Children
    const children = edgeMap.get(canvasId) || [];

    if (canvasType === 'eval_response') {
      const options = data.options || ['Opción 1', 'Opción 2'];
      const connectedIndices = new Set<number>();

      children.forEach((c, idx) => {
        connectedIndices.add(idx);
        processNode(c.target, nid, 'button', idx);
      });

      options.forEach((_, idx) => {
        if (!connectedIndices.has(idx)) {
          addDefaultClose(plan, nid, 'button', `Opción ${idx + 1}`, idx);
        }
      });

      addDefaultClose(plan, nid, 'other');
      addRecoveryClose(plan, nid, 'Timeout Menú');
    } else if (canvasType === 'condition') {
      children.forEach((c, idx) => {
        processNode(c.target, nid, 'out', idx);
      });
      addDefaultClose(plan, nid, 'other');
    } else if (canvasType === 'smarton') {
      const options = data.options || ['Consulta'];
      const connectedIndices = new Set<number>();

      children.forEach((c, idx) => {
        connectedIndices.add(idx);
        processNode(c.target, nid, 'message_body', idx);
      });

      options.forEach((_, idx) => {
        if (!connectedIndices.has(idx)) {
          addDefaultClose(plan, nid, 'message_body', `Intención ${idx + 1}`, idx);
        }
      });

      addDefaultClose(plan, nid, 'other');
      addRecoveryClose(plan, nid, 'Timeout Smarton');
    } else if (fbType === 'http_v2') {
      let hasSuccess = false;
      let hasFailure = false;

      children.forEach((c) => {
        const h = c.handle.toLowerCase();
        if (h.includes('fail')) hasFailure = true;
        if (h.includes('succ') || h.includes('out')) hasSuccess = true;

        const port = h.includes('fail') ? 'failure' : 'success';
        processNode(c.target, nid, port);
      });

      if (!hasSuccess) addDefaultClose(plan, nid, 'success', 'HTTP Exitoso');
      if (!hasFailure) addErrorRecovery(plan, nid);
    } else {
      children.forEach((c) => {
        processNode(c.target, nid, 'out');
      });
    }
  }

  processNode(startNode.id, botId, 'out');

  // Handle orphan nodes
  nodes.forEach((n) => {
    if (!visited.has(n.id)) {
      processNode(n.id, botId, 'out');
    }
  });

  return plan;
}

function addDefaultClose(
  plan: FlowPlan,
  fromId: string,
  port: string,
  label = 'Cierre por defecto',
  portIndex?: number
) {
  const closeId = shortId('cls');
  plan.nodes.push({
    id: closeId,
    type: 'typification',
    params: {
      label: `${label.substring(0, 16)}`,
      name: label.substring(0, 20),
      description: label,
    },
    section: 'Flujo principal',
  });

  const edge: FlowPlanEdge = { from: fromId, port, to: closeId };
  if (portIndex !== undefined) edge.port_index = portIndex;
  plan.edges.push(edge);
}

function addRecoveryClose(plan: FlowPlan, fromId: string, label: string) {
  const msgId = shortId('rec');
  plan.nodes.push({
    id: msgId,
    type: 'message_text',
    params: {
      label: `Recupero ${label}`.substring(0, 30),
      text: 'Parece que estás ocupado. Cuando desees retomar, aquí estaré a tu disposición.',
    },
    section: 'Flujo principal',
  });
  plan.edges.push({ from: fromId, port: 'no_answer', to: msgId });
  addDefaultClose(plan, msgId, 'out', label);
}

function addErrorRecovery(plan: FlowPlan, fromId: string) {
  const msgId = shortId('err');
  plan.nodes.push({
    id: msgId,
    type: 'message_text',
    params: {
      label: 'Error de Conexión',
      text: 'Hubo un inconveniente con el sistema. Te transferiré con un asesor humano inmediatamente.',
    },
    section: 'Flujo principal',
  });
  plan.edges.push({ from: fromId, port: 'failure', to: msgId });
  addDefaultClose(plan, msgId, 'out', 'Error Sistema');
}
