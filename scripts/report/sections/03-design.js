/**
 * Section 3: UX/UI 디자인 시스템 / UX/UI Design System
 */

import { getDiagramHTML } from '../diagrams/generator.js';
import { getScreenshotHTML } from '../screenshots/helper.js';

export const designContent = {
  ko: {
    title: '제3장 UX/UI 디자인 시스템',
    content: `
      <h3>3.1 디자인 철학: Extreme Black & White Industrial Design</h3>

      <h4>3.1.1 핵심 원칙</h4>
      <p>
        A-SW Hub의 디자인은 <strong>"극한의 절제와 명확성"</strong>을 추구합니다.
        불필요한 시각적 요소를 모두 제거하고, 정보 전달에만 집중한 산업용 디자인 언어를 구축하였습니다.
      </p>

      <div class="design-principles">
        <h5>5가지 디자인 원칙</h5>
        <table>
          <thead>
            <tr>
              <th>원칙</th>
              <th>설명</th>
              <th>구현</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>① 절대 모노크롬</strong></td>
              <td>오직 #000000과 #FFFFFF만 사용</td>
              <td>모든 UI 요소, 그래프, 아이콘</td>
            </tr>
            <tr>
              <td><strong>② Zero Radius</strong></td>
              <td>모서리 둥글림 금지 (border-radius: 0)</td>
              <td>버튼, 카드, 모달, 입력창</td>
            </tr>
            <tr>
              <td><strong>③ Hairline Borders</strong></td>
              <td>가는 1px 테두리, 그림자 금지</td>
              <td>box-shadow: none</td>
            </tr>
            <tr>
              <td><strong>④ Industrial Typography</strong></td>
              <td>시스템 폰트, 대문자 라벨</td>
              <td>-apple-system, text-transform: uppercase</td>
            </tr>
            <tr>
              <td><strong>⑤ Maximum Density</strong></td>
              <td>정보 밀도 최대화</td>
              <td>Compact spacing, Grid layouts</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>3.1.2 색상 시스템</h4>
      <div class="color-system">
        <pre class="code-block">
/* 전체 색상 팔레트 (단 2가지) */
--bg: #ffffff;           /* 배경 */
--fg: #000000;           /* 전경 (텍스트, 테두리) */

/* 투명도 변형 (회색 표현용) */
--hair: rgba(0, 0, 0, 0.12);    /* 가벼운 테두리 */
--muted: rgba(0, 0, 0, 0.6);    /* 보조 텍스트 */
--subtle: rgba(0, 0, 0, 0.04);  /* 배경 강조 */

/* 상태 표현 (패턴으로) */
Success: ▓▓▓▓▓ (Solid fill)
Warning: ░░░░░ (Dotted pattern)
Error: ▒▒▒▒▒ (Diagonal lines)
        </pre>
      </div>

      <h4>3.1.3 타이포그래피</h4>
      <table>
        <thead>
          <tr>
            <th>용도</th>
            <th>폰트</th>
            <th>크기</th>
            <th>두께</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>페이지 제목</td>
            <td>Noto Sans KR</td>
            <td>24px</td>
            <td>700</td>
          </tr>
          <tr>
            <td>섹션 제목</td>
            <td>Noto Sans KR</td>
            <td>18px</td>
            <td>600</td>
          </tr>
          <tr>
            <td>본문</td>
            <td>Noto Sans KR</td>
            <td>14px</td>
            <td>400</td>
          </tr>
          <tr>
            <td>라벨</td>
            <td>Noto Sans KR</td>
            <td>11px</td>
            <td>600, UPPERCASE</td>
          </tr>
          <tr>
            <td>코드</td>
            <td>Courier New</td>
            <td>13px</td>
            <td>400</td>
          </tr>
        </tbody>
      </table>

      <h3>3.2 컴포넌트 시스템</h3>

      <h4>3.2.1 기본 컴포넌트</h4>
      <div class="component-list">
        <h5>① Button</h5>
        <ul>
          <li><strong>Primary:</strong> 검정 배경 + 흰색 텍스트</li>
          <li><strong>Secondary:</strong> 흰색 배경 + 검정 테두리 + 검정 텍스트</li>
          <li><strong>Hover:</strong> 색상 반전 (invert filter)</li>
          <li><strong>Disabled:</strong> opacity: 0.5</li>
        </ul>

        <h5>② Input</h5>
        <ul>
          <li>1px 검정 테두리</li>
          <li>Focus: 2px 두꺼운 테두리</li>
          <li>Error: 점선 테두리 (border-style: dashed)</li>
        </ul>

        <h5>③ Table</h5>
        <ul>
          <li>헤더: 검정 배경 + 흰색 텍스트</li>
          <li>행: Zebra striping (rgba(0,0,0,0.04))</li>
          <li>호버: 반전 효과</li>
        </ul>

        <h5>④ Modal</h5>
        <ul>
          <li>배경: rgba(0,0,0,0.8) overlay</li>
          <li>컨텐츠: 흰색 박스 + 2px 검정 테두리</li>
          <li>닫기: 우측 상단 X 아이콘</li>
        </ul>

        <h5>⑤ Chart</h5>
        <ul>
          <li>선: 검정 실선 (line-width: 2px)</li>
          <li>영역: 회색 패턴 (hatching)</li>
          <li>축: 검정 hairline</li>
          <li>범례: 텍스트 라벨 only</li>
        </ul>
      </div>

      <h3>3.3 레이아웃 전략</h3>

      <h4>3.3.1 그리드 시스템</h4>
      <p>
        12 컬럼 기반 그리드를 사용하며, 모든 간격은 4px의 배수로 통일하였습니다.
      </p>

      <div class="spacing-scale">
        <h5>Spacing Scale</h5>
        <ul>
          <li><strong>xs:</strong> 4px - 컴포넌트 내부 여백</li>
          <li><strong>sm:</strong> 8px - 관련 요소 간격</li>
          <li><strong>md:</strong> 16px - 섹션 내부 간격</li>
          <li><strong>lg:</strong> 24px - 섹션 간 간격</li>
          <li><strong>xl:</strong> 32px - 페이지 구분</li>
        </ul>
      </div>

      <h4>3.3.2 반응형 레이아웃</h4>
      <table>
        <thead>
          <tr>
            <th>브레이크포인트</th>
            <th>레이아웃</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>&lt; 768px (Mobile)</td>
            <td>1 Column, Stack Navigation</td>
          </tr>
          <tr>
            <td>768px - 1024px (Tablet)</td>
            <td>2 Columns, Collapsible Sidebar</td>
          </tr>
          <tr>
            <td>&gt; 1024px (Desktop)</td>
            <td>3 Columns, Fixed Sidebar</td>
          </tr>
        </tbody>
      </table>

      <h3>3.4 접근성 (WCAG 2.1 AA 준수)</h3>

      <h4>3.4.1 색상 대비</h4>
      <ul>
        <li><strong>텍스트:</strong> 검정 (#000) on 흰색 (#fff) = 21:1 (AAA 등급)</li>
        <li><strong>링크:</strong> Underline 기본 제공</li>
        <li><strong>포커스:</strong> 2px 두꺼운 테두리로 명확히 표시</li>
      </ul>

      <h4>3.4.2 키보드 네비게이션</h4>
      <ul>
        <li>모든 인터랙티브 요소 Tab으로 접근 가능</li>
        <li>Skip to content 링크 제공</li>
        <li>Escape 키로 모달 닫기</li>
      </ul>

      <h4>3.4.3 스크린 리더</h4>
      <ul>
        <li>모든 이미지에 alt 텍스트</li>
        <li>ARIA labels for icon buttons</li>
        <li>Semantic HTML 사용 (&lt;nav&gt;, &lt;main&gt;, &lt;aside&gt;)</li>
      </ul>

      <h3>3.5 역할별 UI 차별화</h3>

      <h4>3.5.1 Admin 전용 기능</h4>
      <ul>
        <li>시스템 설정 페이지 (7개 탭)</li>
        <li>사용자 관리</li>
        <li>승인 최종 결정 버튼</li>
        <li>프로젝트 삭제 권한 (Danger Zone)</li>
      </ul>

      <h4>3.5.2 Developer 뷰</h4>
      <ul>
        <li>빌드 트리거 버튼</li>
        <li>배포 요청 양식</li>
        <li>코드 diff 뷰어</li>
        <li>로그 스트리밍</li>
      </ul>

      <h4>3.5.3 Viewer 뷰</h4>
      <ul>
        <li>읽기 전용 대시보드</li>
        <li>메트릭 조회</li>
        <li>프로젝트 상태 모니터링</li>
        <li>수정 버튼 비활성화</li>
      </ul>
    `
  },
  en: {
    title: 'Chapter 3: UX/UI Design System',
    content: `
      <h3>3.1 Design Philosophy: Extreme Black & White Industrial Design</h3>

      <h4>3.1.1 Core Principles</h4>
      <p>
        A-SW Hub pursues <strong>"extreme restraint and clarity"</strong>.
        All unnecessary visual elements removed, focusing only on information delivery.
      </p>

      <div class="design-principles">
        <h5>5 Design Principles</h5>
        <table>
          <thead>
            <tr>
              <th>Principle</th>
              <th>Description</th>
              <th>Implementation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>① Absolute Monochrome</strong></td>
              <td>Only #000000 and #FFFFFF</td>
              <td>All UI, charts, icons</td>
            </tr>
            <tr>
              <td><strong>② Zero Radius</strong></td>
              <td>No rounded corners</td>
              <td>Buttons, cards, modals, inputs</td>
            </tr>
            <tr>
              <td><strong>③ Hairline Borders</strong></td>
              <td>Thin 1px borders, no shadows</td>
              <td>box-shadow: none</td>
            </tr>
            <tr>
              <td><strong>④ Industrial Typography</strong></td>
              <td>System fonts, uppercase labels</td>
              <td>-apple-system, text-transform: uppercase</td>
            </tr>
            <tr>
              <td><strong>⑤ Maximum Density</strong></td>
              <td>Maximize information density</td>
              <td>Compact spacing, grid layouts</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>3.2 Component System</h3>
      <p>
        Comprehensive library of reusable components following design principles.
      </p>

      <h3>3.3 Layout Strategy</h3>
      <p>
        12-column grid system with 4px baseline spacing scale.
      </p>

      <h3>3.4 Accessibility (WCAG 2.1 AA Compliant)</h3>
      <p>
        21:1 contrast ratio, keyboard navigation, screen reader support.
      </p>

      <h3>3.5 Role-Based UI Differentiation</h3>
      <p>
        Distinct interfaces for Admin, Developer, and Viewer roles.
      </p>
    `
  }
};

