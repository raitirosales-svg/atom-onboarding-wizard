import { NodeCategory, NodeType } from '../types/canvas';

export interface PaletteNodeInfo {
  type: NodeType;
  category: NodeCategory;
  label: string;
  description: string;
  iconName: string;
  color: string;
  isIntegration?: boolean;
  defaultOptions?: string[];
}

export const NODE_PALETTE: PaletteNodeInfo[] = [
  // Comunicación
  {
    type: 'message',
    category: 'Comunicación',
    label: 'Mensaje',
    description: 'El bot envía un mensaje interactivo o de texto en WhatsApp.',
    iconName: 'MessageSquareText',
    color: '#3B82F6', // Blue
  },
  {
    type: 'template',
    category: 'Comunicación',
    label: 'Plantilla WhatsApp',
    description: 'Envío de plantilla aprobada HSM (notificación / inicio de flujo).',
    iconName: 'FileCode',
    color: '#0D9488', // Teal
  },

  // Lógica
  {
    type: 'eval_response',
    category: 'Lógica',
    label: 'Evaluar Respuesta',
    description: 'Ramifica el flujo según la respuesta elegida por el cliente.',
    iconName: 'GitFork',
    color: '#D97706', // Amber
    defaultOptions: ['Opción 1', 'Opción 2', 'Otro'],
  },
  {
    type: 'condition',
    category: 'Lógica',
    label: 'Condicional',
    description: 'Evalúa reglas de negocio (e.g. ¿Cliente registrado? ¿Horario hábil?).',
    iconName: 'GitBranch',
    color: '#EA580C', // Orange
  },
  {
    type: 'jump',
    category: 'Lógica',
    label: 'Salto',
    description: 'Dirige la conversación a otro bloque o submódulo de la arquitectura.',
    iconName: 'CornerDownRight',
    color: '#8B5CF6', // Purple
  },
  {
    type: 'delay',
    category: 'Lógica',
    label: 'Tiempo de espera',
    description: 'Pausa el flujo durante un lapso de tiempo especificado.',
    iconName: 'Clock',
    color: '#64748B', // Slate
  },
  {
    type: 'end',
    category: 'Lógica',
    label: 'Fin de flujo',
    description: 'Finaliza la sesión o cierra la conversación activa.',
    iconName: 'StopCircle',
    color: '#E11D48', // Rose
  },

  // Datos
  {
    type: 'save_field',
    category: 'Datos',
    label: 'Guardar Campo',
    description: 'Almacena datos proporcionados por el cliente (nombre, correo, orden).',
    iconName: 'Database',
    color: '#059669', // Emerald
  },
  {
    type: 'location',
    category: 'Datos',
    label: 'Ubicación',
    description: 'Solicita y procesa la ubicación geográfica enviada por WhatsApp.',
    iconName: 'MapPin',
    color: '#65A30D', // Lime
  },

  // IA
  {
    type: 'smarton',
    category: 'IA',
    label: 'Smarton (Agente IA)',
    description: 'Agente conversacional de IA para responder preguntas frecuentes y guiar.',
    iconName: 'Sparkles',
    color: '#9333EA', // Purple/Fuchsia
  },
  {
    type: 'format',
    category: 'IA',
    label: 'Formatear',
    description: 'Normaliza y formatea texto o datos antes de enviar al backend.',
    iconName: 'Wand2',
    color: '#0891B2', // Cyan
  },

  // Clasificación
  {
    type: 'tag',
    category: 'Clasificación',
    label: 'Etiqueta',
    description: 'Asigna etiquetas de segmentación al contacto en la plataforma.',
    iconName: 'Tag',
    color: '#DB2777', // Pink
  },
  {
    type: 'customer_stage',
    category: 'Clasificación',
    label: 'Etapa del Cliente',
    description: 'Actualiza el embudo o estado del cliente (e.g. Lead, Calificado).',
    iconName: 'TrendingUp',
    color: '#0284C7', // Sky
  },
  {
    type: 'typification',
    category: 'Clasificación',
    label: 'Tipificación',
    description: 'Registra el código de tipificación de la conversación para reportes.',
    iconName: 'FolderCheck',
    color: '#CA8A04', // Yellow/Gold
  },
  {
    type: 'assign_group',
    category: 'Clasificación',
    label: 'Asignación a grupo',
    description: 'Transfiere la conversación a una cola o equipo de atención humana.',
    iconName: 'Users',
    color: '#2563EB', // Blue
  },

  // Integraciones (Visually distinct - dashed border, larger, plug icon)
  {
    type: 'crm',
    category: 'Integraciones',
    label: 'CRM',
    description: 'Crea o actualiza contactos, tratos o prospectos en CRM (HubSpot, Salesforce, Zoho).',
    iconName: 'Plug',
    color: '#DC2626', // Red
    isIntegration: true,
  },
  {
    type: 'http_request',
    category: 'Integraciones',
    label: 'Petición HTTP',
    description: 'Realiza solicitudes HTTP REST API (GET, POST, PUT, DELETE) o Webhooks a servicios externos.',
    iconName: 'Send',
    color: '#2563EB', // Blue
    isIntegration: true,
  },
  {
    type: 'customer_recognition',
    category: 'Integraciones',
    label: 'Reconocimiento de cliente',
    description: 'Identifica y consulta información del cliente mediante API o servicio de autenticación.',
    iconName: 'UserCheck',
    color: '#7C3AED', // Purple
    isIntegration: true,
  },
];
