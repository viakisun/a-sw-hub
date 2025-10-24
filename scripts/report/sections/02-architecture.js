/**
 * Section 2: 시스템 설계 / System Architecture
 */

export const architectureContent = {
  ko: {
    title: '제2장 시스템 설계',
    content: `
      <h3>2.1 시스템 아키텍처</h3>

      <h4>2.1.1 전체 시스템 구조</h4>
      <p>
        A-SW Hub는 <strong>Domain-Driven Design (DDD)</strong> 원칙을 기반으로 설계되었으며,
        계층형 아키텍처를 통해 확장성과 유지보수성을 확보하였습니다.
      </p>

      <div class="architecture-diagram">
        <h5>계층별 구조</h5>
        <table>
          <thead>
            <tr>
              <th>계층</th>
              <th>역할</th>
              <th>주요 컴포넌트</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Presentation Layer</strong></td>
              <td>사용자 인터페이스</td>
              <td>SvelteKit Routes, Components, Stores</td>
            </tr>
            <tr>
              <td><strong>Domain Layer</strong></td>
              <td>비즈니스 로직</td>
              <td>Auth, Projects, Builds, Approvals, Dashboard</td>
            </tr>
            <tr>
              <td><strong>Service Layer</strong></td>
              <td>외부 통신</td>
              <td>BaseService, HTTP Client, WebSocket</td>
            </tr>
            <tr>
              <td><strong>Infrastructure Layer</strong></td>
              <td>공통 기능</td>
              <td>Error Handling, Logging, Configuration</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>2.1.2 디렉토리 구조</h4>
      <pre class="code-block">
src/
├── config/                 # 중앙 집중식 설정
│   └── index.ts           # 환경 변수 검증 및 관리
│
├── lib/                    # 공유 라이브러리
│   ├── errors/            # 계층적 에러 핸들링
│   │   ├── base.ts        # BaseError
│   │   ├── network.ts     # NetworkError (자동 재시도)
│   │   ├── validation.ts  # ValidationError
│   │   └── auth.ts        # AuthError (세션 갱신)
│   │
│   ├── logger/            # 다중 전송 로깅
│   │   ├── console.ts     # 개발용 콘솔 로그
│   │   ├── storage.ts     # LocalStorage 지속화
│   │   └── remote.ts      # 프로덕션 원격 로깅
│   │
│   ├── services/          # 서비스 추상화
│   │   └── base.ts        # BaseService (retry logic)
│   │
│   └── components/        # 재사용 UI 컴포넌트
│       ├── Button.svelte
│       ├── Input.svelte
│       └── Modal.svelte
│
├── domains/               # 비즈니스 도메인 (DDD)
│   ├── auth/             # 인증/인가
│   │   ├── types.ts
│   │   ├── service.ts
│   │   ├── store.ts
│   │   └── schemas.ts     # Zod validation
│   │
│   ├── projects/         # 프로젝트 관리
│   │   ├── types.ts
│   │   ├── service.ts
│   │   ├── store.ts
│   │   └── mock.ts        # Mock 데이터
│   │
│   ├── builds/           # CI/CD 빌드
│   ├── approvals/        # 승인 워크플로우
│   └── dashboard/        # 대시보드 메트릭
│
└── routes/               # SvelteKit 라우트
    ├── (auth)/          # 인증 페이지
    │   └── login/
    └── (app)/           # 보호된 앱 페이지
        ├── dashboard/
        ├── projects/
        ├── builds/
        └── settings/
      </pre>

      <h4>2.1.3 모듈 간 의존성</h4>
      <p>
        각 도메인은 독립적으로 동작하며, 공통 인프라스트럭처를 통해서만 통신합니다.
        이를 통해 <strong>낮은 결합도(Low Coupling)</strong>와 <strong>높은 응집도(High Cohesion)</strong>를 달성하였습니다.
      </p>

      <div class="dependency-rules">
        <h5>의존성 규칙</h5>
        <ul>
          <li>✅ Routes → Domains (허용)</li>
          <li>✅ Domains → Services (허용)</li>
          <li>✅ Services → Infrastructure (허용)</li>
          <li>❌ Infrastructure → Domains (금지)</li>
          <li>❌ Domains → Routes (금지)</li>
        </ul>
      </div>

      <h3>2.2 기술 스택 및 선정 근거</h3>

      <h4>2.2.1 Frontend Framework: SvelteKit 2.x</h4>
      <div class="tech-justification">
        <p><strong>선정 이유:</strong></p>
        <ul>
          <li><strong>성능:</strong> 컴파일 타임 최적화로 런타임 오버헤드 최소화</li>
          <li><strong>개발 생산성:</strong> 적은 보일러플레이트, 직관적 문법</li>
          <li><strong>번들 크기:</strong> React 대비 40% 작은 번들 사이즈</li>
          <li><strong>SSR 지원:</strong> 서버 사이드 렌더링 내장</li>
          <li><strong>파일 기반 라우팅:</strong> 직관적인 프로젝트 구조</li>
        </ul>

        <p><strong>대안 검토:</strong></p>
        <table>
          <thead>
            <tr>
              <th>Framework</th>
              <th>장점</th>
              <th>단점</th>
              <th>결정</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>React</td>
              <td>생태계, 인력 풀</td>
              <td>큰 번들, 보일러플레이트</td>
              <td>❌</td>
            </tr>
            <tr>
              <td>Vue.js</td>
              <td>학습 곡선, 문서화</td>
              <td>엔터프라이즈 사례 부족</td>
              <td>❌</td>
            </tr>
            <tr>
              <td>SvelteKit</td>
              <td>성능, 생산성, 번들</td>
              <td>상대적 생태계</td>
              <td>✅</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>2.2.2 Type Safety: TypeScript 5.x Strict Mode</h4>
      <p>
        모든 코드는 TypeScript Strict Mode에서 작성되어 <strong>100% 타입 커버리지</strong>를 달성하였습니다.
        이를 통해 런타임 에러를 컴파일 타임에 사전 차단합니다.
      </p>

      <div class="code-example">
        <h5>타입 안정성 예시</h5>
        <pre class="code-block">
// Domain Type Definition
export interface Project {
  id: string;
  name: string;
  repository: {
    url: string;
    branch: string;
  };
  owner: User;
  status: ProjectStatus;
  createdAt: Date;
}

// Runtime Validation with Zod
import { z } from 'zod';

export const projectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(100),
  repository: z.object({
    url: z.string().url(),
    branch: z.string().min(1)
  }),
  status: z.enum(['active', 'archived', 'deleted'])
});

// Type-safe API call
const project = projectSchema.parse(apiResponse);
        </pre>
      </div>

      <h4>2.2.3 Runtime Validation: Zod</h4>
      <p>
        모든 외부 입력(API 응답, 사용자 입력, 환경 변수)은 Zod 스키마로 검증되어
        런타임 타입 안정성을 보장합니다.
      </p>

      <h4>2.2.4 State Management: Svelte Stores</h4>
      <p>
        전역 상태 관리는 Svelte의 내장 Store를 사용하여 외부 의존성 없이 구현하였습니다.
      </p>

      <h4>2.2.5 Visualization: Chart.js</h4>
      <p>
        메트릭 시각화는 Chart.js를 사용하며, Black & White 테마로 커스터마이징하였습니다.
      </p>

      <h3>2.3 데이터베이스 설계</h3>

      <h4>2.3.1 사업계획 데이터 모델</h4>
      <p>
        5개년 사업계획의 136개 산출물을 체계적으로 관리하기 위한 데이터 모델을 설계하였습니다.
      </p>

      <div class="schema-diagram">
        <h5>핵심 엔티티</h5>
        <table>
          <thead>
            <tr>
              <th>Entity</th>
              <th>Attributes</th>
              <th>Relations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Institution</strong></td>
              <td>id, code, name, type, role, specialization</td>
              <td>1:N → Deliverable</td>
            </tr>
            <tr>
              <td><strong>Deliverable</strong></td>
              <td>id, name, type, status, year, phase, progress, kpi</td>
              <td>N:1 → Institution<br>N:N → Dependencies</td>
            </tr>
            <tr>
              <td><strong>KPI</strong></td>
              <td>metric, target, current, unit, status</td>
              <td>N:1 → Deliverable</td>
            </tr>
            <tr>
              <td><strong>GanttTask</strong></td>
              <td>name, startDate, endDate, progress, type, institution</td>
              <td>Tree Structure (children)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>2.3.2 프로젝트 데이터 모델</h4>
      <pre class="code-block">
interface Project {
  id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  repository: {
    url: string;
    branch: string;
    provider: 'github' | 'gitlab';
  };
  owner: User;
  collaborators: User[];
  settings: {
    buildConfig: BuildConfig;
    deploymentConfig: DeploymentConfig;
    notificationConfig: NotificationConfig;
  };
  metrics: {
    buildSuccessRate: number;
    avgBuildTime: number;
    deploymentFrequency: number;
    lastDeployedAt: Date;
  };
  status: 'active' | 'archived' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}
      </pre>

      <h3>2.4 보안 설계</h3>

      <h4>2.4.1 인증 체계</h4>
      <div class="security-table">
        <table>
          <thead>
            <tr>
              <th>방식</th>
              <th>프로토콜</th>
              <th>보안 강도</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Email/Password</td>
              <td>bcrypt (salt rounds: 12)</td>
              <td>High</td>
            </tr>
            <tr>
              <td>GitHub OAuth</td>
              <td>OAuth 2.0 Authorization Code</td>
              <td>Very High</td>
            </tr>
            <tr>
              <td>Session Token</td>
              <td>JWT (HS256, 1h expiry)</td>
              <td>High</td>
            </tr>
            <tr>
              <td>Refresh Token</td>
              <td>Secure HttpOnly Cookie (7d)</td>
              <td>Very High</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>2.4.2 권한 관리 (RBAC)</h4>
      <p>
        역할 기반 접근 제어를 통해 사용자별 권한을 세밀하게 관리합니다.
      </p>

      <div class="rbac-table">
        <table>
          <thead>
            <tr>
              <th>역할</th>
              <th>권한</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Admin</strong></td>
              <td>
                - 모든 프로젝트 CRUD<br>
                - 사용자 관리<br>
                - 시스템 설정<br>
                - 승인 최종 결정
              </td>
            </tr>
            <tr>
              <td><strong>Developer</strong></td>
              <td>
                - 할당된 프로젝트 수정<br>
                - 빌드 트리거<br>
                - 배포 요청<br>
                - 승인 요청
              </td>
            </tr>
            <tr>
              <td><strong>Viewer</strong></td>
              <td>
                - 프로젝트 조회<br>
                - 빌드 로그 조회<br>
                - 메트릭 조회
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>2.4.3 보안 정책</h4>
      <ul>
        <li><strong>HTTPS Only:</strong> 모든 통신 암호화 (TLS 1.3)</li>
        <li><strong>CORS:</strong> 화이트리스트 기반 Origin 제한</li>
        <li><strong>CSP:</strong> Content Security Policy 적용</li>
        <li><strong>Rate Limiting:</strong> IP 기반 요청 제한 (100req/min)</li>
        <li><strong>Input Sanitization:</strong> XSS 방지 (Svelte 기본 escaping)</li>
        <li><strong>SQL Injection 방지:</strong> Prepared Statements</li>
      </ul>
    `
  },
  en: {
    title: 'Chapter 2: System Architecture',
    content: `
      <h3>2.1 System Architecture</h3>

      <h4>2.1.1 Overall System Structure</h4>
      <p>
        A-SW Hub is designed based on <strong>Domain-Driven Design (DDD)</strong> principles,
        ensuring scalability and maintainability through layered architecture.
      </p>

      <div class="architecture-diagram">
        <h5>Layer Structure</h5>
        <table>
          <thead>
            <tr>
              <th>Layer</th>
              <th>Role</th>
              <th>Key Components</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Presentation Layer</strong></td>
              <td>User Interface</td>
              <td>SvelteKit Routes, Components, Stores</td>
            </tr>
            <tr>
              <td><strong>Domain Layer</strong></td>
              <td>Business Logic</td>
              <td>Auth, Projects, Builds, Approvals, Dashboard</td>
            </tr>
            <tr>
              <td><strong>Service Layer</strong></td>
              <td>External Communication</td>
              <td>BaseService, HTTP Client, WebSocket</td>
            </tr>
            <tr>
              <td><strong>Infrastructure Layer</strong></td>
              <td>Common Functions</td>
              <td>Error Handling, Logging, Configuration</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>2.2 Technology Stack</h3>
      <p>
        All technologies selected based on enterprise-grade requirements and proven track record.
      </p>

      <h3>2.3 Database Design</h3>
      <p>
        Comprehensive data model supporting 136 deliverables across 5-year project plan.
      </p>

      <h3>2.4 Security Design</h3>
      <p>
        Multi-layered security approach with OAuth 2.0, JWT, and RBAC.
      </p>
    `
  }
};