export function generateDesignHTML(lang) {
  const content = designContent[lang];

  // Insert screenshots and diagrams
  let htmlContent = content.content;

  // Insert login screenshot after "3.1.3 타이포그래피"
  htmlContent = htmlContent.replace(
    '</table>\n\n      <h3>3.2 컴포넌트 시스템</h3>',
    '</table>\n\n' + getScreenshotHTML('01-login', lang) + '\n\n      <h3>3.2 컴포넌트 시스템</h3>'
  );

  // Insert designSystem diagram after "3.2 컴포넌트 시스템"
  htmlContent = htmlContent.replace(
    '<h3>3.2 컴포넌트 시스템</h3>',
    '<h3>3.2 컴포넌트 시스템</h3>\n\n' + getDiagramHTML('designSystem', lang)
  );

  // Insert dashboard screenshot after "3.2 컴포넌트 시스템"
  htmlContent = htmlContent.replace(
    '</div>\n\n      <h3>3.3 레이아웃 전략</h3>',
    '</div>\n\n' + getScreenshotHTML('02-dashboard', lang) + '\n\n      <h3>3.3 레이아웃 전략</h3>'
  );

  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <title>${content.title}</title>
      <style>${getStyles(lang)}</style>
    </head>
    <body>
      <div class="report-section">
        <h1 class="section-title">${content.title}</h1>
        ${htmlContent}
      </div>
    </body>
    </html>
  `;
}

function getStyles(lang) {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4 portrait; margin: 25mm 25mm 25mm 20mm; }
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
    h5 { font-size: 11pt; font-weight: 600; margin-top: 4mm; margin-bottom: 2mm; }
    p { margin-bottom: 3mm; text-align: justify; }
    ul, ol { margin-left: 6mm; margin-bottom: 3mm; }
    li { margin-bottom: 2mm; }
    table { width: 100%; border-collapse: collapse; margin: 2mm 0; }
    th, td { border: 1px solid #000; padding: 2mm; text-align: left; font-size: 9pt; }
    th { background: #f0f0f0; font-weight: 600; }
    .code-block { background: #f5f5f5; border: 1px solid #ddd; padding: 3mm; font-family: monospace; font-size: 8pt; white-space: pre; }
    strong { font-weight: 600; }
  `;
}
