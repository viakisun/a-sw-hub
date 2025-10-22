/**
 * A-SW 통합 계획 산출물 실제 데이터
 * 1단계 3개년 + 2단계 2개년
 */

import type { Deliverable } from '$lib/types/businessPlan';

export const deliverables: Deliverable[] = [
  // ============================================
  // 1단계 1차년도 (요구·분석·아키텍처 정립)
  // ============================================

  // KITECH - 농작업 분석·모듈화
  {
    id: 'DOC-01-01',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'KITECH',
    year: 1,
    phase: 1,
    name: '농작업 분석 보고서 v1.0',
    nameEn: 'Agricultural Task Analysis Report v1.0',
    type: 'DOC',
    status: 'completed',
    description: '무인자율 농작업 분석 및 A-SW 모듈화 파라미터 정립. 작물/작업별 단계 구조화(예: 양파), 자율작업 시퀀스 초안',
    startDate: new Date('2024-01-01'),
    targetDate: new Date('2024-06-30'),
    completedDate: new Date('2024-06-28'),
    progress: 100,
    version: '1.0',
    kpi: [
      { metric: '대표 작업 종류', target: '5종 이상', current: '7종', status: 'achieved' },
      { metric: '파라미터 누락', target: '0건', current: '0건', status: 'achieved' },
      { metric: '상호리뷰 통과', target: '100%', current: '100%', status: 'achieved' }
    ],
    dependencies: [],
    documentation: '/docs/DOC-01-01_Agricultural_Analysis_v1.0.pdf'
  },
  {
    id: 'DATA-01-01',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'KITECH',
    year: 1,
    phase: 1,
    name: '작업 시퀀스 사전 v1.0',
    nameEn: 'Task Sequence Dictionary v1.0',
    type: 'DATA',
    status: 'completed',
    description: '농작업별 시퀀스 정의, 제어입력/센서/조건 식별, 제어 파라미터 정의',
    startDate: new Date('2024-02-01'),
    targetDate: new Date('2024-08-31'),
    completedDate: new Date('2024-08-25'),
    progress: 100,
    version: '1.0',
    kpi: [
      { metric: '시퀀스 정의', target: '50개', current: '62개', status: 'achieved' },
      { metric: '파라미터 커버리지', target: '100%', current: '100%', status: 'achieved' }
    ],
    dependencies: ['DOC-01-01'],
    repository: 'github.com/asw-hub/task-sequence-dictionary'
  },
  {
    id: 'INT-01-01',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'KITECH',
    year: 1,
    phase: 1,
    name: '작업 모듈 I/F v1.0',
    nameEn: 'Task Module Interface v1.0',
    type: 'INT',
    status: 'completed',
    description: '작업 모듈 인터페이스 정의(입·출력, 단위, 타이밍)',
    startDate: new Date('2024-03-01'),
    targetDate: new Date('2024-10-31'),
    completedDate: new Date('2024-10-20'),
    progress: 100,
    version: '1.0',
    kpi: [
      { metric: '인터페이스 정의', target: '100%', current: '100%', status: 'achieved' },
      { metric: 'VIA 스키마 정합성', target: '검토완료', current: '검토완료', status: 'achieved' }
    ],
    dependencies: ['DATA-01-01', 'INT-01-31'],
    repository: 'github.com/asw-hub/task-module-interface'
  },

  // TYMICT - 요구사항·시스템 아키텍처
  {
    id: 'DOC-01-11',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'TYMICT',
    year: 1,
    phase: 1,
    name: '요구사항 명세서 v1.0',
    nameEn: 'Requirements Specification v1.0',
    type: 'DOC',
    status: 'completed',
    description: '현장 요구 반영 시스템 요구사항 분석서',
    startDate: new Date('2024-01-01'),
    targetDate: new Date('2024-04-30'),
    completedDate: new Date('2024-04-25'),
    progress: 100,
    version: '1.0',
    kpi: [
      { metric: '요구→시험 추적성', target: '100%', current: '100%', status: 'achieved' },
      { metric: '기술위원회 승인', target: '2회', current: '2회', status: 'achieved' }
    ],
    dependencies: [],
    documentation: '/docs/DOC-01-11_Requirements_v1.0.pdf'
  },
  {
    id: 'DOC-01-12',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'TYMICT',
    year: 1,
    phase: 1,
    name: '시스템 아키텍처 설계서 v1.0',
    nameEn: 'System Architecture Design v1.0',
    type: 'DOC',
    status: 'completed',
    description: 'HW 아키텍처, 시스템 사양 검토, 리스크 평가',
    startDate: new Date('2024-03-01'),
    targetDate: new Date('2024-09-30'),
    completedDate: new Date('2024-09-15'),
    progress: 100,
    version: '1.0',
    kpi: [
      { metric: '아키텍처 완성도', target: '100%', current: '100%', status: 'achieved' },
      { metric: '리스크 식별', target: '전체', current: '전체', status: 'achieved' }
    ],
    dependencies: ['DOC-01-11', 'DOC-01-01', 'SYS-01-31'],
    documentation: '/docs/DOC-01-12_System_Architecture_v1.0.pdf'
  },

  // VIA - A-SW 서비스 플랫폼 아키텍처
  {
    id: 'SYS-01-31',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 1,
    phase: 1,
    name: '플랫폼 아키텍처 백서 v1.0',
    nameEn: 'Platform Architecture Whitepaper v1.0',
    type: 'SYS',
    status: 'completed',
    description: '개방형 A-SW 공유환경 MSA·보안·저장소·CI/CD 설계',
    startDate: new Date('2024-02-01'),
    targetDate: new Date('2024-08-31'),
    completedDate: new Date('2024-08-20'),
    progress: 100,
    version: '1.0',
    kpi: [
      { metric: '위협모델링', target: '통과', current: '통과', status: 'achieved' },
      { metric: '핵심 도메인 정의', target: '100%', current: '100%', status: 'achieved' },
      { metric: '스키마 정의', target: '100%', current: '100%', status: 'achieved' }
    ],
    dependencies: [],
    documentation: '/docs/SYS-01-31_Platform_Architecture_v1.0.pdf'
  },
  {
    id: 'INT-01-31',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 1,
    phase: 1,
    name: '인증/권한/토큰 스펙 v1.0',
    nameEn: 'Auth/Permission/Token Specification v1.0',
    type: 'INT',
    status: 'completed',
    description: 'OAuth2/OIDC·RBAC 기반 인증 체계',
    startDate: new Date('2024-03-01'),
    targetDate: new Date('2024-09-30'),
    completedDate: new Date('2024-09-10'),
    progress: 100,
    version: '1.0',
    kpi: [
      { metric: '보안 요구사항', target: '100%', current: '100%', status: 'achieved' },
      { metric: 'RBAC 모델 정의', target: '완료', current: '완료', status: 'achieved' }
    ],
    dependencies: ['SYS-01-31'],
    repository: 'github.com/asw-hub/auth-spec'
  },
  {
    id: 'OPS-01-31',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 1,
    phase: 1,
    name: 'CI/CD 설계 문서 v1.0',
    nameEn: 'CI/CD Design Document v1.0',
    type: 'OPS',
    status: 'completed',
    description: 'Git 기반 워크플로우, 자동화 파이프라인 설계',
    startDate: new Date('2024-04-01'),
    targetDate: new Date('2024-11-30'),
    completedDate: new Date('2024-11-15'),
    progress: 100,
    version: '1.0',
    kpi: [
      { metric: '파이프라인 설계', target: '완료', current: '완료', status: 'achieved' },
      { metric: '워크플로우 정의', target: '100%', current: '100%', status: 'achieved' }
    ],
    dependencies: ['SYS-01-31'],
    documentation: '/docs/OPS-01-31_CICD_Design_v1.0.pdf'
  },

  // ============================================
  // 1단계 2차년도 (알고리즘·HW 구현, 플랫폼 기능화)
  // ============================================

  // KITECH - 경로 생성/추종/속도 제어 + 통신표준 식별
  {
    id: 'SYS-02-01',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'KITECH',
    year: 2,
    phase: 1,
    name: '경로생성 모듈 v1.0',
    nameEn: 'Path Generation Module v1.0',
    type: 'SYS',
    status: 'in_progress',
    description: '작업폭/간격 기반 경로 생성 알고리즘',
    startDate: new Date('2025-01-01'),
    targetDate: new Date('2025-05-31'),
    progress: 75,
    version: '1.0-beta',
    kpi: [
      { metric: '경로 오차 p95', target: '≤ 10 cm', current: '8 cm', status: 'in_progress' },
      { metric: '생성 시간', target: '< 1s', current: '0.8s', status: 'achieved' }
    ],
    dependencies: ['INT-01-01', 'SYS-02-21'],
    repository: 'github.com/asw-hub/path-generation'
  },
  {
    id: 'SYS-02-02',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'KITECH',
    year: 2,
    phase: 1,
    name: '경로추종 모듈 v1.0',
    nameEn: 'Path Following Module v1.0',
    type: 'SYS',
    status: 'in_progress',
    description: '실시간 경로 추종 제어 알고리즘',
    startDate: new Date('2025-03-01'),
    targetDate: new Date('2025-07-31'),
    progress: 60,
    version: '0.9',
    kpi: [
      { metric: '추종 지연 p95', target: '≤ 100 ms', current: '95 ms', status: 'in_progress' },
      { metric: '추종 정확도', target: '≥ 95%', current: '93%', status: 'in_progress' }
    ],
    dependencies: ['SYS-02-01', 'SYS-02-11'],
    repository: 'github.com/asw-hub/path-following'
  },
  {
    id: 'SYS-02-03',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'KITECH',
    year: 2,
    phase: 1,
    name: '속도제어 모듈 v1.0',
    nameEn: 'Speed Control Module v1.0',
    type: 'SYS',
    status: 'in_progress',
    description: '작업 최적 속도 제어 알고리즘',
    startDate: new Date('2025-04-01'),
    targetDate: new Date('2025-08-31'),
    progress: 50,
    version: '0.8',
    kpi: [
      { metric: '속도 제어 정밀도', target: '≤ 0.1 km/h', current: '0.12 km/h', status: 'in_progress' },
      { metric: '응답시간', target: '< 50 ms', current: '45 ms', status: 'achieved' }
    ],
    dependencies: ['SYS-02-02'],
    repository: 'github.com/asw-hub/speed-control'
  },
  {
    id: 'DOC-02-01',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'KITECH',
    year: 2,
    phase: 1,
    name: '통신표준 식별 보고서 v1.0',
    nameEn: 'Communication Standard Identification Report v1.0',
    type: 'DOC',
    status: 'in_progress',
    description: 'ISOBUS 연관성(Part7/10/14) 식별 및 표준 매핑',
    startDate: new Date('2025-06-01'),
    targetDate: new Date('2025-11-30'),
    progress: 30,
    version: '0.5',
    kpi: [
      { metric: '표준 매핑 누락', target: '0건', current: '분석중', status: 'in_progress' }
    ],
    dependencies: ['DOC-01-01'],
    documentation: '/docs/DOC-02-01_Communication_Standards_v0.5.pdf'
  },

  // TYMICT - 통합제어기/인터페이스/안전·RTOS/HMI
  {
    id: 'SYS-02-11',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'TYMICT',
    year: 2,
    phase: 1,
    name: '통합제어기(ICU) HW v1.0',
    nameEn: 'Integrated Control Unit Hardware v1.0',
    type: 'SYS',
    status: 'in_progress',
    description: 'ICU 하드웨어 플랫폼 개발',
    startDate: new Date('2025-01-01'),
    targetDate: new Date('2025-06-30'),
    progress: 65,
    version: '0.9',
    kpi: [
      { metric: '센서 동시처리', target: '4종 ≤ 20 ms', current: '18 ms', status: 'in_progress' },
      { metric: '신뢰성', target: 'MTBF ≥ 2000h', current: '테스트중', status: 'in_progress' }
    ],
    dependencies: ['DOC-01-12'],
    documentation: '/docs/SYS-02-11_ICU_Hardware_Spec_v0.9.pdf'
  },
  {
    id: 'SYS-02-12',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'TYMICT',
    year: 2,
    phase: 1,
    name: '인터페이스 보드 v1.0',
    nameEn: 'Interface Board v1.0',
    type: 'SYS',
    status: 'in_progress',
    description: '다중 센서/액추에이터 인터페이스 보드',
    startDate: new Date('2025-02-01'),
    targetDate: new Date('2025-07-31'),
    progress: 55,
    version: '0.8',
    kpi: [
      { metric: '인터페이스 수', target: '≥ 8', current: '8', status: 'achieved' },
      { metric: '통신 지연', target: '< 5 ms', current: '4.5 ms', status: 'achieved' }
    ],
    dependencies: ['SYS-02-11'],
    documentation: '/docs/SYS-02-12_Interface_Board_v0.8.pdf'
  },
  {
    id: 'OPS-02-11',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'TYMICT',
    year: 2,
    phase: 1,
    name: '안전/RTOS 프로파일 v1.0',
    nameEn: 'Safety/RTOS Profile v1.0',
    type: 'OPS',
    status: 'in_progress',
    description: '실시간 운영체제 및 안전 시스템 프로파일',
    startDate: new Date('2025-03-01'),
    targetDate: new Date('2025-08-31'),
    progress: 45,
    version: '0.7',
    kpi: [
      { metric: 'E-Stop 응답', target: '≤ 100 ms', current: '85 ms', status: 'in_progress' },
      { metric: '안전 기능 검증', target: '100%', current: '80%', status: 'in_progress' }
    ],
    dependencies: ['SYS-02-11', 'SYS-02-12'],
    documentation: '/docs/OPS-02-11_Safety_RTOS_v0.7.pdf'
  },
  {
    id: 'UI-02-11',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'TYMICT',
    year: 2,
    phase: 1,
    name: 'HMI 시스템 v1.0',
    nameEn: 'HMI System v1.0',
    type: 'UI',
    status: 'in_progress',
    description: '농업용 특화 HMI 인터페이스',
    startDate: new Date('2025-04-01'),
    targetDate: new Date('2025-09-30'),
    progress: 40,
    version: '0.6',
    kpi: [
      { metric: 'HMI 왕복시간', target: '≤ 50 ms', current: '55 ms', status: 'in_progress' },
      { metric: '사용성 테스트', target: '≥ 4.0/5.0', current: '테스트 예정', status: 'not_started' }
    ],
    dependencies: ['SYS-02-11', 'OPS-02-11'],
    repository: 'github.com/asw-hub/hmi-system'
  },
  {
    id: 'DOC-02-11',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'TYMICT',
    year: 2,
    phase: 1,
    name: '통합 시험 보고서 v1.0',
    nameEn: 'Integration Test Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '하드웨어 및 소프트웨어 통합 시험 결과',
    startDate: new Date('2025-10-01'),
    targetDate: new Date('2025-12-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '시험 항목 커버리지', target: '100%', current: '0%', status: 'not_started' }
    ],
    dependencies: ['SYS-02-11', 'SYS-02-12', 'OPS-02-11', 'UI-02-11'],
    documentation: ''
  },

  // JBN - 측위·환경인지·공간정보 + 학습 DB
  {
    id: 'SYS-02-21',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'JBN',
    year: 2,
    phase: 1,
    name: '측위 모듈 v1.0',
    nameEn: 'Positioning Module v1.0',
    type: 'SYS',
    status: 'in_progress',
    description: '고정밀 측위 알고리즘 모듈',
    startDate: new Date('2025-01-01'),
    targetDate: new Date('2025-05-31'),
    progress: 70,
    version: '0.9',
    kpi: [
      { metric: '위치 RMSE', target: '≤ 0.2 m', current: '0.18 m', status: 'in_progress' },
      { metric: '수렴 시간', target: '< 30s', current: '25s', status: 'achieved' }
    ],
    dependencies: [],
    repository: 'github.com/asw-hub/positioning-module'
  },
  {
    id: 'SYS-02-22',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'JBN',
    year: 2,
    phase: 1,
    name: '환경인지 모듈 v1.0',
    nameEn: 'Environment Perception Module v1.0',
    type: 'SYS',
    status: 'in_progress',
    description: '농업 환경 인지 및 장애물 검출',
    startDate: new Date('2025-02-01'),
    targetDate: new Date('2025-07-31'),
    progress: 55,
    version: '0.8',
    kpi: [
      { metric: '인지 mIoU', target: '≥ 0.65', current: '0.62', status: 'in_progress' },
      { metric: '처리 FPS', target: '≥ 30', current: '28', status: 'in_progress' }
    ],
    dependencies: ['DATA-02-21'],
    repository: 'github.com/asw-hub/perception-module'
  },
  {
    id: 'DATA-02-21',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'JBN',
    year: 2,
    phase: 1,
    name: '학습 DB v1.0',
    nameEn: 'Training Database v1.0',
    type: 'DATA',
    status: 'in_progress',
    description: '환경인지 학습용 데이터베이스(스키마/라벨 가이드)',
    startDate: new Date('2025-01-01'),
    targetDate: new Date('2025-06-30'),
    progress: 60,
    version: '0.8',
    kpi: [
      { metric: '데이터 수집량', target: '≥ 100GB', current: '65GB', status: 'in_progress' },
      { metric: '라벨링 정확도', target: '≥ 95%', current: '94%', status: 'in_progress' }
    ],
    dependencies: [],
    repository: 'github.com/asw-hub/training-database'
  },
  {
    id: 'DOC-02-21',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'JBN',
    year: 2,
    phase: 1,
    name: '알고리즘 보고서 v1.0',
    nameEn: 'Algorithm Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '측위 및 환경인지 알고리즘 상세 설명서',
    startDate: new Date('2025-08-01'),
    targetDate: new Date('2025-11-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '알고리즘 문서화', target: '100%', current: '0%', status: 'not_started' }
    ],
    dependencies: ['SYS-02-21', 'SYS-02-22'],
    documentation: ''
  },

  // VIA - 온보딩/인증/등록·승인/Repo/검색·탐색
  {
    id: 'UI-02-31',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 2,
    phase: 1,
    name: '온보딩 포털 v1.0',
    nameEn: 'Onboarding Portal v1.0',
    type: 'UI',
    status: 'in_progress',
    description: '개발자 온보딩 및 가이드 포털',
    startDate: new Date('2025-01-01'),
    targetDate: new Date('2025-04-30'),
    progress: 80,
    version: '0.9',
    kpi: [
      { metric: '온보딩 완료율', target: '≥ 80%', current: '75%', status: 'in_progress' },
      { metric: '평균 완료시간', target: '< 30분', current: '35분', status: 'in_progress' }
    ],
    dependencies: ['INT-01-31'],
    repository: 'github.com/asw-hub/onboarding-portal'
  },
  {
    id: 'INT-02-31',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 2,
    phase: 1,
    name: '인증/권한 API v1.0',
    nameEn: 'Auth/Permission API v1.0',
    type: 'INT',
    status: 'in_progress',
    description: 'OAuth2/OIDC 기반 인증 API 구현',
    startDate: new Date('2025-02-01'),
    targetDate: new Date('2025-05-31'),
    progress: 75,
    version: '0.9',
    kpi: [
      { metric: 'API 응답시간 p95', target: '< 100ms', current: '85ms', status: 'achieved' },
      { metric: '보안 감사 통과', target: '100%', current: '진행중', status: 'in_progress' }
    ],
    dependencies: ['INT-01-31'],
    repository: 'github.com/asw-hub/auth-api'
  },
  {
    id: 'SYS-02-31',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 2,
    phase: 1,
    name: '등록/승인 서비스 v1.0',
    nameEn: 'Registration/Approval Service v1.0',
    type: 'SYS',
    status: 'in_progress',
    description: 'A-SW 등록 및 승인 워크플로우 서비스',
    startDate: new Date('2025-03-01'),
    targetDate: new Date('2025-07-31'),
    progress: 60,
    version: '0.8',
    kpi: [
      { metric: '등록→승인 시간', target: 'p50 ≤ 2영업일', current: '2.5일', status: 'in_progress' },
      { metric: '자동 검증률', target: '≥ 80%', current: '75%', status: 'in_progress' }
    ],
    dependencies: ['INT-02-31'],
    repository: 'github.com/asw-hub/registration-service'
  },
  {
    id: 'SYS-02-32',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 2,
    phase: 1,
    name: 'Repo 서비스 v1.0',
    nameEn: 'Repository Service v1.0',
    type: 'SYS',
    status: 'in_progress',
    description: 'Git 기반 A-SW 저장소 서비스',
    startDate: new Date('2025-04-01'),
    targetDate: new Date('2025-08-31'),
    progress: 50,
    version: '0.7',
    kpi: [
      { metric: '가용성', target: '≥ 99.5%', current: '99.3%', status: 'in_progress' },
      { metric: '동시 접속', target: '≥ 1000', current: '800', status: 'in_progress' }
    ],
    dependencies: ['SYS-02-31'],
    repository: 'github.com/asw-hub/repository-service'
  },
  {
    id: 'UI-02-32',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 2,
    phase: 1,
    name: '검색/탐색 UI v1.0',
    nameEn: 'Search/Discovery UI v1.0',
    type: 'UI',
    status: 'in_progress',
    description: 'A-SW 검색 및 탐색 인터페이스',
    startDate: new Date('2025-05-01'),
    targetDate: new Date('2025-09-30'),
    progress: 35,
    version: '0.6',
    kpi: [
      { metric: '검색 정확도', target: '≥ 90%', current: '테스트중', status: 'in_progress' },
      { metric: '응답시간', target: '< 500ms', current: '테스트중', status: 'in_progress' }
    ],
    dependencies: ['SYS-02-32'],
    repository: 'github.com/asw-hub/search-ui'
  },

  // OntarioTech - 경로 최적화·할당
  {
    id: 'SYS-02-41',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'OntarioTech',
    year: 2,
    phase: 1,
    name: '경로 최적화 엔진 v1.0',
    nameEn: 'Path Optimization Engine v1.0',
    type: 'SYS',
    status: 'in_progress',
    description: '다중 농기계 경로 최적화 알고리즘',
    startDate: new Date('2025-02-01'),
    targetDate: new Date('2025-07-31'),
    progress: 65,
    version: '0.8',
    kpi: [
      { metric: '커버리지', target: '100%', current: '98%', status: 'in_progress' },
      { metric: '중복주행', target: '≤ 3%', current: '3.5%', status: 'in_progress' },
      { metric: '총주행거리 감소', target: '−10%', current: '−8%', status: 'in_progress' }
    ],
    dependencies: ['SYS-02-01'],
    repository: 'github.com/asw-hub/path-optimization'
  },
  {
    id: 'SYS-02-42',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'OntarioTech',
    year: 2,
    phase: 1,
    name: '작업 할당 스케줄러 v1.0',
    nameEn: 'Task Allocation Scheduler v1.0',
    type: 'SYS',
    status: 'in_progress',
    description: '다중 장비 작업 할당 및 스케줄링',
    startDate: new Date('2025-04-01'),
    targetDate: new Date('2025-09-30'),
    progress: 45,
    version: '0.7',
    kpi: [
      { metric: '할당 최적성', target: '≥ 95%', current: '92%', status: 'in_progress' },
      { metric: '계산 시간', target: '< 5s', current: '6s', status: 'in_progress' }
    ],
    dependencies: ['SYS-02-41'],
    repository: 'github.com/asw-hub/task-scheduler'
  },
  {
    id: 'DOC-02-41',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'OntarioTech',
    year: 2,
    phase: 1,
    name: '실험·성능 보고서 v1.0',
    nameEn: 'Experiment & Performance Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '경로 최적화 및 할당 알고리즘 성능 분석',
    startDate: new Date('2025-10-01'),
    targetDate: new Date('2025-12-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '실험 완료', target: '100%', current: '0%', status: 'not_started' }
    ],
    dependencies: ['SYS-02-41', 'SYS-02-42'],
    documentation: ''
  },

  // ============================================
  // 1단계 3차년도 (작업기 제어/모니터링, MIL, 협업·플랫폼 고도화)
  // ============================================

  // KITECH - 작업기 제어/모니터링 + MIL + TC 개선안
  {
    id: 'SYS-03-01',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'KITECH',
    year: 3,
    phase: 1,
    name: '작업기 제어 모듈 v2.0',
    nameEn: 'Implement Control Module v2.0',
    type: 'SYS',
    status: 'planned',
    description: '농작업기 정밀 제어 모듈',
    startDate: new Date('2026-01-01'),
    targetDate: new Date('2026-05-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '깊이 오차 p95', target: '≤ 5 mm', current: '-', status: 'not_started' },
      { metric: '응답시간', target: '< 30 ms', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-01', 'SYS-02-02', 'SYS-02-03'],
    repository: ''
  },
  {
    id: 'SYS-03-02',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'KITECH',
    year: 3,
    phase: 1,
    name: '작업 모니터링 모듈 v2.0',
    nameEn: 'Work Monitoring Module v2.0',
    type: 'SYS',
    status: 'planned',
    description: '실시간 작업 상태 모니터링',
    startDate: new Date('2026-03-01'),
    targetDate: new Date('2026-07-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '이상감지 재현율', target: '≥ 0.9', current: '-', status: 'not_started' },
      { metric: '오탐률', target: '< 5%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-01'],
    repository: ''
  },
  {
    id: 'SYS-03-03',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'KITECH',
    year: 3,
    phase: 1,
    name: 'MIL 시뮬레이터 환경 v1.0',
    nameEn: 'MIL Simulator Environment v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'Model-in-the-Loop 시뮬레이션 환경',
    startDate: new Date('2026-04-01'),
    targetDate: new Date('2026-09-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: 'MIL 시나리오', target: '20개 E2E 통과', current: '-', status: 'not_started' },
      { metric: '시뮬레이션 정확도', target: '≥ 95%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-01', 'SYS-03-02'],
    repository: ''
  },
  {
    id: 'DOC-03-01',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'KITECH',
    year: 3,
    phase: 1,
    name: 'TC(Part10) 개선 제안서 v1.0',
    nameEn: 'TC(Part10) Improvement Proposal v1.0',
    type: 'DOC',
    status: 'planned',
    description: 'ISOBUS Task Controller 표준 개선 제안',
    startDate: new Date('2026-08-01'),
    targetDate: new Date('2026-11-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '표준 제안 완성도', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['DOC-02-01'],
    documentation: ''
  },

  // TYMICT - ICU Rev.2 + 다중 I/F 융합 + AI 미들웨어 + HMI 통합
  {
    id: 'SYS-03-11',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'TYMICT',
    year: 3,
    phase: 1,
    name: 'ICU Rev.2 하드웨어 v2.0',
    nameEn: 'ICU Rev.2 Hardware v2.0',
    type: 'SYS',
    status: 'planned',
    description: '2세대 통합제어기 하드웨어',
    startDate: new Date('2026-01-01'),
    targetDate: new Date('2026-05-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '처리성능', target: '2x 향상', current: '-', status: 'not_started' },
      { metric: 'MTBF', target: '≥ 3000h', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-11'],
    documentation: ''
  },
  {
    id: 'SYS-03-12',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'TYMICT',
    year: 3,
    phase: 1,
    name: 'AI 미들웨어/융합 엔진 v1.0',
    nameEn: 'AI Middleware/Fusion Engine v1.0',
    type: 'SYS',
    status: 'planned',
    description: '멀티모달 AI 융합 미들웨어',
    startDate: new Date('2026-03-01'),
    targetDate: new Date('2026-07-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '멀티모델 동시추론', target: 'FPS ≥ 15', current: '-', status: 'not_started' },
      { metric: '융합 지연', target: '≤ 10 ms', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-11'],
    repository: ''
  },
  {
    id: 'UI-03-11',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'TYMICT',
    year: 3,
    phase: 1,
    name: 'HMI 통합 표시 v2.0',
    nameEn: 'HMI Integrated Display v2.0',
    type: 'UI',
    status: 'planned',
    description: '통합 HMI 대시보드 시스템',
    startDate: new Date('2026-04-01'),
    targetDate: new Date('2026-08-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: 'UI 응답시간', target: '< 100ms', current: '-', status: 'not_started' },
      { metric: 'OTA 실패율', target: '≤ 2%', current: '-', status: 'not_started' }
    ],
    dependencies: ['UI-02-11', 'SYS-03-12'],
    repository: ''
  },
  {
    id: 'DOC-03-11',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'TYMICT',
    year: 3,
    phase: 1,
    name: '통합 검증 리포트 v2.0',
    nameEn: 'Integration Verification Report v2.0',
    type: 'DOC',
    status: 'planned',
    description: '2차 통합 시스템 검증 보고서',
    startDate: new Date('2026-09-01'),
    targetDate: new Date('2026-12-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '검증 완료율', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-11', 'SYS-03-12', 'UI-03-11'],
    documentation: ''
  },

  // JBN - 측위/인지/공간정보 고도화(경량화·강화학습)
  {
    id: 'SYS-03-21',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'JBN',
    year: 3,
    phase: 1,
    name: '측위 고도화 v2.0',
    nameEn: 'Enhanced Positioning v2.0',
    type: 'SYS',
    status: 'planned',
    description: '강화학습 기반 측위 알고리즘 고도화',
    startDate: new Date('2026-01-01'),
    targetDate: new Date('2026-05-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '위치 RMSE', target: '≤ 0.15 m', current: '-', status: 'not_started' },
      { metric: '모델 크기', target: '−30%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-21'],
    repository: ''
  },
  {
    id: 'SYS-03-22',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'JBN',
    year: 3,
    phase: 1,
    name: '인지 고도화 v2.0',
    nameEn: 'Enhanced Perception v2.0',
    type: 'SYS',
    status: 'planned',
    description: '경량화된 고성능 인지 알고리즘',
    startDate: new Date('2026-03-01'),
    targetDate: new Date('2026-07-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: 'mIoU', target: '≥ 0.72', current: '-', status: 'not_started' },
      { metric: '처리속도', target: '2x 향상', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-22'],
    repository: ''
  },
  {
    id: 'DATA-03-21',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'JBN',
    year: 3,
    phase: 1,
    name: '공간정보 학습셋 v2.0',
    nameEn: 'Spatial Info Training Set v2.0',
    type: 'DATA',
    status: 'planned',
    description: '확장된 공간정보 학습 데이터셋',
    startDate: new Date('2026-02-01'),
    targetDate: new Date('2026-06-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '데이터 규모', target: '≥ 200GB', current: '-', status: 'not_started' },
      { metric: '다양성 지수', target: '≥ 0.8', current: '-', status: 'not_started' }
    ],
    dependencies: ['DATA-02-21'],
    repository: ''
  },
  {
    id: 'DOC-03-21',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'JBN',
    year: 3,
    phase: 1,
    name: '강화학습/경량화 보고서 v1.0',
    nameEn: 'RL/Lightweight Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '강화학습 및 모델 경량화 기술 보고서',
    startDate: new Date('2026-08-01'),
    targetDate: new Date('2026-11-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '기술 문서화', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-21', 'SYS-03-22'],
    documentation: ''
  },

  // VIA - Git 협업 고도화(Fork/PR/병합) + 프로젝트 대시보드
  {
    id: 'SYS-03-31',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 3,
    phase: 1,
    name: '협업 워크플로우 v2.0',
    nameEn: 'Collaboration Workflow v2.0',
    type: 'SYS',
    status: 'planned',
    description: 'Git 기반 Fork/PR/Merge 협업 시스템',
    startDate: new Date('2026-01-01'),
    targetDate: new Date('2026-05-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: 'PR→Merge 시간', target: 'p50 ≤ 3일', current: '-', status: 'not_started' },
      { metric: '롤백률', target: '≤ 1%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-32'],
    repository: ''
  },
  {
    id: 'UI-03-31',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 3,
    phase: 1,
    name: '프로젝트 보드·Wiki·Issues·Milestones v1.0',
    nameEn: 'Project Board·Wiki·Issues·Milestones v1.0',
    type: 'UI',
    status: 'planned',
    description: '프로젝트 관리 대시보드 및 협업 도구',
    startDate: new Date('2026-03-01'),
    targetDate: new Date('2026-07-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '기능 완성도', target: '100%', current: '-', status: 'not_started' },
      { metric: '사용성 점수', target: '≥ 4.5/5', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-31'],
    repository: ''
  },
  {
    id: 'OPS-03-31',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 3,
    phase: 1,
    name: '활동 로그·감사 대시보드 v1.0',
    nameEn: 'Activity Log·Audit Dashboard v1.0',
    type: 'OPS',
    status: 'planned',
    description: '시스템 활동 로깅 및 감사 대시보드',
    startDate: new Date('2026-05-01'),
    targetDate: new Date('2026-09-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: 'MTTR', target: '≤ 1h', current: '-', status: 'not_started' },
      { metric: '로그 커버리지', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['UI-03-31'],
    repository: ''
  },

  // OntarioTech - 북미형 협업/협동 최적화
  {
    id: 'SYS-03-41',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'OntarioTech',
    year: 3,
    phase: 1,
    name: '북미형 경로 최적화 엔진 v2.0',
    nameEn: 'North American Path Optimization Engine v2.0',
    type: 'SYS',
    status: 'planned',
    description: '북미 농업환경 특화 경로 최적화',
    startDate: new Date('2026-02-01'),
    targetDate: new Date('2026-06-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '대기시간 감소', target: '−15%', current: '-', status: 'not_started' },
      { metric: '총주행거리 감소', target: '−12%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-41'],
    repository: ''
  },
  {
    id: 'SYS-03-42',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'OntarioTech',
    year: 3,
    phase: 1,
    name: '협업/협동 스케줄러 v2.0',
    nameEn: 'Collaboration/Cooperation Scheduler v2.0',
    type: 'SYS',
    status: 'planned',
    description: '다중 장비 협업/협동 스케줄링 시스템',
    startDate: new Date('2026-04-01'),
    targetDate: new Date('2026-08-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '협업 효율성', target: '≥ 90%', current: '-', status: 'not_started' },
      { metric: '충돌 회피율', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-42', 'SYS-03-41'],
    repository: ''
  },
  {
    id: 'DOC-03-41',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'OntarioTech',
    year: 3,
    phase: 1,
    name: '북미 시나리오 성능 보고서 v1.0',
    nameEn: 'North American Scenario Performance Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '북미 환경 시나리오 성능 분석 보고서',
    startDate: new Date('2026-09-01'),
    targetDate: new Date('2026-11-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '시나리오 검증', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-41', 'SYS-03-42'],
    documentation: ''
  },

  // ============================================
  // 2단계 1차년도 (군집·협업, MIL/HIL, 플랫폼-시뮬레이터 연동)
  // ============================================

  // KITECH - V2X 군집/협업 + MIL/HIL
  {
    id: 'SYS-04-01',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'KITECH',
    year: 4,
    phase: 2,
    name: 'V2X 협업 제어 모듈 v1.0',
    nameEn: 'V2X Collaborative Control Module v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'V2X 기반 다수 장비 협업 제어',
    startDate: new Date('2027-01-01'),
    targetDate: new Date('2027-05-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '군집 거리오차 p95', target: '≤ 20 cm', current: '-', status: 'not_started' },
      { metric: '협업 충돌', target: '0건', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-01', 'SYS-03-03'],
    repository: ''
  },
  {
    id: 'SYS-04-02',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'KITECH',
    year: 4,
    phase: 2,
    name: 'MIL 통합 연동 시나리오팩 v1.0',
    nameEn: 'MIL Integration Scenario Pack v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'MIL 시뮬레이션 통합 연동시험 시나리오',
    startDate: new Date('2027-03-01'),
    targetDate: new Date('2027-07-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '시나리오 수', target: '≥ 30', current: '-', status: 'not_started' },
      { metric: '통과율', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-03', 'SYS-04-01'],
    repository: ''
  },
  {
    id: 'SYS-04-03',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'KITECH',
    year: 4,
    phase: 2,
    name: 'HIL 검증환경 v1.0',
    nameEn: 'HIL Verification Environment v1.0',
    type: 'SYS',
    status: 'planned',
    description: '실장비 제어기 포함 HIL 검증환경',
    startDate: new Date('2027-05-01'),
    targetDate: new Date('2027-09-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: 'HIL 케이스', target: '30개 통과', current: '-', status: 'not_started' },
      { metric: '실시간성', target: '100% 보장', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-02'],
    repository: ''
  },
  {
    id: 'DOC-04-01',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'KITECH',
    year: 4,
    phase: 2,
    name: 'Part14 개선 제안서 v1.0',
    nameEn: 'Part14 Improvement Proposal v1.0',
    type: 'DOC',
    status: 'planned',
    description: '시퀀스 제어 통신표준(Part14) 개선안',
    startDate: new Date('2027-08-01'),
    targetDate: new Date('2027-11-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '표준 제안 승인', target: '위원회 통과', current: '-', status: 'not_started' }
    ],
    dependencies: ['DOC-03-01'],
    documentation: ''
  },

  // TYMICT - 고성능 다중 센서 AI 융합
  {
    id: 'SYS-04-11',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'TYMICT',
    year: 4,
    phase: 2,
    name: '통합 하드웨어 플랫폼 v2.0',
    nameEn: 'Integrated Hardware Platform v2.0',
    type: 'SYS',
    status: 'planned',
    description: '고성능 멀티프로세싱 HW 플랫폼',
    startDate: new Date('2027-01-01'),
    targetDate: new Date('2027-05-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: 'AI 융합 지연', target: '≤ 5 ms', current: '-', status: 'not_started' },
      { metric: '시스템 가용성', target: '≥ 99.9%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-11'],
    documentation: ''
  },
  {
    id: 'SYS-04-12',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'TYMICT',
    year: 4,
    phase: 2,
    name: 'AI 플랫폼 미들웨어 v2.0',
    nameEn: 'AI Platform Middleware v2.0',
    type: 'SYS',
    status: 'planned',
    description: '모델 라이브러리/버전/자동배포 시스템',
    startDate: new Date('2027-03-01'),
    targetDate: new Date('2027-07-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '모델 배포시간', target: '< 1분', current: '-', status: 'not_started' },
      { metric: '동적 로딩', target: '지원', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-12', 'SYS-04-11'],
    repository: ''
  },
  {
    id: 'OPS-04-11',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'TYMICT',
    year: 4,
    phase: 2,
    name: '다층 안전 감시/로깅 체계 v1.0',
    nameEn: 'Multi-layer Safety Monitoring/Logging v1.0',
    type: 'OPS',
    status: 'planned',
    description: '다층 안전 감시 및 로깅 시스템',
    startDate: new Date('2027-05-01'),
    targetDate: new Date('2027-09-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '장애 감지율', target: '≥ 99%', current: '-', status: 'not_started' },
      { metric: '알람 지연', target: '< 100ms', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-12'],
    repository: ''
  },
  {
    id: 'DOC-04-11',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'TYMICT',
    year: 4,
    phase: 2,
    name: '전체 시스템 통합 검증 보고서 v1.0',
    nameEn: 'Full System Integration Verification Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '장기 내구 테스트 포함 통합 검증',
    startDate: new Date('2027-09-01'),
    targetDate: new Date('2027-12-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '내구 테스트', target: '통과', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-11', 'SYS-04-12', 'OPS-04-11'],
    documentation: ''
  },

  // JBN - 강화학습 기반 고도화
  {
    id: 'SYS-04-21',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'JBN',
    year: 4,
    phase: 2,
    name: 'RL-보강 전역 경로계획 모듈 v1.0',
    nameEn: 'RL-Enhanced Global Path Planning v1.0',
    type: 'SYS',
    status: 'planned',
    description: '강화학습 기반 전역 경로계획',
    startDate: new Date('2027-01-01'),
    targetDate: new Date('2027-05-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '경로계획 성공률', target: '≥ 98%', current: '-', status: 'not_started' },
      { metric: '최적성', target: '≥ 95%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-21'],
    repository: ''
  },
  {
    id: 'SYS-04-22',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'JBN',
    year: 4,
    phase: 2,
    name: '비정형 장애물 인지 모듈 v1.0',
    nameEn: 'Irregular Obstacle Perception Module v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'DETR/Transformer 계열 비정형 인지',
    startDate: new Date('2027-03-01'),
    targetDate: new Date('2027-07-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '비정형 인지 F1', target: '≥ 0.8', current: '-', status: 'not_started' },
      { metric: '처리속도', target: 'FPS ≥ 30', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-22'],
    repository: ''
  },
  {
    id: 'DATA-04-21',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'JBN',
    year: 4,
    phase: 2,
    name: '학습/평가 세트 v1.0',
    nameEn: 'Training/Evaluation Set v1.0',
    type: 'DATA',
    status: 'planned',
    description: '메타·시각-언어 보강 데이터셋',
    startDate: new Date('2027-02-01'),
    targetDate: new Date('2027-06-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '데이터 규모', target: '≥ 500GB', current: '-', status: 'not_started' },
      { metric: '메타데이터 완성도', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['DATA-03-21'],
    repository: ''
  },
  {
    id: 'DOC-04-21',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'JBN',
    year: 4,
    phase: 2,
    name: '고도화 알고리즘 보고서 v1.0',
    nameEn: 'Advanced Algorithm Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '강화학습 및 비정형 인지 알고리즘 문서',
    startDate: new Date('2027-08-01'),
    targetDate: new Date('2027-11-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '알고리즘 문서화', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-21', 'SYS-04-22'],
    documentation: ''
  },

  // VIA - CI/CD 자동 배포 및 시뮬레이터 연동
  {
    id: 'INT-04-31',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 4,
    phase: 2,
    name: '연동 인터페이스 스펙 v1.0',
    nameEn: 'Integration Interface Specification v1.0',
    type: 'INT',
    status: 'planned',
    description: 'A-SW → ICU → 시뮬레이터 연동 스펙',
    startDate: new Date('2027-01-01'),
    targetDate: new Date('2027-04-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '인터페이스 정의', target: '100%', current: '-', status: 'not_started' },
      { metric: '호환성 검증', target: '완료', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-31'],
    repository: ''
  },
  {
    id: 'SYS-04-31',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 4,
    phase: 2,
    name: 'CI/CD 자동 시험 파이프라인 v1.0',
    nameEn: 'CI/CD Automated Test Pipeline v1.0',
    type: 'SYS',
    status: 'planned',
    description: '자동화 테스트 및 배포 파이프라인',
    startDate: new Date('2027-02-01'),
    targetDate: new Date('2027-06-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '자동시험 커버리지', target: '≥ 80%', current: '-', status: 'not_started' },
      { metric: '결함 탐지율', target: '≥ 85%', current: '-', status: 'not_started' }
    ],
    dependencies: ['INT-04-31'],
    repository: ''
  },
  {
    id: 'SYS-04-32',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 4,
    phase: 2,
    name: '시뮬레이터 연동/검증 모듈 v1.0',
    nameEn: 'Simulator Integration/Verification Module v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'MIL/SIL 훅 및 자동 검증',
    startDate: new Date('2027-04-01'),
    targetDate: new Date('2027-08-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '재배포 리드타임', target: 'p50 ≤ 30분', current: '-', status: 'not_started' },
      { metric: 'MIL/SIL 연동', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-31'],
    repository: ''
  },
  {
    id: 'UI-04-31',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 4,
    phase: 2,
    name: '관리자·연동 대시보드 v1.0',
    nameEn: 'Admin·Integration Dashboard v1.0',
    type: 'UI',
    status: 'planned',
    description: '통합 관리 및 연동 상태 대시보드',
    startDate: new Date('2027-05-01'),
    targetDate: new Date('2027-09-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '대시보드 완성도', target: '100%', current: '-', status: 'not_started' },
      { metric: '실시간 업데이트', target: '< 1s', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-32'],
    repository: ''
  },
  {
    id: 'OPS-04-31',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 4,
    phase: 2,
    name: '교육용 시제품·개발자 키트 v1.0',
    nameEn: 'Educational Prototype·Developer Kit v1.0',
    type: 'OPS',
    status: 'planned',
    description: '개발자 교육용 시제품 및 SDK',
    startDate: new Date('2027-07-01'),
    targetDate: new Date('2027-10-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '교육자료 완성도', target: '100%', current: '-', status: 'not_started' },
      { metric: 'SDK 기능 커버리지', target: '≥ 90%', current: '-', status: 'not_started' }
    ],
    dependencies: ['UI-04-31'],
    repository: ''
  },
  {
    id: 'DOC-04-31',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 4,
    phase: 2,
    name: '운영·성과 분석 보고서 v1.0',
    nameEn: 'Operation·Performance Analysis Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '플랫폼 운영 및 성과 지표 분석',
    startDate: new Date('2027-10-01'),
    targetDate: new Date('2027-12-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '성과지표 달성', target: '≥ 90%', current: '-', status: 'not_started' }
    ],
    dependencies: ['OPS-04-31'],
    documentation: ''
  },

  // OntarioTech - MIL 연동 검증
  {
    id: 'SYS-04-41',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'OntarioTech',
    year: 4,
    phase: 2,
    name: 'MIL 연동 검증 스위트 v1.0',
    nameEn: 'MIL Integration Verification Suite v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'MIL 환경 통합 검증 스위트',
    startDate: new Date('2027-02-01'),
    targetDate: new Date('2027-06-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '시나리오 커버리지', target: '100%', current: '-', status: 'not_started' },
      { metric: '검증 자동화', target: '≥ 80%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-42'],
    repository: ''
  },
  {
    id: 'UI-04-41',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'OntarioTech',
    year: 4,
    phase: 2,
    name: '모듈형 GUI v1.0',
    nameEn: 'Modular GUI v1.0',
    type: 'UI',
    status: 'planned',
    description: '파라미터 입력/효과 분석 GUI',
    startDate: new Date('2027-04-01'),
    targetDate: new Date('2027-08-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '사용자 테스트', target: '10세션', current: '-', status: 'not_started' },
      { metric: '사용성 점수', target: '≥ 4.0/5', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-41'],
    repository: ''
  },
  {
    id: 'DOC-04-41',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'OntarioTech',
    year: 4,
    phase: 2,
    name: '시나리오 기반 성능 고도화 보고서 v1.0',
    nameEn: 'Scenario-based Performance Enhancement Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '다양한 파라미터 변화 시 성능 영향 분석',
    startDate: new Date('2027-09-01'),
    targetDate: new Date('2027-11-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '분석 완성도', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['UI-04-41'],
    documentation: ''
  },

  // ============================================
  // 2단계 2차년도 (현장 실증·안전 인증·표준 개선·상용화 준비)
  // ============================================

  // KITECH - 현장 실증 및 기능안전
  {
    id: 'DOC-05-01',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'KITECH',
    year: 5,
    phase: 2,
    name: '현장 실증 종합 보고서 v1.0',
    nameEn: 'Field Test Comprehensive Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '실차·현장 실증 결과 및 개선 이력',
    startDate: new Date('2028-01-01'),
    targetDate: new Date('2028-06-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '현장 장애 재현률', target: '≤ 5%', current: '-', status: 'not_started' },
      { metric: '실증 완료', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-01', 'SYS-04-03'],
    documentation: ''
  },
  {
    id: 'SYS-05-01',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'KITECH',
    year: 5,
    phase: 2,
    name: 'HIL 기능안전 케이스팩 v1.0',
    nameEn: 'HIL Functional Safety Case Pack v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'HIL 기능안전 인증 준비 케이스',
    startDate: new Date('2028-04-01'),
    targetDate: new Date('2028-08-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '기능안전 통과율', target: '≥ 95%', current: '-', status: 'not_started' },
      { metric: '인증 준비도', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-03'],
    repository: ''
  },
  {
    id: 'DOC-05-02',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'KITECH',
    year: 5,
    phase: 2,
    name: 'V2X 통신 I/F 표준 개선 제안서 v1.0',
    nameEn: 'V2X Communication Interface Standard Proposal v1.0',
    type: 'DOC',
    status: 'planned',
    description: 'V2X 인터페이스 표준 개선안',
    startDate: new Date('2028-07-01'),
    targetDate: new Date('2028-10-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '표준화 기구 제출', target: '완료', current: '-', status: 'not_started' }
    ],
    dependencies: ['DOC-04-01'],
    documentation: ''
  },

  // TYMICT - 상용화 파일럿
  {
    id: 'SYS-05-11',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'TYMICT',
    year: 5,
    phase: 2,
    name: '고성능 통합제어기 최종 파일럿 v1.0',
    nameEn: 'High-Performance ICU Final Pilot v1.0',
    type: 'SYS',
    status: 'planned',
    description: '상용화 직전 최종 파일럿 시스템',
    startDate: new Date('2028-01-01'),
    targetDate: new Date('2028-05-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: 'MTBF', target: '≥ 5,000h', current: '-', status: 'not_started' },
      { metric: '파이프라인 지연 p95', target: '≤ 80 ms', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-11'],
    documentation: ''
  },
  {
    id: 'SYS-05-12',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'TYMICT',
    year: 5,
    phase: 2,
    name: 'AI 미들웨어 최종 패키지 v1.0',
    nameEn: 'AI Middleware Final Package v1.0',
    type: 'SYS',
    status: 'planned',
    description: '상용화 준비 AI 미들웨어 패키지',
    startDate: new Date('2028-03-01'),
    targetDate: new Date('2028-07-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '온디바이스 학습', target: '지원', current: '-', status: 'not_started' },
      { metric: '플러그앤플레이', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-12', 'SYS-05-11'],
    repository: ''
  },
  {
    id: 'UI-05-11',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'TYMICT',
    year: 5,
    phase: 2,
    name: 'HMI 최종 패키지 v1.0',
    nameEn: 'HMI Final Package v1.0',
    type: 'UI',
    status: 'planned',
    description: '상용화 준비 HMI 최종 패키지',
    startDate: new Date('2028-05-01'),
    targetDate: new Date('2028-09-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '사용성 테스트', target: '≥ 4.5/5', current: '-', status: 'not_started' },
      { metric: '현장 검증', target: '완료', current: '-', status: 'not_started' }
    ],
    dependencies: ['UI-03-11', 'SYS-05-12'],
    repository: ''
  },
  {
    id: 'DOC-05-11',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'TYMICT',
    year: 5,
    phase: 2,
    name: '기술문서·사용자 매뉴얼·벤치마크 v1.0',
    nameEn: 'Technical Docs·User Manual·Benchmark v1.0',
    type: 'DOC',
    status: 'planned',
    description: '상용화 기술문서 및 사용자 매뉴얼',
    startDate: new Date('2028-08-01'),
    targetDate: new Date('2028-11-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '상용화 체크리스트', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-05-11', 'SYS-05-12', 'UI-05-11'],
    documentation: ''
  },

  // JBN - 최적화 배포모델
  {
    id: 'SYS-05-21',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'JBN',
    year: 5,
    phase: 2,
    name: '위치추정 경량화·통합 배포 v1.0',
    nameEn: 'Positioning Lightweight·Integrated Deploy v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'ONNX/양자화 경량 배포 모델',
    startDate: new Date('2028-01-01'),
    targetDate: new Date('2028-05-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '온디바이스 FPS', target: '≥ 30', current: '-', status: 'not_started' },
      { metric: '전력소비', target: '−40%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-21'],
    repository: ''
  },
  {
    id: 'SYS-05-22',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'JBN',
    year: 5,
    phase: 2,
    name: 'RL 경로계획 통합 배포 v1.0',
    nameEn: 'RL Path Planning Integrated Deploy v1.0',
    type: 'SYS',
    status: 'planned',
    description: '강화학습 경로계획 통합 배포 버전',
    startDate: new Date('2028-03-01'),
    targetDate: new Date('2028-07-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '배포 패키지 크기', target: '< 100MB', current: '-', status: 'not_started' },
      { metric: '성능 안정성', target: '≥ 99%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-21', 'SYS-05-21'],
    repository: ''
  },
  {
    id: 'DATA-05-21',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'JBN',
    year: 5,
    phase: 2,
    name: '실증 기반 튜닝셋 v1.0',
    nameEn: 'Field-based Tuning Set v1.0',
    type: 'DATA',
    status: 'planned',
    description: '현장 실증 기반 최종 튜닝 데이터셋',
    startDate: new Date('2028-02-01'),
    targetDate: new Date('2028-06-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '실증 데이터 반영', target: '100%', current: '-', status: 'not_started' },
      { metric: '성능 개선', target: '≥ 10%', current: '-', status: 'not_started' }
    ],
    dependencies: ['DATA-04-21'],
    repository: ''
  },
  {
    id: 'DOC-05-21',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'JBN',
    year: 5,
    phase: 2,
    name: '통합 개방형 SW 구성·검증 보고서 v1.0',
    nameEn: 'Integrated Open SW Configuration·Verification Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '최종 통합 SW 구성 및 검증 결과',
    startDate: new Date('2028-08-01'),
    targetDate: new Date('2028-11-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '테스트베드 검증', target: '완료', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-05-21', 'SYS-05-22'],
    documentation: ''
  },

  // VIA - 플랫폼 운영 정착
  {
    id: 'OPS-05-31',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 5,
    phase: 2,
    name: '정적 분석 통합 파이프라인 v1.0',
    nameEn: 'Static Analysis Integrated Pipeline v1.0',
    type: 'OPS',
    status: 'planned',
    description: 'SAST/SCA/SBOM 통합 분석 파이프라인',
    startDate: new Date('2028-01-01'),
    targetDate: new Date('2028-04-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '품질 위반 감지율', target: '≥ 90%', current: '-', status: 'not_started' },
      { metric: '라이선스 검증', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-31'],
    repository: ''
  },
  {
    id: 'SYS-05-31',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 5,
    phase: 2,
    name: 'AI 탐색/추천 엔진 v1.0',
    nameEn: 'AI Search/Recommendation Engine v1.0',
    type: 'SYS',
    status: 'planned',
    description: '자동 태깅 및 개인화 추천 시스템',
    startDate: new Date('2028-03-01'),
    targetDate: new Date('2028-07-31'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '추천 CTR', target: '≥ 8%', current: '-', status: 'not_started' },
      { metric: '태깅 정확도', target: '≥ 90%', current: '-', status: 'not_started' }
    ],
    dependencies: ['UI-04-31'],
    repository: ''
  },
  {
    id: 'UI-05-31',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 5,
    phase: 2,
    name: '커뮤니티·Q&A·기여 등급 시스템 v1.0',
    nameEn: 'Community·Q&A·Contribution System v1.0',
    type: 'UI',
    status: 'planned',
    description: '개발자 커뮤니티 및 기여 관리 시스템',
    startDate: new Date('2028-05-01'),
    targetDate: new Date('2028-09-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '월간 활성 기여자', target: '50+', current: '-', status: 'not_started' },
      { metric: '커뮤니티 활성도', target: '≥ 80%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-05-31'],
    repository: ''
  },
  {
    id: 'DOC-05-31',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'VIA',
    year: 5,
    phase: 2,
    name: '온라인 기술백서 v1.0',
    nameEn: 'Online Technical Documentation v1.0',
    type: 'DOC',
    status: 'planned',
    description: '온라인 기술백서 및 운영 가이드',
    startDate: new Date('2028-08-01'),
    targetDate: new Date('2028-11-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '문서 완성도', target: '100%', current: '-', status: 'not_started' },
      { metric: '가이드 커버리지', target: '≥ 95%', current: '-', status: 'not_started' }
    ],
    dependencies: ['UI-05-31'],
    documentation: ''
  },

  // OntarioTech - HIL/실차 고도화
  {
    id: 'DOC-05-41',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'OntarioTech',
    year: 5,
    phase: 2,
    name: 'HIL·실차 시나리오·구성안 v1.0',
    nameEn: 'HIL·Vehicle Test Scenario·Configuration v1.0',
    type: 'DOC',
    status: 'planned',
    description: 'HIL 및 실차 시험 시나리오 구성',
    startDate: new Date('2028-02-01'),
    targetDate: new Date('2028-06-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '실차-HIL 상관계수', target: '≥ 0.9', current: '-', status: 'not_started' },
      { metric: '시나리오 완성도', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['DOC-04-41'],
    documentation: ''
  },
  {
    id: 'SYS-05-41',
    projectId: 'PRJ-ASW-2024',
    institutionCode: 'OntarioTech',
    year: 5,
    phase: 2,
    name: '성능 고도화 패치셋 v1.0',
    nameEn: 'Performance Enhancement Patchset v1.0',
    type: 'SYS',
    status: 'planned',
    description: '경로/스케줄링 최종 성능 고도화',
    startDate: new Date('2028-05-01'),
    targetDate: new Date('2028-09-30'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '총 작업시간 감소', target: '−15%', current: '-', status: 'not_started' },
      { metric: '최종 검증', target: '완료', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-41'],
    repository: ''
  }
];