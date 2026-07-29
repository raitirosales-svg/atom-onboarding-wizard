/**
 * Canvas-to-FlowPlan converter — runs entirely in the browser.
 * Converts ReactFlow canvas data to FlowBuilder-compatible flow_plan.json.
 * No Python, no server needed.
 */

interface CanvasNode {
  id: string;
  data: {
    type: string;
    label: string;
    description?: string;
    options?: string[];
    fieldName?: string;
    systemName?: string;
    conditionIf?: string;
    conditionElse?: string;
    delayMinutes?: number;
    method?: string;
    url?: string;
    templateName?: string;
    isIntegration?: boolean;
  };
}

interface CanvasEdge {
  source: string;
  target: string;
  sourceHandle: string;
}

interface CanvasProject {
  id?: string;
  name?: string;
  industry?: string;
  brandColor?: string;
  version?: string;
}

interface CanvasData {
  project?: CanvasProject;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  comments?: any[];
}

interface FlowNode {
  id: string;
  type: string;
  params: Record<string, any>;
  section: string;
}

interface FlowEdge {
  from: string;
  port: string;
  port_index?: number;
  to: string;
}

interface FlowPlan {
  name: string;
  platform: string;
  mode: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

const TYPE_MAP: Record<string, string> = {
  message: 'message_text',
  template: 'message_template',
  eval_response: 'evaluate_buttons',
  condition: 'conditional',
  jump: 'jump',
  end: 'typification',
  delay: 'wait',
  save_field: 'save_field',
  location: 'location',
  smarton: 'smarton_generic',
  format: 'formatter_text',
  tag: 'tag',
  customer_stage: 'stage',
  typification: 'typification',
  assign_group: 'assignation',
  crm: 'http_v2',
  payment: 'http_v2',
  database_api: 'http_v2',
  meta_capi: 'http_v2',
};

let nodeCounter = 0;
function uid(prefix = 'n'): string {
  return `${prefix}_${Date.now().toString(36)}_${(nodeCounter++).toString(36)}`;
}

export function convertCanvasToFlowPlan(canvasData: CanvasData): FlowPlan {
  nodeCounter = 0;
  const { nodes, edges, project = {} } = canvasData;

  const plan: FlowPlan = {
    name: project.name || 'Untitled',
    platform: 'whatsapp',
    mode: 'create',
    nodes: [],
    edges: [],
  };

  const idMap: Record<string, string> = {};
  const edgeMap: Record<string, Array<{ target: string; handle: string }>> = {};

  for (const e of edges) {
    if (!edgeMap[e.source]) edgeMap[e.source] = [];
    edgeMap[e.source].push({ target: e.target, handle: e.sourceHandle });
  }

  // Start node
  const botId = uid('bot');
  plan.nodes.push({ id: botId, type: 'bot', params: { label: `${project.name || 'Bot'} #1` }, section: 'Flujo principal' });

  // Find entry node (no incoming edges)
  const targetIds = new Set(edges.map(e => e.target));
  const startNodes = nodes.filter(n => !targetIds.has(n.id));
  const startNode = startNodes[0] || nodes[0];
  const visited = new Set<string>();

  function processNode(canvasId: string, parentId: string, parentPort: string, portIndex?: number) {
    if (visited.has(canvasId)) return;
    visited.add(canvasId);

    const node = nodes.find(n => n.id === canvasId);
    if (!node) return;

    const data = node.data || {};
    const canvasType = data.type || 'message';
    const fbType = TYPE_MAP[canvasType] || 'message_text';
    const nid = uid('cn');
    idMap[canvasId] = nid;

    const label = (data.label || canvasType).substring(0, 30);
    const params = buildParams(canvasType, fbType, data, label);

    plan.nodes.push({ id: nid, type: fbType, params, section: 'Flujo principal' });

    const edge: FlowEdge = { from: parentId, port: parentPort, to: nid };
    if (portIndex !== undefined) edge.port_index = portIndex;
    plan.edges.push(edge);

    const children = edgeMap[canvasId] || [];

    if (canvasType === 'eval_response') {
      const options = data.options || [];
      const connected = new Set<number>();
      for (const [idx, child] of children.entries()) {
        connected.add(idx);
        processNode(child.target, nid, 'button', idx);
      }
      for (let i = 0; i < options.length; i++) {
        if (!connected.has(i)) addDefaultClose(plan, nid, 'button', `Opcion ${i + 1}`, i);
      }
      addDefaultClose(plan, nid, 'other');
      addRecoveryClose(plan, nid, 'Timeout menu');

    } else if (canvasType === 'condition') {
      for (const [idx, child] of children.entries()) {
        processNode(child.target, nid, 'out', idx);
      }
      addDefaultClose(plan, nid, 'other');

    } else if (canvasType === 'smarton') {
      const intents = data.options || [];
      const connected = new Set<number>();
      for (const [idx, child] of children.entries()) {
        connected.add(idx);
        processNode(child.target, nid, 'message_body', idx);
      }
      for (let i = 0; i < intents.length; i++) {
        if (!connected.has(i)) addDefaultClose(plan, nid, 'message_body', `Intencion ${i + 1}`, i);
      }
      addDefaultClose(plan, nid, 'other');
      addRecoveryClose(plan, nid, 'Timeout Smarton');

    } else if (fbType === 'http_v2') {
      let hasSuccess = false;
      for (const child of children) {
        const port = child.handle?.includes('fail') ? 'failure' : 'success';
        if (port === 'success') hasSuccess = true;
        processNode(child.target, nid, port);
      }
      if (!hasSuccess) addDefaultClose(plan, nid, 'success', 'HTTP OK');
      addErrorRecovery(plan, nid);

    } else {
      for (const child of children) {
        processNode(child.target, nid, 'out');
      }
    }
  }

  if (startNode) processNode(startNode.id, botId, 'out');

  // Orphaned nodes
  for (const node of nodes) {
    if (!visited.has(node.id)) processNode(node.id, botId, 'out');
  }

  return plan;
}

function buildParams(canvasType: string, _fbType: string, data: any, label: string): Record<string, any> {
  const p: Record<string, any> = { label };

  switch (canvasType) {
    case 'message':
    case 'template':
      p.text = data.description || label;
      break;
    case 'eval_response':
      p.values = (data.options || []).map((o: string) => o.substring(0, 20));
      p.no_answer_minutes = 30;
      p.no_answer_period = 'minutos';
      break;
    case 'condition':
      p.field = data.fieldName || 'var_default';
      p.branches = data.conditionIf
        ? [{ label: data.conditionIf.substring(0, 30), operator: 'equal_to', values: [data.conditionIf.substring(0, 30)] }]
        : [];
      break;
    case 'typification':
    case 'end':
      p.name = label.substring(0, 20);
      p.description = data.description || label;
      break;
    case 'smarton':
      p.description = data.description || label;
      p.prompt = buildSmartonPrompt(data, label);
      p.intents = (data.options || []).map((o: string) => ({ name: o.substring(0, 30), description: o }));
      p.no_answer_minutes = 30;
      p.no_answer_period = 'minutos';
      break;
    case 'save_field':
      p.field = data.fieldName || 'var_field';
      break;
    case 'customer_stage':
      p.keyword = data.fieldName || 'awareness';
      break;
    case 'assign_group':
      p.group = data.systemName || label;
      break;
    case 'format':
      p.output_field = data.fieldName || 'var_formatted';
      p.prompt = data.description || 'Formatear datos';
      break;
    case 'http_v2':
    case 'crm':
    case 'payment':
    case 'database_api':
    case 'meta_capi':
      p.method = data.method || 'GET';
      p.url = data.url || '';
      p.auth = { type: 'bearer', token_source: `var_${(data.systemName || 'api').toLowerCase().replace(/\s+/g, '_')}_token` };
      break;
    case 'jump':
      p.target = data.targetId || '';
      break;
    case 'delay':
      p.minutes = data.delayMinutes || 0;
      break;
    case 'tag':
      p.name = label.substring(0, 20);
      break;
  }
  return p;
}

function buildSmartonPrompt(data: any, label: string): string {
  return `## 1. Rol e Identidad
Eres un asistente IA especializado en ${label}.

## 2. Tono y Estilo de Comunicacion
* Voz: profesional y amable
* Formato WhatsApp: mensajes cortos, *negrita con UN solo asterisco*.
* UNA SOLA PREGUNTA A LA VEZ.

## 3. Restricciones
* No inventes datos.
* Si el usuario se desvia, retoma con amabilidad.

## 4. Dominio
${data.description || label}

## 5. Flujo de la Conversacion
1. Presenta opciones sobre ${label}.
2. Guia al usuario paso a paso.

## 6. Cierre
Cuando el usuario este satisfecho, ofrece siguiente paso.`;
}

function addDefaultClose(plan: FlowPlan, fromId: string, port: string, label = 'Cierre', portIndex?: number) {
  const suffix = uid('').slice(-4);
  const cid = uid('cls');
  plan.nodes.push({
    id: cid,
    type: 'typification',
    params: { label: `${label.substring(0, 16)} ${suffix}`, name: label.substring(0, 20), description: label },
    section: 'Flujo principal',
  });
  const edge: FlowEdge = { from: fromId, port, to: cid };
  if (portIndex !== undefined) edge.port_index = portIndex;
  plan.edges.push(edge);
}

function addRecoveryClose(plan: FlowPlan, fromId: string, label = 'Timeout') {
  const mid = uid('rec');
  plan.nodes.push({
    id: mid,
    type: 'message_text',
    params: { label: `Recupero ${label}`.substring(0, 30), text: 'Parece que estas ocupado. Cuando gustes retomar, aqui estare.' },
    section: 'Flujo principal',
  });
  plan.edges.push({ from: fromId, port: 'no_answer', to: mid });
  addDefaultClose(plan, mid, 'out', label);
}

function addErrorRecovery(plan: FlowPlan, fromId: string) {
  const suffix = uid('').slice(-4);
  const mid = uid('err');
  plan.nodes.push({
    id: mid,
    type: 'message_text',
    params: { label: `Error API ${suffix}`, text: 'Estoy teniendo problemas para procesar tu solicitud. Te conectare con un asesor.' },
    section: 'Flujo principal',
  });
  plan.edges.push({ from: fromId, port: 'failure', to: mid });
  addDefaultClose(plan, mid, 'out', `Error sistema ${suffix}`);
}

export function downloadFlowPlan(flowPlan: FlowPlan, projectName = 'proyecto') {
  const blob = new Blob([JSON.stringify(flowPlan, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-flow_plan.json`;
  a.click();
  URL.revokeObjectURL(url);
}
