/**
 * ============================================================
 * A-SW HUB - PDF Documentation Generator
 * ============================================================
 *
 * 이 스크립트는 A-SW HUB 플랫폼의 역할별(Admin/Developer/Viewer)
 * 사용자 문서를 자동으로 생성합니다.
 *
 * 주요 기능:
 * 1. 웹 페이지 스크린샷 자동 캡처 (Playwright 사용)
 * 2. 역할별/언어별 PDF 생성 (6개 조합)
 * 3. 표지, 목차, 상세 페이지 자동 구성
 * 4. 2가지 출력 포맷 지원 (PRINT/PRESENTATION)
 *
 * 파일 구조:
 * - 상수 및 설정 (lines 1-260)
 * - 타이틀 페이지 레이아웃 함수들 (lines 270-785)
 * - PDF 생성 함수들 (lines 786-1391)
 * - 페이지 캡처 함수들 (lines 1392-1486)
 * - 메인 실행 로직 (lines 1487-1735)
 *
 * 사용법:
 *   npm run generate-pdfs
 *
 * 출력:
 *   pdfs/en/ - 영어 PDF 파일들
 *   pdfs/ko/ - 한국어 PDF 파일들
 */

import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// 기본 경로 설정
// ============================================================
const BASE_URL = 'http://localhost:5174';              // 개발 서버 URL
const OUTPUT_DIR = path.join(__dirname, '../pdfs');    // PDF 출력 폴더
const FONTS_DIR = path.join(__dirname, '../fonts');    // 폰트 파일 폴더
const TRANSLATIONS_DIR = path.join(__dirname, '../translations'); // 번역 파일 폴더

// ============================================================
// PDF 출력 포맷 프리셋
// ============================================================
/**
 * PDF 출력 포맷별 설정
 *
 * PRINT: A4 landscape (297×210mm) - 인쇄용
 * PRESENTATION: 16:9 (1920×1080px) - 화면 발표용
 *
 * 각 프리셋 포함 항목:
 * - dimensions: 페이지 크기
 * - fontSize: 요소별 폰트 크기
 * - screenshot: 스크린샷 영역 비율 (3:1)
 * - spacing: 표지 페이지 여백
 * - coverFontSize: 표지 페이지 전용 폰트
 */
const FORMAT_PRESETS = {
  PRINT: {
    name: 'A4 Print',
    description: 'A4 landscape format for printing',
    pageFormat: 'A4',
    orientation: 'landscape',
    dimensions: { width: '297mm', height: '210mm' },
    viewport: { width: 1920, height: 1350 },
    padding: { page: '35mm 40mm', toc: '30mm' },
    fontSize: {
      coverTitle: '34px',
      coverSubtitle: '12px',
      coverBody: '13px',
      coverSmall: '10px',
      tocTitle: '32px',
      tocItem: '13px',
      detailTitle: '28px',
      detailBody: '14px',
      detailSmall: '11px'
    },
    screenshot: {
      scale: 1.00,
      flexRatio: 7.5,
      descriptionFlexRatio: 2.5
    },
    content: {
      maxFeatures: 9,
      maxComponents: 17
    },
    spacing: {
      containerPadding: '100px 120px 75px 120px',
      headerMarginBottom: '85px',
      platformLabelMarginBottom: '35px',
      titleMarginBottom: '45px',
      mainContentPaddingBottom: '45px',
      bottomSectionPaddingTop: '35px',
      infoListGap: '32px',
      infoListMarginBottom: '45px',
      footerPaddingTop: '30px'
    },
    coverFontSize: {
      title: '125px',
      subtitle: '25px',
      infoText: '15px',
      orgName: '18px',
      orgFull: '10px',
      participants: '10px',
      date: '10px'
    }
  },

  PRESENTATION: {
    name: '16:9 Presentation',
    description: '1920×1080 format for screen presentation',
    pageFormat: null, // Custom size
    orientation: 'landscape',
    dimensions: { width: '1920px', height: '1080px' },
    viewport: { width: 1920, height: 1080 },
    padding: { page: '40px 60px', toc: '40px 60px' },
    fontSize: {
      coverTitle: '48px',
      coverSubtitle: '18px',
      coverBody: '20px',
      coverSmall: '14px',
      tocTitle: '42px',
      tocItem: '18px',
      detailTitle: '36px',
      detailBody: '18px',
      detailSmall: '14px'
    },
    screenshot: {
      scale: 1.00,
      flexRatio: 7.5,
      descriptionFlexRatio: 2.5
    },
    content: {
      maxFeatures: 12,
      maxComponents: 20
    },
    spacing: {
      containerPadding: '140px 160px 100px 160px',
      headerMarginBottom: '120px',
      platformLabelMarginBottom: '50px',
      titleMarginBottom: '60px',
      mainContentPaddingBottom: '60px',
      bottomSectionPaddingTop: '50px',
      infoListGap: '45px',
      infoListMarginBottom: '60px',
      footerPaddingTop: '40px'
    },
    coverFontSize: {
      title: '170px',
      subtitle: '34px',
      infoText: '20px',
      orgName: '24px',
      orgFull: '14px',
      participants: '13px',
      date: '14px'
    }
  }
};

// ============================================================
// 사용자 설정 (이 부분만 수정하세요!)
// ============================================================

/**
 * 출력 포맷 선택
 * - 'PRINT': A4 인쇄용
 * - 'PRESENTATION': 16:9 화면 발표용
 */
const OUTPUT_FORMAT = 'PRESENTATION';

/**
 * 표지 페이지 레이아웃 선택
 * - 'layout1': 왼쪽 정렬
 * - 'layout2': 상단 헤더
 * - 'layout3': 2단 구성
 * - 'modern': 현대적 디자인 (권장)
 */
const TITLE_PAGE_LAYOUT = 'modern';

/**
 * 현재 선택된 포맷의 프리셋 반환
 * @returns {Object} 선택된 FORMAT_PRESETS 객체
 */
function getActivePreset() {
  return FORMAT_PRESETS[OUTPUT_FORMAT];
}

// ============================================================
// 하위 호환성을 위한 변수들 (직접 수정 금지)
// ============================================================
const VIEWPORT_HEIGHT = getActivePreset().viewport.height;
const MAX_FEATURES = getActivePreset().content.maxFeatures;
const MAX_COMPONENTS = getActivePreset().content.maxComponents;
const SCREENSHOT_SCALE = getActivePreset().screenshot.scale;
const SCREENSHOT_FLEX_RATIO = getActivePreset().screenshot.flexRatio;
const DESCRIPTION_FLEX_RATIO = getActivePreset().screenshot.descriptionFlexRatio;

// ============================================================
// 역할별 계정 및 페이지 설정
// ============================================================
/**
 * 역할별(Admin/Developer/Viewer) 로그인 정보 및 캡처할 페이지 목록
 *
 * 각 역할은 다음을 포함:
 * - email/password: 자동 로그인용 계정 정보
 * - pages: 캡처할 페이지 배열
 *   - route: 페이지 경로
 *   - name: 페이지 이름
 *   - code: 페이지 고유 코드 (DASH-001 등)
 *   - tabs: 탭이 있는 페이지의 탭 목록 (선택사항)
 *   - modals: 모달이 있는 페이지의 모달 목록 (선택사항)
 */
