import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleGenerateSpec } from './src/api/generateSpecHandler.js';
import { spawn } from 'child_process';
import { writeFileSync, unlinkSync, readFileSync } from 'fs';
import { tmpdir } from 'os';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

app.post('/api/generate-spec', async (req, res) => {
  try {
    const canvasData = req.body;
    const result = await handleGenerateSpec(canvasData);
    res.json(result);
  } catch (err: any) {
    console.error('Error generating spec:', err);
    res.status(500).json({ error: err.message || 'Error al generar la ficha técnica' });
  }
});

// ── FlowBuilder integration: canvas → flow_plan.json ──
app.post('/api/generate-flow-plan', async (req, res) => {
  const tmpInput = path.join(tmpdir(), `canvas_input_${Date.now()}.json`);
  const tmpOutput = path.join(tmpdir(), `flow_plan_${Date.now()}.json`);
  try {
    const canvasData = req.body;
    writeFileSync(tmpInput, JSON.stringify(canvasData, null, 2), 'utf-8');

    const scriptPath = path.join(__dirname, 'canvas_to_flow_plan.py');
    const result = await new Promise<{ nodes: number; edges: number; plan: any }>((resolve, reject) => {
      const py = spawn('python', [scriptPath, tmpInput, tmpOutput], {
        cwd: __dirname,
        timeout: 30000
      });

      let stdout = '';
      let stderr = '';

      py.stdout.on('data', (d: Buffer) => { stdout += d.toString(); });
      py.stderr.on('data', (d: Buffer) => { stderr += d.toString(); });

      py.on('close', (code: number) => {
        if (code !== 0) {
          reject(new Error(stderr || stdout || 'Python process failed'));
          return;
        }
        const plan = JSON.parse(readFileSync(tmpOutput, 'utf-8'));
        resolve({
          nodes: plan.nodes?.length || 0,
          edges: plan.edges?.length || 0,
          plan
        });
      });

      py.on('error', reject);
    });

    res.json({
      success: true,
      nodes: result.nodes,
      edges: result.edges,
      flowPlan: result.plan
    });
  } catch (err: any) {
    console.error('Error generating flow plan:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Error al generar el flow plan'
    });
  } finally {
    try { unlinkSync(tmpInput); } catch {}
    try { unlinkSync(tmpOutput); } catch {}
  }
});

// Serve built frontend assets in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
