/**
 * Mermaid 다이어그램 PNG 생성기
 * Playwright를 사용하여 Mermaid 코드를 렌더링하고 PNG로 저장
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { diagrams, diagramMeta } from './mermaid-definitions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, 'outputs');

/**
 * Mermaid 코드를 PNG 이미지로 변환
 */
async function generateDiagramPNG(page, mermaidCode, outputPath) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          margin: 0;
          padding: 20px;
          background: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .mermaid {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        /* Mermaid Black & White 스타일 강제 */
        .mermaid svg {
          max-width: 100%;
        }
      </style>
    </head>
    <body>
      <pre class="mermaid">
${mermaidCode}
      </pre>
      <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
      <script>
        mermaid.initialize({
          startOnLoad: true,
          securityLevel: 'loose',
          theme: 'base',
          themeVariables: {
            primaryColor: '#ffffff',
            primaryTextColor: '#000000',
            primaryBorderColor: '#000000',
            lineColor: '#000000',
            secondaryColor: '#f5f5f5',
            tertiaryColor: '#ffffff',
            background: '#ffffff',
            mainBkg: '#ffffff',
            secondBkg: '#f5f5f5',
            tertiaryBkg: '#ffffff',
            clusterBkg: '#f5f5f5',
            clusterBorder: '#000000',
            defaultLinkColor: '#000000',
            titleColor: '#000000',
            edgeLabelBackground: '#ffffff',
            nodeTextColor: '#000000',
            nodeBorder: '#000000'
          },
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          flowchart: {
            curve: 'linear',
            padding: 15
          },
          sequence: {
            diagramMarginX: 20,
            diagramMarginY: 20
          },
          gantt: {
            barHeight: 30,
            fontSize: 11,
            gridLineStartPadding: 10,
            sectionFontSize: 12
          }
        });

        // 렌더링 완료 표시
        window.addEventListener('load', () => {
          document.body.setAttribute('data-ready', 'true');
        });
      </script>
    </body>
    </html>
  `;

  try {
    await page.setContent(html);

    // Mermaid 렌더링 대기
    await page.waitForSelector('.mermaid svg', { timeout: 30000 });
    await page.waitForTimeout(2000); // 추가 렌더링 시간

    // SVG 요소 찾기
    const svgElement = await page.$('.mermaid svg');
    if (!svgElement) {
      throw new Error('Mermaid SVG not found');
    }

    // SVG 요소만 스크린샷
    await svgElement.screenshot({
      path: outputPath,
      omitBackground: true
    });

    console.log(`  ✓ Generated: ${path.basename(outputPath)}`);
    return true;
  } catch (error) {
    console.error(`  ✗ Error generating ${path.basename(outputPath)}:`, error.message);
    return false;
  }
}

/**
 * 모든 다이어그램 생성
 */
export async function generateAllDiagrams() {
  console.log('\n============================================================');
  console.log('Diagram Generator');
  console.log('============================================================\n');

  // Output 디렉토리 생성
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 800 }
  });

  const diagramNames = Object.keys(diagrams);
  let successCount = 0;

  for (const name of diagramNames) {
    console.log(`Generating: ${name}...`);
    const outputPath = path.join(OUTPUT_DIR, `${name}.png`);
    const success = await generateDiagramPNG(page, diagrams[name], outputPath);
    if (success) successCount++;
  }

  await browser.close();

  console.log(`\n✓ Generated ${successCount}/${diagramNames.length} diagrams`);
  console.log(`Location: ${OUTPUT_DIR}\n`);
}

/**
 * 다이어그램을 Base64로 로드
 */
export function loadDiagramAsBase64(name) {
  const filePath = path.join(OUTPUT_DIR, `${name}.png`);
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: Diagram ${name}.png not found`);
    return null;
  }
  const buffer = fs.readFileSync(filePath);
  return buffer.toString('base64');
}

/**
 * 다이어그램 HTML 생성
 */
export function getDiagramHTML(name, lang = 'ko') {
  const base64 = loadDiagramAsBase64(name);
  if (!base64) {
    return `<p style="color: red;">[Diagram ${name} not found]</p>`;
  }

  const meta = diagramMeta[name];
  const title = lang === 'ko' ? meta.title : meta.titleEn;
  const description = meta.description;

  return `
    <div class="diagram-container" style="margin: 6mm 0; page-break-inside: avoid;">
      <div class="diagram-title" style="font-size: 11pt; font-weight: 600; margin-bottom: 2mm; text-align: center;">
        ${title}
      </div>
      <div class="diagram-image" style="text-align: center; margin: 3mm 0;">
        <img src="data:image/png;base64,${base64}"
             style="max-width: 100%; height: auto; border: 1px solid #ddd;"
             alt="${title}" />
      </div>
      ${description ? `
      <div class="diagram-caption" style="font-size: 9pt; color: #666; text-align: center; margin-top: 2mm;">
        ${description}
      </div>
      ` : ''}
    </div>
  `;
}

// CLI로 직접 실행 시
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllDiagrams().catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}
