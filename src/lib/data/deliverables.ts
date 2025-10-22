/**
 * A-SW 통합 계획 산출물 실제 데이터
 * 1단계 3개년 + 2단계 2개년
 *
 * 연차별 기간:
 * - 1단계 1차년도: 2025년 9월 ~ 2025년 12월
 * - 1단계 2차년도: 2026년 1월 ~ 2026년 12월
 * - 1단계 3차년도: 2027년 1월 ~ 2027년 12월
 * - 2단계 1차년도: 2028년 1월 ~ 2028년 12월
 * - 2단계 2차년도: 2029년 1월 ~ 2029년 12월
 */

import type { Deliverable } from '$lib/types/businessPlan';

export const deliverables: Deliverable[] = [
  // ============================================
  // 1단계 1차년도 (2025.09 ~ 2025.12)
  // 요구·분석·아키텍처 정립
  // ============================================

  // KITECH - 농작업 분석·모듈화
  {
    id: 'DOC-01-01',
    projectId: 'PRJ-ASW-2025',
    institutionCode: 'KITECH',
    year: 1,
    phase: 1,
    name: '농작업 분석 보고서 v1.0',
    nameEn: 'Agricultural Task Analysis Report v1.0',
    type: 'DOC',
    status: 'in_progress',
    description: '무인자율 농작업 분석 및 A-SW 모듈화 파라미터 정립. 작물/작업별 단계 구조화(예: 양파), 자율작업 시퀀스 초안',
    startDate: new Date('2025-09-01'),
    targetDate: new Date('2025-10-31'),
    progress: 20,
    version: '0.2',
    kpi: [
      { metric: '대표 작업 종류', target: '5종 이상', current: '2종', status: 'in_progress' },
      { metric: '파라미터 누락', target: '0건', current: '검토중', status: 'in_progress' },
      { metric: '상호리뷰 통과', target: '100%', current: '0%', status: 'not_started' }
    ],
    dependencies: [],
    documentation: '/docs/DOC-01-01_Agricultural_Analysis_v0.2.pdf'
  },
  {
    id: 'DATA-01-01',
    projectId: 'PRJ-ASW-2025',
    institutionCode: 'KITECH',
    year: 1,
    phase: 1,
    name: '작업 시퀀스 사전 v1.0',
    nameEn: 'Task Sequence Dictionary v1.0',
    type: 'DATA',
    status: 'planned',
    description: '농작업별 시퀀스 정의, 제어입력/센서/조건 식별, 제어 파라미터 정의',
    startDate: new Date('2025-09-15'),
    targetDate: new Date('2025-11-15'),
    progress: 10,
    version: '0.1',
    kpi: [
      { metric: '시퀀스 정의 완성도', target: '100%', current: '10%', status: 'in_progress' },
      { metric: '파라미터 검증', target: '완료', current: '진행중', status: 'in_progress' }
    ],
    dependencies: ['DOC-01-01']
  },
  {
    id: 'INT-01-01',
    projectId: 'PRJ-ASW-2025',
    institutionCode: 'KITECH',
    year: 1,
    phase: 1,
    name: '작업 모듈 I/F v1.0',
    nameEn: 'Task Module Interface v1.0',
    type: 'INT',
    status: 'planned',
    description: '작업 모듈 인터페이스 정의 (입·출력, 단위, 타이밍)',
    startDate: new Date('2025-10-01'),
    targetDate: new Date('2025-12-15'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: 'I/F 명세 완성도', target: '100%', current: '0%', status: 'not_started' },
      { metric: 'VIA 정합성 검토', target: '통과', current: '대기', status: 'not_started' }
    ],
    dependencies: ['DATA-01-01']
  },

  // TYMICT - 요구사항·시스템 아키텍처
  {
    id: 'DOC-01-11',
    projectId: 'PRJ-ASW-2025',
    institutionCode: 'TYMICT',
    year: 1,
    phase: 1,
    name: '요구사항 명세서 v1.0',
    nameEn: 'Requirements Specification v1.0',
    type: 'DOC',
    status: 'planned',
    description: '현장 요구 반영 시스템 요구사항 분석 및 명세화',
    startDate: new Date('2025-09-01'),
    targetDate: new Date('2025-10-31'),
    progress: 15,
    version: '0.2',
    kpi: [
      { metric: '요구사항 추적성', target: '100%', current: '30%', status: 'in_progress' },
      { metric: '기술위원회 승인', target: '2회', current: '0회', status: 'not_started' }
    ],
    dependencies: []
  },
  {
    id: 'DOC-01-12',
    projectId: 'PRJ-ASW-2025',
    institutionCode: 'TYMICT',
    year: 1,
    phase: 1,
    name: '시스템 아키텍처 설계서 v1.0',
    nameEn: 'System Architecture Design v1.0',
    type: 'DOC',
    status: 'planned',
    description: 'HW 아키텍처, 시스템 구조, 사양 검토 및 리스크 평가',
    startDate: new Date('2025-09-15'),
    targetDate: new Date('2025-11-30'),
    progress: 5,
    version: '0.1',
    kpi: [
      { metric: '아키텍처 완성도', target: '100%', current: '5%', status: 'in_progress' },
      { metric: '리스크 평가', target: '완료', current: '진행중', status: 'in_progress' }
    ],
    dependencies: ['DOC-01-11']
  },

  // VIA - A-SW 서비스 플랫폼 아키텍처
  {
    id: 'SYS-01-31',
    projectId: 'PRJ-ASW-2025',
    institutionCode: 'VIA',
    year: 1,
    phase: 1,
    name: '플랫폼 아키텍처 백서 v1.0',
    nameEn: 'Platform Architecture Whitepaper v1.0',
    type: 'SYS',
    status: 'planned',
    description: '개방형 A-SW 공유환경 MSA·보안·저장소·CI/CD 아키텍처',
    startDate: new Date('2025-09-01'),
    targetDate: new Date('2025-11-30'),
    progress: 10,
    version: '0.1',
    kpi: [
      { metric: '도메인 정의', target: '100%', current: '10%', status: 'in_progress' },
      { metric: '위협모델링', target: '통과', current: '준비중', status: 'not_started' }
    ],
    dependencies: []
  },
  {
    id: 'INT-01-31',
    projectId: 'PRJ-ASW-2025',
    institutionCode: 'VIA',
    year: 1,
    phase: 1,
    name: '인증/권한/토큰 스펙 v1.0',
    nameEn: 'Auth/Permission/Token Spec v1.0',
    type: 'INT',
    status: 'planned',
    description: 'OAuth2/OIDC·RBAC 기반 인증 및 권한 관리 스펙',
    startDate: new Date('2025-09-15'),
    targetDate: new Date('2025-11-15'),
    progress: 5,
    version: '0.1',
    kpi: [
      { metric: '보안 스펙 완성도', target: '100%', current: '5%', status: 'in_progress' },
      { metric: '표준 준수', target: 'OAuth2/OIDC', current: '검토중', status: 'in_progress' }
    ],
    dependencies: ['SYS-01-31']
  },
  {
    id: 'OPS-01-31',
    projectId: 'PRJ-ASW-2025',
    institutionCode: 'VIA',
    year: 1,
    phase: 1,
    name: 'CI/CD 설계 문서 v1.0',
    nameEn: 'CI/CD Design Document v1.0',
    type: 'OPS',
    status: 'planned',
    description: 'Git-like 저장소 및 CI/CD 워크플로우 설계',
    startDate: new Date('2025-10-01'),
    targetDate: new Date('2025-12-15'),
    progress: 0,
    version: '0.1',
    kpi: [
      { metric: '워크플로우 정의', target: '100%', current: '0%', status: 'not_started' },
      { metric: '자동화 범위', target: '80%', current: '0%', status: 'not_started' }
    ],
    dependencies: ['SYS-01-31', 'INT-01-31']
  },

  // ============================================
  // 1단계 2차년도 (2026.01 ~ 2026.12)
  // 알고리즘·HW 구현, 플랫폼 기능화
  // ============================================

  // KITECH - 경로 생성/추종/속도 제어 + 통신표준 식별
  {
    id: 'SYS-02-01',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'KITECH',
    year: 2,
    phase: 1,
    name: '경로생성 모듈 v1.0',
    nameEn: 'Path Generation Module v1.0',
    type: 'SYS',
    status: 'planned',
    description: '작업폭/간격 기반 경로 생성 알고리즘',
    startDate: new Date('2026-01-01'),
    targetDate: new Date('2026-04-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '경로 오차', target: 'p95 ≤ 10cm', current: '-', status: 'not_started' },
      { metric: '생성 시간', target: '< 1초', current: '-', status: 'not_started' }
    ],
    dependencies: ['INT-01-01']
  },
  {
    id: 'SYS-02-02',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'KITECH',
    year: 2,
    phase: 1,
    name: '경로추종 모듈 v1.0',
    nameEn: 'Path Following Module v1.0',
    type: 'SYS',
    status: 'planned',
    description: '실시간 경로 추종 제어 알고리즘',
    startDate: new Date('2026-03-01'),
    targetDate: new Date('2026-06-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '추종 지연', target: 'p95 ≤ 100ms', current: '-', status: 'not_started' },
      { metric: '횡방향 오차', target: '< 5cm', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-01']
  },
  {
    id: 'SYS-02-03',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'KITECH',
    year: 2,
    phase: 1,
    name: '속도제어 모듈 v1.0',
    nameEn: 'Speed Control Module v1.0',
    type: 'SYS',
    status: 'planned',
    description: '작업 조건별 속도 최적화 제어',
    startDate: new Date('2026-05-01'),
    targetDate: new Date('2026-08-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '속도 정밀도', target: '±2%', current: '-', status: 'not_started' },
      { metric: '응답시간', target: '< 50ms', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-02']
  },
  {
    id: 'DOC-02-01',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'KITECH',
    year: 2,
    phase: 1,
    name: '통신표준 식별 보고서 v1.0',
    nameEn: 'Communication Standards Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: 'ISOBUS Part7/10/14 연관성 분석 및 매핑',
    startDate: new Date('2026-07-01'),
    targetDate: new Date('2026-10-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '표준 매핑 완성도', target: '100%', current: '-', status: 'not_started' },
      { metric: '누락 항목', target: '0건', current: '-', status: 'not_started' }
    ],
    dependencies: []
  },

  // TYMICT - 통합제어기/인터페이스/안전·RTOS/HMI
  {
    id: 'SYS-02-11',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'TYMICT',
    year: 2,
    phase: 1,
    name: '통합제어기(ICU) HW v1.0',
    nameEn: 'Integrated Control Unit HW v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'ICU 하드웨어 및 기본 펌웨어',
    startDate: new Date('2026-01-01'),
    targetDate: new Date('2026-06-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '센서 동시처리', target: '4종 p95≤20ms', current: '-', status: 'not_started' },
      { metric: 'E-Stop 응답', target: '≤100ms', current: '-', status: 'not_started' }
    ],
    dependencies: ['DOC-01-12']
  },
  {
    id: 'SYS-02-12',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'TYMICT',
    year: 2,
    phase: 1,
    name: '인터페이스 보드 v1.0',
    nameEn: 'Interface Board v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'I/F 보드 하드웨어 및 드라이버',
    startDate: new Date('2026-02-01'),
    targetDate: new Date('2026-05-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '통신 지연', target: '< 10ms', current: '-', status: 'not_started' },
      { metric: '처리량', target: '> 1Mbps', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-11']
  },
  {
    id: 'OPS-02-11',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'TYMICT',
    year: 2,
    phase: 1,
    name: '안전/RTOS 프로파일 v1.0',
    nameEn: 'Safety/RTOS Profile v1.0',
    type: 'OPS',
    status: 'planned',
    description: '안전 시스템 및 실시간 OS 프로파일',
    startDate: new Date('2026-04-01'),
    targetDate: new Date('2026-08-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: 'WCET 준수', target: '100%', current: '-', status: 'not_started' },
      { metric: '안전 인증', target: '준비완료', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-11', 'SYS-02-12']
  },
  {
    id: 'UI-02-11',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'TYMICT',
    year: 2,
    phase: 1,
    name: 'HMI 시스템 v1.0',
    nameEn: 'HMI System v1.0',
    type: 'UI',
    status: 'planned',
    description: '농업용 HMI 시스템 및 UI',
    startDate: new Date('2026-06-01'),
    targetDate: new Date('2026-10-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: 'HMI 왕복시간', target: '≤50ms', current: '-', status: 'not_started' },
      { metric: '사용성 평가', target: '>4.0/5.0', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-11']
  },
  {
    id: 'DOC-02-11',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'TYMICT',
    year: 2,
    phase: 1,
    name: '통합 시험 보고서 v1.0',
    nameEn: 'Integration Test Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: 'HW/SW 통합 시험 결과 보고서',
    startDate: new Date('2026-09-01'),
    targetDate: new Date('2026-11-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '시험 커버리지', target: '>90%', current: '-', status: 'not_started' },
      { metric: '결함 해결률', target: '>95%', current: '-', status: 'not_started' }
    ],
    dependencies: ['UI-02-11', 'OPS-02-11']
  },

  // JBN - 측위·환경인지·공간정보 + 학습 DB
  {
    id: 'SYS-02-21',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'JBN',
    year: 2,
    phase: 1,
    name: '측위 모듈 v1.0',
    nameEn: 'Positioning Module v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'RTK-GNSS 기반 정밀 측위 모듈',
    startDate: new Date('2026-01-01'),
    targetDate: new Date('2026-05-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '위치 RMSE', target: '≤0.2m', current: '-', status: 'not_started' },
      { metric: 'Fix율', target: '>95%', current: '-', status: 'not_started' }
    ],
    dependencies: []
  },
  {
    id: 'SYS-02-22',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'JBN',
    year: 2,
    phase: 1,
    name: '환경인지 모듈 v1.0',
    nameEn: 'Environment Perception Module v1.0',
    type: 'SYS',
    status: 'planned',
    description: '카메라/LiDAR 기반 환경 인지 모듈',
    startDate: new Date('2026-03-01'),
    targetDate: new Date('2026-08-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '인지 mIoU', target: '≥0.65', current: '-', status: 'not_started' },
      { metric: '처리속도', target: '>15FPS', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-21']
  },
  {
    id: 'DATA-02-21',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'JBN',
    year: 2,
    phase: 1,
    name: '학습 DB v1.0',
    nameEn: 'Training Database v1.0',
    type: 'DATA',
    status: 'planned',
    description: '환경 인지용 학습 데이터베이스 (스키마/라벨)',
    startDate: new Date('2026-05-01'),
    targetDate: new Date('2026-09-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '데이터셋 크기', target: '>10,000장', current: '-', status: 'not_started' },
      { metric: '라벨 품질', target: '>95%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-22']
  },
  {
    id: 'DOC-02-21',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'JBN',
    year: 2,
    phase: 1,
    name: '알고리즘 보고서 v1.0',
    nameEn: 'Algorithm Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '측위 및 환경인지 알고리즘 상세 보고서',
    startDate: new Date('2026-08-01'),
    targetDate: new Date('2026-11-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '문서 완성도', target: '100%', current: '-', status: 'not_started' },
      { metric: '검증 결과', target: '포함', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-21', 'SYS-02-22', 'DATA-02-21']
  },

  // VIA - 온보딩/인증/등록·승인/Repo/검색·탐색
  {
    id: 'UI-02-31',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'VIA',
    year: 2,
    phase: 1,
    name: '온보딩 포털 v1.0',
    nameEn: 'Onboarding Portal v1.0',
    type: 'UI',
    status: 'planned',
    description: '개발자 온보딩 및 관리 포털',
    startDate: new Date('2026-01-01'),
    targetDate: new Date('2026-03-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '온보딩 시간', target: '<30분', current: '-', status: 'not_started' },
      { metric: 'UX 평점', target: '>4.0/5.0', current: '-', status: 'not_started' }
    ],
    dependencies: ['INT-01-31']
  },
  {
    id: 'INT-02-31',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'VIA',
    year: 2,
    phase: 1,
    name: '인증/권한 API v1.0',
    nameEn: 'Auth/Permission API v1.0',
    type: 'INT',
    status: 'planned',
    description: 'OAuth2/OIDC 기반 인증 API 구현',
    startDate: new Date('2026-02-01'),
    targetDate: new Date('2026-05-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: 'API 응답시간', target: 'p95<100ms', current: '-', status: 'not_started' },
      { metric: '보안 테스트', target: '통과', current: '-', status: 'not_started' }
    ],
    dependencies: ['INT-01-31']
  },
  {
    id: 'SYS-02-31',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'VIA',
    year: 2,
    phase: 1,
    name: '등록/승인 서비스 v1.0',
    nameEn: 'Registration/Approval Service v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'A-SW 등록 및 승인 워크플로우 서비스',
    startDate: new Date('2026-04-01'),
    targetDate: new Date('2026-07-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '승인 시간', target: 'p50≤2일', current: '-', status: 'not_started' },
      { metric: '가용성', target: '≥99.5%', current: '-', status: 'not_started' }
    ],
    dependencies: ['UI-02-31', 'INT-02-31']
  },
  {
    id: 'SYS-02-32',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'VIA',
    year: 2,
    phase: 1,
    name: 'Repo 서비스 v1.0',
    nameEn: 'Repository Service v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'Git-like A-SW 저장소 서비스',
    startDate: new Date('2026-06-01'),
    targetDate: new Date('2026-09-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '저장소 성능', target: '>1000 req/s', current: '-', status: 'not_started' },
      { metric: '데이터 무결성', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-31']
  },
  {
    id: 'UI-02-32',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'VIA',
    year: 2,
    phase: 1,
    name: '검색/탐색 UI v1.0',
    nameEn: 'Search/Browse UI v1.0',
    type: 'UI',
    status: 'planned',
    description: 'A-SW 검색 및 탐색 인터페이스',
    startDate: new Date('2026-08-01'),
    targetDate: new Date('2026-11-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '검색 정확도', target: '>90%', current: '-', status: 'not_started' },
      { metric: '응답속도', target: '<500ms', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-32']
  },

  // OntarioTech - 경로 최적화·할당
  {
    id: 'SYS-02-41',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'OntarioTech',
    year: 2,
    phase: 1,
    name: '경로 최적화 엔진 v1.0',
    nameEn: 'Path Optimization Engine v1.0',
    type: 'SYS',
    status: 'planned',
    description: '다중 농기계 경로 최적화 알고리즘',
    startDate: new Date('2026-02-01'),
    targetDate: new Date('2026-07-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '커버리지', target: '100%', current: '-', status: 'not_started' },
      { metric: '중복주행', target: '≤3%', current: '-', status: 'not_started' },
      { metric: '총주행거리', target: '-10%', current: '-', status: 'not_started' }
    ],
    dependencies: []
  },
  {
    id: 'SYS-02-42',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'OntarioTech',
    year: 2,
    phase: 1,
    name: '작업 할당 스케줄러 v1.0',
    nameEn: 'Task Allocation Scheduler v1.0',
    type: 'SYS',
    status: 'planned',
    description: '작업 할당 및 스케줄링 시스템',
    startDate: new Date('2026-06-01'),
    targetDate: new Date('2026-10-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '할당 효율성', target: '>85%', current: '-', status: 'not_started' },
      { metric: '대기시간', target: '<5분', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-41']
  },
  {
    id: 'DOC-02-41',
    projectId: 'PRJ-ASW-2026',
    institutionCode: 'OntarioTech',
    year: 2,
    phase: 1,
    name: '실험·성능 보고서 v1.0',
    nameEn: 'Experiment/Performance Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '최적화 알고리즘 성능 검증 보고서',
    startDate: new Date('2026-09-01'),
    targetDate: new Date('2026-11-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '시나리오 수', target: '>20개', current: '-', status: 'not_started' },
      { metric: '성능 개선', target: '입증', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-41', 'SYS-02-42']
  },

  // ============================================
  // 1단계 3차년도 (2027.01 ~ 2027.12)
  // 작업기 제어/모니터링, MIL, 협업 고도화
  // ============================================

  // KITECH - 작업기 제어/모니터링 + MIL + TC 개선안
  {
    id: 'SYS-03-01',
    projectId: 'PRJ-ASW-2027',
    institutionCode: 'KITECH',
    year: 3,
    phase: 1,
    name: '작업기 제어 모듈 v2.0',
    nameEn: 'Implement Control Module v2.0',
    type: 'SYS',
    status: 'planned',
    description: '작업기 정밀 제어 알고리즘 (깊이, 각도, 속도)',
    startDate: new Date('2027-01-01'),
    targetDate: new Date('2027-04-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '깊이 오차', target: 'p95≤5mm', current: '-', status: 'not_started' },
      { metric: '제어 정밀도', target: '±2%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-03']
  },
  {
    id: 'SYS-03-02',
    projectId: 'PRJ-ASW-2027',
    institutionCode: 'KITECH',
    year: 3,
    phase: 1,
    name: '작업 모니터링 모듈 v2.0',
    nameEn: 'Work Monitoring Module v2.0',
    type: 'SYS',
    status: 'planned',
    description: '작업 상태 실시간 모니터링 및 이상감지',
    startDate: new Date('2027-03-01'),
    targetDate: new Date('2027-06-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '이상감지 재현율', target: '≥0.9', current: '-', status: 'not_started' },
      { metric: '오탐률', target: '<5%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-01']
  },
  {
    id: 'SYS-03-03',
    projectId: 'PRJ-ASW-2027',
    institutionCode: 'KITECH',
    year: 3,
    phase: 1,
    name: 'MIL 시뮬레이터 환경 v1.0',
    nameEn: 'MIL Simulator Environment v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'Model-in-the-Loop 시뮬레이션 환경 구축',
    startDate: new Date('2027-05-01'),
    targetDate: new Date('2027-09-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: 'MIL 시나리오', target: '20개 통과', current: '-', status: 'not_started' },
      { metric: '정확도', target: '>95%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-02']
  },
  {
    id: 'DOC-03-01',
    projectId: 'PRJ-ASW-2027',
    institutionCode: 'KITECH',
    year: 3,
    phase: 1,
    name: 'TC(Part10) 개선 제안서 v1.0',
    nameEn: 'TC(Part10) Improvement Proposal v1.0',
    type: 'DOC',
    status: 'planned',
    description: 'ISOBUS Part10 Task Controller 개선안',
    startDate: new Date('2027-08-01'),
    targetDate: new Date('2027-11-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '개선항목', target: '>10개', current: '-', status: 'not_started' },
      { metric: '표준위원회 검토', target: '제출', current: '-', status: 'not_started' }
    ],
    dependencies: ['DOC-02-01']
  },

  // TYMICT - ICU Rev.2 + AI 미들웨어 + HMI 통합
  {
    id: 'SYS-03-11',
    projectId: 'PRJ-ASW-2027',
    institutionCode: 'TYMICT',
    year: 3,
    phase: 1,
    name: 'ICU Rev.2 하드웨어 v2.0',
    nameEn: 'ICU Rev.2 Hardware v2.0',
    type: 'SYS',
    status: 'planned',
    description: '2세대 통합제어기 하드웨어 (성능 개선)',
    startDate: new Date('2027-01-01'),
    targetDate: new Date('2027-05-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '처리성능', target: '2x 향상', current: '-', status: 'not_started' },
      { metric: '소비전력', target: '-30%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-11']
  },
  {
    id: 'SYS-03-12',
    projectId: 'PRJ-ASW-2027',
    institutionCode: 'TYMICT',
    year: 3,
    phase: 1,
    name: 'AI 미들웨어/융합 엔진 v1.0',
    nameEn: 'AI Middleware/Fusion Engine v1.0',
    type: 'SYS',
    status: 'planned',
    description: '멀티모달 AI 추론 및 센서 융합 엔진',
    startDate: new Date('2027-03-01'),
    targetDate: new Date('2027-08-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '멀티모델 추론', target: 'FPS≥15', current: '-', status: 'not_started' },
      { metric: '융합 지연', target: '≤10ms', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-11']
  },
  {
    id: 'UI-03-11',
    projectId: 'PRJ-ASW-2027',
    institutionCode: 'TYMICT',
    year: 3,
    phase: 1,
    name: 'HMI 통합 표시 v2.0',
    nameEn: 'HMI Integrated Display v2.0',
    type: 'UI',
    status: 'planned',
    description: '통합 HMI 디스플레이 시스템',
    startDate: new Date('2027-06-01'),
    targetDate: new Date('2027-10-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: 'UI 반응속도', target: '<100ms', current: '-', status: 'not_started' },
      { metric: '시인성 평가', target: '>4.5/5.0', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-12', 'UI-02-11']
  },
  {
    id: 'DOC-03-11',
    projectId: 'PRJ-ASW-2027',
    institutionCode: 'TYMICT',
    year: 3,
    phase: 1,
    name: '통합 검증 리포트 v2.0',
    nameEn: 'Integration Verification Report v2.0',
    type: 'DOC',
    status: 'planned',
    description: '2세대 시스템 통합 검증 보고서',
    startDate: new Date('2027-09-01'),
    targetDate: new Date('2027-11-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: 'OTA 실패율', target: '≤2%', current: '-', status: 'not_started' },
      { metric: '신뢰성', target: 'MTBF>1000h', current: '-', status: 'not_started' }
    ],
    dependencies: ['UI-03-11']
  },

  // JBN - 측위/인지 고도화 (경량화·강화학습)
  {
    id: 'SYS-03-21',
    projectId: 'PRJ-ASW-2027',
    institutionCode: 'JBN',
    year: 3,
    phase: 1,
    name: '측위 고도화 v2.0',
    nameEn: 'Advanced Positioning v2.0',
    type: 'SYS',
    status: 'planned',
    description: '다중 센서 융합 측위 (GNSS/IMU/Vision)',
    startDate: new Date('2027-01-01'),
    targetDate: new Date('2027-05-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '위치 RMSE', target: '≤0.15m', current: '-', status: 'not_started' },
      { metric: 'GNSS 음영지역', target: '동작', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-21']
  },
  {
    id: 'SYS-03-22',
    projectId: 'PRJ-ASW-2027',
    institutionCode: 'JBN',
    year: 3,
    phase: 1,
    name: '인지 고도화 v2.0',
    nameEn: 'Advanced Perception v2.0',
    type: 'SYS',
    status: 'planned',
    description: '경량화 및 강화학습 기반 인지 모델',
    startDate: new Date('2027-03-01'),
    targetDate: new Date('2027-08-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: 'mIoU', target: '≥0.72', current: '-', status: 'not_started' },
      { metric: '모델 크기', target: '-30%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-22']
  },
  {
    id: 'DATA-03-21',
    projectId: 'PRJ-ASW-2027',
    institutionCode: 'JBN',
    year: 3,
    phase: 1,
    name: '공간정보 학습셋 v2.0',
    nameEn: 'Spatial Info Training Set v2.0',
    type: 'DATA',
    status: 'planned',
    description: '강화학습용 공간정보 데이터셋',
    startDate: new Date('2027-05-01'),
    targetDate: new Date('2027-09-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '데이터 규모', target: '>50,000장', current: '-', status: 'not_started' },
      { metric: '다양성 지수', target: '>0.8', current: '-', status: 'not_started' }
    ],
    dependencies: ['DATA-02-21']
  },
  {
    id: 'DOC-03-21',
    projectId: 'PRJ-ASW-2027',
    institutionCode: 'JBN',
    year: 3,
    phase: 1,
    name: '강화학습/경량화 보고서 v1.0',
    nameEn: 'RL/Lightweighting Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '강화학습 및 모델 경량화 기술 보고서',
    startDate: new Date('2027-08-01'),
    targetDate: new Date('2027-11-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '기술 완성도', target: '100%', current: '-', status: 'not_started' },
      { metric: '재현 가능성', target: '보장', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-21', 'SYS-03-22']
  },

  // VIA - Git 협업 고도화 + 프로젝트 대시보드
  {
    id: 'SYS-03-31',
    projectId: 'PRJ-ASW-2027',
    institutionCode: 'VIA',
    year: 3,
    phase: 1,
    name: '협업 워크플로우 v2.0',
    nameEn: 'Collaboration Workflow v2.0',
    type: 'SYS',
    status: 'planned',
    description: 'Fork/PR/Merge 기반 협업 시스템',
    startDate: new Date('2027-01-01'),
    targetDate: new Date('2027-04-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: 'PR→Merge', target: 'p50≤3일', current: '-', status: 'not_started' },
      { metric: '롤백률', target: '≤1%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-32']
  },
  {
    id: 'UI-03-31',
    projectId: 'PRJ-ASW-2027',
    institutionCode: 'VIA',
    year: 3,
    phase: 1,
    name: '프로젝트 보드·Wiki·Issues v1.0',
    nameEn: 'Project Board/Wiki/Issues v1.0',
    type: 'UI',
    status: 'planned',
    description: '프로젝트 관리 대시보드 및 협업 도구',
    startDate: new Date('2027-03-01'),
    targetDate: new Date('2027-07-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: 'MTTR', target: '≤1h', current: '-', status: 'not_started' },
      { metric: '사용률', target: '>80%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-31']
  },
  {
    id: 'OPS-03-31',
    projectId: 'PRJ-ASW-2027',
    institutionCode: 'VIA',
    year: 3,
    phase: 1,
    name: '활동 로그·감사 대시보드 v1.0',
    nameEn: 'Activity Log/Audit Dashboard v1.0',
    type: 'OPS',
    status: 'planned',
    description: '활동 로깅 및 감사 추적 시스템',
    startDate: new Date('2027-06-01'),
    targetDate: new Date('2027-09-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '로그 커버리지', target: '100%', current: '-', status: 'not_started' },
      { metric: '검색 성능', target: '<1초', current: '-', status: 'not_started' }
    ],
    dependencies: ['UI-03-31']
  },

  // OntarioTech - 북미형 협업/협동 최적화
  {
    id: 'SYS-03-41',
    projectId: 'PRJ-ASW-2027',
    institutionCode: 'OntarioTech',
    year: 3,
    phase: 1,
    name: '북미형 경로 최적화 엔진 v2.0',
    nameEn: 'NA Path Optimization Engine v2.0',
    type: 'SYS',
    status: 'planned',
    description: '북미 대규모 농장용 경로 최적화',
    startDate: new Date('2027-02-01'),
    targetDate: new Date('2027-06-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '대기시간', target: '-15%', current: '-', status: 'not_started' },
      { metric: '처리면적', target: '>1000ha/일', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-02-41']
  },
  {
    id: 'SYS-03-42',
    projectId: 'PRJ-ASW-2027',
    institutionCode: 'OntarioTech',
    year: 3,
    phase: 1,
    name: '협업/협동 스케줄러 v2.0',
    nameEn: 'Collaboration Scheduler v2.0',
    type: 'SYS',
    status: 'planned',
    description: '다중 장비 협업/협동 스케줄링',
    startDate: new Date('2027-05-01'),
    targetDate: new Date('2027-09-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '총주행거리', target: '-12%', current: '-', status: 'not_started' },
      { metric: '협업 효율', target: '>90%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-41']
  },
  {
    id: 'DOC-03-41',
    projectId: 'PRJ-ASW-2027',
    institutionCode: 'OntarioTech',
    year: 3,
    phase: 1,
    name: '북미 시나리오 성능 보고서 v1.0',
    nameEn: 'NA Scenario Performance Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '북미형 농장 시나리오 성능 검증',
    startDate: new Date('2027-08-01'),
    targetDate: new Date('2027-11-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '시나리오 수', target: '>30개', current: '-', status: 'not_started' },
      { metric: '검증 완료', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-42']
  },

  // ============================================
  // 2단계 1차년도 (2028.01 ~ 2028.12)
  // 군집·협업, MIL/HIL, 플랫폼-시뮬레이터 연동
  // ============================================

  // KITECH - V2X 군집/협업 + MIL/HIL
  {
    id: 'SYS-04-01',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'KITECH',
    year: 4,
    phase: 2,
    name: 'V2X 협업 제어 모듈 v1.0',
    nameEn: 'V2X Collaborative Control Module v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'V2X 기반 다중 장비 협업 제어 시스템',
    startDate: new Date('2028-01-01'),
    targetDate: new Date('2028-04-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '상호거리 오차', target: 'p95≤20cm', current: '-', status: 'not_started' },
      { metric: '협업 충돌', target: '0건', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-03']
  },
  {
    id: 'SYS-04-02',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'KITECH',
    year: 4,
    phase: 2,
    name: 'MIL 통합 연동 시나리오팩 v1.0',
    nameEn: 'MIL Integration Scenario Pack v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'MIL 시뮬레이션 통합 연동 시나리오',
    startDate: new Date('2028-03-01'),
    targetDate: new Date('2028-07-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '시나리오 수', target: '>30개', current: '-', status: 'not_started' },
      { metric: '검증 통과율', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-01']
  },
  {
    id: 'SYS-04-03',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'KITECH',
    year: 4,
    phase: 2,
    name: 'HIL 검증환경 v1.0',
    nameEn: 'HIL Verification Environment v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'Hardware-in-the-Loop 검증 환경',
    startDate: new Date('2028-06-01'),
    targetDate: new Date('2028-10-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: 'HIL 케이스', target: '30개 통과', current: '-', status: 'not_started' },
      { metric: '실제 일치율', target: '>95%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-02']
  },
  {
    id: 'DOC-04-01',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'KITECH',
    year: 4,
    phase: 2,
    name: 'Part14 개선 제안서 v1.0',
    nameEn: 'Part14 Improvement Proposal v1.0',
    type: 'DOC',
    status: 'planned',
    description: 'ISOBUS Part14 시퀀스 제어 표준 개선안',
    startDate: new Date('2028-08-01'),
    targetDate: new Date('2028-11-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '개선 제안', target: '>15개', current: '-', status: 'not_started' },
      { metric: 'ISO 제출', target: '완료', current: '-', status: 'not_started' }
    ],
    dependencies: ['DOC-03-01']
  },

  // TYMICT - 고성능 다중 센서 AI 융합
  {
    id: 'SYS-04-11',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'TYMICT',
    year: 4,
    phase: 2,
    name: '통합 하드웨어 플랫폼 v2.0',
    nameEn: 'Integrated HW Platform v2.0',
    type: 'SYS',
    status: 'planned',
    description: '고성능 멀티프로세싱 하드웨어 플랫폼',
    startDate: new Date('2028-01-01'),
    targetDate: new Date('2028-05-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: 'AI 융합 지연', target: '≤5ms', current: '-', status: 'not_started' },
      { metric: '처리 채널', target: '>8ch', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-11']
  },
  {
    id: 'SYS-04-12',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'TYMICT',
    year: 4,
    phase: 2,
    name: 'AI 플랫폼 미들웨어 v2.0',
    nameEn: 'AI Platform Middleware v2.0',
    type: 'SYS',
    status: 'planned',
    description: 'AI 모델 관리 및 자동 배포 시스템',
    startDate: new Date('2028-03-01'),
    targetDate: new Date('2028-08-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '모델 배포시간', target: '<5분', current: '-', status: 'not_started' },
      { metric: '버전 관리', target: '자동화', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-11']
  },
  {
    id: 'OPS-04-11',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'TYMICT',
    year: 4,
    phase: 2,
    name: '다층 안전 감시/로깅 체계 v1.0',
    nameEn: 'Multi-layer Safety Monitoring v1.0',
    type: 'OPS',
    status: 'planned',
    description: '다층 안전 감시 및 로깅 시스템',
    startDate: new Date('2028-06-01'),
    targetDate: new Date('2028-10-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '시스템 가용성', target: '≥99.9%', current: '-', status: 'not_started' },
      { metric: '장애 감지', target: '<1초', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-12']
  },
  {
    id: 'DOC-04-11',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'TYMICT',
    year: 4,
    phase: 2,
    name: '전체 시스템 통합 검증 보고서 v1.0',
    nameEn: 'System Integration Verification Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '전체 시스템 통합 및 내구성 검증',
    startDate: new Date('2028-09-01'),
    targetDate: new Date('2028-11-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '내구 테스트', target: '1000h 통과', current: '-', status: 'not_started' },
      { metric: '신뢰도', target: 'MTBF>2000h', current: '-', status: 'not_started' }
    ],
    dependencies: ['OPS-04-11']
  },

  // JBN - 강화학습 기반 고도화
  {
    id: 'SYS-04-21',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'JBN',
    year: 4,
    phase: 2,
    name: 'RL-보강 전역 경로계획 모듈 v1.0',
    nameEn: 'RL-Enhanced Global Path Planning v1.0',
    type: 'SYS',
    status: 'planned',
    description: '강화학습 기반 전역 경로계획',
    startDate: new Date('2028-01-01'),
    targetDate: new Date('2028-05-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '경로계획 성공률', target: '≥98%', current: '-', status: 'not_started' },
      { metric: '최적성', target: '>95%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-22']
  },
  {
    id: 'SYS-04-22',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'JBN',
    year: 4,
    phase: 2,
    name: '비정형 장애물 인지 모듈 v1.0',
    nameEn: 'Irregular Obstacle Detection v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'Transformer 기반 비정형 장애물 인지',
    startDate: new Date('2028-03-01'),
    targetDate: new Date('2028-08-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '인지 F1', target: '≥0.8', current: '-', status: 'not_started' },
      { metric: '처리속도', target: '>20FPS', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-21']
  },
  {
    id: 'DATA-04-21',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'JBN',
    year: 4,
    phase: 2,
    name: '학습/평가 세트 v1.0',
    nameEn: 'Training/Evaluation Set v1.0',
    type: 'DATA',
    status: 'planned',
    description: '메타 및 시각-언어 보강 데이터셋',
    startDate: new Date('2028-05-01'),
    targetDate: new Date('2028-09-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '데이터 규모', target: '>100,000장', current: '-', status: 'not_started' },
      { metric: '어노테이션 품질', target: '>98%', current: '-', status: 'not_started' }
    ],
    dependencies: ['DATA-03-21']
  },
  {
    id: 'DOC-04-21',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'JBN',
    year: 4,
    phase: 2,
    name: '고도화 알고리즘 보고서 v1.0',
    nameEn: 'Advanced Algorithm Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: 'RL 및 Transformer 기반 알고리즘 보고서',
    startDate: new Date('2028-08-01'),
    targetDate: new Date('2028-11-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '논문 게재', target: '>2편', current: '-', status: 'not_started' },
      { metric: '특허 출원', target: '>3건', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-22']
  },

  // VIA - CI/CD 자동 배포 + 시뮬레이터 연동
  {
    id: 'INT-04-31',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'VIA',
    year: 4,
    phase: 2,
    name: '연동 인터페이스 스펙 v1.0',
    nameEn: 'Integration Interface Spec v1.0',
    type: 'INT',
    status: 'planned',
    description: 'A-SW → ICU → 시뮬레이터 연동 스펙',
    startDate: new Date('2028-01-01'),
    targetDate: new Date('2028-03-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '인터페이스 정의', target: '100%', current: '-', status: 'not_started' },
      { metric: '호환성 테스트', target: '통과', current: '-', status: 'not_started' }
    ],
    dependencies: ['OPS-03-31']
  },
  {
    id: 'SYS-04-31',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'VIA',
    year: 4,
    phase: 2,
    name: 'CI/CD 자동 시험 파이프라인 v1.0',
    nameEn: 'CI/CD Auto Test Pipeline v1.0',
    type: 'SYS',
    status: 'planned',
    description: '자동화된 테스트 및 배포 파이프라인',
    startDate: new Date('2028-02-01'),
    targetDate: new Date('2028-06-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '테스트 커버리지', target: '≥80%', current: '-', status: 'not_started' },
      { metric: '배포 시간', target: 'p50≤30분', current: '-', status: 'not_started' }
    ],
    dependencies: ['INT-04-31']
  },
  {
    id: 'SYS-04-32',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'VIA',
    year: 4,
    phase: 2,
    name: '시뮬레이터 연동/검증 모듈 v1.0',
    nameEn: 'Simulator Integration Module v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'MIL/SIL 시뮬레이터 연동 모듈',
    startDate: new Date('2028-04-01'),
    targetDate: new Date('2028-08-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '연동 성공률', target: '100%', current: '-', status: 'not_started' },
      { metric: '시뮬레이션 정확도', target: '>95%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-31']
  },
  {
    id: 'UI-04-31',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'VIA',
    year: 4,
    phase: 2,
    name: '관리자·연동 대시보드 v1.0',
    nameEn: 'Admin/Integration Dashboard v1.0',
    type: 'UI',
    status: 'planned',
    description: '관리자 및 연동 모니터링 대시보드',
    startDate: new Date('2028-06-01'),
    targetDate: new Date('2028-09-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '실시간 모니터링', target: '지연<1초', current: '-', status: 'not_started' },
      { metric: '시각화 품질', target: '>4.5/5.0', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-32']
  },
  {
    id: 'OPS-04-31',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'VIA',
    year: 4,
    phase: 2,
    name: '교육용 시제품·개발자 키트 v1.0',
    nameEn: 'Educational Kit/SDK v1.0',
    type: 'OPS',
    status: 'planned',
    description: '교육용 시제품 및 개발자 키트',
    startDate: new Date('2028-08-01'),
    targetDate: new Date('2028-10-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '문서 완성도', target: '100%', current: '-', status: 'not_started' },
      { metric: '샘플 프로젝트', target: '>10개', current: '-', status: 'not_started' }
    ],
    dependencies: ['UI-04-31']
  },
  {
    id: 'DOC-04-31',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'VIA',
    year: 4,
    phase: 2,
    name: '운영·성과 분석 보고서 v1.0',
    nameEn: 'Operation/Performance Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '플랫폼 운영 및 성과 분석',
    startDate: new Date('2028-10-01'),
    targetDate: new Date('2028-11-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '결함 탐지율', target: '≥85%', current: '-', status: 'not_started' },
      { metric: '사용자 만족도', target: '>4.0/5.0', current: '-', status: 'not_started' }
    ],
    dependencies: ['OPS-04-31']
  },

  // OntarioTech - MIL 연동 검증
  {
    id: 'SYS-04-41',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'OntarioTech',
    year: 4,
    phase: 2,
    name: 'MIL 연동 검증 스위트 v1.0',
    nameEn: 'MIL Integration Test Suite v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'MIL 통합 검증 테스트 스위트',
    startDate: new Date('2028-02-01'),
    targetDate: new Date('2028-06-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '테스트 케이스', target: '>50개', current: '-', status: 'not_started' },
      { metric: '커버리지', target: '>90%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-03-42']
  },
  {
    id: 'UI-04-41',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'OntarioTech',
    year: 4,
    phase: 2,
    name: '모듈형 GUI v1.0',
    nameEn: 'Modular GUI v1.0',
    type: 'UI',
    status: 'planned',
    description: '파라미터 입력 및 효과 분석 GUI',
    startDate: new Date('2028-05-01'),
    targetDate: new Date('2028-09-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '모듈 수', target: '>20개', current: '-', status: 'not_started' },
      { metric: 'UX 평가', target: '>4.0/5.0', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-41']
  },
  {
    id: 'DOC-04-41',
    projectId: 'PRJ-ASW-2028',
    institutionCode: 'OntarioTech',
    year: 4,
    phase: 2,
    name: '시나리오 기반 성능 고도화 보고서 v1.0',
    nameEn: 'Scenario Performance Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '시나리오별 성능 분석 및 고도화',
    startDate: new Date('2028-08-01'),
    targetDate: new Date('2028-11-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '분석 시나리오', target: '>40개', current: '-', status: 'not_started' },
      { metric: '성능 개선', target: '>15%', current: '-', status: 'not_started' }
    ],
    dependencies: ['UI-04-41']
  },

  // ============================================
  // 2단계 2차년도 (2029.01 ~ 2029.12)
  // 현장 실증·안전 인증·표준 개선·상용화 준비
  // ============================================

  // KITECH - 현장 실증 + HIL 기능안전
  {
    id: 'DOC-05-01',
    projectId: 'PRJ-ASW-2029',
    institutionCode: 'KITECH',
    year: 5,
    phase: 2,
    name: '현장 실증 종합 보고서 v1.0',
    nameEn: 'Field Test Comprehensive Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '현장 실증 및 문제 개선 이력',
    startDate: new Date('2029-01-01'),
    targetDate: new Date('2029-06-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '실증 횟수', target: '>50회', current: '-', status: 'not_started' },
      { metric: '장애 재현률', target: '≤5%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-03']
  },
  {
    id: 'SYS-05-01',
    projectId: 'PRJ-ASW-2029',
    institutionCode: 'KITECH',
    year: 5,
    phase: 2,
    name: 'HIL 기능안전 케이스팩 v1.0',
    nameEn: 'HIL Functional Safety Case Pack v1.0',
    type: 'SYS',
    status: 'planned',
    description: '기능안전 인증용 HIL 테스트 케이스',
    startDate: new Date('2029-03-01'),
    targetDate: new Date('2029-08-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '안전 테스트', target: '통과율≥95%', current: '-', status: 'not_started' },
      { metric: 'ISO 26262', target: 'ASIL-B', current: '-', status: 'not_started' }
    ],
    dependencies: ['DOC-05-01']
  },
  {
    id: 'DOC-05-02',
    projectId: 'PRJ-ASW-2029',
    institutionCode: 'KITECH',
    year: 5,
    phase: 2,
    name: 'V2X 통신 I/F 표준 개선 제안서 v1.0',
    nameEn: 'V2X Interface Standard Proposal v1.0',
    type: 'DOC',
    status: 'planned',
    description: 'V2X 통신 인터페이스 표준 개선안',
    startDate: new Date('2029-07-01'),
    targetDate: new Date('2029-10-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '표준 제안', target: '>20개', current: '-', status: 'not_started' },
      { metric: '국제표준 제출', target: '완료', current: '-', status: 'not_started' }
    ],
    dependencies: ['DOC-04-01']
  },

  // TYMICT - 상용화 파일럿
  {
    id: 'SYS-05-11',
    projectId: 'PRJ-ASW-2029',
    institutionCode: 'TYMICT',
    year: 5,
    phase: 2,
    name: '고성능 통합제어기 최종 파일럿 v1.0',
    nameEn: 'High-Performance ICU Final Pilot v1.0',
    type: 'SYS',
    status: 'planned',
    description: '상용화 준비 최종 파일럿 하드웨어',
    startDate: new Date('2029-01-01'),
    targetDate: new Date('2029-05-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: 'MTBF', target: '≥5000h', current: '-', status: 'not_started' },
      { metric: '생산 준비', target: '완료', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-11']
  },
  {
    id: 'SYS-05-12',
    projectId: 'PRJ-ASW-2029',
    institutionCode: 'TYMICT',
    year: 5,
    phase: 2,
    name: 'AI 미들웨어 최종 패키지 v1.0',
    nameEn: 'AI Middleware Final Package v1.0',
    type: 'SYS',
    status: 'planned',
    description: '상용 AI 미들웨어 최종 패키지',
    startDate: new Date('2029-03-01'),
    targetDate: new Date('2029-07-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '전체 지연', target: 'p95≤80ms', current: '-', status: 'not_started' },
      { metric: '안정성', target: '99.99%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-05-11']
  },
  {
    id: 'UI-05-11',
    projectId: 'PRJ-ASW-2029',
    institutionCode: 'TYMICT',
    year: 5,
    phase: 2,
    name: 'HMI 최종 패키지 v1.0',
    nameEn: 'HMI Final Package v1.0',
    type: 'UI',
    status: 'planned',
    description: '상용 HMI 시스템 최종 버전',
    startDate: new Date('2029-05-01'),
    targetDate: new Date('2029-09-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '사용성', target: '>4.8/5.0', current: '-', status: 'not_started' },
      { metric: '다국어 지원', target: '5개국어', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-05-12']
  },
  {
    id: 'DOC-05-11',
    projectId: 'PRJ-ASW-2029',
    institutionCode: 'TYMICT',
    year: 5,
    phase: 2,
    name: '기술문서·사용자 매뉴얼·벤치마크 v1.0',
    nameEn: 'Technical Documentation Package v1.0',
    type: 'DOC',
    status: 'planned',
    description: '완전한 기술 문서 및 사용자 매뉴얼',
    startDate: new Date('2029-08-01'),
    targetDate: new Date('2029-11-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '문서 완성도', target: '100%', current: '-', status: 'not_started' },
      { metric: '상용화 체크', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['UI-05-11']
  },

  // JBN - 최적화 배포모델
  {
    id: 'SYS-05-21',
    projectId: 'PRJ-ASW-2029',
    institutionCode: 'JBN',
    year: 5,
    phase: 2,
    name: '위치추정 경량화·통합 배포 v1.0',
    nameEn: 'Positioning Lightweight Deployment v1.0',
    type: 'SYS',
    status: 'planned',
    description: 'ONNX/양자화 기반 경량 배포 모델',
    startDate: new Date('2029-01-01'),
    targetDate: new Date('2029-05-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '모델 크기', target: '<100MB', current: '-', status: 'not_started' },
      { metric: '온디바이스 FPS', target: '>30', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-04-21']
  },
  {
    id: 'SYS-05-22',
    projectId: 'PRJ-ASW-2029',
    institutionCode: 'JBN',
    year: 5,
    phase: 2,
    name: 'RL 경로계획 통합 배포 v1.0',
    nameEn: 'RL Path Planning Deployment v1.0',
    type: 'SYS',
    status: 'planned',
    description: '강화학습 경로계획 통합 배포 버전',
    startDate: new Date('2029-03-01'),
    targetDate: new Date('2029-07-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '배포 성공률', target: '100%', current: '-', status: 'not_started' },
      { metric: '실시간 성능', target: '보장', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-05-21']
  },
  {
    id: 'DATA-05-21',
    projectId: 'PRJ-ASW-2029',
    institutionCode: 'JBN',
    year: 5,
    phase: 2,
    name: '실증 기반 튜닝셋 v1.0',
    nameEn: 'Field-based Tuning Set v1.0',
    type: 'DATA',
    status: 'planned',
    description: '실증 데이터 기반 파인튜닝 데이터셋',
    startDate: new Date('2029-05-01'),
    targetDate: new Date('2029-09-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '실증 데이터', target: '>200,000장', current: '-', status: 'not_started' },
      { metric: '품질 검증', target: '100%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-05-22']
  },
  {
    id: 'DOC-05-21',
    projectId: 'PRJ-ASW-2029',
    institutionCode: 'JBN',
    year: 5,
    phase: 2,
    name: '통합 개방형 SW 구성·검증 보고서 v1.0',
    nameEn: 'Integrated Open SW Report v1.0',
    type: 'DOC',
    status: 'planned',
    description: '개방형 SW 최종 구성 및 검증',
    startDate: new Date('2029-08-01'),
    targetDate: new Date('2029-11-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '테스트베드 검증', target: '완료', current: '-', status: 'not_started' },
      { metric: '성능 목표', target: '100% 달성', current: '-', status: 'not_started' }
    ],
    dependencies: ['DATA-05-21']
  },

  // VIA - 플랫폼 운영 정착
  {
    id: 'OPS-05-31',
    projectId: 'PRJ-ASW-2029',
    institutionCode: 'VIA',
    year: 5,
    phase: 2,
    name: '정적 분석 통합 파이프라인 v1.0',
    nameEn: 'Static Analysis Pipeline v1.0',
    type: 'OPS',
    status: 'planned',
    description: 'SAST/SCA/SBOM 통합 분석 시스템',
    startDate: new Date('2029-01-01'),
    targetDate: new Date('2029-04-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '정책 위반 감지', target: '≥90%', current: '-', status: 'not_started' },
      { metric: '자동 수정', target: '>70%', current: '-', status: 'not_started' }
    ],
    dependencies: ['DOC-04-31']
  },
  {
    id: 'SYS-05-31',
    projectId: 'PRJ-ASW-2029',
    institutionCode: 'VIA',
    year: 5,
    phase: 2,
    name: 'AI 탐색/추천 엔진 v1.0',
    nameEn: 'AI Search/Recommendation Engine v1.0',
    type: 'SYS',
    status: 'planned',
    description: '자동 태깅 및 개인화 추천 시스템',
    startDate: new Date('2029-03-01'),
    targetDate: new Date('2029-07-31'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '추천 CTR', target: '≥8%', current: '-', status: 'not_started' },
      { metric: '태깅 정확도', target: '>95%', current: '-', status: 'not_started' }
    ],
    dependencies: ['OPS-05-31']
  },
  {
    id: 'UI-05-31',
    projectId: 'PRJ-ASW-2029',
    institutionCode: 'VIA',
    year: 5,
    phase: 2,
    name: '커뮤니티·Q&A·기여 등급 시스템 v1.0',
    nameEn: 'Community/QA/Contribution System v1.0',
    type: 'UI',
    status: 'planned',
    description: '개발자 커뮤니티 및 기여도 시스템',
    startDate: new Date('2029-05-01'),
    targetDate: new Date('2029-09-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '월간 활성 사용자', target: '50+', current: '-', status: 'not_started' },
      { metric: '기여도 증가율', target: '>20%', current: '-', status: 'not_started' }
    ],
    dependencies: ['SYS-05-31']
  },
  {
    id: 'DOC-05-31',
    projectId: 'PRJ-ASW-2029',
    institutionCode: 'VIA',
    year: 5,
    phase: 2,
    name: '온라인 기술백서 v1.0',
    nameEn: 'Online Technical Documentation v1.0',
    type: 'DOC',
    status: 'planned',
    description: '온라인 기술백서 및 운영 가이드',
    startDate: new Date('2029-08-01'),
    targetDate: new Date('2029-11-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '문서 완성도', target: '100%', current: '-', status: 'not_started' },
      { metric: '개발자 가이드', target: '50+ 문서', current: '-', status: 'not_started' }
    ],
    dependencies: ['UI-05-31']
  },

  // OntarioTech - HIL/실차 고도화
  {
    id: 'DOC-05-41',
    projectId: 'PRJ-ASW-2029',
    institutionCode: 'OntarioTech',
    year: 5,
    phase: 2,
    name: 'HIL·실차 시나리오·구성안 v1.0',
    nameEn: 'HIL/Vehicle Test Scenario v1.0',
    type: 'DOC',
    status: 'planned',
    description: 'HIL 및 실차 시험 시나리오',
    startDate: new Date('2029-02-01'),
    targetDate: new Date('2029-06-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '시나리오 수', target: '>100개', current: '-', status: 'not_started' },
      { metric: '실차-HIL 상관', target: '≥0.9', current: '-', status: 'not_started' }
    ],
    dependencies: ['DOC-04-41']
  },
  {
    id: 'SYS-05-41',
    projectId: 'PRJ-ASW-2029',
    institutionCode: 'OntarioTech',
    year: 5,
    phase: 2,
    name: '성능 고도화 패치셋 v1.0',
    nameEn: 'Performance Enhancement Patch v1.0',
    type: 'SYS',
    status: 'planned',
    description: '최종 성능 고도화 패치',
    startDate: new Date('2029-05-01'),
    targetDate: new Date('2029-09-30'),
    progress: 0,
    version: '0.0',
    kpi: [
      { metric: '작업시간', target: '-15%', current: '-', status: 'not_started' },
      { metric: '효율성', target: '>95%', current: '-', status: 'not_started' }
    ],
    dependencies: ['DOC-05-41']
  }
];