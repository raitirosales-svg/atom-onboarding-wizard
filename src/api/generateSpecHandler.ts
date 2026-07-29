import { generateFallbackSpec } from '../lib/generateFallbackSpec';

export { generateFallbackSpec };

export async function handleGenerateSpec(
  canvasData: any
): Promise<{ specMarkdown: string; warning?: string }> {
  return {
    specMarkdown: generateFallbackSpec(canvasData),
    warning: 'Sin API key configurada. Ficha generada con motor local.',
  };
}