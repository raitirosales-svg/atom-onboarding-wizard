type CanvasNode = {
  id: string;
  type?: string;
  position?: { x: number; y: number };
  data?: Record<string, any>;
};

type CanvasEdge = {
  id?: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
};

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
  http_request: 'http_v2',
  customer_recognition: 'http_v2',
};

function shortId(prefix = 'n') {
  return `${prefix}_${Math.random().toString(16).slice(2, 10)}`;
}

function buildParams(
  canvasType: string,
  data: Record<string, any>,
  label: string,
  description: string
) {
  const base: Record<string, any> = {
    label,
    text: description || label,
  };

  switch (canvasType) {
    case 'eval_response':
      return {
        ...base,
        buttons: (data.options || ['Opción 1', 'Opción 2']).map((opt: string, i: number) => ({
          id: `btn_${i + 1}`,
          title: String(opt).slice(0, 20),
        })),
      };
    case 'condition':
      return {
        ...base,
        condition_if: data.conditionIf || description || 'condición',
        condition_else: data.conditionElse || 'else',
      };
    case 'save_field':
      return {
        ...base,
        field_name: data.fieldName || 'campo',
        field_scope: data.fieldScope || 'permanent',
      };
    case 'crm':
    case 'payment':
    case 'database_api':
    case 'meta_capi':
    case 'http_request':
    case 'customer_recognition':
      return {
        ...base,
        system_name: data.systemName || label,
        method: 'POST',
        url: '',
        notes: description,
      };
    case 'tag':
      return { ...base, tags: data.options || [label] };
    case 'typification':
    case 'end':
      return { ...base, typification: label || 'Fin Autogestión' };
    case 'assign_group':
      return { ...base, group: data.systemName || 'Asesores' };
    case 'smarton':
      return { ...base, prompt: description || label };
    case 'delay':
      return { ...base, seconds: 5 };
    default:
      return base;
  }
}

export function canvasToFlowPlan(input: {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  project?: { name?: string; industry?: string; brandColor?: string };
  comments?: any[];
  contexto?: Record<string, any>;
}) {
  const nodes = input.nodes || [];
  const edges = input.edges || [];
  const project = input.project || {};

  const plan: {
    name: string;
    platform: string;
    mode: string;
    meta?: Record<string, any>;
    nodes: any[];
    edges: any[];
  } = {
    name: project.name || 'Untitled',
    platform: 'whatsapp',
    mode: 'create',
    meta: {
      industry: project.industry,
      brandColor: project.brandColor,
      contexto: input.contexto || {},
      comments: input.comments || [],
      exportedAt: new Date().toISOString(),
      source: 'atom-onboarding-wizard-canvas',
    },
    nodes: [],
    edges: [],
  };

  const idMap: Record<string, string> = {};
  const nodesById: Record<string, CanvasNode> = {};
  nodes.forEach((n) => {
    nodesById[n.id] = n;
  });

  const botId = shortId('bot');
  plan.nodes.push({
    id: botId,
    type: 'bot',
    params: { label: `${project.name || 'Bot'} #1` },
    section: 'Flujo principal',
  });

  const targetIds = new Set(edges.map((e) => e.target));
  const startNodes = nodes.filter((n) => !targetIds.has(n.id));
  const startNode = startNodes[0] || nodes[0];
  if (!startNode) return plan;

  const edgeMap: Record<string, Array<{ target: string; handle: string }>> = {};
  edges.forEach((e) => {
    if (!edgeMap[e.source]) edgeMap[e.source] = [];
    edgeMap[e.source].push({
      target: e.target,
      handle: e.sourceHandle || 'out',
    });
  });

  const visited = new Set<string>();

  const processNode = (canvasId: string, parentFbId: string, parentPort: string) => {
    if (visited.has(canvasId)) {
      const existing = idMap[canvasId];
      if (existing) {
        plan.edges.push({
          id: shortId('e'),
          source: parentFbId,
          sourceHandle: parentPort,
          target: existing,
          targetHandle: 'in',
        });
      }
      return;
    }
    visited.add(canvasId);

    const node = nodesById[canvasId];
    if (!node) return;

    const data = node.data || {};
    const canvasType = data.type || 'message';
    const fbType = TYPE_MAP[canvasType] || 'message_text';
    const nid = shortId('cn');
    idMap[canvasId] = nid;

    const label = String(data.label || canvasType).slice(0, 40);
    const description = String(data.description || '');

    plan.nodes.push({
      id: nid,
      type: fbType,
      params: buildParams(canvasType, data, label, description),
      section: 'Flujo principal',
      position: node.position || { x: 0, y: 0 },
    });

    plan.edges.push({
      id: shortId('e'),
      source: parentFbId,
      sourceHandle: parentPort,
      target: nid,
      targetHandle: 'in',
    });

    const children = edgeMap[canvasId] || [];
    if (canvasType === 'eval_response' && (data.options || []).length > 0) {
      children.forEach((child, idx) => {
        const port = `btn_${idx + 1}`;
        processNode(child.target, nid, port);
      });
    } else if (canvasType === 'condition') {
      children.forEach((child, idx) => {
        processNode(child.target, nid, idx === 0 ? 'true' : 'false');
      });
    } else {
      children.forEach((child) => {
        processNode(child.target, nid, 'out');
      });
    }
  };

  processNode(startNode.id, botId, 'out');

  nodes.forEach((n) => {
    if (!visited.has(n.id)) {
      processNode(n.id, botId, 'out');
    }
  });

  return plan;
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
