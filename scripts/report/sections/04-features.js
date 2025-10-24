/**
 * Section 4-8: Remaining sections (consolidated for speed)
 */

export const remainingSections = {
  ko: [
    {
      id: 4,
      title: '제4장 핵심 기능 구현',
      content: `
        <h3>4.1 인증 시스템</h3>
        <p>Email/Password + GitHub OAuth 2.0 통합 인증 시스템 구축</p>
        <ul>
          <li>JWT 기반 세션 관리 (1시간 만료)</li>
          <li>Refresh Token (7일 만료, HttpOnly Cookie)</li>
          <li>자동 세션 갱신</li>
        </ul>

        <h3>4.2 프로젝트 관리</h3>
        <p>142개 농업기계 A-SW 프로젝트 통합 관리</p>
        <ul>
          <li>카테고리별 분류: 작물관리, 토양분석, 관개시스템, 해충방제 등 8개 분야</li>
          <li>Git 저장소 연동 (GitHub/GitLab)</li>
          <li>프로젝트 설정: General / Repository / Build / Deployment / Notifications</li>
        </ul>

        <h3>4.3 CI/CD 파이프라인</h3>
        <p>완전 자동화된 빌드/테스트/배포 시스템</p>
        <ul>
          <li>9단계 빌드 프로세스: Clone → Install → Lint → Build → Test → Package → Upload → Deploy → Verify</li>
          <li>실시간 로그 스트리밍</li>
          <li>빌드 성공률 100% 달성</li>
        </ul>

        <h3>4.4 대시보드 및 모니터링</h3>
        <p>Chart.js 기반 실시간 메트릭 시각화</p>
        <ul>
          <li>프로젝트 상태 요약</li>
          <li>빌드 성공률 추이</li>
          <li>언어별 프로젝트 분포</li>
          <li>활동 피드 (실시간 업데이트)</li>
        </ul>

        <h3>4.5 품질 관리</h3>
        <p>다단계 승인 워크플로우 및 품질 게이트</p>
        <ul>
          <li>2단계 승인 (Developer → Admin)</li>
          <li>품질 지표: Code Coverage, Complexity, Duplication</li>
          <li>SonarQube 통합</li>
        </ul>

        <h3>4.6 타임라인 관리</h3>
        <p>5개년 계획 Gantt Chart 시각화</p>
        <ul>
          <li>136개 산출물 진행상황 추적</li>
          <li>기관별/년도별 계층 구조</li>
          <li>의존성 관리</li>
        </ul>
      `
    },
    {
      id: 5,
      title: '제5장 기술 구현 상세',
      content: `
        <h3>5.1 Configuration-Driven Architecture</h3>
        <p>모든 설정을 환경 변수로 외부화하여 코드 수정 없이 동작 변경 가능</p>
        <pre class="code-block">
// .env
VITE_MOCK_API=true
VITE_API_BASE_URL=
VITE_ENABLE_REALTIME=true
VITE_LOG_LEVEL=debug
        </pre>

        <h3>5.2 Error Handling Infrastructure</h3>
        <p>계층적 에러 분류 시스템</p>
        <ul>
          <li><strong>NetworkError:</strong> 자동 재시도 (exponential backoff)</li>
          <li><strong>ValidationError:</strong> 필드별 에러 메시지</li>
          <li><strong>AuthError:</strong> 세션 갱신 시도</li>
          <li><strong>BusinessError:</strong> 도메인 특화 처리</li>
        </ul>

        <h3>5.3 Logging System</h3>
        <p>Multi-transport 로깅 인프라</p>
        <ul>
          <li><strong>Console:</strong> 개발 환경 디버깅</li>
          <li><strong>LocalStorage:</strong> 에러 지속화</li>
          <li><strong>Remote:</strong> 프로덕션 모니터링</li>
        </ul>

        <h3>5.4 TypeScript Strict Mode</h3>
        <p>100% 타입 커버리지 달성</p>
        <ul>
          <li>모든 함수에 명시적 타입 정의</li>
          <li>Zod 스키마로 런타임 검증</li>
          <li>컴파일 타임에 대부분의 버그 차단</li>
        </ul>
      `
    },
    {
      id: 6,
      title: '제6장 테스트 및 품질 검증',
      content: `
        <h3>6.1 테스트 전략</h3>
        <table>
          <thead>
            <tr>
              <th>테스트 유형</th>
              <th>도구</th>
              <th>커버리지</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Unit Test</td>
              <td>Vitest</td>
              <td>85%</td>
            </tr>
            <tr>
              <td>Integration Test</td>
              <td>Vitest + MSW</td>
              <td>70%</td>
            </tr>
            <tr>
              <td>E2E Test</td>
              <td>Playwright</td>
              <td>주요 플로우 100%</td>
            </tr>
          </tbody>
        </table>

        <h3>6.2 품질 메트릭</h3>
        <ul>
          <li><strong>빌드 성공률:</strong> 100% (Zero Warnings)</li>
          <li><strong>타입 커버리지:</strong> 100% (Strict Mode)</li>
          <li><strong>번들 크기:</strong> 180KB (gzipped)</li>
          <li><strong>Lighthouse 점수:</strong> Performance 95, Accessibility 100</li>
        </ul>

        <h3>6.3 성능 최적화</h3>
        <ul>
          <li>Route-based code splitting</li>
          <li>Lazy loading (Chart.js)</li>
          <li>Debounced inputs (300ms)</li>
          <li>Virtual scrolling (계획)</li>
        </ul>
      `
    },
    {
      id: 7,
      title: '제7장 배포 및 운영',
      content: `
        <h3>7.1 배포 환경</h3>
        <table>
          <thead>
            <tr>
              <th>환경</th>
              <th>용도</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Development</td>
              <td>개발 테스트</td>
              <td>localhost:5173</td>
            </tr>
            <tr>
              <td>Staging</td>
              <td>통합 테스트</td>
              <td>staging.asw-hub.com</td>
            </tr>
            <tr>
              <td>Production</td>
              <td>실제 운영</td>
              <td>asw-hub.com</td>
            </tr>
          </tbody>
        </table>

        <h3>7.2 CI/CD 파이프라인</h3>
        <p>GitHub Actions 기반 자동화</p>
        <ul>
          <li>Pull Request → 자동 빌드/테스트</li>
          <li>Main 브랜치 Push → Staging 배포</li>
          <li>Tag 생성 → Production 배포</li>
        </ul>

        <h3>7.3 모니터링</h3>
        <ul>
          <li>Error tracking (Sentry)</li>
          <li>Performance monitoring (Web Vitals)</li>
          <li>Uptime monitoring (Pingdom)</li>
        </ul>
      `
    },
    {
      id: 8,
      title: '제8장 결과 및 기대효과',
      content: `
        <h3>8.1 정량적 성과</h3>
        <table>
          <thead>
            <tr>
              <th>지표</th>
              <th>목표</th>
              <th>달성</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>개발 주기 단축</td>
              <td>75%</td>
              <td>✅ 75% (3-6개월 → 2-4주)</td>
            </tr>
            <tr>
              <td>빌드 성공률</td>
              <td>100%</td>
              <td>✅ 100%</td>
            </tr>
            <tr>
              <td>타입 안정성</td>
              <td>100%</td>
              <td>✅ 100%</td>
            </tr>
            <tr>
              <td>배포 자동화</td>
              <td>100%</td>
              <td>✅ 100%</td>
            </tr>
          </tbody>
        </table>

        <h3>8.2 정성적 성과</h3>
        <ul>
          <li><strong>협업 문화 혁신:</strong> 5개 기관 실시간 협업 체계 구축</li>
          <li><strong>기술 표준화:</strong> A-SW 개발 표준 프로세스 확립</li>
          <li><strong>지식 축적:</strong> 체계적인 히스토리 관리</li>
        </ul>

        <h3>8.3 향후 발전 방향</h3>
        <ul>
          <li>AI 기반 코드 리뷰 도입</li>
          <li>실시간 협업 기능 강화 (Live Share)</li>
          <li>모바일 앱 개발</li>
          <li>글로벌 진출 (다국어 지원 확대)</li>
        </ul>

        <h3>8.4 사업화 계획</h3>
        <p>
          본 플랫폼은 농업기계 분야를 넘어 다양한 산업 분야에 적용 가능하며,
          SaaS 모델로 상용화를 추진할 예정입니다.
        </p>
      `
    },
    {
      id: 'A',
      title: '부록',
      content: `
        <h3>부록 A. 시스템 요구사항</h3>
        <table>
          <thead>
            <tr>
              <th>항목</th>
              <th>최소</th>
              <th>권장</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>브라우저</td>
              <td>Chrome 90+</td>
              <td>Chrome 120+</td>
            </tr>
            <tr>
              <td>화면 해상도</td>
              <td>1280x720</td>
              <td>1920x1080</td>
            </tr>
            <tr>
              <td>네트워크</td>
              <td>1Mbps</td>
              <td>10Mbps</td>
            </tr>
          </tbody>
        </table>

        <h3>부록 B. API 엔드포인트</h3>
        <pre class="code-block">
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/builds/:projectId/trigger
GET    /api/builds/:id/logs
        </pre>

        <h3>부록 C. 용어 정의</h3>
        <ul>
          <li><strong>A-SW:</strong> Autonomous Software (자율주행 소프트웨어)</li>
          <li><strong>CI/CD:</strong> Continuous Integration/Continuous Deployment</li>
          <li><strong>DDD:</strong> Domain-Driven Design</li>
          <li><strong>RBAC:</strong> Role-Based Access Control</li>
        </ul>

        <h3>부록 D. 참고문헌</h3>
        <ol>
          <li>SvelteKit Documentation, https://kit.svelte.dev</li>
          <li>TypeScript Handbook, https://www.typescriptlang.org</li>
          <li>Domain-Driven Design, Eric Evans, 2003</li>
        </ol>
      `
    }
  ],
  en: [
    {
      id: 4,
      title: 'Chapter 4: Core Features Implementation',
      content: `
        <h3>4.1 Authentication System</h3>
        <p>Integrated authentication with Email/Password + GitHub OAuth 2.0</p>

        <h3>4.2 Project Management</h3>
        <p>142 agricultural machinery A-SW projects</p>

        <h3>4.3 CI/CD Pipeline</h3>
        <p>Fully automated build/test/deploy system</p>

        <h3>4.4 Dashboard & Monitoring</h3>
        <p>Real-time metrics visualization with Chart.js</p>

        <h3>4.5 Quality Management</h3>
        <p>Multi-level approval workflows</p>

        <h3>4.6 Timeline Management</h3>
        <p>5-year Gantt chart visualization</p>
      `
    },
    {
      id: 5,
      title: 'Chapter 5: Technical Implementation Details',
      content: `
        <h3>5.1 Configuration-Driven Architecture</h3>
        <p>Environment-based configuration system</p>

        <h3>5.2 Error Handling Infrastructure</h3>
        <p>Hierarchical error classification</p>

        <h3>5.3 Logging System</h3>
        <p>Multi-transport logging infrastructure</p>

        <h3>5.4 TypeScript Strict Mode</h3>
        <p>100% type coverage achieved</p>
      `
    },
    {
      id: 6,
      title: 'Chapter 6: Testing & Quality Assurance',
      content: `
        <h3>6.1 Testing Strategy</h3>
        <p>Unit, Integration, and E2E testing with high coverage</p>

        <h3>6.2 Quality Metrics</h3>
        <p>100% build success rate, 100% type coverage</p>

        <h3>6.3 Performance Optimization</h3>
        <p>Code splitting, lazy loading, debouncing</p>
      `
    },
    {
      id: 7,
      title: 'Chapter 7: Deployment & Operations',
      content: `
        <h3>7.1 Deployment Environments</h3>
        <p>Development, Staging, Production</p>

        <h3>7.2 CI/CD Pipeline</h3>
        <p>GitHub Actions-based automation</p>

        <h3>7.3 Monitoring</h3>
        <p>Error tracking, performance monitoring, uptime monitoring</p>
      `
    },
    {
      id: 8,
      title: 'Chapter 8: Results & Expected Impact',
      content: `
        <h3>8.1 Quantitative Results</h3>
        <p>75% dev cycle reduction, 100% build success rate</p>

        <h3>8.2 Qualitative Results</h3>
        <p>Collaboration culture innovation, technology standardization</p>

        <h3>8.3 Future Directions</h3>
        <p>AI code review, real-time collaboration, mobile app</p>

        <h3>8.4 Commercialization Plan</h3>
        <p>SaaS model for various industries</p>
      `
    },
    {
      id: 'A',
      title: 'Appendices',
      content: `
        <h3>Appendix A. System Requirements</h3>
        <p>Browser: Chrome 90+, Resolution: 1280x720+</p>

        <h3>Appendix B. API Endpoints</h3>
        <p>RESTful API with JWT authentication</p>

        <h3>Appendix C. Glossary</h3>
        <p>A-SW, CI/CD, DDD, RBAC definitions</p>

        <h3>Appendix D. References</h3>
        <p>SvelteKit, TypeScript, DDD documentation</p>
      `
    }
  ]
};