const ACCOUNTS = {
  'admin': {
    email: 'admin@a-sw-hub.com',
    password: 'demo123',
    name: 'Admin',
    pages: [
      { route: '/login', name: 'Login', code: 'AUTH-001', skipAuth: true },
      { route: '/dashboard', name: 'Dashboard', code: 'DASH-001' },
      {
        route: '/projects',
        name: 'Projects List',
        code: 'PROJ-001'
      },
      {
        route: '/projects/v2x-collaboration',
        name: 'Project Detail',
        code: 'PROJ-002',
        tabs: [
          { selector: 'button.tab:has-text("OVERVIEW")', name: 'Overview' },
          { selector: 'button.tab:has-text("BUILDS")', name: 'Builds' },
          { selector: 'button.tab:has-text("DEPLOYMENTS")', name: 'Deployments' },
          { selector: 'button.tab:has-text("CONTRIBUTORS")', name: 'Contributors' },
          { selector: 'button.tab:has-text("SETTINGS")', name: 'Settings' }
        ]
      },
      {
        route: '/projects/v2x-collaboration/edit',
        name: 'Project Configuration',
        code: 'PROJ-003',
        tabs: [
          { selector: 'button.nav-item:has-text("GENERAL")', name: 'General' },
          { selector: 'button.nav-item:has-text("REPOSITORY")', name: 'Repository' },
          { selector: 'button.nav-item:has-text("BUILD")', name: 'Build' },
          { selector: 'button.nav-item:has-text("DEPLOYMENT")', name: 'Deployment' },
          { selector: 'button.nav-item:has-text("NOTIFICATIONS")', name: 'Notifications' },
          { selector: 'button.nav-item:has-text("ADVANCED")', name: 'Advanced' },
          { selector: 'button.nav-item:has-text("DANGER ZONE")', name: 'Danger Zone' }
        ]
      },
      {
        route: '/projects/v2x-collaboration/pipelines',
        name: 'Project Pipelines',
        code: 'PROJ-004',
        tabs: [
          { selector: 'button.tab:has-text("OVERVIEW")', name: 'Overview' },
          { selector: 'button.tab:has-text("CONFIGURATION")', name: 'Configuration' },
          { selector: 'button.tab:has-text("HISTORY")', name: 'History' },
          { selector: 'button.tab:has-text("SETTINGS")', name: 'Settings' }
        ]
      },
      {
        route: '/projects/new',
        name: 'New Project',
        code: 'PROJ-005'
      },
      { route: '/builds', name: 'Builds Dashboard', code: 'BUILD-001' },
      { route: '/deployments', name: 'Deployments', code: 'DEPLOY-001' },
      { route: '/approvals', name: 'Approvals', code: 'APPR-001' },
      { route: '/timeline', name: 'Timeline', code: 'TIME-001' },
      { route: '/quality', name: 'Quality Metrics', code: 'QUAL-001' },
      {
        route: '/settings',
        name: 'System Settings',
        code: 'SETT-001',
        tabs: [
          { selector: 'button.tab .nav-label:has-text("PROFILE")', name: 'Profile' },
          { selector: 'button.tab .nav-label:has-text("SECURITY")', name: 'Security' },
          { selector: 'button.tab .nav-label:has-text("NOTIFICATIONS")', name: 'Notifications' },
          { selector: 'button.tab .nav-label:has-text("PREFERENCES")', name: 'Preferences' },
          { selector: 'button.tab .nav-label:has-text("INTEGRATIONS")', name: 'Integrations' },
          { selector: 'button.tab .nav-label:has-text("DATA")', name: 'Data & Privacy' }
        ]
      }
    ],
  },

  'developer': {
    email: 'developer@a-sw-hub.com',
    password: 'demo123',
    name: 'Developer',
    pages: [
      { route: '/login', name: 'Login', code: 'AUTH-001', skipAuth: true },
      { route: '/dashboard', name: 'Dashboard', code: 'DASH-001' },
      { route: '/projects', name: 'Projects List', code: 'PROJ-001' },
      { route: '/projects/v2x-collaboration', name: 'Project Detail', code: 'PROJ-002' },
      { route: '/projects/v2x-collaboration/pipelines', name: 'Project Pipelines', code: 'PROJ-004' },
      { route: '/projects/new', name: 'New Project', code: 'PROJ-005' },
      { route: '/builds', name: 'Builds Dashboard', code: 'BUILD-001' },
      { route: '/deployments', name: 'Deployments', code: 'DEPLOY-001' },
      { route: '/approvals', name: 'Approvals', code: 'APPR-001' },
      { route: '/timeline', name: 'Timeline', code: 'TIME-001' },
      { route: '/quality', name: 'Quality Metrics', code: 'QUAL-001' },
      { route: '/settings', name: 'System Settings', code: 'SETT-001' }
    ],
  },

  'viewer': {
    email: 'viewer@a-sw-hub.com',
    password: 'demo123',
    name: 'Viewer',
    pages: [
      { route: '/login', name: 'Login', code: 'AUTH-001', skipAuth: true },
      { route: '/dashboard', name: 'Dashboard', code: 'DASH-001' },
      { route: '/projects', name: 'Projects List', code: 'PROJ-001' },
      { route: '/projects/v2x-collaboration', name: 'Project Detail', code: 'PROJ-002' },
      { route: '/builds', name: 'Builds Dashboard', code: 'BUILD-001' },
      { route: '/deployments', name: 'Deployments', code: 'DEPLOY-001' },
      { route: '/approvals', name: 'Approvals', code: 'APPR-001' },
      { route: '/timeline', name: 'Timeline', code: 'TIME-001' },
      { route: '/quality', name: 'Quality Metrics', code: 'QUAL-001' },
      { route: '/settings', name: 'System Settings', code: 'SETT-001' }
    ],
  }
};

// ============================================================
// 유틸리티 함수들
// ============================================================

/**
 * 번역 파일 로드
 * @param {string} lang - 언어 코드 ('en' 또는 'ko')
 * @returns {Object} 페이지 및 공통 번역 객체
 */
function loadTranslations(lang) {
  const pagesPath = path.join(TRANSLATIONS_DIR, `pages-${lang}.json`);
  const commonPath = path.join(TRANSLATIONS_DIR, `common-${lang}.json`);
  return {
    pages: JSON.parse(fs.readFileSync(pagesPath, 'utf-8')),
    common: JSON.parse(fs.readFileSync(commonPath, 'utf-8')),
  };
}

// ============================================================
// 표지 페이지 레이아웃 템플릿들
// ============================================================

