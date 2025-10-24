/**
 * A-SW Hub 용역 최종 결과보고서 생성 스크립트
 *
 * 농업기계 자율주행 소프트웨어 개발을 위한 통합 협업 플랫폼(A-SW Hub)
 * 구축 용역 최종 결과보고서 자동 생성
 *
 * Features:
 * - A4 Portrait (210mm × 297mm)
 * - 8개 섹션 + 부록 (약 60-80페이지)
 * - 한글/영문 양방향 생성
 * - 전문 학술 보고서 스타일
 * - 자동 목차/페이지 번호
 * - 스크린샷/다이어그램 삽입
 */

import { chromium } from 'playwright';
import { PDFDocument, rgb, grayscale, PDFName } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// Configuration
// ============================================================

const OUTPUT_DIR = path.join(__dirname, '..', 'reports');
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

const PAGE_FORMAT = {
  width: '210mm',    // A4 width
  height: '297mm',   // A4 height
  margin: {
    top: '25mm',
    right: '25mm',    // 오른쪽 여백 증가 (잘림 방지)
    bottom: '25mm',
    left: '20mm'
  }
};

// ============================================================
// Report Metadata
// ============================================================

const REPORT_META = {
  ko: {
    title: '농업기계 자율주행 소프트웨어 개발을 위한\n통합 협업 플랫폼(A-SW Hub) 구축\n용역 결과보고서',
    subtitle: '2025년 농업기계 디지털 전환형 개방형 A-SW 오픈소스 협력 개발 서비스 플랫폼 구축 사업',
    projectName: '농업기계 디지털전환형 개방형 A-SW 오픈소스 및 협력개발 서비스 플랫폼 구축',
    projectNameShort: '2025 농업기계 디지털 전환형 개방형 A-SW 오픈소스 협력 개발 서비스 플랫폼 구축 사업',
    subProjectName: '무인자율 농작업을 위한 개방형 A-SW 개발 및 실증',
    leadInstitution: '한국생산기술연구원 (KITECH)',
    participants: 'KITECH · TYMICT · JBNU · VIA · OntarioTech',
    developer: '(주)비아',
    developerFull: '주식회사 비아 (VIASOFT.AI)',
    projectPeriod: '2025년 9월 1일 ~ 2025년 10월 25일',
    reportDate: '2025년 10월 26일'
  },
  en: {
    title: 'A-SW Hub - Integrated Collaborative Platform\nfor Autonomous Agricultural Machinery\nSoftware Development Report',
    subtitle: 'Open-Source A-SW and Collaborative Development Service Platform for Digital Transformation of Agricultural Machinery',
    projectName: 'Open-Source A-SW and Collaborative Development Service Platform for Digital Transformation of Agricultural Machinery',
    projectNameShort: '2025 Open-Source A-SW Platform Development Project',
    subProjectName: 'Development and Demonstration of Open A-SW for Unmanned Autonomous Agricultural Operations',
    leadInstitution: 'Korea Institute of Industrial Technology (KITECH)',
    participants: 'KITECH · TYMICT · JBNU · VIA · OntarioTech',
    developer: 'VIA Inc.',
    developerFull: 'VIA Inc. (VIASOFT.AI)',
    projectPeriod: 'September 1, 2025 ~ October 25, 2025',
    reportDate: 'October 26, 2025'
  }
};

// ============================================================
// Report Structure
// ============================================================

