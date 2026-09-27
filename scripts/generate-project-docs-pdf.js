/**
 * ============================================================
 * A-SW HUB - Project Documentation PDF Generator
 * ============================================================
 *
 * 과업 문서를 A4 PDF로 변환합니다.
 *
 * 입력: docs/project-management/*.md
 * 출력: docs/project-management/pdf/*.pdf
 *
 * 사용법:
 *   npm run generate-project-docs
 */

import { chromium } from 'playwright';
import { marked } from 'marked';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// 설정
// ============================================================

const ROOT_DIR = path.join(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs', 'project-management');
const OUTPUT_DIR = path.join(DOCS_DIR, 'pdf');

const DOCUMENTS = [
  {
    input: 'task-order.md',
    output: 'task-order-ko.pdf',
    title: '과업지시서',
    lang: 'ko'
  },
  {
    input: 'task-order-en.md',
    output: 'task-order-en.pdf',
    title: 'Task Order',
    lang: 'en'
  },
  {
    input: 'requirements-spec.md',
    output: 'requirements-spec.pdf',
    title: '요구사항 명세서',
    lang: 'ko'
  },
  {
    input: 'user-scenarios.md',
    output: 'user-scenarios.pdf',
    title: '사용자 시나리오',
    lang: 'ko'
  },
  {
    input: 'architecture-guide.md',
    output: 'architecture-guide.pdf',
    title: '시스템 아키텍처 가이드',
    lang: 'ko'
  }
];

// ============================================================
// HTML 템플릿
// ============================================================

function getHTMLTemplate(content, title, lang) {
  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    /* Reset */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    /* Page Setup */
    @page {
      size: A4 portrait;
      margin: 25mm 20mm 25mm 25mm;
    }

    html, body {
      width: 100%;
      box-sizing: border-box;
    }

    body {
      font-family: ${lang === 'ko' ? "'Noto Sans KR', " : ""}-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 10pt;
      line-height: 1.8;
      color: #000;
      background: #fff;
    }

    /* Typography */
    h1 {
      font-size: 18pt;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 8mm;
      padding-bottom: 3mm;
      border-bottom: 2px solid #000;
      page-break-after: avoid;
    }

    h2 {
      font-size: 14pt;
      font-weight: 700;
      margin-top: 8mm;
      margin-bottom: 4mm;
      page-break-after: avoid;
    }

    h3 {
      font-size: 12pt;
      font-weight: 600;
      margin-top: 6mm;
      margin-bottom: 3mm;
      page-break-after: avoid;
    }

    h4 {
      font-size: 11pt;
      font-weight: 600;
      margin-top: 4mm;
      margin-bottom: 2mm;
      page-break-after: avoid;
    }

    h5 {
      font-size: 10pt;
      font-weight: 600;
      margin-top: 3mm;
      margin-bottom: 1.5mm;
      page-break-after: avoid;
    }

    h6 {
      font-size: 9pt;
      font-weight: 600;
      margin-top: 2mm;
      margin-bottom: 1mm;
      page-break-after: avoid;
    }

    p {
      margin-bottom: 3mm;
      text-align: justify;
      orphans: 3;
      widows: 3;
    }

    /* Lists */
    ul, ol {
      margin-left: 6mm;
      margin-bottom: 3mm;
      orphans: 2;
      widows: 2;
    }

    li {
      margin-bottom: 2mm;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 4mm 0;
      page-break-inside: auto;
    }

    thead {
      display: table-header-group;
    }

    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }

    th, td {
      border: 1px solid #000;
      padding: 2mm;
      text-align: left;
      font-size: 9pt;
      vertical-align: top;
    }

    th {
      background: #f0f0f0;
      font-weight: 600;
    }

    /* Code Blocks */
    pre {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 3mm;
      margin: 3mm 0;
      overflow-x: auto;
      page-break-inside: avoid;
    }

    code {
      font-family: 'Courier New', monospace;
      font-size: 8pt;
      background: #f5f5f5;
      padding: 1px 3px;
    }

    pre code {
      background: none;
      padding: 0;
      line-height: 1.4;
    }

    /* Inline Code */
    p code, li code, td code {
      background: #f0f0f0;
      padding: 1px 4px;
      font-size: 9pt;
    }

    /* Links */
    a {
      color: #000;
      text-decoration: underline;
    }

    /* Blockquotes */
    blockquote {
      border-left: 3px solid #000;
      padding-left: 4mm;
      margin: 4mm 0;
      background: #f9f9f9;
      padding: 3mm 4mm;
    }

    /* Strong & Em */
    strong {
      font-weight: 600;
    }

    em {
      font-style: italic;
    }

    /* Horizontal Rule */
    hr {
      border: none;
      border-top: 1px solid #ccc;
      margin: 6mm 0;
    }

    /* Page Breaks */
    .page-break {
      page-break-after: always;
    }

    /* Prevent breaks */
    .no-break {
      page-break-inside: avoid;
    }

    /* Header Metadata */
    .doc-header {
      margin-bottom: 10mm;
      padding-bottom: 5mm;
      border-bottom: 3px solid #000;
    }

    .doc-title {
      font-size: 24pt;
      font-weight: 700;
      margin-bottom: 2mm;
    }

    .doc-meta {
      font-size: 9pt;
      color: #666;
      margin-top: 3mm;
    }

    .doc-meta p {
      margin-bottom: 1mm;
    }

    /* Footer */
    @media print {
      .footer {
        position: fixed;
        bottom: 10mm;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 8pt;
        color: #666;
      }
    }
  </style>
</head>
<body>
  <div class="document">
    ${content}
  </div>
</body>
</html>
  `;
}

// ============================================================
// Markdown to PDF 변환
// ============================================================

async function convertMarkdownToPDF(doc) {
  const inputPath = path.join(DOCS_DIR, doc.input);
  const outputPath = path.join(OUTPUT_DIR, doc.output);

  console.log(`\n📄 Processing: ${doc.input}`);
  console.log(`   → ${doc.output}`);

  try {
    // 1. Markdown 파일 읽기
    const markdown = await fs.readFile(inputPath, 'utf-8');
    console.log(`   ✓ Markdown loaded (${markdown.length} characters)`);

    // 2. Markdown → HTML 변환
    marked.setOptions({
      gfm: true,           // GitHub Flavored Markdown
      breaks: false,       // 줄바꿈 무시
      headerIds: true,     // Header ID 생성
      mangle: false        // 이메일 자동 링크 비활성화
    });

    const htmlContent = marked.parse(markdown);
    console.log(`   ✓ Converted to HTML`);

    // 3. HTML 템플릿 적용
    const fullHTML = getHTMLTemplate(htmlContent, doc.title, doc.lang);

    // 4. Playwright로 PDF 생성
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.setContent(fullHTML, { waitUntil: 'networkidle' });
    console.log(`   ✓ Page loaded`);

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '25mm',
        right: '20mm',
        bottom: '25mm',
        left: '25mm'
      },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="font-size: 8pt; text-align: center; width: 100%; color: #666; padding: 10mm 0;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `
    });

    await browser.close();
    console.log(`   ✅ PDF generated: ${outputPath}`);

    return { success: true, file: doc.output };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return { success: false, file: doc.output, error: error.message };
  }
}

// ============================================================
// 메인 함수
// ============================================================

async function main() {
  console.log('============================================================');
  console.log('📚 A-SW Hub - Project Documentation PDF Generator');
  console.log('============================================================\n');

  // 출력 디렉토리 생성
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    console.log(`✓ Output directory ready: ${OUTPUT_DIR}\n`);
  } catch (error) {
    console.error(`❌ Failed to create output directory: ${error.message}`);
    process.exit(1);
  }

  // 문서별 PDF 생성
  const results = [];
  for (const doc of DOCUMENTS) {
    const result = await convertMarkdownToPDF(doc);
    results.push(result);
  }

  // 결과 요약
  console.log('\n============================================================');
  console.log('📊 Summary');
  console.log('============================================================\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  successful.forEach(r => console.log(`   - ${r.file}`));

  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length}/${results.length}`);
    failed.forEach(r => console.log(`   - ${r.file}: ${r.error}`));
  }

  console.log('\n✨ Done!\n');
}

// 실행
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
