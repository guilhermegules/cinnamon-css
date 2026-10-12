import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'lightningcss';
import pkg from './package.json' with { type: 'json' };

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const banner = `/**
 * Cinnamon CSS v${pkg.version}
 * Linux Mint Cinnamon & Mint-Y Design System for the Web
 * License: MIT
 */\n`;

const minBanner = `/*! Cinnamon CSS v${pkg.version} | MIT License */\n`;

export default defineConfig(({ command, mode, isPreview }) => {
  const isDemo = mode === 'demo' || command === 'serve' || isPreview;

  const cssConfig = {
    transformer: 'lightningcss',
    lightningcss: {
      drafts: {
        customMedia: true
      }
    }
  };

  if (isDemo) {
    return {
      root: 'demo',
      css: cssConfig,
      build: {
        outDir: '../dist-demo',
        emptyOutDir: true,
        cssMinify: 'lightningcss',
        minify: 'lightningcss'
      },
      server: {
        port: 5173,
        host: true,
        fs: {
          allow: ['..']
        }
      },
      preview: {
        port: 4173,
        host: true
      }
    };
  }

  return {
    css: cssConfig,
    plugins: [
      {
        name: 'vite-plugin-cinnamon-lightningcss',
        generateBundle(options, bundle) {
          for (const [fileName, chunk] of Object.entries(bundle)) {
            if (fileName.endsWith('.css') && !fileName.endsWith('.min.css')) {
              const unminified = `${banner}${chunk.source}`;
              chunk.source = unminified;

              // Minify with Lightning CSS
              const minified = transform({
                filename: fileName,
                code: Buffer.from(unminified),
                minify: true,
                ...cssConfig.lightningcss
              });

              this.emitFile({
                type: 'asset',
                fileName: fileName.replace(/\.css$/, '.min.css'),
                source: `${minBanner}${minified.code.toString()}`
              });
            }
          }
        }
      }
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      cssCodeSplit: true,
      cssMinify: false,
      minify: false,
      lib: {
        entry: resolve(__dirname, 'src/index.css'),
        formats: ['es']
      },
      rollupOptions: {
        output: {
          assetFileNames: 'cinnamon.[ext]'
        }
      }
    }
  };
});