const REPORT_SECTIONS = {
  ko: [
    { id: '1', title: '연구개발과제 개요', pages: 10 },
    { id: '2', title: '시스템 설계', pages: 15 },
    { id: '3', title: 'UX/UI 디자인 시스템', pages: 12 },
    { id: '4', title: '핵심 기능 구현', pages: 22 },
    { id: '5', title: '기술 구현 상세', pages: 18 },
    { id: '6', title: '테스트 및 품질 검증', pages: 10 },
    { id: '7', title: '배포 및 운영', pages: 6 },
    { id: '8', title: '결과 및 기대효과', pages: 5 },
    { id: 'A', title: '부록', pages: 10 }
  ],
  en: [
    { id: '1', title: 'Project Overview', pages: 10 },
    { id: '2', title: 'System Architecture', pages: 15 },
    { id: '3', title: 'UX/UI Design System', pages: 12 },
    { id: '4', title: 'Core Features Implementation', pages: 22 },
    { id: '5', title: 'Technical Implementation Details', pages: 18 },
    { id: '6', title: 'Testing & Quality Assurance', pages: 10 },
    { id: '7', title: 'Deployment & Operations', pages: 6 },
    { id: '8', title: 'Results & Expected Impact', pages: 5 },
    { id: 'A', title: 'Appendices', pages: 10 }
  ]
};

// ============================================================
// HTML Template Generators
// ============================================================

/**
 * Generate cover page HTML
 */
