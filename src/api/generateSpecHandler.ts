import { GoogleGenAI } from '@google/genai';
import { generateFallbackSpec } from '../lib/generateFallbackSpec';

export { generateFallbackSpec };

export async function handleGenerateSpec(
  canvasData: any
): Promise<{ specMarkdown: string; warning?: string }> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return {
      specMarkdown: generateFallbackSpec(canvasData),
      warning:
        'Sin GEMINI_API_KEY en variables de entorno. Se generó especificación mediante motor estructurado.',
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
    }
    return { specMarkdown: generateFallbackSpec(canvasData) };
  } catch (error: any) {
    console.error('Error executing Gemini API call:', error);
    return {
      specMarkdown: generateFallbackSpec(canvasData),
      warning: `Error en API Gemini: ${error.message}. Se utilizó respaldo local.`,
    };
  }
}
