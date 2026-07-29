import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client with mandatory telemetry User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Generate Technical Scope Document (Ficha Técnica)
app.post('/api/generate-spec', async (req, res) => {
  try {
    const { projectMeta, nodes, edgesCount } = req.body;

    const prompt = `
Eres un Arquitecto de Soluciones Senior en Inteligencia Artificial y Chatbots de WhatsApp en Atom.
Genera una FICHA TÉCNICA OFICIAL Y COMPLETA para el proyecto de automatización en formato Markdown profesional.

DATOS DEL PROYECTO:
- Nombre del Bot: ${projectMeta.name || 'Sin Título'}
- Cliente / Empresa: ${projectMeta.clientName || 'Cliente Confidencial'}
- Industria: ${projectMeta.industry || 'General'}
- Objetivo Comercial: ${projectMeta.objective || 'Automatizar atención y ventas por WhatsApp'}
- Autor / Arquitecto: ${projectMeta.author || 'Atom Solutions Architect'}
- Total Nodos en Lienzo: ${nodes.length}
- Total Conexiones: ${edgesCount}

ESTRUCTURA DE NODOS DEL FLUJO:
${JSON.stringify(nodes, null, 2)}

INSTRUCCIONES DE REDACCIÓN:
Genera un documento con la siguiente estructura formal en Markdown:
1. **1. Resumen Ejecutivo y Alcance del Proyecto**
2. **2. Arquitectura del Flujo e Interacción de Nodos** (Analizar paso a paso cada nodo y sus salidas)
3. **3. Matriz de Variables y Campos Persistidos** (Tabla de variables como \`var_nombre\`, tipo, nodo origen)
4. **4. Mapeo de Integraciones y Endpoints HTTP/CRM** (Servicios externos consumidos, métodos y autenticación)
5. **5. Especificación de Prompts para Smarton AI** (Prompts de sistema, tono de voz y restricciones)
6. **6. Matriz de Casos de Prueba y Edge Cases** (Casos de éxito, timeouts, entradas inválidas y errores de API)

Formatea todo en Markdown profesional con tablas, viñetas y bloques de código cuando sea pertinente.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({
      specMarkdown: response.text || 'No se pudo generar el contenido.',
    });
  } catch (error: any) {
    console.error('Error generating technical spec:', error);
    res.status(500).json({
      error: error.message || 'Error al procesar la solicitud con Gemini AI.',
    });
  }
});

// Endpoint: AI Flow Suggestions & Generator
app.post('/api/ai-suggest', async (req, res) => {
  try {
    const { userPrompt, currentNodes, projectMeta } = req.body;

    const systemPrompt = `
Eres un Diseñador y Consultor de Chatbots para WhatsApp en Atom.
El usuario te ha realizado la siguiente solicitud o consulta:
"${userPrompt}"

Proyecto: ${projectMeta?.name || 'Bot WhatsApp'}
Nodos actuales: ${JSON.stringify(currentNodes)}

Analiza la solicitud y responde en JSON con las siguientes propiedades:
- "suggestionText": Explicación clara y profesional de las mejoras recomendadas.
- "generatedNodes": (Opcional) Un arreglo de nodos si la solicitud implica crear un nuevo flujo. Cada nodo debe tener id, type: "customWhatsAppNode", position: {x, y}, y data: { nodeType, label, description, options, fieldName }.
- "generatedEdges": (Opcional) Arreglo de edges con id, source, target, sourceHandle ("out", "button_0", "success", etc.).
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestionText: { type: Type.STRING },
            generatedNodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  position: {
                    type: Type.OBJECT,
                    properties: {
                      x: { type: Type.NUMBER },
                      y: { type: Type.NUMBER },
                    },
                  },
                  data: {
                    type: Type.OBJECT,
                    properties: {
                      nodeType: { type: Type.STRING },
                      label: { type: Type.STRING },
                      description: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      fieldName: { type: Type.STRING },
                    },
                  },
                },
              },
            },
            generatedEdges: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  source: { type: Type.STRING },
                  target: { type: Type.STRING },
                  sourceHandle: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json(parsedData);
  } catch (error: any) {
    console.error('Error in AI suggest endpoint:', error);
    res.status(500).json({
      error: error.message || 'Error al procesar sugerencia con Gemini AI.',
    });
  }
});

// Endpoint: Generate Flow Plan JSON
app.post('/api/generate-flow-plan', async (req, res) => {
  try {
    const { nodes, edges, projectMeta } = req.body;
    res.json({
      success: true,
      flowPlan: {
        name: projectMeta?.name || 'Bot Flow Plan',
        platform: 'whatsapp',
        mode: 'create',
        nodes: nodes || [],
        edges: edges || [],
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Serve built static files from dist/ folder with SPA fallback
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
