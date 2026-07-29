import { GoogleGenAI } from '@google/genai';

export function generateFallbackSpec(canvasData: any): string {
  const clientName = canvasData.clientName || 'Cliente Demo';
  const industry = canvasData.industry || 'E-commerce';
  const version = canvasData.version || 'v1';
  const dateStr = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const nodes = canvasData.flow?.nodes || [];
  const edges = canvasData.flow?.edges || [];
  const comments = canvasData.flow?.comments || [];

  const integrations = nodes.filter((n: any) => n.data?.category === 'Integraciones');
  const savedFields = nodes.filter((n: any) => n.data?.type === 'save_field');

  let stepsText = '';
  nodes.forEach((node: any, idx: number) => {
    const title = node.data?.label || node.data?.title || `Paso ${idx + 1}`;
    const desc = node.data?.description || 'Sin descripción';
    const typeLabel = node.data?.nodeTypeLabel || node.data?.type || 'Acción';
    stepsText += `### ${idx + 1}. ${title} [${typeLabel}]\n`;
    stepsText += `- **Descripción / Contenido:** ${desc}\n`;

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
      integrationsText += `- **${i.data?.label}:** ${i.data?.description || 'Conexión con sistema externo para intercambio de datos.'}\n`;
    });
  } else {
    integrationsText = 'No se especificaron integraciones externas en este flujo básico.\n';
  }

  let fieldsText = '';
  if (savedFields.length > 0) {
    savedFields.forEach((f: any) => {
      fieldsText += `- **${f.data?.label}:** ${f.data?.description || 'Guarda información proporcionada por el usuario.'}\n`;
    });
  } else {
    fieldsText = 'No se registraron capturas de variables o campos específicos.\n';
  }

  return `# FICHA TÉCNICA DE IMPLEMENTACIÓN - WHATSAPP BOT
**Cliente:** ${clientName}
**Industria:** ${industry}
**Versión de Flujo:** ${version}
**Fecha de Generación:** ${dateStr}

---

## 1. Resumen General
La solución diseñada para **${clientName}** corresponde a un flujo conversacional automatizado en WhatsApp Cloud API orientado a la industria de **${industry}**. El flujo guía al usuario desde el saludo inicial hasta la atención personalizada, cualificación de datos o derivación con un agente.

## 2. Objetivo del Bot
- Automatizar la interacción inicial y clasificación de requerimientos.
- Capturar datos clave de los usuarios para acelerar el proceso de atención.
- Integrar con sistemas existentes (${integrations.length} integración(es) detectada(s)).
- Reducir tiempos de respuesta y optimizar la carga de trabajo del equipo comercial/soporte.

## 3. Flujo Detallado Paso a Paso

${stepsText}

## 4. Integraciones Requeridas
${integrationsText}

## 5. Campos de Datos a Capturar
${fieldsText}

## 6. Puntos Abiertos y Dudas Pendientes
${commentsText}

## 7. Resumen de Acuerdos para el Cliente
Hola **${clientName}**, ¡gracias por la sesión de onboarding!
Hemos diseñado juntos la versión **${version}** de tu chatbot de WhatsApp. Aquí tienes los acuerdos principales:
1. **Atención Inicial:** El bot responderá inmediatamente con el mensaje de bienvenida y presentará las opciones principales.
2. **Captura de Información:** El sistema recopilará automáticamente los datos necesarios antes de transferir a un asesor o sistema.
3. **Integraciones:** Se conectará con tus herramientas para procesar las consultas sin intervención manual.

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

    const prompt = `Eres un Ingeniero Principal de Soluciones y Arquitecto WhatsApp Cloud API en Atom Chat.
Tu tarea es generar la Ficha Técnica / Especificación Técnica de Implementación basada en el siguiente flujo de chatbot diseñado dinámicamente durante una sesión de onboarding con el cliente.

DATOS DEL CLIENTE Y PROYECTO:
- Nombre del Cliente: ${canvasData.clientName || 'Cliente'}
- Industria: ${canvasData.industry || 'General'}
- Versión de Flujo: ${canvasData.version || 'v1'}
- Diagrama Estructurado (Nodos, Conexiones, Comentarios):
${JSON.stringify(canvasData.flow, null, 2)}

INSTRUCCIONES DE FORMATO Y CONTENIDO (EN ESPAÑOL CHILENO / COLOMBIANO / LATAM PROFESIONAL):
Por favor genera un documento Markdown completo, riguroso, extremadamente claro y estructurado con las siguientes secciones exactas:

# FICHA TÉCNICA DE IMPLEMENTACIÓN - WHATSAPP BOT
**Cliente:** ${canvasData.clientName || 'Cliente'}
**Industria:** ${canvasData.industry || 'General'}
**Versión de Flujo:** ${canvasData.version || 'v1'}
**Fecha:** ${new Date().toLocaleDateString('es-ES')}

---

## 1. Resumen General
Breve descripción ejecutiva de la solución configurada y la experiencia que vivirá el usuario final en WhatsApp.

## 2. Objetivo del Bot
Objetivos de negocio clave mapeados en esta conversación (e.g., automatización de ventas, atención 24/7, cualificación de leads).

## 3. Flujo Detallado Paso a Paso
Tabla o lista secuencial enumerando cada paso con: ID/Nombre del Nodo, Tipo de Nodo, Acción/Mensaje, y Ramificaciones/Opciones.

## 4. Integraciones Requeridas
Lista detallada de todos los nodos de tipo "Integración" (CRM, Pasarelas de Pago, Base de datos, API externa, Meta CAPI) con sus parámetros y endpoints esperados.

## 5. Campos de Datos a Capturar
Variables que el bot debe almacenar en la sesión o perfil del cliente.

## 6. Puntos Abiertos y Dudas Pendientes
Puntos no resueltos extraídos directamente de los comentarios agregados en los nodos durante la reunión con el cliente. Si no hay comentarios, indica que no hay puntos abiertos pendientes.

## 7. Resumen de Acuerdos para el Cliente
Un resumen en lenguaje 100% simple, cercano y NO técnico redactado para que el especialista de onboarding se lo envíe al cliente por correo o WhatsApp para su validación rápida y aprobación de inicio.

Mantén un tono muy profesional, claro y formal.`;

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
