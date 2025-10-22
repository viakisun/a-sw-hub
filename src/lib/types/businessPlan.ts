/**
 * A-SW 통합 계획 타입 정의
 * 1단계 3개년 + 2단계 2개년
 */

export type InstitutionCode = 'KITECH' | 'TYMICT' | 'JBNU' | 'VIA' | 'OntarioTech';

export type DeliverableType = 'SYS' | 'UI' | 'INT' | 'DATA' | 'OPS' | 'DOC';

export type DeliverableStatus = 'planned' | 'in_progress' | 'completed' | 'verified' | 'deployed';

export interface Institution {
  id: string;
  code: InstitutionCode;
  name: string;
  nameKr: string;
  type: 'lead' | 'participating' | 'international';
  role: string;
  specialization: string[];
  researchers: number;
  projects: number;
  description: string;
}

export interface Deliverable {
  id: string; // Format: TYPE-YY-XX (e.g., SYS-01-01)
  projectId: string;
  institutionCode: InstitutionCode;
  year: number; // 1-5
  phase: 1 | 2; // Phase 1 (3 years) or Phase 2 (2 years)
  name: string;
  nameEn?: string;
  type: DeliverableType;
  status: DeliverableStatus;
  description: string;
  startDate: Date;
  targetDate: Date;
  completedDate?: Date;
  kpi: KPI[];
  dependencies: string[]; // Other deliverable IDs
  artifacts?: Artifact[];
  progress: number; // 0-100
  version: string;
  repository?: string;
  documentation?: string;
}

export interface KPI {
  metric: string;
  target: string | number;
  current?: string | number;
  unit?: string;
  status: 'not_started' | 'in_progress' | 'achieved' | 'failed';
}

export interface Artifact {
  name: string;
  type: string;
  size?: string;
  url?: string;
  hash?: string;
}

export interface ProjectPhase {
  phase: 1 | 2;
  year: number;
  yearLabel: string; // e.g., "1단계 1차년도"
  startDate: Date;
  endDate: Date;
  objectives: string[];
  institutions: InstitutionCode[];
  deliverables: string[]; // Deliverable IDs
  budget?: number;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  name: string;
  date: Date;
  type: 'review' | 'demo' | 'report' | 'deployment';
  deliverables: string[];
  status: 'upcoming' | 'completed' | 'delayed';
  description?: string;
}

export interface GanttTask {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  type: 'phase' | 'deliverable' | 'milestone' | 'task';
  institution?: InstitutionCode;
  assignees?: string[];
  dependencies?: string[];
  children?: GanttTask[];
  color?: string;
  // Additional properties for compatibility
  start?: Date;
  end?: Date;
  status?: DeliverableStatus;
  milestones?: Milestone[];
  deliverableId?: string;
}

export interface BusinessPlan {
  projectInfo: {
    title: string;
    titleEn: string;
    code: string;
    startDate: Date;
    endDate: Date;
    totalBudget: number;
    description: string;
  };
  institutions: Institution[];
  phases: ProjectPhase[];
  deliverables: Deliverable[];
  ganttData: GanttTask[];
}

// 산출물 ID 체계 헬퍼
export class DeliverableIdHelper {
  static generate(type: DeliverableType, year: number, sequence: number): string {
    const yearStr = String(year).padStart(2, '0');
    const seqStr = String(sequence).padStart(2, '0');
    return `${type}-${yearStr}-${seqStr}`;
  }

  static parse(id: string): { type: DeliverableType; year: number; sequence: number } | null {
    const match = id.match(/^(SYS|UI|INT|DATA|OPS|DOC)-(\d{2})-(\d{2})$/);
    if (!match) return null;

    return {
      type: match[1] as DeliverableType,
      year: parseInt(match[2], 10),
      sequence: parseInt(match[3], 10)
    };
  }
}