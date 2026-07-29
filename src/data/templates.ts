import { Node, Edge } from '@xyflow/react';
import { WhatsAppNodeData, ProjectMetadata } from '../types';

export interface PrebuiltTemplate {
  id: string;
  name: string;
  badge: string;
  description: string;
  projectMeta: ProjectMetadata;
  nodes: Node<WhatsAppNodeData>[];
  edges: Edge[];
}

export const PREBUILT_TEMPLATES: PrebuiltTemplate[] = [
  {
    id: 'commerce_support',
    name: 'Atención a Clientes & Ventas WhatsApp',
    badge: 'Ecommerce & Retail',
    description: 'Flujo completo con menú interactivo de opciones, consulta de pedidos en CRM y asistente Smarton AI para dudas frecuentes.',
    projectMeta: {
      name: 'Chatbot Ecommerce & Soporte',
      clientName: 'Tienda Atom Retail',
      description: 'Automatización de consultas de estado de pedido, catálogo interactivo y derivación a asesores humanos.',
      industry: 'Retail & Ecommerce',
      objective: 'Reducir la carga de tickets de soporte repetitivos en un 60% e incrementar ventas por WhatsApp.',
      author: 'Atom Solutions Architect',
    },
    nodes: [
      {
        id: 'node-1',
        type: 'customWhatsAppNode',
        position: { x: 100, y: 150 },
        data: {
          nodeType: 'message',
          label: 'Bienvenida Cliente',
          description: '¡Hola! 👋 Bienvenido a Tienda Atom. ¿En qué te podemos ayudar hoy?',
        },
      },
      {
        id: 'node-2',
        type: 'customWhatsAppNode',
        position: { x: 450, y: 120 },
        data: {
          nodeType: 'eval_response',
          label: 'Menú Principal Opciones',
          description: 'Selecciona una opción del menú para continuar:',
          options: ['📦 Estado de mi Pedido', '🛍️ Ver Catálogo', '💬 Hablar con Asesor'],
          noAnswerMinutes: 30,
        },
      },
      {
        id: 'node-3',
        type: 'customWhatsAppNode',
        position: { x: 850, y: -20 },
        data: {
          nodeType: 'save_field',
          label: 'Pedir ID de Pedido',
          fieldName: 'var_numero_pedido',
          description: 'Por favor ingresa tu número de pedido (ej: ATOM-9823):',
        },
      },
      {
        id: 'node-4',
        type: 'customWhatsAppNode',
        position: { x: 1200, y: -20 },
        data: {
          nodeType: 'crm',
          label: 'Consulta API Shopify CRM',
          systemName: 'Shopify API',
          method: 'GET',
          url: 'https://api.atom.chat/v1/orders/{{var_numero_pedido}}',
          description: 'Verificar estado del pedido en base de datos externa.',
        },
      },
      {
        id: 'node-5',
        type: 'customWhatsAppNode',
        position: { x: 850, y: 220 },
        data: {
          nodeType: 'smarton',
          label: 'Smarton AI Catálogo Advisor',
          description: 'Asistente IA para recomendar productos y precios según requerimiento del cliente.',
          prompt: 'Eres un recomendador experto de productos. Sugiere opciones amigables y claras con formato WhatsApp.',
          options: ['Ropa y Calzado', 'Tecnología', 'Ofertas del mes'],
        },
      },
      {
        id: 'node-6',
        type: 'customWhatsAppNode',
        position: { x: 850, y: 460 },
        data: {
          nodeType: 'assign_group',
          label: 'Asignación a Soporte Humano',
          systemName: 'Equipo_Soporte_Ventas',
          description: 'Transferencia directa al Inbox de agentes en línea.',
        },
      },
      {
        id: 'node-7',
        type: 'customWhatsAppNode',
        position: { x: 1550, y: -20 },
        data: {
          nodeType: 'typification',
          label: 'Cierre Exitoso Consulta Pedido',
          description: 'Estado reportado al usuario y ticket resuelto.',
        },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2', sourceHandle: 'out' },
      { id: 'e2-3', source: 'node-2', target: 'node-3', sourceHandle: 'button_0' },
      { id: 'e2-5', source: 'node-2', target: 'node-5', sourceHandle: 'button_1' },
      { id: 'e2-6', source: 'node-2', target: 'node-6', sourceHandle: 'button_2' },
      { id: 'e3-4', source: 'node-3', target: 'node-4', sourceHandle: 'out' },
      { id: 'e4-7', source: 'node-4', target: 'node-7', sourceHandle: 'success' },
    ],
  },
  {
    id: 'lead_qualification',
    name: 'Calificación de Leads B2B & Agendamiento',
    badge: 'Ventas B2B',
    description: 'Captura de datos calificados (Empresa, Presupuesto, Rol), filtro condicional y transferencia prioritaria.',
    projectMeta: {
      name: 'Flujo Lead Qualification B2B',
      clientName: 'Atom Corporate SaaS',
      description: 'Filtrado automático de prospectos comerciales antes de agendar reunión con Sales Executives.',
      industry: 'SaaS & Servicios B2B',
      objective: 'Aumentar la tasa de conversión de leads inbound calificados y agilizar la prospección.',
      author: 'Lead Growth Architect',
    },
    nodes: [
      {
        id: 'node-b1',
        type: 'customWhatsAppNode',
        position: { x: 100, y: 150 },
        data: {
          nodeType: 'template',
          label: 'Plantilla HSM Inbound',
          templateName: 'hsm_bienvenida_b2b',
          description: 'Hola {{1}}, gracias por tu interés en nuestras soluciones empresariales. ¿Cuál es el nombre de tu empresa?',
        },
      },
      {
        id: 'node-b2',
        type: 'customWhatsAppNode',
        position: { x: 450, y: 150 },
        data: {
          nodeType: 'save_field',
          label: 'Guardar Nombre Empresa',
          fieldName: 'var_empresa_lead',
          description: 'Campo persistente en perfil de contacto.',
        },
      },
      {
        id: 'node-b3',
        type: 'customWhatsAppNode',
        position: { x: 800, y: 150 },
        data: {
          nodeType: 'eval_response',
          label: 'Presupuesto Mensual',
          description: '¿Cuál es tu rango de presupuesto estimado para este proyecto?',
          options: ['Más de $5,000 USD/mes', 'Entre $1,000 y $5,000 USD/mes', 'Menos de $1,000 USD/mes'],
        },
      },
      {
        id: 'node-b4',
        type: 'customWhatsAppNode',
        position: { x: 1200, y: 50 },
        data: {
          nodeType: 'customer_stage',
          label: 'Etapa: MQL Calificado',
          fieldName: 'MQL_High_Value',
          description: 'Marcar contacto como lead de alto valor en la plataforma.',
        },
      },
      {
        id: 'node-b5',
        type: 'customWhatsAppNode',
        position: { x: 1550, y: 50 },
        data: {
          nodeType: 'crm',
          label: 'POST HubSpot CRM Sync',
          systemName: 'HubSpot Integrator',
          method: 'POST',
          url: 'https://api.hubspot.com/v1/contacts',
          description: 'Crear negocio e insertar lead en Pipeline de Ventas Directas.',
        },
      },
      {
        id: 'node-b6',
        type: 'customWhatsAppNode',
        position: { x: 1200, y: 320 },
        data: {
          nodeType: 'smarton',
          label: 'Smarton AI Nurturing B2B',
          description: 'Entregar material educativo y redirigir a registro self-service.',
          prompt: 'Provee información sobre nuestros planes básicos de forma amigable y comparte el link de autoregistro.',
          options: ['Ver Planes Self-Service', 'Ver Casos de Éxito'],
        },
      },
    ],
    edges: [
      { id: 'eb1-2', source: 'node-b1', target: 'node-b2', sourceHandle: 'out' },
      { id: 'eb2-3', source: 'node-b2', target: 'node-b3', sourceHandle: 'out' },
      { id: 'eb3-4a', source: 'node-b3', target: 'node-b4', sourceHandle: 'button_0' },
      { id: 'eb3-4b', source: 'node-b3', target: 'node-b4', sourceHandle: 'button_1' },
      { id: 'eb3-6', source: 'node-b3', target: 'node-b6', sourceHandle: 'button_2' },
      { id: 'eb4-5', source: 'node-b4', target: 'node-b5', sourceHandle: 'out' },
    ],
  },
];
