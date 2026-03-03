
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const rawApiKey = process.env.API_KEY || process.env.VITE_API_KEY || env.API_KEY || env.VITE_API_KEY || '';

  return {
    plugins: [
      react(),
      {
        name: 'save-questions-middleware',
        configureServer(server) {
          server.middlewares.use('/__save-question', async (req, res, next) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => body += chunk);
              req.on('end', () => {
                try {
                  const { categoryId, key, data } = JSON.parse(body);
                  const filename = categoryId.toLowerCase() + '.ts';
                  // Resolve path to data/questions relative to project root
                  const filePath = path.resolve(__dirname, 'data', 'questions', filename);
                  
                  if (fs.existsSync(filePath)) {
                    let content = fs.readFileSync(filePath, 'utf-8');
                    // Prevent duplicates
                    if (!content.includes(`"${key}"`)) {
                       const lastBraceIndex = content.lastIndexOf('};');
                       if (lastBraceIndex !== -1) {
                          const beforeBrace = content.slice(0, lastBraceIndex);
                          const afterBrace = content.slice(lastBraceIndex);
                          
                          // Check if we need a comma
                          const trimmedBefore = beforeBrace.trimEnd();
                          const needsComma = !trimmedBefore.endsWith(',') && !trimmedBefore.endsWith('{');
                          
                          const commaPrefix = needsComma ? ',' : '';
                          const newEntry = `${commaPrefix}\n  // Auto-generated\n  "${key}": ${JSON.stringify(data, null, 2)}`;
                          
                          const newContent = beforeBrace + newEntry + afterBrace;
                          fs.writeFileSync(filePath, newContent);
                          console.log(`✅ [Auto-Save] Saved ${key} to ${filename}`);
                       }
                    } else {
                      console.log(`ℹ️ [Auto-Save] Key ${key} already exists in ${filename}`);
                    }
                  } else {
                    console.warn(`⚠️ [Auto-Save] File not found: ${filePath}`);
                  }
                  res.statusCode = 200;
                  res.end('Saved');
                } catch (e) {
                  console.error('❌ [Auto-Save] Error:', e);
                  res.statusCode = 500;
                  res.end('Error');
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ],
    base: './', 
    define: {
      'process.env.API_KEY': JSON.stringify(rawApiKey)
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('recharts') || id.includes('d3')) return 'vendor-charts';
              if (id.includes('lucide-react')) return 'vendor-icons';
              return 'vendor-core';
            }
          }
        }
      }
    }
  };
});
