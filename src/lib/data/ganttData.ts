/**
 * A-SW 통합 계획 Gantt Chart 데이터
 * 1단계 3개년 + 2단계 2개년 타임라인
 *
 * 연차별 기간:
 * - 1단계 1차년도: 2025년 9월 ~ 2025년 12월 (4개월)
 * - 1단계 2차년도: 2026년 1월 ~ 2026년 12월 (12개월)
 * - 1단계 3차년도: 2027년 1월 ~ 2027년 12월 (12개월)
 * - 2단계 1차년도: 2028년 1월 ~ 2028년 12월 (12개월)
 * - 2단계 2차년도: 2029년 1월 ~ 2029년 12월 (12개월)
 */

import type { GanttTask } from '$lib/types/businessPlan';
import { deliverables } from './deliverables';

// 색상 팔레트 (흑백 농도)
const COLORS = {
  KITECH: '#000000',
  TYMICT: '#333333',
  JBNU: '#555555',
  VIA: '#777777',
  OntarioTech: '#999999',
  milestone: '#000000',
  phase: '#FFFFFF'
};

// Gantt 차트 데이터 생성 함수
function generateGanttData(): GanttTask[] {
  const ganttTasks: GanttTask[] = [];

  // 1단계 (3개년)
  const phase1: GanttTask = {
    id: 'PHASE-1',
    name: '【1단계】 핵심 기술 개발 및 플랫폼 구축',
    startDate: new Date('2025-09-01'),
    endDate: new Date('2027-12-31'),
    progress: calculatePhaseProgress(1),
    type: 'phase',
    color: COLORS.phase,
    children: []
  };

  // 1단계 1차년도
  const year1: GanttTask = {
    id: 'YEAR-1',
    name: '▶ 1단계 1차년도: 요구·분석·아키텍처 정립 (2025.09-12)',
    startDate: new Date('2025-09-01'),
    endDate: new Date('2025-12-31'),
    progress: calculateYearProgress(1),
    type: 'phase',
    children: []
  };

  // 1차년도 기관별 태스크
  year1.children = [
    {
      id: 'Y1-KITECH',
      name: 'KITECH: 농작업 분석·모듈화',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-12-31'),
      progress: calculateInstitutionProgress(1, 'KITECH'),
      type: 'deliverable',
      institution: 'KITECH',
      color: COLORS.KITECH,
      assignees: ['김태영', '이준호'],
      children: deliverables
        .filter(d => d.year === 1 && d.institutionCode === 'KITECH')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'KITECH',
          color: COLORS.KITECH
        }))
    },
    {
      id: 'Y1-TYMICT',
      name: 'TYMICT: 요구사항·시스템 아키텍처',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-12-31'),
      progress: calculateInstitutionProgress(1, 'TYMICT'),
      type: 'deliverable',
      institution: 'TYMICT',
      color: COLORS.TYMICT,
      assignees: ['박성민'],
      children: deliverables
        .filter(d => d.year === 1 && d.institutionCode === 'TYMICT')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'TYMICT',
          color: COLORS.TYMICT
        }))
    },
    {
      id: 'Y1-VIA',
      name: 'VIA: A-SW 서비스 플랫폼 아키텍처',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-12-31'),
      progress: calculateInstitutionProgress(1, 'VIA'),
      type: 'deliverable',
      institution: 'VIA',
      color: COLORS.VIA,
      assignees: ['송재훈', '이소윤'],
      children: deliverables
        .filter(d => d.year === 1 && d.institutionCode === 'VIA')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'VIA',
          color: COLORS.VIA
        }))
    }
  ];

  // 1단계 2차년도
  const year2: GanttTask = {
    id: 'YEAR-2',
    name: '▶ 1단계 2차년도: 알고리즘·HW 구현, 플랫폼 기능화 (2026.01-12)',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-12-31'),
    progress: calculateYearProgress(2),
    type: 'phase',
    children: []
  };

  year2.children = [
    {
      id: 'Y2-KITECH',
      name: 'KITECH: 경로 생성/추종/속도 제어',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-11-30'),
      progress: calculateInstitutionProgress(2, 'KITECH'),
      type: 'deliverable',
      institution: 'KITECH',
      color: COLORS.KITECH,
      assignees: ['김태영', '이준호'],
      children: deliverables
        .filter(d => d.year === 2 && d.institutionCode === 'KITECH')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'KITECH',
          color: COLORS.KITECH,
          dependencies: d.dependencies
        }))
    },
    {
      id: 'Y2-TYMICT',
      name: 'TYMICT: 통합제어기/안전/HMI',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      progress: calculateInstitutionProgress(2, 'TYMICT'),
      type: 'deliverable',
      institution: 'TYMICT',
      color: COLORS.TYMICT,
      assignees: ['박성민', '정하늘'],
      children: deliverables
        .filter(d => d.year === 2 && d.institutionCode === 'TYMICT')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'TYMICT',
          color: COLORS.TYMICT,
          dependencies: d.dependencies
        }))
    },
    {
      id: 'Y2-JBNU',
      name: 'JBNU: 측위·환경인지·공간정보',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-11-30'),
      progress: calculateInstitutionProgress(2, 'JBNU'),
      type: 'deliverable',
      institution: 'JBNU',
      color: COLORS.JBNU,
      assignees: ['최민수', '김서연'],
      children: deliverables
        .filter(d => d.year === 2 && d.institutionCode === 'JBNU')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'JBNU',
          color: COLORS.JBNU,
          dependencies: d.dependencies
        }))
    },
    {
      id: 'Y2-VIA',
      name: 'VIA: 온보딩/인증/등록/Repo',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-09-30'),
      progress: calculateInstitutionProgress(2, 'VIA'),
      type: 'deliverable',
      institution: 'VIA',
      color: COLORS.VIA,
      assignees: ['송재훈', '이소윤', '한도윤'],
      children: deliverables
        .filter(d => d.year === 2 && d.institutionCode === 'VIA')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'VIA',
          color: COLORS.VIA,
          dependencies: d.dependencies
        }))
    },
    {
      id: 'Y2-OntarioTech',
      name: 'OntarioTech: 경로 최적화·할당',
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-12-31'),
      progress: calculateInstitutionProgress(2, 'OntarioTech'),
      type: 'deliverable',
      institution: 'OntarioTech',
      color: COLORS.OntarioTech,
      assignees: ['Michael Chen', 'Sarah Johnson'],
      children: deliverables
        .filter(d => d.year === 2 && d.institutionCode === 'OntarioTech')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'OntarioTech',
          color: COLORS.OntarioTech,
          dependencies: d.dependencies
        }))
    }
  ];

  // 1단계 3차년도
  const year3: GanttTask = {
    id: 'YEAR-3',
    name: '▶ 1단계 3차년도: 작업기 제어/모니터링, MIL, 협업 고도화 (2027.01-12)',
    startDate: new Date('2027-01-01'),
    endDate: new Date('2027-12-31'),
    progress: calculateYearProgress(3),
    type: 'phase',
    children: []
  };

  year3.children = [
    {
      id: 'Y3-KITECH',
      name: 'KITECH: 작업기 제어/모니터링 + MIL',
      startDate: new Date('2027-01-01'),
      endDate: new Date('2027-11-30'),
      progress: calculateInstitutionProgress(3, 'KITECH'),
      type: 'deliverable',
      institution: 'KITECH',
      color: COLORS.KITECH,
      assignees: ['김태영', '이준호'],
      children: deliverables
        .filter(d => d.year === 3 && d.institutionCode === 'KITECH')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'KITECH',
          color: COLORS.KITECH,
          dependencies: d.dependencies
        }))
    },
    {
      id: 'Y3-TYMICT',
      name: 'TYMICT: ICU Rev.2 + AI 미들웨어',
      startDate: new Date('2027-01-01'),
      endDate: new Date('2027-12-31'),
      progress: calculateInstitutionProgress(3, 'TYMICT'),
      type: 'deliverable',
      institution: 'TYMICT',
      color: COLORS.TYMICT,
      assignees: ['박성민', '정하늘'],
      children: deliverables
        .filter(d => d.year === 3 && d.institutionCode === 'TYMICT')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'TYMICT',
          color: COLORS.TYMICT,
          dependencies: d.dependencies
        }))
    },
    {
      id: 'Y3-JBNU',
      name: 'JBNU: 측위/인지 고도화(경량화·강화학습)',
      startDate: new Date('2027-01-01'),
      endDate: new Date('2027-11-30'),
      progress: calculateInstitutionProgress(3, 'JBNU'),
      type: 'deliverable',
      institution: 'JBNU',
      color: COLORS.JBNU,
      assignees: ['최민수', '김서연'],
      children: deliverables
        .filter(d => d.year === 3 && d.institutionCode === 'JBNU')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'JBNU',
          color: COLORS.JBNU,
          dependencies: d.dependencies
        }))
    },
    {
      id: 'Y3-VIA',
      name: 'VIA: Git 협업 고도화 + 프로젝트 대시보드',
      startDate: new Date('2027-01-01'),
      endDate: new Date('2027-09-30'),
      progress: calculateInstitutionProgress(3, 'VIA'),
      type: 'deliverable',
      institution: 'VIA',
      color: COLORS.VIA,
      assignees: ['송재훈', '이소윤', '한도윤'],
      children: deliverables
        .filter(d => d.year === 3 && d.institutionCode === 'VIA')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'VIA',
          color: COLORS.VIA,
          dependencies: d.dependencies
        }))
    },
    {
      id: 'Y3-OntarioTech',
      name: 'OntarioTech: 북미형 협업/협동 최적화',
      startDate: new Date('2027-02-01'),
      endDate: new Date('2027-11-30'),
      progress: calculateInstitutionProgress(3, 'OntarioTech'),
      type: 'deliverable',
      institution: 'OntarioTech',
      color: COLORS.OntarioTech,
      assignees: ['Michael Chen', 'Sarah Johnson'],
      children: deliverables
        .filter(d => d.year === 3 && d.institutionCode === 'OntarioTech')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'OntarioTech',
          color: COLORS.OntarioTech,
          dependencies: d.dependencies
        }))
    }
  ];

  phase1.children = [year1, year2, year3];

  // 2단계 (2개년)
  const phase2: GanttTask = {
    id: 'PHASE-2',
    name: '【2단계】 통합 검증 및 상용화 준비',
    startDate: new Date('2028-01-01'),
    endDate: new Date('2029-12-31'),
    progress: calculatePhaseProgress(2),
    type: 'phase',
    color: COLORS.phase,
    children: []
  };

  // 2단계 1차년도 (4차년도)
  const year4: GanttTask = {
    id: 'YEAR-4',
    name: '▶ 2단계 1차년도: 군집·협업, MIL/HIL, 플랫폼-시뮬레이터 연동 (2028.01-12)',
    startDate: new Date('2028-01-01'),
    endDate: new Date('2028-12-31'),
    progress: calculateYearProgress(4),
    type: 'phase',
    children: []
  };

  year4.children = [
    {
      id: 'Y4-KITECH',
      name: 'KITECH: V2X 군집/협업 + MIL/HIL',
      startDate: new Date('2028-01-01'),
      endDate: new Date('2028-11-30'),
      progress: calculateInstitutionProgress(4, 'KITECH'),
      type: 'deliverable',
      institution: 'KITECH',
      color: COLORS.KITECH,
      assignees: ['김태영', '이준호'],
      children: deliverables
        .filter(d => d.year === 4 && d.institutionCode === 'KITECH')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'KITECH',
          color: COLORS.KITECH,
          dependencies: d.dependencies
        }))
    },
    {
      id: 'Y4-TYMICT',
      name: 'TYMICT: 고성능 다중 센서 AI 융합',
      startDate: new Date('2028-01-01'),
      endDate: new Date('2028-12-31'),
      progress: calculateInstitutionProgress(4, 'TYMICT'),
      type: 'deliverable',
      institution: 'TYMICT',
      color: COLORS.TYMICT,
      assignees: ['박성민', '정하늘'],
      children: deliverables
        .filter(d => d.year === 4 && d.institutionCode === 'TYMICT')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'TYMICT',
          color: COLORS.TYMICT,
          dependencies: d.dependencies
        }))
    },
    {
      id: 'Y4-JBNU',
      name: 'JBNU: 강화학습 기반 고도화',
      startDate: new Date('2028-01-01'),
      endDate: new Date('2028-11-30'),
      progress: calculateInstitutionProgress(4, 'JBNU'),
      type: 'deliverable',
      institution: 'JBNU',
      color: COLORS.JBNU,
      assignees: ['최민수', '김서연'],
      children: deliverables
        .filter(d => d.year === 4 && d.institutionCode === 'JBNU')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'JBNU',
          color: COLORS.JBNU,
          dependencies: d.dependencies
        }))
    },
    {
      id: 'Y4-VIA',
      name: 'VIA: CI/CD 자동 배포 및 시뮬레이터 연동',
      startDate: new Date('2028-01-01'),
      endDate: new Date('2028-12-31'),
      progress: calculateInstitutionProgress(4, 'VIA'),
      type: 'deliverable',
      institution: 'VIA',
      color: COLORS.VIA,
      assignees: ['송재훈', '이소윤', '한도윤'],
      children: deliverables
        .filter(d => d.year === 4 && d.institutionCode === 'VIA')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'VIA',
          color: COLORS.VIA,
          dependencies: d.dependencies
        }))
    },
    {
      id: 'Y4-OntarioTech',
      name: 'OntarioTech: MIL 연동 검증',
      startDate: new Date('2028-02-01'),
      endDate: new Date('2028-11-30'),
      progress: calculateInstitutionProgress(4, 'OntarioTech'),
      type: 'deliverable',
      institution: 'OntarioTech',
      color: COLORS.OntarioTech,
      assignees: ['Michael Chen', 'Sarah Johnson'],
      children: deliverables
        .filter(d => d.year === 4 && d.institutionCode === 'OntarioTech')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'OntarioTech',
          color: COLORS.OntarioTech,
          dependencies: d.dependencies
        }))
    }
  ];

  // 2단계 2차년도 (5차년도)
  const year5: GanttTask = {
    id: 'YEAR-5',
    name: '▶ 2단계 2차년도: 현장 실증·안전 인증·표준 개선·상용화 준비 (2029.01-12)',
    startDate: new Date('2029-01-01'),
    endDate: new Date('2029-12-31'),
    progress: calculateYearProgress(5),
    type: 'phase',
    children: []
  };

  year5.children = [
    {
      id: 'Y5-KITECH',
      name: 'KITECH: 현장 실증 및 기능안전',
      startDate: new Date('2029-01-01'),
      endDate: new Date('2029-10-31'),
      progress: calculateInstitutionProgress(5, 'KITECH'),
      type: 'deliverable',
      institution: 'KITECH',
      color: COLORS.KITECH,
      assignees: ['김태영', '이준호'],
      children: deliverables
        .filter(d => d.year === 5 && d.institutionCode === 'KITECH')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'KITECH',
          color: COLORS.KITECH,
          dependencies: d.dependencies
        }))
    },
    {
      id: 'Y5-TYMICT',
      name: 'TYMICT: 상용화 파일럿',
      startDate: new Date('2029-01-01'),
      endDate: new Date('2029-11-30'),
      progress: calculateInstitutionProgress(5, 'TYMICT'),
      type: 'deliverable',
      institution: 'TYMICT',
      color: COLORS.TYMICT,
      assignees: ['박성민', '정하늘'],
      children: deliverables
        .filter(d => d.year === 5 && d.institutionCode === 'TYMICT')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'TYMICT',
          color: COLORS.TYMICT,
          dependencies: d.dependencies
        }))
    },
    {
      id: 'Y5-JBNU',
      name: 'JBNU: 최적화 배포모델',
      startDate: new Date('2029-01-01'),
      endDate: new Date('2029-11-30'),
      progress: calculateInstitutionProgress(5, 'JBNU'),
      type: 'deliverable',
      institution: 'JBNU',
      color: COLORS.JBNU,
      assignees: ['최민수', '김서연'],
      children: deliverables
        .filter(d => d.year === 5 && d.institutionCode === 'JBNU')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'JBNU',
          color: COLORS.JBNU,
          dependencies: d.dependencies
        }))
    },
    {
      id: 'Y5-VIA',
      name: 'VIA: 플랫폼 운영 정착',
      startDate: new Date('2029-01-01'),
      endDate: new Date('2029-11-30'),
      progress: calculateInstitutionProgress(5, 'VIA'),
      type: 'deliverable',
      institution: 'VIA',
      color: COLORS.VIA,
      assignees: ['송재훈', '이소윤', '한도윤'],
      children: deliverables
        .filter(d => d.year === 5 && d.institutionCode === 'VIA')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'VIA',
          color: COLORS.VIA,
          dependencies: d.dependencies
        }))
    },
    {
      id: 'Y5-OntarioTech',
      name: 'OntarioTech: HIL/실차 고도화',
      startDate: new Date('2029-02-01'),
      endDate: new Date('2029-09-30'),
      progress: calculateInstitutionProgress(5, 'OntarioTech'),
      type: 'deliverable',
      institution: 'OntarioTech',
      color: COLORS.OntarioTech,
      assignees: ['Michael Chen', 'Sarah Johnson'],
      children: deliverables
        .filter(d => d.year === 5 && d.institutionCode === 'OntarioTech')
        .map(d => ({
          id: d.id,
          name: d.name,
          startDate: d.startDate,
          endDate: d.targetDate,
          progress: d.progress,
          type: 'task' as const,
          institution: 'OntarioTech',
          color: COLORS.OntarioTech,
          dependencies: d.dependencies
        }))
    }
  ];

  phase2.children = [year4, year5];

  // 마일스톤 추가
  const milestones: GanttTask[] = [
    {
      id: 'MS-1',
      name: '◆ 1단계 1차년도 완료 보고',
      startDate: new Date('2025-12-15'),
      endDate: new Date('2025-12-15'),
      progress: 0,
      type: 'milestone',
      color: COLORS.milestone
    },
    {
      id: 'MS-2',
      name: '◆ 1단계 중간평가',
      startDate: new Date('2026-06-30'),
      endDate: new Date('2026-06-30'),
      progress: 0,
      type: 'milestone',
      color: COLORS.milestone
    },
    {
      id: 'MS-3',
      name: '◆ 1단계 2차년도 완료 보고',
      startDate: new Date('2026-12-15'),
      endDate: new Date('2026-12-15'),
      progress: 0,
      type: 'milestone',
      color: COLORS.milestone
    },
    {
      id: 'MS-4',
      name: '◆ 1단계 최종평가',
      startDate: new Date('2027-12-15'),
      endDate: new Date('2027-12-15'),
      progress: 0,
      type: 'milestone',
      color: COLORS.milestone
    },
    {
      id: 'MS-5',
      name: '◆ 2단계 중간평가',
      startDate: new Date('2028-06-30'),
      endDate: new Date('2028-06-30'),
      progress: 0,
      type: 'milestone',
      color: COLORS.milestone
    },
    {
      id: 'MS-6',
      name: '◆ 사업 최종평가',
      startDate: new Date('2029-12-15'),
      endDate: new Date('2029-12-15'),
      progress: 0,
      type: 'milestone',
      color: COLORS.milestone
    }
  ];

  ganttTasks.push(phase1, phase2, ...milestones);
  return ganttTasks;
}

