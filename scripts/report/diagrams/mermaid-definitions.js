/**
 * Mermaid 다이어그램 정의
 * Black & White 테마 적용
 */

export const diagrams = {
  // 1. 시스템 아키텍처 (제2장)
  architecture: `
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#fff','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#000','secondaryColor':'#f5f5f5','tertiaryColor':'#fff'}}}%%
graph TB
    A["Presentation Layer<br/>(SvelteKit Routes, Components)"]
    B["Domain Layer<br/>(Auth, Projects, Builds, Approvals)"]
    C["Service Layer<br/>(BaseService, HTTP Client)"]
    D["Infrastructure Layer<br/>(Error Handling, Logging, Config)"]

    A -->|"Uses"| B
    B -->|"Calls"| C
    C -->|"Depends on"| D

    style A fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style B fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style C fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style D fill:#fff,stroke:#000,stroke-width:2px,color:#000
  `,

  // 2. 참여기관 협업 체계 (제1장)
  collaboration: `
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#000','primaryTextColor':'#fff','primaryBorderColor':'#000','lineColor':'#000','secondaryColor':'#fff','tertiaryColor':'#f5f5f5'}}}%%
graph TD
    HUB["A-SW Hub<br/>통합 협업 플랫폼"]
    K["KITECH<br/>한국생산기술연구원<br/>(주관)"]
    T["TYMICT<br/>통합제어기/안전/HMI"]
    J["JBNU<br/>전북대학교<br/>측위/환경인지"]
    V["VIA<br/>주식회사 비아<br/>플랫폼 개발"]
    O["OntarioTech<br/>경로최적화/협업"]

    HUB -.->|"총괄관리"| K
    HUB -->|"실시간 협업"| T
    HUB -->|"실시간 협업"| J
    HUB -->|"실시간 협업"| V
    HUB -->|"실시간 협업"| O

    K -->|"조정"| T
    K -->|"조정"| J
    K -->|"조정"| V
    K -->|"조정"| O

    style HUB fill:#000,stroke:#000,stroke-width:3px,color:#fff
    style K fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style T fill:#f5f5f5,stroke:#000,stroke-width:1px,color:#000
    style J fill:#f5f5f5,stroke:#000,stroke-width:1px,color:#000
    style V fill:#f5f5f5,stroke:#000,stroke-width:1px,color:#000
    style O fill:#f5f5f5,stroke:#000,stroke-width:1px,color:#000
  `,

  // 3. CI/CD 파이프라인 (제4장)
  cicd: `
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#fff','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#000'}}}%%
graph LR
    A["Git Push"]
    B["Build<br/>(Lint, Compile)"]
    C["Test<br/>(Unit, Integration)"]
    D["Package<br/>(Bundle)"]
    E["Deploy<br/>(Staging)"]
    F["Verify<br/>(Health Check)"]
    G["Production"]

    A -->|"Trigger"| B
    B -->|"Success"| C
    C -->|"Pass"| D
    D -->|"Ready"| E
    E -->|"OK"| F
    F -->|"Approve"| G

    B -.->|"Fail"| X["Notify<br/>Developer"]
    C -.->|"Fail"| X
    F -.->|"Fail"| Y["Rollback"]

    style A fill:#f5f5f5,stroke:#000,stroke-width:1px,color:#000
    style B fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style C fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style D fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style E fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style F fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style G fill:#000,stroke:#000,stroke-width:2px,color:#fff
    style X fill:#fff,stroke:#000,stroke-width:1px,stroke-dasharray: 5 5,color:#000
    style Y fill:#fff,stroke:#000,stroke-width:1px,stroke-dasharray: 5 5,color:#000
  `,

  // 4. 도메인 모델 관계 (제2장)
  domain: `
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#fff','primaryTextColor':'#000','primaryBorderColor':'#000'}}}%%
erDiagram
    USER ||--o{ PROJECT : owns
    USER ||--o{ BUILD : triggers
    PROJECT ||--o{ BUILD : has
    PROJECT ||--o{ DEPLOYMENT : contains
    BUILD ||--o{ DEPLOYMENT : creates
    DEPLOYMENT ||--o{ APPROVAL : requires
    USER ||--o{ APPROVAL : approves

    USER {
        string id PK
        string email
        string name
        string role
    }
    PROJECT {
        string id PK
        string name
        string repository
        string status
        string ownerId FK
    }
    BUILD {
        string id PK
        string projectId FK
        string status
        datetime startedAt
    }
    DEPLOYMENT {
        string id PK
        string buildId FK
        string environment
        string status
    }
    APPROVAL {
        string id PK
        string deploymentId FK
        string approverId FK
        string status
    }
  `,

  // 5. 역할별 권한 (제2장) - CSS로 구현할 예정
  // permissions: 'TABLE',

  // 6. 5개년 타임라인 (제1장)
  timeline: `
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#fff','primaryTextColor':'#000','primaryBorderColor':'#000'}}}%%
gantt
    title 5개년 사업 계획
    dateFormat YYYY-MM
    axisFormat %Y-%m

    section 1단계
    1차년도 (2025.09-12)    :2025-09, 4M
    2차년도 (2026.01-12)    :2026-01, 12M
    3차년도 (2027.01-12)    :2027-01, 12M

    section 2단계
    1차년도 (2028.01-12)    :2028-01, 12M
    2차년도 (2029.01-12)    :2029-01, 12M

    section 본 용역
    A-SW Hub 구축          :crit, 2025-09, 2M
  `,

  // 7. 디자인 시스템 계층 (제3장)
  designSystem: `
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#fff','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#000'}}}%%
graph TD
    A["Design Tokens<br/>(Colors, Spacing, Typography)"]
    B1["Atoms<br/>(Button, Input, Label)"]
    B2["Atoms<br/>(Icon, Link)"]
    C1["Molecules<br/>(Form Field, Search Box)"]
    C2["Molecules<br/>(Card, Menu Item)"]
    D1["Organisms<br/>(Navigation, Header)"]
    D2["Organisms<br/>(Table, Modal)"]
    E["Templates<br/>(Page Layouts)"]
    F["Pages<br/>(Dashboard, Projects)"]

    A --> B1
    A --> B2
    B1 --> C1
    B2 --> C2
    C1 --> D1
    C2 --> D2
    D1 --> E
    D2 --> E
    E --> F

    style A fill:#000,stroke:#000,stroke-width:2px,color:#fff
    style B1 fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style B2 fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style C1 fill:#f5f5f5,stroke:#000,stroke-width:2px,color:#000
    style C2 fill:#f5f5f5,stroke:#000,stroke-width:2px,color:#000
    style D1 fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style D2 fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style E fill:#f5f5f5,stroke:#000,stroke-width:2px,color:#000
    style F fill:#000,stroke:#000,stroke-width:2px,color:#fff
  `
};

// 다이어그램 메타데이터
export const diagramMeta = {
  architecture: {
    title: '시스템 아키텍처',
    titleEn: 'System Architecture',
    section: 2,
    description: 'Domain-Driven Design 기반 계층형 아키텍처'
  },
  collaboration: {
    title: '참여기관 협업 체계',
    titleEn: 'Institutional Collaboration Structure',
    section: 1,
    description: 'A-SW Hub를 중심으로 한 5개 기관 실시간 협업'
  },
  cicd: {
    title: 'CI/CD 파이프라인',
    titleEn: 'CI/CD Pipeline',
    section: 4,
    description: 'Git Push부터 Production 배포까지 자동화'
  },
  domain: {
    title: '도메인 모델 관계도',
    titleEn: 'Domain Model Relationships',
    section: 2,
    description: '주요 엔티티 간 관계 (ER Diagram)'
  },
  timeline: {
    title: '5개년 사업 계획',
    titleEn: '5-Year Project Timeline',
    section: 1,
    description: '1단계 3년 + 2단계 2년 일정'
  },
  designSystem: {
    title: '디자인 시스템 계층 구조',
    titleEn: 'Design System Hierarchy',
    section: 3,
    description: 'Atomic Design 기반 컴포넌트 구조'
  }
};
