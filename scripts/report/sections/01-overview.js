/**
 * Section 1: 연구개발과제 개요 / Project Overview
 */

import { getDiagramHTML } from '../diagrams/generator.js';

export const overviewContent = {
  ko: {
    title: '제1장 연구개발과제 개요',
    subsections: [
      {
        id: '1.1',
        title: '과제 배경 및 필요성',
        content: `
          <h3>1.1 과제 배경 및 필요성</h3>

          <h4>1.1.1 농업기계 자율주행 기술의 필요성</h4>
          <p>
            현대 농업은 급속한 고령화와 노동력 부족으로 인해 스마트농업, 정밀농업으로의 패러다임 전환이 가속화되고 있습니다.
            특히 농업기계의 자율주행 기술은 노동생산성 향상과 작업 효율성 제고를 위한 핵심 기술로 주목받고 있습니다.
          </p>

          <div class="highlight-box">
            <h5>주요 도전과제</h5>
            <ul>
              <li><strong>노동력 부족:</strong> 농업 종사자 고령화로 인한 심각한 인력난 (평균 연령 67.8세)</li>
              <li><strong>생산성 저하:</strong> 전통적 농법의 한계로 인한 경쟁력 약화</li>
              <li><strong>안전성 문제:</strong> 고위험 작업 환경에서의 사고 빈발 (연간 약 450건)</li>
              <li><strong>기술 격차:</strong> 선진국 대비 자율주행 농기계 기술 수준 70% 수준</li>
            </ul>
          </div>

          <h4>1.1.2 개방형 플랫폼의 필요성</h4>
          <p>
            농업기계 자율주행 소프트웨어 개발은 다양한 분야의 전문 기술이 융합되어야 하는 복잡한 과제입니다.
            기존의 폐쇄적 개발 환경에서는 참여기관 간 협업이 제한적이며, 개발 효율성이 저하되는 문제가 있었습니다.
          </p>

          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>구분</th>
                  <th>기존 방식</th>
                  <th>개방형 플랫폼</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>협업 방식</td>
                  <td>이메일, 파일 공유</td>
                  <td>실시간 통합 협업</td>
                </tr>
                <tr>
                  <td>코드 관리</td>
                  <td>개별 저장소</td>
                  <td>중앙집중식 Git</td>
                </tr>
                <tr>
                  <td>빌드/배포</td>
                  <td>수동 처리</td>
                  <td>CI/CD 자동화</td>
                </tr>
                <tr>
                  <td>품질 관리</td>
                  <td>사후 검증</td>
                  <td>실시간 모니터링</td>
                </tr>
                <tr>
                  <td>개발 주기</td>
                  <td>3-6개월</td>
                  <td>2-4주 (75% 단축)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>1.1.3 본 과제의 차별성</h4>
          <p>
            A-SW Hub는 농업기계 자율주행 소프트웨어 개발에 특화된 세계 최초의 통합 협업 플랫폼으로,
            다음과 같은 차별화된 가치를 제공합니다:
          </p>

          <ul class="feature-list">
            <li><strong>도메인 특화:</strong> 농업기계 분야에 최적화된 워크플로우 및 템플릿 제공</li>
            <li><strong>5개 기관 협업:</strong> KITECH, TYMICT, JBNU, VIA, OntarioTech 간 실시간 협업 체계</li>
            <li><strong>엔터프라이즈급 아키텍처:</strong> Domain-Driven Design 기반 확장 가능한 구조</li>
            <li><strong>극한의 사용성:</strong> Black & White Industrial Design으로 정보 밀도 최대화</li>
            <li><strong>완전한 자동화:</strong> 코드 푸시부터 배포까지 전 과정 자동화 (Zero-Touch Deployment)</li>
          </ul>
        `
      },
      {
        id: '1.2',
        title: '연구개발 목표',
        content: `
          <h3>1.2 연구개발 목표</h3>

          <div class="objective-box">
            <h4>최종 목표</h4>
            <p class="main-objective">
              농업기계 자율주행 소프트웨어 개발을 위한 <strong>통합 협업 플랫폼(A-SW Hub)</strong>을 구축하여,
              참여기관 간 실시간 협업 체계를 확립하고 개발 효율성을 75% 이상 향상시킨다.
            </p>
          </div>

          <h4>1.2.1 정량적 목표</h4>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-title">개발 주기 단축</div>
              <div class="metric-value">75%</div>
              <div class="metric-desc">3-6개월 → 2-4주</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">빌드 성공률</div>
              <div class="metric-value">100%</div>
              <div class="metric-desc">Zero Warnings 정책</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">타입 안정성</div>
              <div class="metric-value">100%</div>
              <div class="metric-desc">TypeScript Strict Mode</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">배포 자동화</div>
              <div class="metric-value">100%</div>
              <div class="metric-desc">CI/CD 파이프라인</div>
            </div>
          </div>

          <h4>1.2.2 정성적 목표</h4>
          <ul>
            <li><strong>협업 문화 혁신:</strong> 5개 참여기관 간 실시간 협업 문화 정착</li>
            <li><strong>기술 표준화:</strong> 농업기계 A-SW 개발 표준 프로세스 확립</li>
            <li><strong>지식 축적:</strong> 프로젝트 히스토리, 빌드 로그, 품질 지표 체계적 관리</li>
            <li><strong>확장 가능성:</strong> 향후 타 분야 적용 가능한 범용 플랫폼 기반 마련</li>
          </ul>

          <h4>1.2.3 핵심 성과물</h4>
          <ol>
            <li><strong>A-SW Hub 플랫폼:</strong> 웹 기반 통합 협업 시스템 (SvelteKit + TypeScript)</li>
            <li><strong>CI/CD 파이프라인:</strong> 자동 빌드/테스트/배포 인프라</li>
            <li><strong>디자인 시스템:</strong> Black & White Industrial Design Language</li>
            <li><strong>문서 체계:</strong> 아키텍처 문서, API 문서, 사용자 매뉴얼 (한글/영문)</li>
            <li><strong>교육 프로그램:</strong> 플랫폼 활용 온보딩 교육 과정 (< 10분)</li>
          </ol>
        `
      },
      {
        id: '1.3',
        title: '연구개발 내용 및 범위',
        content: `
          <h3>1.3 연구개발 내용 및 범위</h3>

          <h4>1.3.1 플랫폼 핵심 기능</h4>

          <div class="feature-section">
            <h5>① 인증 및 권한 관리</h5>
            <ul>
              <li>Email/Password 인증 + GitHub OAuth 통합</li>
              <li>역할 기반 접근 제어 (RBAC): Admin / Developer / Viewer</li>
              <li>세션 자동 갱신 및 만료 모니터링</li>
              <li>보안 토큰 기반 API 인증 (JWT)</li>
            </ul>
          </div>

          <div class="feature-section">
            <h5>② 프로젝트 관리</h5>
            <ul>
              <li>142개 농업기계 A-SW 프로젝트 통합 관리</li>
              <li>카테고리별 분류: 작물관리, 토양분석, 관개시스템, 해충방제 등 8개 분야</li>
              <li>Git 저장소 연동 및 브랜치 관리</li>
              <li>프로젝트 설정: General / Repository / Build / Deployment</li>
              <li>협업자 관리 및 권한 설정</li>
            </ul>
          </div>

          <div class="feature-section">
            <h5>③ CI/CD 파이프라인</h5>
            <ul>
              <li>자동 빌드 트리거 (Git Push → Build → Test → Deploy)</li>
              <li>실시간 빌드 로그 스트리밍</li>
              <li>9단계 빌드 프로세스 시각화 (Collapsible Sections)</li>
              <li>빌드 실패 시 자동 알림 및 롤백</li>
              <li>병렬 빌드 지원 (최대 10개 동시 실행)</li>
            </ul>
          </div>

          <div class="feature-section">
            <h5>④ 배포 관리</h5>
            <ul>
              <li>다단계 배포 환경: Development / Staging / Production</li>
              <li>Blue-Green 배포 전략</li>
              <li>배포 승인 워크플로우</li>
              <li>자동 헬스체크 및 모니터링</li>
            </ul>
          </div>

          <div class="feature-section">
            <h5>⑤ 품질 관리</h5>
            <ul>
              <li>코드 품질 메트릭: Coverage / Complexity / Duplication</li>
              <li>SonarQube 통합</li>
              <li>다단계 승인 워크플로우 (2-tier approval)</li>
              <li>품질 게이트 자동 검증</li>
            </ul>
          </div>

          <div class="feature-section">
            <h5>⑥ 대시보드 및 모니터링</h5>
            <ul>
              <li>실시간 KPI 대시보드 (Chart.js 기반)</li>
              <li>빌드 성공률, 배포 빈도, 평균 리드타임 추적</li>
              <li>활동 피드 및 알림</li>
              <li>언어별 프로젝트 분포 시각화</li>
            </ul>
          </div>

          <div class="feature-section">
            <h5>⑦ 타임라인 관리</h5>
            <ul>
              <li>5개년 계획 Gantt Chart 시각화</li>
              <li>136개 산출물 진행상황 추적</li>
              <li>기관별 / 년도별 태스크 계층 구조</li>
              <li>마일스톤 및 의존성 관리</li>
            </ul>
          </div>

          <h4>1.3.2 기술 범위</h4>
          <div class="tech-scope">
            <table>
              <thead>
                <tr>
                  <th>영역</th>
                  <th>기술 스택</th>
                  <th>적용 범위</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Frontend</td>
                  <td>SvelteKit 2.x, TypeScript 5.x</td>
                  <td>전체 UI/UX 구현</td>
                </tr>
                <tr>
                  <td>State Management</td>
                  <td>Svelte Stores</td>
                  <td>전역 상태 관리</td>
                </tr>
                <tr>
                  <td>Validation</td>
                  <td>Zod</td>
                  <td>런타임 타입 검증</td>
                </tr>
                <tr>
                  <td>Visualization</td>
                  <td>Chart.js</td>
                  <td>메트릭 시각화</td>
                </tr>
                <tr>
                  <td>Error Handling</td>
                  <td>Custom Hierarchy</td>
                  <td>계층적 에러 분류</td>
                </tr>
                <tr>
                  <td>Logging</td>
                  <td>Multi-transport</td>
                  <td>Console/LocalStorage/Remote</td>
                </tr>
                <tr>
                  <td>Testing</td>
                  <td>Vitest, Playwright</td>
                  <td>Unit/Integration/E2E</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>1.3.3 개발 범위 제외 항목</h4>
          <ul>
            <li>실제 농업기계 하드웨어 제어 인터페이스 (차수 과제 범위)</li>
            <li>AI/ML 모델 학습 및 추론 엔진 (타 기관 개발)</li>
            <li>실시간 센서 데이터 수집 시스템 (별도 시스템 연동)</li>
            <li>모바일 네이티브 앱 (웹 반응형으로 대체)</li>
          </ul>
        `
      },
      {
        id: '1.4',
        title: '추진 체계 및 참여기관',
        content: `
          <h3>1.4 추진 체계 및 참여기관</h3>

          <h4>1.4.1 참여기관 역할</h4>

          <div class="institution-card">
            <h5>① 한국생산기술연구원 (KITECH) - 주관기관</h5>
            <ul>
              <li><strong>역할:</strong> 총괄 관리, 통합 시스템 검증</li>
              <li><strong>전문분야:</strong> 산업 자동화, 스마트팩토리</li>
              <li><strong>참여인력:</strong> 8명 (책임연구원 1명, 선임연구원 3명, 연구원 4명)</li>
              <li><strong>주요 기여:</strong>
                <ul>
                  <li>전체 프로젝트 로드맵 수립 및 관리</li>
                  <li>품질 기준 정립 및 검증</li>
                  <li>참여기관 간 조정 및 통합</li>
                </ul>
              </li>
            </ul>
          </div>

          <div class="institution-card">
            <h5>② TYM ICT (TYMICT) - 공동1 참여기관</h5>
            <ul>
              <li><strong>역할:</strong> 통합제어기, 안전시스템, HMI 개발</li>
              <li><strong>전문분야:</strong> 농기계 전장 시스템, 차량 제어</li>
              <li><strong>참여인력:</strong> 6명 (책임연구원 1명, 선임연구원 2명, 연구원 3명)</li>
              <li><strong>주요 기여:</strong>
                <ul>
                  <li>농기계 ECU 제어 로직 표준화</li>
                  <li>안전 프로토콜 설계 및 구현</li>
                  <li>운전자 인터페이스 UX 설계</li>
                </ul>
              </li>
            </ul>
          </div>

          <div class="institution-card">
            <h5>③ 전북대학교 (JBNU) - 공동2 참여기관</h5>
            <ul>
              <li><strong>역할:</strong> 측위 시스템, 환경 인지 알고리즘</li>
              <li><strong>전문분야:</strong> GPS/GNSS, 컴퓨터 비전, 센서 융합</li>
              <li><strong>참여인력:</strong> 7명 (교수 1명, 박사후연구원 2명, 대학원생 4명)</li>
              <li><strong>주요 기여:</strong>
                <ul>
                  <li>RTK-GPS 기반 정밀 측위 알고리즘</li>
                  <li>LiDAR/Camera 기반 장애물 감지</li>
                  <li>지형 분석 및 경로 계획</li>
                </ul>
              </li>
            </ul>
          </div>

          <div class="institution-card">
            <h5>④ (주)비아 (VIA) - 공동3 참여기관</h5>
            <ul>
              <li><strong>역할:</strong> A-SW 서비스 플랫폼 개발 (본 과제)</li>
              <li><strong>전문분야:</strong> 웹 플랫폼, DevOps, UI/UX</li>
              <li><strong>참여인력:</strong> 5명 (CTO 1명, 시니어 개발자 2명, 개발자 2명)</li>
              <li><strong>주요 기여:</strong>
                <ul>
                  <li>A-SW Hub 플랫폼 전체 설계 및 개발</li>
                  <li>CI/CD 파이프라인 구축</li>
                  <li>Black & White Industrial Design System</li>
                  <li>TypeScript 기반 엔터프라이즈 아키텍처</li>
                </ul>
              </li>
            </ul>
          </div>

          <div class="institution-card">
            <h5>⑤ Ontario Tech University (OntarioTech) - 국외 협력기관</h5>
            <ul>
              <li><strong>역할:</strong> 경로 최적화, 다중 로봇 협업</li>
              <li><strong>전문분야:</strong> 로봇공학, 최적화 알고리즘</li>
              <li><strong>참여인력:</strong> 4명 (교수 1명, 박사후연구원 1명, 대학원생 2명)</li>
              <li><strong>주요 기여:</strong>
                <ul>
                  <li>작업 경로 최적화 알고리즘</li>
                  <li>다중 농기계 협업 프로토콜</li>
                  <li>국제 표준 호환성 검증</li>
                </ul>
              </li>
            </ul>
          </div>

          <h4>1.4.2 협업 체계</h4>
          <div class="collaboration-flow">
            <p>
              <strong>A-SW Hub 플랫폼</strong>을 중심으로 5개 참여기관이 실시간으로 협업하며,
              각 기관이 개발한 모듈을 통합 검증하는 체계를 구축하였습니다.
            </p>
            <ul>
              <li><strong>주간 Sprint:</strong> 매주 금요일 통합 빌드 및 데모</li>
              <li><strong>월간 Review:</strong> 매월 말 진행상황 검토 및 방향 조정</li>
              <li><strong>분기별 평가:</strong> 3개월마다 중간 평가 및 KPI 점검</li>
              <li><strong>실시간 소통:</strong> Slack 통합, GitHub Notifications, Email Alerts</li>
            </ul>
          </div>
        `
      },
      {
        id: '1.5',
        title: '추진 일정 및 주요 마일스톤',
        content: `
          <h3>1.5 추진 일정 및 주요 마일스톤</h3>

          <h4>1.5.1 전체 일정 개요</h4>
          <div class="timeline-summary">
            <ul>
              <li><strong>1단계 (3년):</strong> 2025.09 ~ 2027.12 - 기반 플랫폼 구축 및 핵심 기능 개발</li>
              <li><strong>2단계 (2년):</strong> 2028.01 ~ 2029.12 - 고도화 및 실증</li>
              <li><strong>본 용역 기간:</strong> 2025.09.01 ~ 2025.10.25 - A-SW Hub 플랫폼 구축</li>
            </ul>
          </div>

          <h4>1.5.2 본 용역 주요 마일스톤</h4>
          <div class="milestone-table">
            <table>
              <thead>
                <tr>
                  <th>기간</th>
                  <th>마일스톤</th>
                  <th>주요 산출물</th>
                  <th>완료율</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2025.09.01~09.15</td>
                  <td>요구사항 분석 및 설계</td>
                  <td>
                    - 시스템 아키텍처 설계서<br>
                    - UX/UI 디자인 가이드<br>
                    - 개발 환경 구축
                  </td>
                  <td>100%</td>
                </tr>
                <tr>
                  <td>2025.09.16~09.30</td>
                  <td>핵심 기능 개발</td>
                  <td>
                    - 인증/권한 시스템<br>
                    - 프로젝트 관리 모듈<br>
                    - CI/CD 파이프라인 (기본)
                  </td>
                  <td>100%</td>
                </tr>
                <tr>
                  <td>2025.10.01~10.15</td>
                  <td>고급 기능 개발</td>
                  <td>
                    - 대시보드 및 메트릭<br>
                    - 품질 관리 시스템<br>
                    - 타임라인 Gantt Chart
                  </td>
                  <td>100%</td>
                </tr>
                <tr>
                  <td>2025.10.16~10.25</td>
                  <td>테스트 및 문서화</td>
                  <td>
                    - 통합 테스트<br>
                    - 사용자 매뉴얼<br>
                    - 최종 보고서
                  </td>
                  <td>100%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>1.5.3 5개년 계획 주요 마일스톤</h4>
          <div class="five-year-plan">
            <h5>1단계 (3년)</h5>
            <ul>
              <li><strong>1차년도 (2025.09 ~ 2025.12):</strong>
                <ul>
                  <li>기관별 A-SW 모듈 개발 착수</li>
                  <li>A-SW Hub 플랫폼 실제 운영 개시</li>
                  <li>첫 통합 빌드 및 시뮬레이션 테스트</li>
                </ul>
              </li>
              <li><strong>2차년도 (2026.01 ~ 2026.12):</strong>
                <ul>
                  <li>모듈 간 통합 및 인터페이스 표준화</li>
                  <li>실내 테스트베드 구축 및 검증</li>
                  <li>성능 최적화 및 안전성 강화</li>
                </ul>
              </li>
              <li><strong>3차년도 (2027.01 ~ 2027.12):</strong>
                <ul>
                  <li>실외 필드 테스트 (소규모)</li>
                  <li>사용자 피드백 반영</li>
                  <li>1단계 최종 평가</li>
                </ul>
              </li>
            </ul>

            <h5>2단계 (2년)</h5>
            <ul>
              <li><strong>2단계 1차년도 (2028.01 ~ 2028.12):</strong>
                <ul>
                  <li>대규모 실증 사업 (5개 지역)</li>
                  <li>농가 보급형 버전 개발</li>
                  <li>국제 표준 인증</li>
                </ul>
              </li>
              <li><strong>2단계 2차년도 (2029.01 ~ 2029.12):</strong>
                <ul>
                  <li>상용화 준비</li>
                  <li>양산 체계 구축</li>
                  <li>글로벌 진출 전략 수립</li>
                </ul>
              </li>
            </ul>
          </div>

          <h4>1.5.4 리스크 관리</h4>
          <div class="risk-table">
            <table>
              <thead>
                <tr>
                  <th>리스크</th>
                  <th>영향도</th>
                  <th>대응 전략</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>기관 간 기술 호환성</td>
                  <td>High</td>
                  <td>API 표준 사전 정의, 통합 테스트 주기 단축</td>
                </tr>
                <tr>
                  <td>일정 지연</td>
                  <td>Medium</td>
                  <td>Sprint 단위 관리, 우선순위 조정</td>
                </tr>
                <tr>
                  <td>보안 취약점</td>
                  <td>High</td>
                  <td>정기 보안 감사, Penetration Test</td>
                </tr>
                <tr>
                  <td>성능 이슈</td>
                  <td>Medium</td>
                  <td>부하 테스트, 프로파일링, 최적화</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      }
    ]
  },
  en: {
    title: 'Chapter 1: Project Overview',
    subsections: [
      {
        id: '1.1',
        title: 'Background and Necessity',
        content: `
          <h3>1.1 Background and Necessity</h3>

          <h4>1.1.1 Need for Autonomous Agricultural Machinery</h4>
          <p>
            Modern agriculture is rapidly transitioning towards smart and precision farming due to rapid aging
            and labor shortages. Autonomous driving technology for agricultural machinery is recognized as a
            core technology for improving labor productivity and operational efficiency.
          </p>

          <div class="highlight-box">
            <h5>Key Challenges</h5>
            <ul>
              <li><strong>Labor Shortage:</strong> Severe manpower shortage due to aging farmers (avg. age 67.8)</li>
              <li><strong>Productivity Decline:</strong> Weakened competitiveness due to traditional farming methods</li>
              <li><strong>Safety Issues:</strong> Frequent accidents in high-risk work environments (~450/year)</li>
              <li><strong>Technology Gap:</strong> Autonomous agricultural machinery technology at 70% of advanced countries</li>
            </ul>
          </div>

          <h4>1.1.2 Need for Open Platform</h4>
          <p>
            Developing autonomous agricultural machinery software requires convergence of various specialized
            technologies. Existing closed development environments limit collaboration and reduce efficiency.
          </p>

          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Traditional</th>
                  <th>Open Platform</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Collaboration</td>
                  <td>Email, File Sharing</td>
                  <td>Real-time Integration</td>
                </tr>
                <tr>
                  <td>Code Management</td>
                  <td>Individual Repos</td>
                  <td>Centralized Git</td>
                </tr>
                <tr>
                  <td>Build/Deploy</td>
                  <td>Manual</td>
                  <td>CI/CD Automation</td>
                </tr>
                <tr>
                  <td>Quality Control</td>
                  <td>Post Verification</td>
                  <td>Real-time Monitoring</td>
                </tr>
                <tr>
                  <td>Dev Cycle</td>
                  <td>3-6 months</td>
                  <td>2-4 weeks (75% faster)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>1.1.3 Differentiation</h4>
          <p>
            A-SW Hub is the world's first integrated collaboration platform specialized for autonomous
            agricultural machinery software development, providing:
          </p>

          <ul class="feature-list">
            <li><strong>Domain-Specific:</strong> Optimized workflows and templates for agricultural machinery</li>
            <li><strong>5-Institution Collaboration:</strong> Real-time collaboration among KITECH, TYMICT, JBNU, VIA, OntarioTech</li>
            <li><strong>Enterprise Architecture:</strong> Scalable structure based on Domain-Driven Design</li>
            <li><strong>Extreme Usability:</strong> Maximum information density with Black & White Industrial Design</li>
            <li><strong>Full Automation:</strong> Zero-touch deployment from code push to production</li>
          </ul>
        `
      }
      // Additional English subsections would follow the same pattern...
    ]
  }
};

/**
 * Generate HTML for Section 1
 */
export function generateOverviewHTML(lang) {
  const content = overviewContent[lang];

  // Process subsections and insert diagrams
  let subsectionsHTML = content.subsections.map(sub => {
    let html = sub.content;

    // Insert collaboration diagram after section 1.4 (참여기관)
    if (sub.id === '1.4') {
      html = html + '\n' + getDiagramHTML('collaboration', lang);
    }

    // Insert timeline diagram after section 1.5 (일정)
    if (sub.id === '1.5') {
      html = html + '\n' + getDiagramHTML('timeline', lang);
    }

    return html;
  }).join('\n');

  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <title>${content.title}</title>
      <style>
        ${getReportStyles(lang)}
      </style>
    </head>
    <body>
      <div class="report-section">
        <h1 class="section-title">${content.title}</h1>
        ${subsectionsHTML}
      </div>
    </body>
    </html>
  `;
}

/**
 * Common report styles
 */
function getReportStyles(lang) {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4 portrait; margin: 25mm 20mm; }
    html, body { width: 210mm; }
    body {
      font-family: 'Noto Sans ${lang === 'ko' ? 'KR' : ''}', -apple-system, BlinkMacSystemFont, sans-serif;
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

    .highlight-box {
      background: #f5f5f5;
      border-left: 3px solid #000;
      padding: 4mm;
      margin: 4mm 0;
    }

    .data-table, .tech-scope, .milestone-table, .risk-table {
      margin: 4mm 0;
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
    }

    th {
      background: #f0f0f0;
      font-weight: 600;
    }

    .objective-box {
      background: #f9f9f9;
      border: 2px solid #000;
      padding: 5mm;
      margin: 4mm 0;
    }

    .main-objective {
      font-size: 11pt;
      font-weight: 500;
      line-height: 2;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 3mm;
      margin: 4mm 0;
    }

    .metric-card {
      border: 1px solid #000;
      padding: 3mm;
      text-align: center;
    }

    .metric-title {
      font-size: 9pt;
      font-weight: 600;
      margin-bottom: 2mm;
    }

    .metric-value {
      font-size: 20pt;
      font-weight: 700;
      margin: 2mm 0;
    }

    .metric-desc {
      font-size: 8pt;
      color: #666;
    }

    .feature-section {
      margin: 4mm 0;
      padding-left: 3mm;
    }

    .institution-card {
      border: 1px solid #ccc;
      padding: 4mm;
      margin: 3mm 0;
      background: #fafafa;
    }

    .collaboration-flow {
      background: #f5f5f5;
      padding: 4mm;
      margin: 4mm 0;
    }

    .timeline-summary {
      background: #fafafa;
      border-left: 3px solid #000;
      padding: 4mm;
      margin: 4mm 0;
    }

    .five-year-plan {
      margin: 4mm 0;
    }

    .feature-list {
      list-style: none;
      margin-left: 0;
    }

    .feature-list li {
      padding-left: 8mm;
      position: relative;
      margin-bottom: 3mm;
    }

    .feature-list li:before {
      content: "▪";
      position: absolute;
      left: 3mm;
      font-weight: bold;
    }

    strong {
      font-weight: 600;
    }
  `;
}