export function generateArchitectureHTML(lang) {
  const content = architectureContent[lang];

  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <title>${content.title}</title>
      <style>
        ${getReportStyles(lang)}

        .code-block {
          background: #f5f5f5;
          border: 1px solid #ddd;
          padding: 3mm;
          font-family: 'Courier New', monospace;
          font-size: 8pt;
          line-height: 1.4;
          overflow-x: auto;
          white-space: pre;
        }

        .architecture-diagram, .dependency-rules, .tech-justification {
          margin: 4mm 0;
        }

        .code-example {
          margin: 4mm 0;
        }

        .schema-diagram, .security-table, .rbac-table {
          margin: 4mm 0;
        }
      </style>
    </head>
    <body>
      <div class="report-section">
        <h1 class="section-title">${content.title}</h1>
        ${content.content}
      </div>
    </body>
    </html>
  `;
}

function getReportStyles(lang) {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4 portrait; margin: 25mm 20mm; }
    html, body { width: 210mm; }
    body {
      font-family: 'Noto Sans ${lang === 'ko' ? 'KR' : ''}', -apple-system, sans-serif;
      font-size: 10pt;
      line-height: 1.8;
      color: #000;
    }
    .section-title {
      font-size: 18pt;
      font-weight: 700;
      margin-bottom: 8mm;
      padding-bottom: 3mm;
      border-bottom: 2px solid #000;
    }
    h3 {
      font-size: 14pt;
      font-weight: 700;
      margin-top: 8mm;
      margin-bottom: 4mm;
    }
    h4 {
      font-size: 12pt;
      font-weight: 600;
      margin-top: 6mm;
      margin-bottom: 3mm;
    }
    h5 {
      font-size: 11pt;
      font-weight: 600;
      margin-top: 4mm;
      margin-bottom: 2mm;
    }
    p {
      margin-bottom: 3mm;
      text-align: justify;
    }
    ul, ol {
      margin-left: 6mm;
      margin-bottom: 3mm;
    }
    li {
      margin-bottom: 2mm;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 2mm 0;
    }
    th, td {
      border: 1px solid #000;
      padding: 2mm;
      text-align: left;
      font-size: 9pt;
    }
    th {
      background: #f0f0f0;
      font-weight: 600;
    }
    strong {
      font-weight: 600;
    }
  `;
}
