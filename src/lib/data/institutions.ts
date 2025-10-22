/**
 * A-SW 통합 계획 참여기관 실제 데이터
 */

import type { Institution } from '$lib/types/businessPlan';

export const institutions: Institution[] = [
  {
    id: 'INST-001',
    code: 'KITECH',
    name: 'Korea Institute of Industrial Technology',
    nameKr: '한국생산기술연구원',
    type: 'lead',
    role: '주관기관',
    specialization: [
      '무인자율 농작업 분석',
      '경로생성/추종/속도제어',
      'V2X 군집/협업',
      'MIL/HIL 검증환경',
      'ISOBUS 통신표준'
    ],
    researchers: 12,
    projects: 8,
    description: '농작업 분석·모듈화, 경로제어, V2X 협업, 표준화 주도'
  },
  {
    id: 'INST-002',
    code: 'TYMICT',
    name: 'TYM ICT',
    nameKr: 'TYM ICT',
    type: 'participating',
    role: '공동연구기관 1',
    specialization: [
      '통합제어기(ICU)',
      '안전/RTOS',
      'HMI 시스템',
      'AI 미들웨어',
      '다중센서 융합'
    ],
    researchers: 10,
    projects: 6,
    description: '통합제어기, 안전시스템, HMI, AI 플랫폼 개발'
  },
  {
    id: 'INST-003',
    code: 'JBNU',
    name: 'Jeonbuk National University',
    nameKr: '전북대학교',
    type: 'participating',
    role: '공동연구기관 2',
    specialization: [
      '측위 알고리즘',
      '환경인지',
      '공간정보',
      '강화학습',
      '학습 DB 구축'
    ],
    researchers: 8,
    projects: 5,
    description: '측위·환경인지·공간정보, 학습기반 알고리즘 개발'
  },
  {
    id: 'INST-004',
    code: 'VIA',
    name: 'VIA Technologies',
    nameKr: 'VIA',
    type: 'participating',
    role: '공동연구기관 3',
    specialization: [
      'A-SW 서비스 플랫폼',
      'MSA 아키텍처',
      'Git 기반 협업',
      'CI/CD 자동화',
      '품질검증 시스템'
    ],
    researchers: 15,
    projects: 10,
    description: 'A-SW 서비스 플랫폼, 저장소, CI/CD, 협업체계 구축'
  },
  {
    id: 'INST-005',
    code: 'OntarioTech',
    name: 'Ontario Tech University',
    nameKr: '온타리오 공과대학교',
    type: 'international',
    role: '국외협력기관',
    specialization: [
      '경로 최적화',
      '작업 할당',
      '협동 스케줄링',
      'MIL 검증',
      '북미형 시나리오'
    ],
    researchers: 6,
    projects: 4,
    description: '경로최적화·할당·검증, 북미형 협업 알고리즘'
  }
];

// 연구진 Mock Data
export interface Researcher {
  id: string;
  name: string;
  nameEn: string;
  institutionCode: string;
  position: string;
  email: string;
  expertise: string[];
  deliverables: string[];
  avatar?: string;
}

export const researchers: Researcher[] = [
  // KITECH
  {
    id: 'RES-001',
    name: '김태영',
    nameEn: 'Kim Taeyoung',
    institutionCode: 'KITECH',
    position: '책임연구원',
    email: 'tykim@kitech.re.kr',
    expertise: ['농작업 분석', '경로계획', 'V2X 통신'],
    deliverables: ['DOC-01-01', 'SYS-02-01', 'SYS-04-01']
  },
  {
    id: 'RES-002',
    name: '이준호',
    nameEn: 'Lee Junho',
    institutionCode: 'KITECH',
    position: '선임연구원',
    email: 'jhlee@kitech.re.kr',
    expertise: ['경로추종', '속도제어', 'HIL 검증'],
    deliverables: ['SYS-02-02', 'SYS-02-03', 'SYS-05-01']
  },

  // TYMICT
  {
    id: 'RES-003',
    name: '박성민',
    nameEn: 'Park Sungmin',
    institutionCode: 'TYMICT',
    position: '수석엔지니어',
    email: 'smpark@tymict.com',
    expertise: ['통합제어기', 'RTOS', '임베디드시스템'],
    deliverables: ['SYS-02-11', 'SYS-03-11', 'SYS-04-11']
  },
  {
    id: 'RES-004',
    name: '정하늘',
    nameEn: 'Jung Haneul',
    institutionCode: 'TYMICT',
    position: 'AI팀장',
    email: 'hnjung@tymict.com',
    expertise: ['AI 미들웨어', '센서융합', 'HMI'],
    deliverables: ['UI-02-11', 'SYS-03-12', 'SYS-04-12']
  },

  // JBNU
  {
    id: 'RES-005',
    name: '최민수',
    nameEn: 'Choi Minsu',
    institutionCode: 'JBNU',
    position: '부교수',
    email: 'mschoi@jbnu.ac.kr',
    expertise: ['측위 알고리즘', 'SLAM', '강화학습'],
    deliverables: ['SYS-02-21', 'SYS-03-21', 'SYS-04-21']
  },
  {
    id: 'RES-006',
    name: '김서연',
    nameEn: 'Kim Seoyeon',
    institutionCode: 'JBNU',
    position: '조교수',
    email: 'sykim@jbnu.ac.kr',
    expertise: ['환경인지', '컴퓨터비전', '딥러닝'],
    deliverables: ['SYS-02-22', 'DATA-02-21', 'SYS-04-22']
  },

  // VIA
  {
    id: 'RES-007',
    name: '송재훈',
    nameEn: 'Song Jaehoon',
    institutionCode: 'VIA',
    position: 'Platform Architect',
    email: 'jhsong@via.com',
    expertise: ['MSA', 'DevOps', '클라우드'],
    deliverables: ['SYS-01-31', 'SYS-02-31', 'SYS-04-31']
  },
  {
    id: 'RES-008',
    name: '이소윤',
    nameEn: 'Lee Soyun',
    institutionCode: 'VIA',
    position: 'Lead Developer',
    email: 'sylee@via.com',
    expertise: ['CI/CD', 'Git 워크플로우', '품질검증'],
    deliverables: ['OPS-01-31', 'UI-02-31', 'OPS-05-31']
  },
  {
    id: 'RES-009',
    name: '한도윤',
    nameEn: 'Han Doyun',
    institutionCode: 'VIA',
    position: 'Frontend Lead',
    email: 'dyhan@via.com',
    expertise: ['UI/UX', '대시보드', '데이터시각화'],
    deliverables: ['UI-02-32', 'UI-03-31', 'UI-05-31']
  },

  // OntarioTech
  {
    id: 'RES-010',
    name: 'Michael Chen',
    nameEn: 'Michael Chen',
    institutionCode: 'OntarioTech',
    position: 'Associate Professor',
    email: 'michael.chen@ontariotech.ca',
    expertise: ['경로최적화', '운영연구', '휴리스틱'],
    deliverables: ['SYS-02-41', 'SYS-03-41', 'SYS-04-41']
  },
  {
    id: 'RES-011',
    name: 'Sarah Johnson',
    nameEn: 'Sarah Johnson',
    institutionCode: 'OntarioTech',
    position: 'Research Scientist',
    email: 'sarah.johnson@ontariotech.ca',
    expertise: ['스케줄링', '협동제어', 'MIL검증'],
    deliverables: ['SYS-02-42', 'SYS-03-42', 'DOC-05-41']
  }
];