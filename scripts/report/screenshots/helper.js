/**
 * 스크린샷 HTML 생성 헬퍼
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = path.join(__dirname, '../../..', 'screenshots', 'app');

// 스크린샷 메타데이터
export const screenshotMeta = {
  '01-login': {
    title: '로그인 페이지',
    titleEn: 'Login Page',
    description: 'Email/Password 인증 및 GitHub OAuth 2.0 통합 로그인',
    figure: '그림 3-1'
  },
  '02-dashboard': {
    title: '대시보드',
    titleEn: 'Dashboard',
    description: '프로젝트 상태 요약, Chart.js 기반 메트릭 시각화',
    figure: '그림 3-2'
  },
  '03-projects-list': {
    title: '프로젝트 목록',
    titleEn: 'Projects List',
    description: '142개 농업기계 A-SW 프로젝트 통합 관리',
    figure: '그림 4-1'
  },
  '04-project-detail': {
    title: '프로젝트 상세',
    titleEn: 'Project Detail',
    description: 'Git Repository 정보, 빌드 상태, 협업자 관리',
    figure: '그림 4-2'
  },
  '05-project-new': {
    title: '프로젝트 생성',
    titleEn: 'Create New Project',
    description: '5개 탭 설정 폼 (General/Repository/Build/Deployment/Notifications)',
    figure: '그림 4-3'
  },
  '06-builds-list': {
    title: '빌드 목록',
    titleEn: 'Build List',
    description: 'CI/CD 빌드 히스토리 및 성공/실패 상태 추적',
    figure: '그림 4-4'
  },
  '07-build-logs': {
    title: '빌드 로그',
    titleEn: 'Build Logs',
    description: '9단계 Collapsible Sections, 터미널 스타일 실시간 로그',
    figure: '그림 4-5'
  },
  '08-deployments': {
    title: '배포 목록',
    titleEn: 'Deployments',
    description: 'Development/Staging/Production 환경별 배포 히스토리',
    figure: '그림 4-6'
  },
  '09-approvals': {
    title: '승인 워크플로우',
    titleEn: 'Approval Workflow',
    description: '2단계 승인 프로세스, Admin/Developer 권한 기반 관리',
    figure: '그림 4-7'
  },
  '10-timeline': {
    title: '타임라인',
    titleEn: 'Timeline',
    description: '5개년 계획 Gantt Chart, 136개 산출물 진행상황 추적',
    figure: '그림 4-8'
  }
};

/**
 * 스크린샷을 Base64로 로드
 */
export function loadScreenshotAsBase64(name) {
  const filePath = path.join(SCREENSHOTS_DIR, `${name}.png`);
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: Screenshot ${name}.png not found`);
    return null;
  }
  const buffer = fs.readFileSync(filePath);
  return buffer.toString('base64');
}

/**
 * 스크린샷 HTML 생성
 */
export function getScreenshotHTML(name, lang = 'ko') {
  const base64 = loadScreenshotAsBase64(name);
  if (!base64) {
    return `<p style="color: red;">[Screenshot ${name} not found]</p>`;
  }

  const meta = screenshotMeta[name];
  if (!meta) {
    return `<p style="color: red;">[Screenshot metadata for ${name} not found]</p>`;
  }

  const title = lang === 'ko' ? meta.title : meta.titleEn;
  const description = meta.description;
  const figure = meta.figure;

  return `
    <div class="screenshot-container" style="margin: 6mm 0; page-break-inside: avoid;">
      <div class="screenshot-title" style="font-size: 10pt; font-weight: 600; margin-bottom: 2mm; color: #333;">
        ${figure}. ${title}
      </div>
      <div class="screenshot-image" style="text-align: center; margin: 3mm 0; border: 1px solid #ddd; padding: 2mm; background: #f9f9f9;">
        <img src="data:image/png;base64,${base64}"
             style="max-width: 100%; height: auto; border: 1px solid #ccc;"
             alt="${title}" />
      </div>
      ${description ? `
      <div class="screenshot-caption" style="font-size: 9pt; color: #666; margin-top: 2mm; line-height: 1.6;">
        ${description}
      </div>
      ` : ''}
    </div>
  `;
}