export function generateSectionHTML(sectionData, lang) {
  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <title>${sectionData.title}</title>
      <style>${getStyles(lang)}</style>
    </head>
    <body>
      <div class="report-section">
        <h1 class="section-title">${sectionData.title}</h1>
        ${sectionData.content}
      </div>
    </body>
    </html>
  `;
}

function getStyles(lang) {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4 portrait; margin: 25mm 20mm; }
    html, body { width: 210mm; }
    body {
      font-family: 'Noto Sans ${lang === 'ko' ? 'KR' : ''}', sans-serif;
      font-size: 10pt;
      line-height: 1.8;
      color: #000;
    }
    .section-title { font-size: 18pt; font-weight: 700; margin-bottom: 8mm; padding-bottom: 3mm; border-bottom: 2px solid #000; }
    h3 { font-size: 14pt; font-weight: 700; margin-top: 8mm; margin-bottom: 4mm; }
    h4 { font-size: 12pt; font-weight: 600; margin-top: 6mm; margin-bottom: 3mm; }
    p { margin-bottom: 3mm; text-align: justify; }
    ul, ol { margin-left: 6mm; margin-bottom: 3mm; }
    li { margin-bottom: 2mm; }
    table { width: 100%; border-collapse: collapse; margin: 2mm 0; }
    th, td { border: 1px solid #000; padding: 2mm; text-align: left; font-size: 9pt; }
    th { background: #f0f0f0; font-weight: 600; }
    .code-block { background: #f5f5f5; border: 1px solid #ddd; padding: 3mm; font-family: monospace; font-size: 8pt; white-space: pre; margin: 3mm 0; }
    strong { font-weight: 600; }
  `;
}
