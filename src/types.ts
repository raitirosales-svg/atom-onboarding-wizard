export type NodeType =
  | 'message'
  | 'template'
  | 'eval_response'
  | 'condition'
  | 'jump'
  | 'typification'
  | 'delay'
  | 'save_field'
  | 'smarton'
  | 'format'
  | 'tag'
  | 'customer_stage'
  | 'assign_group'
  | 'crm';

export interface WhatsAppNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
  nodeType: NodeType;
  fieldName?: string;
  conditionIf?: string;
  conditionElse?: string;
  options?: string[];
  systemName?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url?: string;
  templateName?: string;
  delayMinutes?: number;
  prompt?: string;
  noAnswerMinutes?: number;
  [key: string]: unknown;
}

export interface ProjectMetadata {
  name: string;
  clientName: string;
  description: string;
  industry: string;
  objective: string;
  author: string;
}

export interface TechnicalSpec {
  executiveSummary: string;
  flowArchitecture: string;
  variablesMatrix: Array<{ name: string; type: string; description: string; nodeSource: string }>;
  integrations: Array<{ name: string; endpoint: string; method: string; auth: string }>;
  smartonPrompts: Array<{ nodeLabel: string; prompt: string; intents: string[] }>;
  testCases: Array<{ scenario: string; expectedResult: string }>;
  rawMarkdown: string;
}

export interface FlowPlanNode {
  id: string;
  type: string;
  params: Record<string, unknown>;
  section: string;
}

export interface FlowPlanEdge {
  from: string;
  port: string;
  port_index?: number;
  to: string;
}

export interface FlowPlan {
  name: string;
  platform: 'whatsapp';
  mode: 'create' | 'update';
  nodes: FlowPlanNode[];
  edges: FlowPlanEdge[];
}
