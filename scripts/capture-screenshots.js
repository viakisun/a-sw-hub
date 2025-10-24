/**
 * A-SW Hub 애플리케이션 스크린샷 캡처 스크립트
 *
 * Playwright를 사용하여 주요 페이지의 스크린샷을 자동으로 캡처합니다.
 * 보고서에 삽입할 10개의 핵심 화면을 생성합니다.
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '..', 'screenshots', 'app');
const BASE_URL = 'http://localhost:5173';

// 캡처할 페이지 목록 (순서대로)
const SCREENSHOTS = [
  {
    name: '01-login',
    url: '/login',
    title: '로그인 페이지',
    description: 'Email/Password + GitHub OAuth 인증',
    waitFor: 'h1',
    fullPage: false
  },
  {
    name: '02-dashboard',
    url: '/dashboard',
    title: '대시보드',
    description: '프로젝트 상태 요약 및 Chart.js 메트릭',
    waitFor: 'canvas',
    fullPage: true,
    needsAuth: true
  },
  {
    name: '03-projects-list',
    url: '/projects',
    title: '프로젝트 목록',
    description: '142개 농업기계 A-SW 프로젝트 관리',
    waitFor: '.project-card, table',
    fullPage: true,
    needsAuth: true
  },
  {
    name: '04-project-detail',
    url: '/projects/autonomous-tractor',
    title: '프로젝트 상세',
    description: 'Repository 정보, 빌드 상태, 협업자 관리',
    waitFor: 'h1',
    fullPage: true,
    needsAuth: true
  },
  {
    name: '05-project-new',
    url: '/projects/new',
    title: '프로젝트 생성',
    description: '5개 탭 설정 폼 (General/Repository/Build/Deployment/Notifications)',
    waitFor: 'form',
    fullPage: true,
    needsAuth: true
  },
  {
    name: '06-builds-list',
    url: '/builds',
    title: '빌드 목록',
    description: '빌드 히스토리 및 성공/실패 상태',
    waitFor: 'table',
    fullPage: true,
    needsAuth: true
  },
  {
    name: '07-build-logs',
    url: '/builds',
    title: '빌드 로그',
    description: '9단계 Collapsible Sections, 터미널 스타일 로그',
    waitFor: '.log-section',
    fullPage: true,
    needsAuth: true,
    customAction: async (page) => {
      // 첫 번째 빌드 클릭하여 로그 보기
      const firstBuild = await page.$('table tbody tr:first-child');
      if (firstBuild) {
        await firstBuild.click();
        await page.waitForTimeout(1000);
      }
    }
  },
  {
    name: '08-deployments',
    url: '/deployments',
    title: '배포 목록',
    description: 'Development/Staging/Production 배포 히스토리',
    waitFor: 'table',
    fullPage: true,
    needsAuth: true
  },
  {
    name: '09-approvals',
    url: '/approvals',
    title: '승인 워크플로우',
    description: '2단계 승인 프로세스, Admin/Developer 권한 구분',
    waitFor: 'table',
    fullPage: true,
    needsAuth: true
  },
  {
    name: '10-timeline',
    url: '/timeline',
    title: '타임라인',
    description: '5개년 계획 Gantt Chart, 136개 산출물 진행상황',
    waitFor: '.gantt, canvas',
    fullPage: true,
    needsAuth: true
  }
];

/**
 * Mock 로그인 (localStorage에 토큰 설정)
 */
async function mockLogin(page) {
  await page.goto(BASE_URL);

  // Mock auth token 설정
  await page.evaluate(() => {
    localStorage.setItem('auth_token', 'mock-token-for-screenshots');
    localStorage.setItem('user', JSON.stringify({
      id: 'user-1',
      email: 'admin@viasoft.ai',
      name: 'Admin User',
      role: 'admin'
    }));
  });

  console.log('  ✓ Mock login completed');
}

/**
 * 단일 페이지 스크린샷 캡처
 */
async function captureScreenshot(page, config) {
  const { name, url, title, waitFor, fullPage = false, customAction } = config;

  console.log(`\nCapturing: ${name} (${title})`);
  console.log(`  URL: ${url}`);

  try {
    // 페이지 이동
    await page.goto(`${BASE_URL}${url}`, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for key element
    try {
      await page.waitForSelector(waitFor, { timeout: 10000 });
    } catch (e) {
      console.log(`  ⚠ Selector "${waitFor}" not found, continuing anyway`);
    }

    // 추가 대기 (렌더링 완료)
    await page.waitForTimeout(2000);

    // Custom action (예: 버튼 클릭, 탭 전환 등)
    if (customAction) {
      await customAction(page);
      await page.waitForTimeout(1000);
    }

    // 스크린샷 캡처
    const outputPath = path.join(OUTPUT_DIR, `${name}.png`);
    await page.screenshot({
      path: outputPath,
      fullPage: fullPage,
      type: 'png'
    });

    const stats = fs.statSync(outputPath);
    console.log(`  ✓ Saved: ${name}.png (${(stats.size / 1024).toFixed(1)}KB)`);

    return true;
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return false;
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('\n============================================================');
  console.log('A-SW Hub - Screenshot Capture');
  console.log('============================================================\n');

  // Output 디렉토리 생성
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created directory: ${OUTPUT_DIR}\n`);
  }

  // 브라우저 시작
  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();

  let successCount = 0;
  let authDone = false;

  for (const config of SCREENSHOTS) {
    // 인증이 필요한 페이지인 경우 mock login
    if (config.needsAuth && !authDone) {
      await mockLogin(page);
      authDone = true;
    }

    const success = await captureScreenshot(page, config);
    if (success) successCount++;
  }

  await browser.close();

  console.log('\n============================================================');
  console.log(`✓ Captured ${successCount}/${SCREENSHOTS.length} screenshots`);
  console.log(`Location: ${OUTPUT_DIR}`);
  console.log('============================================================\n');

  // 캡처된 파일 목록 출력
  const files = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith('.png'))
    .sort();

  console.log('Files:');
  files.forEach(file => {
    const filePath = path.join(OUTPUT_DIR, file);
    const stats = fs.statSync(filePath);
    console.log(`  - ${file} (${(stats.size / 1024).toFixed(1)}KB)`);
  });
  console.log('');
}

// 실행
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