/**
 * 표지 레이아웃 1: 왼쪽 정렬 현대적 스타일
 * @param {string} lang - 언어 코드
 * @param {Object} common - 공통 번역 객체
 * @param {string} roleName - 역할 이름
 * @param {string} today - 오늘 날짜
 * @returns {string} HTML 문자열
 */
function getTitlePageLayout1(lang, common, roleName, today) {
  const preset = getActivePreset();
  const pageStyle = preset.pageFormat
    ? `size: ${preset.pageFormat} ${preset.orientation};`
    : `size: ${preset.dimensions.width} ${preset.dimensions.height};`;

  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${common.title}</title>
      <style>
        @page { ${pageStyle} margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${preset.dimensions.width}; height: ${preset.dimensions.height}; }
        body {
          font-family: 'Noto Sans ${lang === 'ko' ? 'KR' : ''}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: ${preset.padding.page};
          color: #000;
        }
        .content { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 18px; }
        .header { text-align: left; margin-bottom: 15px; }
        h1 { font-size: ${preset.fontSize.coverTitle}; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 6px; }
        .presented-by { font-size: ${preset.fontSize.coverSubtitle}; color: #666; letter-spacing: 0.8px; }
        .kitech-section { margin: 12px 0; }
        .kitech-abbr { font-size: calc(${preset.fontSize.coverTitle} * 0.7); font-weight: 700; color: #000; }
        .kitech-name { font-size: ${preset.fontSize.coverBody}; color: #333; margin-top: 3px; }
        .kitech-english { font-size: ${preset.fontSize.coverSmall}; color: #666; margin-top: 2px; font-style: italic; }
        .divider { width: 60%; height: 2px; background: #000; margin: 15px 0; }
        .project-info { background: #f5f5f5; padding: 15px 20px; border-left: 3px solid #000; margin: 8px 0; }
        .project-label { font-size: ${preset.fontSize.coverSmall}; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
        .project-title { font-size: ${preset.fontSize.coverBody}; font-weight: 500; color: #000; line-height: 1.4; }
        .platform-desc { background: #fafafa; padding: 15px 20px; border-left: 3px solid #666; margin: 8px 0; }
        .platform-desc-label { font-size: ${preset.fontSize.coverSmall}; font-weight: 600; color: #666; text-transform: uppercase; margin-bottom: 5px; }
        .platform-desc-text { font-size: calc(${preset.fontSize.coverBody} * 0.9); color: #333; line-height: 1.5; }
        .footer-info { margin-top: 15px; text-align: left; }
        .role-text { font-size: ${preset.fontSize.coverSmall}; color: #666; margin-bottom: 3px; }
        .role-name { font-size: calc(${preset.fontSize.coverTitle} * 0.6); font-weight: 600; color: #000; }
        .doc-date { font-size: ${preset.fontSize.coverSmall}; color: #999; margin-top: 8px; }
        .copyright { font-size: calc(${preset.fontSize.coverSmall} * 0.9); color: #999; padding-top: 12px; border-top: 1px solid #e0e0e0; }
      </style>
    </head>
    <body>
      <div class="content">
        <div class="header">
          <h1>${common.title}</h1>
          <div class="presented-by">${common.presentedBy}</div>
        </div>
        <div class="kitech-section">
          <div class="kitech-abbr">${common.companyAbbr}</div>
          <div class="kitech-name">${common.company}</div>
          <div class="kitech-english">${common.companyEnglish}</div>
        </div>
        <div class="divider"></div>
        <div class="project-info">
          <div class="project-label">${common.projectLabel}</div>
          <div class="project-title">${common.projectTitle}</div>
        </div>
        <div class="project-info">
          <div class="project-label">${common.subProjectLabel}</div>
          <div class="project-title">${common.subProjectTitle}</div>
        </div>
        <div class="divider"></div>
        <div class="platform-desc">
          <div class="platform-desc-label">${common.platformDescriptionLabel}</div>
          <div class="platform-desc-text">${common.platformDescription}</div>
        </div>
        <div class="footer-info">
          <div class="role-text">${common.role}</div>
          <div class="role-name">${roleName}</div>
          <div class="doc-date">${common.documentDate}: ${today}</div>
        </div>
      </div>
      <div class="copyright">${common.copyright}</div>
    </body>
    </html>
  `;
}

/**
 * 표지 레이아웃 2: 상단 헤더 스타일 (KITECH 강조)
 * @param {string} lang - 언어 코드
 * @param {Object} common - 공통 번역 객체
 * @param {string} roleName - 역할 이름
 * @param {string} today - 오늘 날짜
 * @returns {string} HTML 문자열
 */
function getTitlePageLayout2(lang, common, roleName, today) {
  const preset = getActivePreset();
  const pageStyle = preset.pageFormat
    ? `size: ${preset.pageFormat} ${preset.orientation};`
    : `size: ${preset.dimensions.width} ${preset.dimensions.height};`;

  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${common.title}</title>
      <style>
        @page { ${pageStyle} margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${preset.dimensions.width}; height: ${preset.dimensions.height}; }
        body {
          font-family: 'Noto Sans ${lang === 'ko' ? 'KR' : ''}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: ${preset.padding.page};
          color: #000;
        }
        .content { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 16px; }
        .kitech-header { background: #000; color: #fff; padding: 18px 25px; text-align: center; margin-bottom: 20px; }
        .kitech-abbr { font-size: calc(${preset.fontSize.coverTitle} * 0.85); font-weight: 700; letter-spacing: 1px; }
        .kitech-name { font-size: ${preset.fontSize.coverSubtitle}; margin-top: 5px; font-weight: 400; }
        .kitech-english { font-size: ${preset.fontSize.coverSmall}; margin-top: 3px; opacity: 0.9; font-style: italic; }
        .title-section { text-align: center; margin: 15px 0; }
        h1 { font-size: ${preset.fontSize.coverTitle}; font-weight: 600; margin-bottom: 6px; }
        .presented-by { font-size: ${preset.fontSize.coverSubtitle}; color: #666; letter-spacing: 0.8px; }
        .info-box { background: #f8f8f8; padding: 14px 20px; margin: 7px 0; border-top: 2px solid #000; border-bottom: 2px solid #000; }
        .info-label { font-size: ${preset.fontSize.coverSmall}; font-weight: 600; color: #666; text-transform: uppercase; margin-bottom: 4px; }
        .info-text { font-size: ${preset.fontSize.coverBody}; color: #000; line-height: 1.4; }
        .platform-box { background: #fafafa; padding: 14px 20px; margin: 7px 0; border: 1px solid #ddd; }
        .platform-text { font-size: calc(${preset.fontSize.coverBody} * 0.85); color: #333; line-height: 1.5; }
        .footer-section { text-align: center; margin-top: 18px; }
        .role-label { font-size: ${preset.fontSize.coverSmall}; color: #666; margin-bottom: 5px; }
        .role-value { font-size: calc(${preset.fontSize.coverTitle} * 0.65); font-weight: 600; color: #000; }
        .doc-date { font-size: ${preset.fontSize.coverSmall}; color: #999; margin-top: 8px; }
        .copyright { font-size: calc(${preset.fontSize.coverSmall} * 0.9); color: #999; text-align: center; padding-top: 10px; border-top: 1px solid #e0e0e0; }
      </style>
    </head>
    <body>
      <div class="content">
        <div class="kitech-header">
          <div class="kitech-abbr">${common.companyAbbr}</div>
          <div class="kitech-name">${common.company}</div>
          <div class="kitech-english">${common.companyEnglish}</div>
        </div>
        <div class="title-section">
          <h1>${common.title}</h1>
          <div class="presented-by">${common.presentedBy}</div>
        </div>
        <div class="info-box">
          <div class="info-label">${common.projectLabel}</div>
          <div class="info-text">${common.projectTitle}</div>
        </div>
        <div class="info-box">
          <div class="info-label">${common.subProjectLabel}</div>
          <div class="info-text">${common.subProjectTitle}</div>
        </div>
        <div class="platform-box">
          <div class="info-label">${common.platformDescriptionLabel}</div>
          <div class="platform-text">${common.platformDescription}</div>
        </div>
        <div class="footer-section">
          <div class="role-label">${common.role}</div>
          <div class="role-value">${roleName}</div>
          <div class="doc-date">${common.documentDate}: ${today}</div>
        </div>
      </div>
      <div class="copyright">${common.copyright}</div>
    </body>
    </html>
  `;
}

/**
 * 표지 레이아웃 3: 2단 구성 스타일
 * @param {string} lang - 언어 코드
 * @param {Object} common - 공통 번역 객체
 * @param {string} roleName - 역할 이름
 * @param {string} today - 오늘 날짜
 * @returns {string} HTML 문자열
 */
function getTitlePageLayout3(lang, common, roleName, today) {
  const preset = getActivePreset();
  const pageStyle = preset.pageFormat
    ? `size: ${preset.pageFormat} ${preset.orientation};`
    : `size: ${preset.dimensions.width} ${preset.dimensions.height};`;

  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${common.title}</title>
      <style>
        @page { ${pageStyle} margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${preset.dimensions.width}; height: ${preset.dimensions.height}; }
        body {
          font-family: 'Noto Sans ${lang === 'ko' ? 'KR' : ''}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: ${preset.padding.page};
          color: #000;
        }
        .content { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 16px; }
        .top-section { display: flex; gap: 25px; align-items: stretch; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 2px solid #000; }
        .left-col { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .right-col { flex: 1; background: #f5f5f5; padding: 20px; display: flex; flex-direction: column; justify-content: center; border-left: 4px solid #000; }
        h1 { font-size: ${preset.fontSize.coverTitle}; font-weight: 600; margin-bottom: 8px; }
        .presented-by { font-size: ${preset.fontSize.coverSubtitle}; color: #666; letter-spacing: 0.8px; }
        .kitech-box { margin-top: 10px; }
        .kitech-label { font-size: ${preset.fontSize.coverSmall}; color: #666; text-transform: uppercase; margin-bottom: 5px; }
        .kitech-abbr { font-size: calc(${preset.fontSize.coverTitle} * 0.75); font-weight: 700; color: #000; }
        .kitech-name { font-size: ${preset.fontSize.coverBody}; color: #333; margin-top: 4px; }
        .kitech-english { font-size: ${preset.fontSize.coverSmall}; color: #666; margin-top: 2px; font-style: italic; }
        .project-section { margin: 10px 0; }
        .project-item { margin: 10px 0; }
        .project-label { font-size: ${preset.fontSize.coverSmall}; font-weight: 600; color: #666; text-transform: uppercase; margin-bottom: 4px; }
        .project-text { font-size: ${preset.fontSize.coverBody}; color: #000; line-height: 1.4; padding-left: 8px; border-left: 2px solid #ccc; }
        .platform-section { background: #fafafa; padding: 14px 18px; margin: 10px 0; border: 1px solid #ddd; }
        .platform-label { font-size: ${preset.fontSize.coverSmall}; font-weight: 600; color: #666; text-transform: uppercase; margin-bottom: 5px; }
        .platform-text { font-size: calc(${preset.fontSize.coverBody} * 0.85); color: #333; line-height: 1.5; }
        .footer-row { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; }
        .role-info { text-align: left; }
        .role-label { font-size: ${preset.fontSize.coverSmall}; color: #666; margin-bottom: 3px; }
        .role-value { font-size: calc(${preset.fontSize.coverTitle} * 0.6); font-weight: 600; color: #000; }
        .date-info { text-align: right; font-size: ${preset.fontSize.coverSmall}; color: #999; }
        .copyright { font-size: calc(${preset.fontSize.coverSmall} * 0.9); color: #999; text-align: center; padding-top: 10px; border-top: 1px solid #e0e0e0; }
      </style>
    </head>
    <body>
      <div class="content">
        <div class="top-section">
          <div class="left-col">
            <h1>${common.title}</h1>
            <div class="presented-by">${common.presentedBy}</div>
          </div>
          <div class="right-col">
            <div class="kitech-label">${common.leadInstitution}</div>
            <div class="kitech-abbr">${common.companyAbbr}</div>
            <div class="kitech-name">${common.company}</div>
            <div class="kitech-english">${common.companyEnglish}</div>
          </div>
        </div>
        <div class="project-section">
          <div class="project-item">
            <div class="project-label">${common.projectLabel}</div>
            <div class="project-text">${common.projectTitle}</div>
          </div>
          <div class="project-item">
            <div class="project-label">${common.subProjectLabel}</div>
            <div class="project-text">${common.subProjectTitle}</div>
          </div>
        </div>
        <div class="platform-section">
          <div class="platform-label">${common.platformDescriptionLabel}</div>
          <div class="platform-text">${common.platformDescription}</div>
        </div>
        <div class="footer-row">
          <div class="role-info">
            <div class="role-label">${common.role}</div>
            <div class="role-value">${roleName}</div>
          </div>
          <div class="date-info">${common.documentDate}: ${today}</div>
        </div>
      </div>
      <div class="copyright">${common.copyright}</div>
    </body>
    </html>
  `;
}

/**
 * 표지 레이아웃 Modern: 미니멀 타이포그래피 중심 (권장)
 * HTML 템플릿 기반으로 제작된 현대적 디자인
 *
 * @param {string} lang - 언어 코드
 * @param {Object} common - 공통 번역 객체
 * @param {string} roleName - 역할 이름 (한글/영문)
 * @param {string} today - 오늘 날짜
 * @param {string} role - 역할 코드 ('admin', 'developer', 'viewer')
 * @returns {string} HTML 문자열
 */
function getTitlePageLayoutModern(lang, common, roleName, today, role) {
  const preset = getActivePreset();
  const pageStyle = preset.pageFormat
    ? `size: ${preset.pageFormat} ${preset.orientation};`
    : `size: ${preset.dimensions.width} ${preset.dimensions.height};`;

  // Role-based badge styling
  const roleBadgeStyles = {
    admin: { bg: '#000000', color: '#ffffff', dotColor: '#ffffff' },
    developer: { bg: '#2563eb', color: '#ffffff', dotColor: '#ffffff' },
    viewer: { bg: '#f0f0f0', color: '#000000', dotColor: '#16a34a', border: '1px solid #e0e0e0' }
  };

  const badgeStyle = roleBadgeStyles[role] || roleBadgeStyles.admin;

  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>A-SW HUB - ${roleName}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
      <style>
        @page { ${pageStyle} margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${preset.dimensions.width}; height: ${preset.dimensions.height}; }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #ffffff;
          color: #000000;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .container {
          width: 100%;
          height: 100%;
          position: relative;
          background: #ffffff;
          padding: ${preset.spacing.containerPadding};
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: ${preset.spacing.headerMarginBottom};
        }

        .left-header {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .company {
          font-size: calc(${preset.fontSize.coverSubtitle} * 1.3);
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #000000;
        }

        .company-sub {
          font-size: ${preset.fontSize.coverSubtitle};
          font-weight: 300;
          color: #666666;
        }

        .role-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          background: ${badgeStyle.bg};
          ${badgeStyle.border ? `border: ${badgeStyle.border};` : ''}
          border-radius: 4px;
        }

        .role-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${badgeStyle.dotColor};
        }

        .role-text {
          font-size: ${preset.fontSize.coverSubtitle};
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: ${badgeStyle.color};
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-bottom: ${preset.spacing.mainContentPaddingBottom};
        }

        .platform-label {
          font-size: ${preset.fontSize.coverSubtitle};
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #999999;
          margin-bottom: ${preset.spacing.platformLabelMarginBottom};
        }

        .title {
          font-size: ${preset.coverFontSize.title};
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -6px;
          color: #000000;
          margin-bottom: ${preset.spacing.titleMarginBottom};
        }

        .subtitle {
          font-size: ${preset.coverFontSize.subtitle};
          font-weight: 300;
          line-height: 1.6;
          color: #333333;
          max-width: 80%;
        }

        .bottom-section {
          padding-top: ${preset.spacing.bottomSectionPaddingTop};
          border-top: 1px solid #e0e0e0;
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: ${preset.spacing.infoListGap};
          margin-bottom: ${preset.spacing.infoListMarginBottom};
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .info-label {
          font-size: ${preset.fontSize.coverSmall};
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #999999;
        }

        .info-text {
          font-size: ${preset.coverFontSize.infoText};
          font-weight: 400;
          line-height: 1.7;
          color: #000000;
        }

        .org-name {
          font-size: ${preset.coverFontSize.orgName};
          font-weight: 700;
          color: #000000;
          margin-bottom: 5px;
        }

        .org-full {
          font-size: ${preset.coverFontSize.orgFull};
          font-weight: 300;
          color: #666666;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: ${preset.spacing.footerPaddingTop};
          border-top: 1px solid #f0f0f0;
        }

        .participants {
          font-size: ${preset.coverFontSize.participants};
          font-weight: 400;
          color: #666666;
          letter-spacing: 2px;
        }

        .date {
          font-size: ${preset.coverFontSize.date};
          font-weight: 300;
          color: #999999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="left-header">
            <div class="company">${common.presentedByCompany}</div>
            <div class="company-sub">${common.presentedByCompanySub}</div>
          </div>

          <div class="role-badge">
            <div class="role-dot"></div>
            <div class="role-text">${roleName}</div>
          </div>
        </div>

        <div class="main-content">
          <div class="platform-label">${common.platformLabel}</div>

          <div class="title">A-SW HUB</div>

          <div class="subtitle">${common.platformTagline}</div>
        </div>

        <div class="bottom-section">
          <div class="info-list">
            <div class="info-item">
              <div class="info-label">${common.projectLabel}</div>
              <div class="info-text">${common.projectTitle}</div>
            </div>

            <div class="info-item">
              <div class="info-label">${common.subProjectLabel}</div>
              <div class="info-text">${common.subProjectTitle}</div>
            </div>

            <div class="info-item">
              <div class="info-label">${common.leadInstitution}</div>
              <div class="org-name">${common.companyAbbr}</div>
              <div class="org-full">${common.company}</div>
            </div>
          </div>

          <div class="footer">
            <div class="participants">${common.participants}</div>
            <div class="date">${today}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ============================================================
// PDF 페이지 생성 함수들
// ============================================================

/**
 * 표지 페이지 생성
 * 선택된 레이아웃(layout1/layout2/layout3/modern)으로 표지 HTML 생성 후 PDF로 변환
 *
 * @param {Object} page - Playwright 페이지 객체
 * @param {string} role - 역할 코드 ('admin', 'developer', 'viewer')
 * @param {string} lang - 언어 코드 ('en', 'ko')
 * @param {Object} common - 공통 번역 객체
 * @param {number} totalPages - 전체 페이지 수
 * @returns {Promise<Buffer>} PDF 버퍼
 */
async function createTitlePageHTML(page, role, lang, common, totalPages = 0) {
  const today = new Date().toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const roleName = common.roles[role] || role;

  // Select layout based on configuration
  let layoutHTML;
  switch (TITLE_PAGE_LAYOUT) {
    case 'layout2':
      layoutHTML = getTitlePageLayout2(lang, common, roleName, today);
      break;
    case 'layout3':
      layoutHTML = getTitlePageLayout3(lang, common, roleName, today);
      break;
    case 'modern':
      layoutHTML = getTitlePageLayoutModern(lang, common, roleName, today, role);
      break;
    case 'layout1':
    default:
      layoutHTML = getTitlePageLayout1(lang, common, roleName, today);
      break;
  }

  const html = layoutHTML;

  try {
    await page.setContent(html);
    await page.waitForLoadState('networkidle');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.log(`  ⚠ Error creating title page: ${error.message}`);
    return null;
  }
}

// Merge PDF buffers (append to end instead of inserting at beginning)
async function mergePDFPages(pdfDoc, htmlPdfBuffer) {
  const htmlPdfDoc = await PDFDocument.load(htmlPdfBuffer);
  const [htmlPage] = await pdfDoc.copyPages(htmlPdfDoc, [0]);
  pdfDoc.addPage(htmlPage);
}

// Create table of contents page (HTML-based, A4 landscape)
async function createTableOfContentsHTML(page, pages, lang, translations, totalPages = 0) {
  const { common } = translations;

  // Build table of contents list
  let pageNum = 3; // Start counting from page 3 (after title and TOC)
  const tocItems = pages.map((pageInfo) => {
    const itemNum = pageNum;
    const itemName = pageInfo.name;
    let count = 1;
    if (pageInfo.tabs) count += pageInfo.tabs.length;
    if (pageInfo.modals) count += pageInfo.modals.length;
    pageNum += count;
    return { num: itemNum, name: itemName };
  });

  const tocListHTML = tocItems.map((item, idx) => `
    <tr>
      <td class="toc-number">${idx + 1}</td>
      <td class="toc-name">${item.name}</td>
      <td class="toc-dots">.......................................................................</td>
      <td class="toc-page">${item.num}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${common.tableOfContents}</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 0;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          width: 297mm;
          height: 210mm;
        }

        body {
          font-family: 'Noto Sans ${lang === 'ko' ? 'KR' : ''}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          padding: 30mm;
          display: flex;
          flex-direction: column;
          color: #000;
          background: #fff;
          margin: 0;
          position: relative;
        }

        .toc-title {
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 30px;
          text-align: center;
          border-bottom: 2px solid #ddd;
          padding-bottom: 20px;
        }

        .toc-content {
          flex: 1;
          overflow-y: auto;
          min-height: 0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          line-height: 1.8;
        }

        tr {
          border: none;
        }

        td {
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .toc-number {
          width: 40px;
          text-align: center;
          font-weight: 600;
        }

        .toc-name {
          padding-left: 15px;
          font-weight: 500;
          width: 40%;
        }

        .toc-dots {
          padding: 0 10px;
          color: #ccc;
          font-size: 11px;
          letter-spacing: 2px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: clip;
          flex: 1;
        }

        .toc-page {
          width: 50px;
          text-align: right;
          padding-right: 15px;
          font-weight: 500;
        }

        .page-footer {
          position: absolute;
          bottom: 0;
          left: 30mm;
          right: 30mm;
          height: 14mm;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 9px;
          color: #666;
          border-top: 1px solid #e0e0e0;
          padding-top: 3mm;
          margin: 0;
        }

        .footer-left {
          flex: 1;
          text-align: left;
        }

        .footer-right {
          flex: 1;
          text-align: right;
        }
      </style>
    </head>
    <body>
      <div class="toc-title">${common.tableOfContents}</div>
      <div class="toc-content">
        <table>
          <tbody>
            ${tocListHTML}
          </tbody>
        </table>
      </div>
      <div class="page-footer">
        <div class="footer-left">Page 2 / ${totalPages}</div>
        <div class="footer-right">${common.footer}</div>
      </div>
    </body>
    </html>
  `;

  try {
    await page.setContent(html);
    await page.waitForLoadState('networkidle');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.log(`  ⚠ Error creating TOC page: ${error.message}`);
    return null;
  }
}

// Create detail page with comprehensive page description (HTML-based, A4 landscape)
async function createDetailPageHTML(page, pageName, pageDescription, pageNum, totalPages, lang, translations) {
  const { common } = translations;

  // Build features list
  const features = pageDescription?.features || [];
  const displayFeatures = features.slice(0, MAX_FEATURES);
  const remainingFeatures = features.length - MAX_FEATURES;

  const featuresHtml = displayFeatures.length > 0
    ? displayFeatures.map(feat => `<li>${feat}</li>`).join('') +
      (remainingFeatures > 0 ? `<li style="font-style: italic; color: #666;">...and ${remainingFeatures} more feature${remainingFeatures > 1 ? 's' : ''}</li>` : '')
    : '';

  // Build components table
  const components = pageDescription?.components || [];
  const displayComponents = components.slice(0, MAX_COMPONENTS);
  const remainingComponents = components.length - MAX_COMPONENTS;

  const componentsTableHtml = displayComponents.length > 0
    ? displayComponents.map(comp => `
        <tr>
          <td style="padding: 6px 8px; border-bottom: 1px solid #e0e0e0; font-size: 10px; color: #333;">${comp}</td>
        </tr>
      `).join('') +
      (remainingComponents > 0 ? `
        <tr>
          <td style="padding: 6px 8px; font-style: italic; color: #666; font-size: 10px;">...and ${remainingComponents} more component${remainingComponents > 1 ? 's' : ''}</td>
        </tr>
      ` : '')
    : '';

  const html = `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${pageName} - Detail</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { font-size: 16px; }
        @page { size: A4 landscape; margin: 0; }
        html, body { margin: 0; padding: 0; width: 297mm; height: 210mm; }
        .page {
          position: relative;
          width: 297mm;
          height: 210mm;
          padding: 10mm 20mm 0 20mm;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          font-family: 'Noto Sans ${lang === 'ko' ? 'KR' : ''}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #000;
          line-height: 1.5;
        }
        .title-section {
          flex-shrink: 0;
          height: 14mm;
          padding-bottom: 0;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 6mm;
          display: flex;
          align-items: center;
        }
        .page-title {
          font-size: 20px;
          font-weight: 700;
          color: #000;
        }
        .content-section {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12mm;
          margin-bottom: 10mm;
        }
        .section {
          display: flex;
          flex-direction: column;
          gap: 4mm;
        }
        .section-title {
          font-size: 11px;
          font-weight: 700;
          color: #000;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-left: 3px solid #000;
          padding-left: 6px;
          margin-bottom: 2mm;
        }
        .section-content {
          font-size: 10px;
          color: #333;
          line-height: 1.6;
        }
        .section-content p {
          margin-bottom: 3mm;
        }
        .section-content ul {
          margin-left: 0;
          padding-left: 0;
          list-style: none;
        }
        .section-content li {
          margin-bottom: 2mm;
          padding-left: 12px;
          position: relative;
        }
        .section-content li:before {
          content: "▪";
          position: absolute;
          left: 0;
          font-weight: bold;
          color: #000;
        }
        .components-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #e0e0e0;
        }
        .components-table th {
          background-color: #f5f5f5;
          padding: 6px 8px;
          text-align: left;
          font-size: 10px;
          font-weight: 600;
          border-bottom: 2px solid #000;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .footer-section {
          position: absolute;
          bottom: 0;
          left: 20mm;
          right: 20mm;
          height: 14mm;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 9px;
          color: #666;
          border-top: 1px solid #e0e0e0;
          padding-top: 3mm;
        }
        .footer-left { flex: 1; text-align: left; }
        .footer-right { flex: 1; text-align: right; }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="title-section">
          <div class="page-title">${pageName}</div>
        </div>
        <div class="content-section">
          <div class="section">
            ${pageDescription?.description ? `
              <div class="section-title">Overview</div>
              <div class="section-content">
                <p>${pageDescription.description}</p>
              </div>
            ` : ''}
            ${pageDescription?.purpose ? `
              <div class="section-title">Purpose</div>
              <div class="section-content">
                <p>${pageDescription.purpose}</p>
              </div>
            ` : ''}
            ${featuresHtml ? `
              <div class="section-title">Key Features</div>
              <div class="section-content">
                <ul>${featuresHtml}</ul>
              </div>
            ` : ''}
          </div>
          <div class="section">
            ${componentsTableHtml ? `
              <div class="section-title">Components</div>
              <div class="section-content">
                <table class="components-table">
                  <thead>
                    <tr>
                      <th>Component</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${componentsTableHtml}
                  </tbody>
                </table>
              </div>
            ` : ''}
          </div>
        </div>
        <div class="footer-section">
          <div class="footer-left">Page ${pageNum} / ${totalPages}</div>
          <div class="footer-right">${common.footer}</div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await page.setContent(html);
    await page.waitForLoadState('networkidle');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.log(`  ⚠ Error creating detail page: ${error.message}`);
    return null;
  }
}

// Create layout page with screenshot and description (HTML-based, NEW vertical layout for A4 landscape)
async function createLayoutPageHTML(page, screenshotBuffer, pageName, pageDescription, pageNum, totalPages, lang, translations) {
  const { common } = translations;

  // Build components list (max 3 items)
  const componentsHtml = pageDescription?.components
    ? pageDescription.components.slice(0, 3)
        .map(comp => `<li>${comp}</li>`)
        .join('')
    : '';

  // Convert screenshot buffer to base64
  const screenshotBase64 = screenshotBuffer.toString('base64');

  // Screenshot image only
  const screenshotHTML = `<img src="data:image/png;base64,${screenshotBase64}" alt="${pageName}" style="display:block;border:1.5px solid #bcbcbc;box-shadow:none;margin:0;padding:0;width:${100 * SCREENSHOT_SCALE}%;max-width:none;" />`;

  const html = `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${pageName}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { font-size: 16px; }
        @page { size: A4 landscape; margin: 0; }
        html, body { margin: 0; padding: 0; width: 297mm; height: 210mm; }
        .page {
          position: relative;
          width: 297mm;
          height: 210mm;
          padding: 10mm 20mm 0 20mm;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          font-family: 'Noto Sans ${lang === 'ko' ? 'KR' : ''}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #000;
          line-height: 1.4;
        }
        .title-section {
          flex-shrink: 0;
          height: 14mm;
          padding-bottom: 0;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 6mm;
          display: flex;
          align-items: center;
        }
        .page-title { font-size: 20px; font-weight: 700; color: #000; }
        .main-section {
          flex: 1;
          display: flex;
          flex-direction: row;
          gap: 12mm;
          margin-bottom: 10mm;
        }
        .screenshot-box {
          flex: ${SCREENSHOT_FLEX_RATIO};
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          background: none;
          border: none;
          border-radius: 0;
          padding: 0;
          min-height: 80mm;
          max-height: 120mm;
          box-sizing: border-box;
        }
        .desc-box {
          flex: ${DESCRIPTION_FLEX_RATIO};
          display: flex;
          flex-direction: column;
          gap: 8mm;
          justify-content: flex-start;
        }
        .section { display: flex; flex-direction: column; gap: 4mm; }
        .section-title { font-size: 11px; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.4px; }
        .section-content { font-size: 10px; color: #333; line-height: 1.5; }
        .section-content ul { margin-left: 0; padding-left: 12px; list-style: none; }
        .section-content li { margin-bottom: 2mm; }
        .section-content li:before { content: "▪ "; margin-right: 4px; font-weight: bold; color: #666; font-size: 9px; }
        .footer-section { position: absolute; bottom: 0; left: 20mm; right: 20mm; height: 14mm; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: #666; border-top: 1px solid #e0e0e0; padding-top: 3mm; margin: 0; }
        .footer-left { flex: 1; text-align: left; }
        .footer-right { flex: 1; text-align: right; }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="title-section">
          <div class="page-title">${pageName}</div>
        </div>
        <div class="main-section">
          <div class="screenshot-box">
            ${screenshotHTML}
          </div>
          <div class="desc-box">
            ${pageDescription?.purpose ? `<div class="section"><div class="section-title">${common.purpose}</div><div class="section-content">${pageDescription.purpose}</div></div>` : ''}
            ${componentsHtml ? `<div class="section"><div class="section-title">${common.keyComponents}</div><div class="section-content"><ul>${componentsHtml}</ul></div></div>` : ''}
            ${pageDescription?.roleSpecific ? `<div class="section"><div class="section-title">${common.roleSpecific}</div><div class="section-content">${pageDescription.roleSpecific}</div></div>` : ''}
          </div>
        </div>
        <div class="footer-section">
          <div class="footer-left">Page ${pageNum} / ${totalPages}</div>
          <div class="footer-right">${common.footer}</div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await page.setContent(html);
    await page.waitForLoadState('networkidle');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.log(`  ⚠ Error creating layout page: ${error.message}`);
    return null;
  }
}

// Capture page with tabs
async function capturePageWithTabs(page, pageInfo, screenshots) {
  console.log(`    Capturing: ${pageInfo.name}`);

  // Capture main page
  await page
    .waitForLoadState('networkidle', { timeout: 10000 })
    .catch(() => {});
  await page.waitForTimeout(2000);

  const mainScreenshot = await page.screenshot({
    type: 'png',
    fullPage: false,
  });

  screenshots.push({
    name: pageInfo.name,
    code: pageInfo.code,
    buffer: mainScreenshot,
  });

  // Capture tabs if any
  if (pageInfo.tabs && pageInfo.tabs.length > 0) {
    for (const tab of pageInfo.tabs) {
      try {
        console.log(`      Tab: ${tab.name}`);
        await page.click(tab.selector, { timeout: 5000 });
        await page.waitForTimeout(1500);

        const tabScreenshot = await page.screenshot({
          type: 'png',
          fullPage: false,
        });

        screenshots.push({
          name: `${pageInfo.name} › ${tab.name}`,
          code: pageInfo.code,
          tabName: tab.name,
          isTab: true,
          buffer: tabScreenshot,
        });
      } catch (error) {
        console.log(`      ⚠ Could not capture tab: ${tab.name}`);
      }
    }
  }

  // Capture modals if any
  if (pageInfo.modals && pageInfo.modals.length > 0) {
    for (const modal of pageInfo.modals) {
      try {
        console.log(`      Modal: ${modal.name}`);
        await page.click(modal.selector, { timeout: 5000 });
        await page.waitForTimeout(1500);

        const modalScreenshot = await page.screenshot({
          type: 'png',
          fullPage: false,
        });

        screenshots.push({
          name: `${pageInfo.name} › ${modal.name}`,
          code: pageInfo.code,
          isModal: true,
          buffer: modalScreenshot,
        });

        // Try to close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      } catch (error) {
        console.log(`      ⚠ Could not capture modal: ${modal.name}`);
      }
    }
  }
}

// Login as role
async function loginAsRole(page, account) {
  console.log(`  Logging in as: ${account.name}`);
  await page.goto(`${BASE_URL}/login`);
  await page
    .waitForLoadState('networkidle', { timeout: 10000 })
    .catch(() => {});

  await page.fill('input[type="email"]', account.email);
  await page.fill('input[type="password"]', account.password);
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  await page.waitForTimeout(1000);
  console.log(`  ✓ Logged in successfully`);
}

// Generate PDF for role and language
async function generatePDFForRoleAndLanguage(
  browser,
  role,
  account,
  lang,
  font,
  translations
) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Generating PDF: ${account.name} (${lang.toUpperCase()})`);
  console.log(`${'='.repeat(60)}`);

  const context = await browser.newContext({
    viewport: { width: 1920, height: VIEWPORT_HEIGHT },
  });
  const page = await context.newPage();

  const screenshots = [];

  // Capture login page first
  const loginPage = account.pages.find((p) => p.route === '/login');
  if (loginPage) {
    console.log(
      `  [1/${account.pages.length}] Navigating to: ${loginPage.route}`
    );
    await page.goto(`${BASE_URL}${loginPage.route}`);
    await capturePageWithTabs(page, loginPage, screenshots);
  }

  // Login
  await loginAsRole(page, account);

  // Capture all other pages
  const otherPages = account.pages.filter((p) => p.route !== '/login');
  for (let i = 0; i < otherPages.length; i++) {
    const pageInfo = otherPages[i];
    console.log(
      `  [${i + 2}/${account.pages.length}] Navigating to: ${pageInfo.route}`
    );

    try {
      await page.goto(`${BASE_URL}${pageInfo.route}`, { timeout: 15000 });
      await capturePageWithTabs(page, pageInfo, screenshots);
    } catch (error) {
      console.log(`  ⚠ Could not access page: ${pageInfo.route}`);
      console.log(`    Error: ${error.message}`);
    }
  }

  // Calculate total pages upfront (screenshots + detail pages + title + toc)
  const totalPages = (screenshots.length * 2) + 2;

  // Generate all PDF pages while context is still open
  console.log(`\n  Generating title page...`);
  const titlePdfBuffer = await createTitlePageHTML(page, role, lang, translations.common, totalPages);

  // Generate TOC page as HTML PDF while context is still open
  console.log(`  Generating table of contents...`);
  const tocPdfBuffer = await createTableOfContentsHTML(page, account.pages, lang, translations, totalPages);

  // Generate layout pages + detail pages as HTML PDFs while context is still open
  console.log(`  Generating ${screenshots.length * 2} pages (screenshot + detail)...`);
  const pagePdfBuffers = [];

  for (let i = 0; i < screenshots.length; i++) {
    const screenshot = screenshots[i];
    const screenshotPageNum = (i * 2) + 3; // 3, 5, 7, 9, ...
    const detailPageNum = (i * 2) + 4;     // 4, 6, 8, 10, ...

    // Get page description - check for tab-specific description first
    let pageDescription = translations.pages[screenshot.code];
    if (screenshot.tabName && pageDescription?.tabs?.[screenshot.tabName]) {
      pageDescription = pageDescription.tabs[screenshot.tabName];
    }

    // Create screenshot page
    const layoutPdfBuffer = await createLayoutPageHTML(
      page,
      screenshot.buffer,
      screenshot.name,
      pageDescription,
      screenshotPageNum,
      totalPages,
      lang,
      translations
    );

    if (layoutPdfBuffer) {
      pagePdfBuffers.push({
        buffer: layoutPdfBuffer,
        name: screenshot.name,
        pageNum: screenshotPageNum
      });
    }

    // Create detail page
    const detailPdfBuffer = await createDetailPageHTML(
      page,
      screenshot.name,
      pageDescription,
      detailPageNum,
      totalPages,
      lang,
      translations
    );

    if (detailPdfBuffer) {
      pagePdfBuffers.push({
        buffer: detailPdfBuffer,
        name: `${screenshot.name} › Detail`,
        pageNum: detailPageNum
      });
    }
  }

  await context.close();

  // Create PDF document and merge all pages in correct order
  console.log(`  Creating PDF with ${totalPages} pages...`);
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // Page 1: Title page (HTML-based)
  if (titlePdfBuffer) {
    console.log(`    Adding page 1/?: Title page...`);
    await mergePDFPages(pdfDoc, titlePdfBuffer);
  }

  // Page 2: Table of contents (HTML-based)
  if (tocPdfBuffer) {
    console.log(`    Adding page 2/?: Table of contents...`);
    await mergePDFPages(pdfDoc, tocPdfBuffer);
  }

  // Pages 3+: Layout pages + Detail pages (interleaved)
  for (let i = 0; i < pagePdfBuffers.length; i++) {
    const pageInfo = pagePdfBuffers[i];
    console.log(
      `    Adding page ${pageInfo.pageNum}/${totalPages}: ${pageInfo.name}`
    );
    await mergePDFPages(pdfDoc, pageInfo.buffer);
  }

  // Save PDF
  const outputPath = path.join(OUTPUT_DIR, lang, `a-sw-hub-${role}-${lang}.pdf`);
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  console.log(`  ✓ PDF saved: ${outputPath}`);
  console.log(`  ✓ Total pages: ${totalPages}`);
}

// Main function
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('A-SW Hub - Multilingual PDF Generator');
  console.log('='.repeat(60));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Output Directory: ${OUTPUT_DIR}\n`);

  // Ensure output directories exist
  for (const lang of ['en', 'ko']) {
    const langDir = path.join(OUTPUT_DIR, lang);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }
  }

  // Check if server is running
  console.log('Checking if development server is running...');
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error('Server not responding');
    }
    console.log('✓ Server is running\n');
  } catch (error) {
    console.error('✗ Error: Development server is not running!');
    console.error('  Please start the server first with: npm run dev');
    process.exit(1);
  }

  // Load fonts
  console.log('Loading fonts...');
  const fonts = {
    en: fs.readFileSync(path.join(FONTS_DIR, 'Roboto-Regular.ttf')),
    ko: fs.readFileSync(path.join(FONTS_DIR, 'NotoSansKR-Regular.ttf')),
  };
  console.log('✓ Fonts loaded\n');

  // Load translations
  console.log('Loading translations...');
  const translations = {
    en: loadTranslations('en'),
    ko: loadTranslations('ko'),
  };
  console.log('✓ Translations loaded\n');

  const browser = await chromium.launch({
    headless: true,
  });

  try {
    // Generate PDFs for each role and language
    let count = 1;
    const total = Object.keys(ACCOUNTS).length * 2;

    // Pre-embed fonts for each language
    const embeddedFonts = {};
    for (const lang of ['en', 'ko']) {
      const tempDoc = await PDFDocument.create();
      tempDoc.registerFontkit(fontkit);
      embeddedFonts[lang] = await tempDoc.embedFont(fonts[lang]);
    }

    for (const [role, account] of Object.entries(ACCOUNTS)) {
      for (const lang of ['en', 'ko']) {
        console.log(`\n[${count}/${total}] Processing...`);

        await generatePDFForRoleAndLanguage(
          browser,
          role,
          account,
          lang,
          embeddedFonts[lang],
          translations[lang]
        );

        count++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✓ All PDFs generated successfully!');
    console.log('='.repeat(60));
    console.log(`\nGenerated ${total} PDF files:`);
    console.log(`  - English: pdfs/en/`);
    console.log(`  - Korean: pdfs/ko/`);
    console.log(`\nLocation: ${OUTPUT_DIR}\n`);
  } catch (error) {
    console.error('\n✗ Error during PDF generation:');
    console.error(error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