// 진행률 계산 함수들
function calculatePhaseProgress(phase: number): number {
  const now = new Date();
  const phaseDeliverables = deliverables.filter(d => d.phase === phase);

  if (phaseDeliverables.length === 0) return 0;

  const totalProgress = phaseDeliverables.reduce((sum, d) => sum + d.progress, 0);
  return Math.round(totalProgress / phaseDeliverables.length);
}

function calculateYearProgress(year: number): number {
  const yearDeliverables = deliverables.filter(d => d.year === year);

  if (yearDeliverables.length === 0) return 0;

  const totalProgress = yearDeliverables.reduce((sum, d) => sum + d.progress, 0);
  return Math.round(totalProgress / yearDeliverables.length);
}

function calculateInstitutionProgress(year: number, institution: string): number {
  const institutionDeliverables = deliverables.filter(
    d => d.year === year && d.institutionCode === institution
  );

  if (institutionDeliverables.length === 0) return 0;

  const totalProgress = institutionDeliverables.reduce((sum, d) => sum + d.progress, 0);
  return Math.round(totalProgress / institutionDeliverables.length);
}

// Export the generated Gantt data
export const ganttData = generateGanttData();

// Helper function to get deliverables by year and institution
export function getDeliverablesByYearAndInstitution(year: number, institution?: string) {
  return deliverables.filter(d => {
    if (institution) {
      return d.year === year && d.institutionCode === institution;
    }
    return d.year === year;
  });
}

// Helper function to get progress statistics
export function getProgressStatistics() {
  const now = new Date();
  const total = deliverables.length;
  const completed = deliverables.filter(d => d.status === 'completed').length;
  const inProgress = deliverables.filter(d => d.status === 'in_progress').length;
  const planned = deliverables.filter(d => d.status === 'planned').length;

  return {
    total,
    completed,
    inProgress,
    planned,
    completionRate: Math.round((completed / total) * 100),
    onTrack: deliverables.filter(d => {
      if (d.status === 'completed') return true;
      if (d.status === 'planned' && d.startDate > now) return true;
      if (d.status === 'in_progress' && d.targetDate > now) return true;
      return false;
    }).length,
    delayed: deliverables.filter(d => {
      return d.status === 'in_progress' && d.targetDate < now;
    }).length
  };
}