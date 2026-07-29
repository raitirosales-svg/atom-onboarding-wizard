import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { handleGenerateSpec } from './src/api/generateSpecHandler';
import { spawn } from 'child_process';
import { writeFileSync, unlinkSync, readFileSync } from 'fs';
import { tmpdir } from 'os';

function apiPlugin(): Plugin {
  return {
    name: 'atom-scope-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/generate-spec', async (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              const canvasData = JSON.parse(body || '{}');
              const result = await handleGenerateSpec(canvasData);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });

      // FlowBuilder integration endpoint
      server.middlewares.use('/api/generate-flow-plan', async (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            const tmpInput = path.join(tmpdir(), `canvas_vite_${Date.now()}.json`);
            const tmpOutput = path.join(tmpdir(), `flow_plan_vite_${Date.now()}.json`);
            try {
              const canvasData = JSON.parse(body || '{}');
              writeFileSync(tmpInput, JSON.stringify(canvasData, null, 2), 'utf-8');

              const result = await new Promise<{ nodes: number; edges: number; plan: any }>((resolve, reject) => {
                const py = spawn('python', ['canvas_to_flow_plan.py', tmpInput, tmpOutput], {
                  cwd: path.resolve(__dirname),
                  timeout: 30000
                });
                let stdout = '', stderr = '';
                py.stdout.on('data', (d: Buffer) => { stdout += d.toString(); });
                py.stderr.on('data', (d: Buffer) => { stderr += d.toString(); });
                py.on('close', (code: number) => {
                  if (code !== 0) { reject(new Error(stderr || stdout || 'Python failed')); return; }
                  const plan = JSON.parse(readFileSync(tmpOutput, 'utf-8'));
                  resolve({ nodes: plan.nodes?.length || 0, edges: plan.edges?.length || 0, plan });
                });
                py.on('error', reject);
              });

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, nodes: result.nodes, edges: result.edges, flowPlan: result.plan }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            } finally {
              try { unlinkSync(tmpInput); } catch {}
              try { unlinkSync(tmpOutput); } catch {}
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
