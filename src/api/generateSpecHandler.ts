import { GoogleGenAI } from '@google/genai';

export function generateFallbackSpec(canvasData: any): string {
  const clientName = canvasData.clientName || 'Cliente Demo';
  const industry = canvasData.industry || 'E-commerce';
  const version = canvasData.version || 'v1';
  const contexto = canvasData.contexto || {};
  const dateStr = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const nodes = canvasData.flow?.nodes || [];
  const edges = canvasData.flow?.edges || [];
  const comments = canvasData.flow?.comments || [];

  const integrations = nodes.filter((n: any) => n.data?.category === 'Integraciones' || n.data?.isIntegration);
  const savedFields = nodes.filter((n: any) => n.data?.type === 'save_field');

  let stepsText = '';
  nodes.forEach((node: any, idx: number) => {
    const title = node.data?.label || node.data?.title || `Paso ${idx + 1}`;
    const desc = node.data?.description || 'Sin descripción';
    const typeLabel = node.data?.type || 'Acción';
    stepsText += `### ${idx + 1}. ${title} [${typeLabel}]\n`;
    stepsText += `- **Descripción / Contenido:** ${desc}\n`;

    if (node.data?.type === 'save_field') {
      const scopeLabel =
        node.data?.fieldScope === 'temporary'
          ? 'Variable de flujo (Temporal)'
          : 'Campo de información (Permanente en Ficha Cliente)';
      stepsText += `- **Variable a guardar:** \`${node.data?.fieldName || 'variable'}\` (${scopeLabel})\n`;
    }

    if (node.data?.options && node.data.options.length > 0) {
      stepsText += `- **Opciones de Respuesta:** ${node.data.options.join(', ')}\n`;
    }
    stepsText += `\n`;
  });

  let commentsText = '';
  if (comments.length > 0) {
    comments.forEach((c: any) => {
      commentsText += `- **[Nodo: ${c.nodeTitle || c.nodeId}]** ${c.author} (${c.timestamp}): ${c.text}\n`;
    });
  } else {
    commentsText = 'No hay puntos abiertos ni comentarios registrados en el flujo actual.\n';
  }

  let integrationsText = '';
  if (integrations.length > 0) {
    integrations.forEach((i: any) => {
      integrationsText += `- **${i.data?.label}:** ${i.data?.description || 'Conexión con sistema externo para intercambio de datos.'} (Sistema: ${i.data?.systemName || 'Por definir'})\n`;
    });
  } else {
    integrationsText = 'No se especificaron integraciones externas en este flujo básico.\n';
  }

  let fieldsText = '';
  if (savedFields.length > 0) {
    savedFields.forEach((f: any) => {
      const scopeLabel =
        f.data?.fieldScope === 'temporary'
          ? 'Variable de flujo (Temporal)'
          : 'Campo de información (Permanente - Ficha Cliente Atom)';
      fieldsText += `- **\`${f.data?.fieldName || f.data?.label}\`**: ${f.data?.description || 'Dato capturado'}. *Tipo:* ${scopeLabel}\n`;
    });
  } else {
    fieldsText = 'No se registraron capturas de variables o campos específicos.\n';
  }

  // Formatting Contexto details
  const goalsStr = contexto.botGoals?.length ? contexto.botGoals.join(', ') : 'Automatizar atención inicial y cualificación';
  const toneStr = contexto.brandTone ? `${contexto.brandTone}${contexto.toneDetails ? ` (${contexto.toneDetails})` : ''}` : 'Profesional y amigable';
  const handoffStr = contexto.humanHandoffTrigger || 'Cuando el cliente lo solicite o requiera atención personalizada';
  const notToDoStr = contexto.whatNotToDo ? `- **Restricciones de Negocio:** ${contexto.whatNotToDo}\n` : '';
  const typificationsStr = contexto.typifications?.length ? contexto.typifications.join(', ') : 'Fin Autogestión, Seguimiento Autogestión';
  const tagsStr = contexto.suggestedTags?.length ? contexto.suggestedTags.map((t: string) => `#${t}`).join(' ') : '#nuevo_lead #whatsapp';

  return `# FICHA TÉCNICA DE IMPLEMENTACIÓN - WHATSAPP BOT
**Cliente:** ${clientName}
**Industria:** ${industry}
**Versión de Flujo:** ${version}
**Fecha de Generación:** ${dateStr}

---

## 1. Resumen General & Contexto del Proyecto
La solución diseñada para **${clientName}** corresponde a un flujo conversacional automatizado en WhatsApp Cloud API para Atom Chat en el rubro de **${industry}**. 
- **Tono de Marca:** ${toneStr}
- **Información de Empresa:** ${contexto.companyInfo || 'Atención a clientes y gestión de consultas vía WhatsApp.'}

## 2. Objetivos del Bot & Definiciones de Negocio
- **Objetivos de Negocio:** ${goalsStr}
- **Casos de Uso Prioritarios:** ${contexto.priorityUseCases || 'Atención inicial, captura de datos y derivación.'}
${notToDoStr}- **Criterio de Derivación Humana:** ${handoffStr}
- **Integraciones Esperadas:** ${contexto.expectedIntegrations?.join(', ') || 'Sin integraciones adicionales'}

## 3. Flujo Detallado Paso a Paso

${stepsText}

## 4. Integraciones Requeridas
${integrationsText}

## 5. Campos de Datos a Capturar (Permanentes vs Temporales)
${fieldsText}

## 6. Cierre, Tipificaciones Atom & Etiquetas
- **Criterio de Cierre Exitoso:** ${contexto.successfulEnding || 'Cliente atendid@ satisfactoriamente o derivad@ a asesor.'}
- **Tipificaciones Configuradas:** ${typificationsStr}
- **Etapas del Funnel:** ${contexto.funnelStages?.join(', ') || 'Awareness, Consideration'}
- **Etiquetas Iniciales:** ${tagsStr}

## 7. Puntos Abiertos y Dudas Pendientes
${commentsText}

## 8. Resumen de Acuerdos para el Cliente
Hola **${clientName}**, ¡un gusto saludarte!
Hemos diseñado juntos la versión **${version}** de tu chatbot de WhatsApp. Aquí tienes los acuerdos principales alcanzados durante nuestra sesión:

1. **Tono & Marca:** El bot utilizará un tono **${toneStr}**.
2. **Atención & Derivación:** Responderá automáticamente tus principales consultas y derivará a un agente cuando **${handoffStr}**.
3. **Tipificaciones & CRM:** Al finalizar cada conversación se registrarán las tipificaciones acordadas (**${typificationsStr}**) para asegurar el seguimiento en Atom.

Quedamos atentos a tu confirmación para proceder con el montaje en el entorno de pruebas.`;
}