function generateCoverPage(lang, meta) {
  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <title>Cover Page</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4 portrait; margin: 0; }
        html, body { width: 210mm; height: 297mm; }
        body {
          font-family: 'Noto Sans ${lang === 'ko' ? 'KR' : ''}', -apple-system, BlinkMacSystemFont, sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40mm 30mm;
          background: #fff;
          color: #000;
        }

        .header {
          text-align: center;
          padding-bottom: 10mm;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 20mm 0;
        }

        .main-title {
          font-size: ${lang === 'ko' ? '22pt' : '20pt'};
          font-weight: 700;
          line-height: 1.6;
          margin-bottom: 15mm;
          white-space: pre-line;
        }

        .subtitle {
          font-size: ${lang === 'ko' ? '12pt' : '11pt'};
          font-weight: 400;
          line-height: 1.8;
          color: #333;
          max-width: 85%;
        }

        .footer {
          border-top: 1px solid #000;
          padding-top: 10mm;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4mm;
          font-size: 10pt;
        }

        .info-label {
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-weight: 400;
        }

        .institution-box {
          background: #f5f5f5;
          border: 1px solid #000;
          padding: 6mm;
          margin-top: 8mm;
          text-align: center;
        }

        .institution-name {
          font-size: 16pt;
          font-weight: 700;
          margin-bottom: 3mm;
        }

        .developer-name {
          font-size: 11pt;
          font-weight: 400;
          color: #666;
        }

        .date-box {
          margin-top: 6mm;
          font-size: 11pt;
          font-weight: 400;
          display: flex;
          flex-direction: column;
          gap: 2mm;
        }

        .date-row {
          display: flex;
          justify-content: space-between;
          font-size: 10pt;
        }

        .author-notice {
          margin-top: 6mm;
          padding: 4mm;
          background: #fafafa;
          border: 1px solid #ddd;
          text-align: center;
          font-size: 10pt;
          font-weight: 500;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <!-- 대외비/최종보고서 제거 -->
      </div>

      <div class="main-content">
        <div class="main-title">${meta.title}</div>
        <div class="subtitle">${meta.subtitle}</div>
      </div>

      <div class="footer">
        <div class="info-row">
          <span class="info-label">${lang === 'ko' ? '사업명' : 'Project'}</span>
          <span class="info-value">${meta.projectName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">${lang === 'ko' ? '주관기관' : 'Lead Institution'}</span>
          <span class="info-value">${meta.leadInstitution}</span>
        </div>
        <div class="info-row">
          <span class="info-label">${lang === 'ko' ? '참여기관' : 'Participants'}</span>
          <span class="info-value">${meta.participants}</span>
        </div>

        <div class="date-box">
          <div class="date-row">
            <span class="info-label">${lang === 'ko' ? '과업기간' : 'Project Period'}</span>
            <span class="info-value">${meta.projectPeriod}</span>
          </div>
          <div class="date-row">
            <span class="info-label">${lang === 'ko' ? '보고서 작성일' : 'Report Date'}</span>
            <span class="info-value">${meta.reportDate}</span>
          </div>
        </div>

        <div class="author-notice">
          ${lang === 'ko' ? '본 보고서는' : 'This report was prepared by'} <strong>${meta.developerFull}</strong>${lang === 'ko' ? '에서 작성하였습니다' : ''}.
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate table of contents page HTML
 */
function generateTableOfContents(lang, sections, meta) {
  let pageNum = 1;
  const tocItems = sections.map((section, idx) => {
    const itemNum = pageNum;
    pageNum += section.pages;
    return { ...section, startPage: itemNum };
  });

  const tocListHTML = tocItems.map(item => `
    <tr>
      <td class="toc-number">${item.id}</td>
      <td class="toc-title">${item.title}</td>
      <td class="toc-dots"></td>
      <td class="toc-page">${item.startPage}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <title>Table of Contents</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4 portrait; margin: 25mm 20mm; }
        html, body { width: 210mm; height: 297mm; }
        body {
          font-family: 'Noto Sans ${lang === 'ko' ? 'KR' : ''}', -apple-system, BlinkMacSystemFont, sans-serif;
          padding: 0;
          color: #000;
        }

        .toc-header {
          text-align: center;
          margin-bottom: 15mm;
          padding-bottom: 5mm;
          border-bottom: 2px solid #000;
        }

        .toc-title-main {
          font-size: 20pt;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .toc-table {
          width: 100%;
          border-collapse: collapse;
        }

        .toc-table tr {
          border-bottom: 1px solid #e0e0e0;
        }

        .toc-table td {
          padding: 5mm 2mm;
          vertical-align: middle;
        }

        .toc-number {
          width: 15mm;
          font-size: 12pt;
          font-weight: 700;
          text-align: left;
        }

        .toc-title {
          font-size: 11pt;
          font-weight: 400;
        }

        .toc-dots {
          flex: 1;
          border-bottom: 1px dotted #ccc;
          margin: 0 4mm;
        }

        .toc-page {
          width: 15mm;
          font-size: 11pt;
          font-weight: 600;
          text-align: right;
        }
      </style>
    </head>
    <body>
      <div class="toc-header">
        <div class="toc-title-main">${lang === 'ko' ? '목 차' : 'TABLE OF CONTENTS'}</div>
      </div>

      <table class="toc-table">
        ${tocListHTML}
      </table>
    </body>
    </html>
  `;
}

// ============================================================
// Section Content Imports
// ============================================================

import { generateOverviewHTML } from './report/sections/01-overview.js';
import { generateArchitectureHTML } from './report/sections/02-architecture.js';
import { generateDesignHTML } from './report/sections/03-design.js';
import { remainingSections, generateSectionHTML } from './report/sections/04-features.js';
import { generateAllDiagrams, getDiagramHTML } from './report/diagrams/generator.js';

// ============================================================
// Main Generation Function
// ============================================================

async function generateReport() {
  console.log('\n============================================================');
  console.log('A-SW Hub - Final Report Generator');
  console.log('============================================================\n');

  // Create output directories
  ['ko', 'en'].forEach(lang => {
    const dir = path.join(OUTPUT_DIR, lang);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Generate all diagrams first
  console.log('Generating diagrams...');
  await generateAllDiagrams();
  console.log('');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const lang of ['ko', 'en']) {
    console.log(`\n[${lang.toUpperCase()}] Generating report...`);

    const meta = REPORT_META[lang];
    const sections = REPORT_SECTIONS[lang];
    const pdfDoc = await PDFDocument.create();

    // 1. Cover page
    console.log('  [1/10] Generating cover page...');
    const coverHTML = generateCoverPage(lang, meta);
    await page.setContent(coverHTML);
    await page.waitForLoadState('networkidle');
    const coverPDF = await page.pdf({
      format: 'A4',
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
    });
    const coverDoc = await PDFDocument.load(coverPDF);
    const [coverPage] = await pdfDoc.copyPages(coverDoc, [0]);
    pdfDoc.addPage(coverPage);

    // 2. Table of contents
    console.log('  [2/10] Generating table of contents...');
    const tocHTML = generateTableOfContents(lang, sections, meta);
    await page.setContent(tocHTML);
    await page.waitForLoadState('networkidle');
    const tocPDF = await page.pdf({
      format: 'A4',
      margin: PAGE_FORMAT.margin
    });
    const tocDoc = await PDFDocument.load(tocPDF);
    const [tocPage] = await pdfDoc.copyPages(tocDoc, [0]);
    pdfDoc.addPage(tocPage);

    // 3. Section 1: Overview
    console.log('  [3/10] Generating Section 1: Overview...');
    await addSectionToPDF(pdfDoc, page, generateOverviewHTML(lang));

    // 4. Section 2: Architecture
    console.log('  [4/10] Generating Section 2: Architecture...');
    await addSectionToPDF(pdfDoc, page, generateArchitectureHTML(lang));

    // 5. Section 3: Design
    console.log('  [5/10] Generating Section 3: Design System...');
    await addSectionToPDF(pdfDoc, page, generateDesignHTML(lang));

    // 6-10. Remaining sections
    const remaining = remainingSections[lang];
    for (let i = 0; i < remaining.length; i++) {
      console.log(`  [${6 + i}/10] Generating Section ${remaining[i].id}...`);
      const sectionHTML = generateSectionHTML(remaining[i], lang);
      await addSectionToPDF(pdfDoc, page, sectionHTML);
    }

    // Add page numbers and footer
    console.log('  Adding page numbers and footer...');
    await addPageNumbersAndFooter(pdfDoc, lang, meta);

    // Save PDF
    const outputPath = path.join(OUTPUT_DIR, lang, `a-sw-hub-final-report-${lang}.pdf`);
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);

    console.log(`  ✓ PDF saved: ${outputPath}`);
    console.log(`  ✓ Total pages: ${pdfDoc.getPageCount()}`);
  }

  await browser.close();

  console.log('\n============================================================');
  console.log('✓ All reports generated successfully!');
  console.log('============================================================\n');
  console.log(`Location: ${OUTPUT_DIR}`);
}

/**
 * Helper: Add section HTML to PDF document
 */
async function addSectionToPDF(pdfDoc, page, sectionHTML) {
  await page.setContent(sectionHTML);
  await page.waitForLoadState('networkidle');

  const sectionPDF = await page.pdf({
    format: 'A4',
    margin: PAGE_FORMAT.margin
  });

  const sectionDoc = await PDFDocument.load(sectionPDF);
  const pageCount = sectionDoc.getPageCount();

  for (let i = 0; i < pageCount; i++) {
    const [copiedPage] = await pdfDoc.copyPages(sectionDoc, [i]);
    pdfDoc.addPage(copiedPage);
  }
}

/**
 * Add page numbers and footer to PDF
 */
async function addPageNumbersAndFooter(pdfDoc, lang, meta) {
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  // Set PDF viewer preference: single page view
  pdfDoc.catalog.set(PDFName.of('PageLayout'), PDFName.of('OneColumn'));

  // For Korean, use simplified project name (ASCII only)
  const projectName = lang === 'ko'
    ? '2025 A-SW Platform Project'
    : meta.projectNameShort;

  // Skip cover (page 0) and TOC (page 1)
  for (let i = 2; i < totalPages; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const pageNumber = i - 1; // 표지/목차 제외하고 1부터 시작

    // Footer text
    const footerLeft = projectName;
    const footerRight = `${pageNumber} / ${totalPages - 2}`;

    // Draw footer (using default Helvetica font for compatibility)
    page.drawText(footerLeft, {
      x: 20 * 2.83465, // 20mm to points
      y: 15 * 2.83465, // 15mm from bottom
      size: 7,
      color: grayscale(0.4)
    });

    page.drawText(footerRight, {
      x: width - (25 * 2.83465) - (footerRight.length * 3.5), // 25mm from right
      y: 15 * 2.83465,
      size: 7,
      color: grayscale(0.4)
    });
  }
}

// Run generator
generateReport().catch(error => {
  console.error('Error generating reports:', error);
  process.exit(1);
});
