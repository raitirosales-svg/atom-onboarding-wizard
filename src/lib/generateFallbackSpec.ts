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
  const comments = canvasData.flow?.comments || [];

  const integrations = nodes.filter(
    (n: any) => n.data?.category === 'Integraciones' || n.data?.isIntegration
  );
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

  const goalsStr = contexto.botGoals?.length
    ? contexto.botGoals.join(', ')
    : 'Automatizar atención inicial y cualificación';
  const toneStr = contexto.brandTone
    ? `${contexto.brandTone}${contexto.toneDetails ? ` (${contexto.toneDetails})` : ''}`
    : 'Profesional y amigable';
  const handoffStr =
    contexto.humanHandoffTrigger ||
    'Cuando el cliente lo solicite o requiera atención personalizada';
  const notToDoStr = contexto.whatNotToDo
    ? `- **Restricciones de Negocio:** ${contexto.whatNotToDo}\n`
    : '';
  const typificationsStr = contexto.typifications?.length
    ? contexto.typifications.join(', ')
    : 'Fin Autogestión, Seguimiento Autogestión';
  const tagsStr = contexto.suggestedTags?.length
    ? contexto.suggestedTags.map((t: string) => `#${t}`).join(' ')
    : '#nuevo_lead #whatsapp';

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