export async function handleGenerateSpec(canvasData: any): Promise<{ specMarkdown: string; warning?: string }> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      specMarkdown: generateFallbackSpec(canvasData),
      warning: 'Sin GEMINI_API_KEY en variables de entorno. Se generó especificación mediante motor estructurado.',
    };
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const contexto = canvasData.contexto || {};

    const prompt = `Eres un Ingeniero Principal de Soluciones y Arquitecto WhatsApp Cloud API en Atom Chat.
Tu tarea es generar la Ficha Técnica / Especificación Técnica de Implementación basada en el siguiente flujo de chatbot y contexto de negocio acordado durante la sesión de onboarding con el cliente.

DATOS DEL CLIENTE, CONTEXTO Y OBJETIVOS DE NEGOCIO:
- Nombre del Cliente: ${canvasData.clientName || 'Cliente'}
- Industria: ${canvasData.industry || 'General'}
- Versión de Flujo: ${canvasData.version || 'v1'}
- Tono de Marca: ${contexto.brandTone || 'Formal y profesional'} (${contexto.toneDetails || 'sin detalles adicionales'})
- Contexto de la Empresa: ${contexto.companyInfo || 'N/A'}
- Objetivos del Bot: ${contexto.botGoals ? JSON.stringify(contexto.botGoals) : 'Atención y cualificación'}
- Casos de Uso Prioritarios: ${contexto.priorityUseCases || 'N/A'}
- Lo que NO debe hacer el bot: ${contexto.whatNotToDo || 'Sin restricciones específicas'}
- Criterio de Derivación a Humano: ${contexto.humanHandoffTrigger || 'N/A'}
- Integraciones Esperadas: ${contexto.expectedIntegrations ? JSON.stringify(contexto.expectedIntegrations) : 'N/A'}
- Criterio de Cierre Exitoso: ${contexto.successfulEnding || 'N/A'}
- Tipificaciones Atom Acordadas: ${contexto.typifications ? JSON.stringify(contexto.typifications) : 'Fin Autogestión, Seguimiento Autogestión'}
- Etapas del Funnel: ${contexto.funnelStages ? JSON.stringify(contexto.funnelStages) : 'Awareness, Opportunity'}
- Etiquetas Iniciales: ${contexto.suggestedTags ? JSON.stringify(contexto.suggestedTags) : 'N/A'}

DIAGRAMA DEL FLUJO CONVERSACIONAL (Nodos, Conexiones, Comentarios):
${JSON.stringify(canvasData.flow, null, 2)}

INSTRUCCIONES CRÍTICAS DE FORMATO Y CONTENIDO (EN ESPAÑOL LATAM PROFESIONAL):
Genera un documento Markdown completo y bien estructurado con las siguientes secciones exactas:

# FICHA TÉCNICA DE IMPLEMENTACIÓN - WHATSAPP BOT
**Cliente:** ${canvasData.clientName || 'Cliente'}
**Industria:** ${canvasData.industry || 'General'}
**Versión de Flujo:** ${canvasData.version || 'v1'}
**Fecha:** ${new Date().toLocaleDateString('es-ES')}

---

## 1. Resumen General & Contexto del Proyecto
Resumen ejecutivo combinando el modelo de negocio del cliente, su industria y el tono de marca definido.

## 2. Objetivos del Bot & Definiciones de Negocio
Explicación detallada de los objetivos de negocio, casos de uso prioritarios, restricciones (lo que NO debe hacer) y reglas de derivación a agentes humanos.

## 3. Flujo Detallado Paso a Paso
Tabla o lista secuencial de cada paso en el diagrama con: ID/Nombre del Nodo, Tipo de Nodo, Contenido/Mensaje, Opciones de Respuesta y Variables registradas.

## 4. Integraciones Requeridas
Detalle técnico de los nodos de integración detectados (CRM, Pasarelas de Pago, Base de datos, API externa) con sus endpoints/parámetros.

## 5. Campos de Datos a Capturar (Permanentes vs Temporales)
Lista explícita de variables discriminando claramente entre:
- **Campos de Información (Permanentes):** Se guardan en la Ficha del Cliente en Atom CRM para futuros contactos.
- **Variables de Flujo (Temporales):** Viven solo durante la sesión del flujo activo.

## 6. Cierre, Tipificaciones Atom & Etiquetas
Criterios de éxito, tipificaciones exactas para configurar en Atom Chat (ej. Fin Autogestión, Seguimiento Autogestión, etc.), etapas del funnel y etiquetas requeridas.

## 7. Puntos Abiertos y Dudas Pendientes
Puntos no resueltos extraídos directamente de los comentarios agregados en los nodos durante la reunión. Si no hay comentarios, indicar que el flujo está cerrado sin dudas pendientes.

## 8. Resumen de Acuerdos para el Cliente
Redacta un mensaje amable, directo, cercano y NO técnico pensado para que el especialista de onboarding se lo envíe al cliente por correo o WhatsApp para su aprobación final de inicio de construcción.

Asegúrate de validar que el flujo cumple con el tono de marca y los objetivos declarados. Mantén un formato limpio y profesional.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const text = response.text;
    if (text) {
      return { specMarkdown: text };
    } else {
      return { specMarkdown: generateFallbackSpec(canvasData) };
    }
  } catch (error: any) {
    console.error('Error executing Gemini API call:', error);
    return {
      specMarkdown: generateFallbackSpec(canvasData),
      warning: `Error en API Gemini: ${error.message}. Se utilizó respaldo local.`,
    };
  }
}
