# A-SW 플랫폼 아키텍처 갭 분석 (Architecture Gap Analysis)

**문서 버전**: 1.0
**작성일**: 2025-12-30
**목적**: 아키텍처 설계 문서와 현재 구현 코드 간 차이 분석 및 보완 방향 제시

---

## 문서 개요

본 문서는 "A-SW 오픈소스 협력개발 서비스 플랫폼 아키텍처 설계서 (revision 3, 2025.12.8)" 와 현재 구현된 코드베이스를 비교 분석하여, **구현 누락 사항, 설계-구현 간 불일치, 보완 필요 영역**을 식별합니다.

### 분석 범위
- **아키텍처 문서**: Chapter 4~10 (핵심 도메인 스키마, 기능, 호환성, 검증, API, 운영)
- **코드베이스**: SvelteKit 기반 프론트엔드, 타입 정의, Mock 데이터
- **제외**: Chapter 1~3 (개요/컨텍스트), Chapter 11~13 (구현 계획/부록)

### 핵심 발견사항 요약

| 구분 | 아키텍처 설계 | 현재 구현 | 갭 수준 |
|------|--------------|----------|--------|
| **도메인 모델** | Package/Release/Artifact 중심 | Project/Build/Approval 중심 | ⚠️ **높음** |
| **상태 관리** | Release 상태 머신 (Draft→Published) | Approval 상태 (pending→approved) | ⚠️ **높음** |
| **호환성** | Profile + Declaration (선언 기반) | 미구현 | 🔴 **누락** |
| **검증** | Verification Report + 증빙 | QualityCheck (간단) | ⚠️ **중간** |
| **저장소** | RDB + Object Storage + SSoT | Mock 데이터만 (DB 없음) | 🔴 **누락** |
| **API** | RESTful API (8.3 정의) | 미구현 (프론트만) | 🔴 **누락** |

---

## Chapter 4. 핵심 도메인 스키마(SSoT) 및 수명주기

### 4.1 A-SW 패키지(Package) 모델

#### 📋 아키텍처 설계
```typescript
interface Package {
  package_id: string;
  name: string;
  summary: string;
  description: string;
  owner_org: string;
  category: string;
  tags: string[];
  is_required: boolean;  // 필수 A-SW 10종 여부
  links: {
    docs?: string;
    support?: string;
    repo?: string;
  };
  created_at: Date;
  updated_at: Date;
}
```

#### 💻 현재 구현
```typescript
// src/lib/types/index.ts
interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  visibility: 'public' | 'private';
  owner: User;  // ⚠️ User 객체 (owner_org 아님)
  language: ProgrammingLanguage;
  icon?: string;
  stars: number;
  forks: number;
  contributors: number;
  repository: { url, defaultBranch, branches };
  buildStatus?: BuildStatus;
  // ❌ is_required 없음
  // ❌ tags[] 없음
  // ❌ links 없음
}
```

#### 🔍 갭 분석
| 항목 | 상태 | 보완 필요 내용 |
|------|------|--------------|
| 엔티티 명칭 | ⚠️ 불일치 | `Project` vs `Package` 관계 정의 필요 |
| 필수 필드 | 🔴 누락 | `is_required`, `tags[]`, `links` 추가 |
| 소유자 표현 | ⚠️ 불일치 | `owner: User` → `owner_org: string` 변환 규칙 |
| GitHub 메타 | ➕ 추가 | `stars/forks/buildStatus`는 아키텍처 외 추가 기능 |

#### ✅ 보완 방안

**Option 1: Project를 Package로 통합**
```typescript
interface Package extends Project {
  package_id: string;  // = id
  owner_org: string;   // = owner.id 또는 새 필드
  is_required: boolean;
  tags: string[];
  links: { docs?, support?, repo? };
}
```

**Option 2: Package-Project 분리**
```typescript
// Package: 상위 개념 (여러 릴리즈 포함)
// Project: 개발 프로젝트 (Git 저장소)
// 1:N 관계로 재설계
```

**⭐ 권장**: Option 1 (통합) - 차년도 최소 범위에 적합

---

### 4.2 릴리즈(Release) 모델

#### 📋 아키텍처 설계
```typescript
interface Release {
  release_id: string;
  package_id: string;
  version: string;  // SemVer
  release_notes: string;
  artifacts: Artifact[];
  status: 'Draft' | 'Submitted' | 'Verified' | 'Approved' | 'Published';
  submitted_at?: Date;
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
}
```

#### 💻 현재 구현
```typescript
// ❌ Release 엔티티가 코드에 전혀 없음
// Build 엔티티는 존재하나 목적이 다름:

interface Build {
  id: string;
  projectId: string;
  buildNumber: number;
  status: BuildStatus;  // pending/running/success/failed
  branch: string;
  commit: { sha, message, author, timestamp };
  stages: BuildStage[];
  triggeredBy: User;
  environment: DeploymentEnvironment;
}
```

#### 🔍 갭 분석
| 항목 | 상태 | 영향 |
|------|------|------|
| Release 엔티티 | 🔴 **전체 누락** | 핵심 도메인 미구현 |
| 상태 머신 | 🔴 누락 | Draft→Submitted→Verified→Approved→Published 흐름 없음 |
| 버전 관리 | 🔴 누락 | SemVer 규칙 미정의 |
| 아티팩트 연결 | 🔴 누락 | Artifact 모델 자체가 없음 |

#### ✅ 보완 방안

**Phase 1: Release 스키마 추가**
```typescript
// src/lib/types/index.ts
export interface Release {
  release_id: string;
  package_id: string;
  version: string;
  release_notes: string;
  status: ReleaseStatus;
  submitted_at?: Date;
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export type ReleaseStatus =
  | 'Draft'
  | 'Submitted'
  | 'Verified'
  | 'Approved'
  | 'Published'
  | 'Withdrawn';
```

**Phase 2: DB 마이그레이션 (Prisma 예시)**
```prisma
model Release {
  id           String        @id @default(cuid())
  packageId    String
  package      Package       @relation(fields: [packageId], references: [id])
  version      String
  releaseNotes String
  status       ReleaseStatus @default(Draft)
  submittedAt  DateTime?
  publishedAt  DateTime?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  artifacts    Artifact[]
  reports      VerificationReport[]
  declarations CompatibilityDeclaration[]

  @@unique([packageId, version])
}
```

**Phase 3: 상태 전이 로직**
```typescript
// src/lib/services/release.service.ts
class ReleaseService {
  async submit(releaseId: string): Promise<Release> {
    // Draft → Submitted 전이
    // 사전 조건: artifacts ≥ 1
  }

  async verify(releaseId: string): Promise<Release> {
    // Submitted → Verified (운영자만)
    // 사전 조건: reports ≥ 1
  }

  async approve(releaseId: string): Promise<Release> {
    // Verified → Approved → Published (운영자만)
  }
}
```

---

### 4.3 릴리즈 상태 머신

#### 📋 아키텍처 설계
```mermaid
stateDiagram-v2
  [*] --> Draft
  Draft --> Submitted: submit()
  Submitted --> Verified: verifyEvidence()
  Verified --> Approved: approve()
  Approved --> Published: publish()
  Published --> Withdrawn: withdraw()
```

#### 💻 현재 구현
```typescript
// ❌ 상태 머신 없음
// Approval.status는 별도 워크플로우:
type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'on-hold';
```

#### ✅ 보완 방안
```typescript
// src/lib/machines/release.machine.ts (XState 또는 간단 FSM)
const releaseStateMachine = {
  Draft: {
    submit: { target: 'Submitted', guard: 'hasArtifacts' }
  },
  Submitted: {
    verify: { target: 'Verified', guard: 'hasReports', role: 'operator' },
    reject: { target: 'Draft', role: 'operator' }
  },
  Verified: {
    approve: { target: 'Approved', role: 'operator' }
  },
  Approved: {
    publish: { target: 'Published', role: 'operator' }
  },
  Published: {
    withdraw: { target: 'Withdrawn', role: 'operator' }
  }
};
```

---

### 4.4 아티팩트(Artifact) 모델

#### 📋 아키텍처 설계
```typescript
interface Artifact {
  artifact_id: string;
  release_id: string;
  file_name: string;
  content_type: string;
  size_bytes: number;
  checksum: string;  // SHA-256
  storage_uri: string;
  created_at: Date;
}
```

#### 💻 현재 구현
```typescript
// ❌ Artifact 엔티티 전혀 없음
// businessPlan.ts의 Artifact는 다른 용도:
interface Artifact {
  name: string;
  type: string;
  size?: string;  // ⚠️ string (not number)
  url?: string;
  hash?: string;
}
```

#### ✅ 보완 방안

**1. 스키마 정의**
```typescript
export interface Artifact {
  artifact_id: string;
  release_id: string;
  file_name: string;
  content_type: string;  // MIME type
  size_bytes: number;
  checksum: string;      // SHA-256
  storage_uri: string;   // S3/MinIO key
  upload_status: 'uploading' | 'completed' | 'failed';
  created_at: Date;
}
```

**2. Object Storage 연동**
```typescript
// src/lib/services/storage.service.ts
class StorageService {
  async upload(file: File, releaseId: string): Promise<Artifact> {
    const checksum = await this.computeSHA256(file);
    const key = `releases/${releaseId}/${file.name}`;

    // S3/MinIO 업로드
    await this.s3Client.putObject({
      Bucket: 'asw-artifacts',
      Key: key,
      Body: file,
      ContentType: file.type,
      Metadata: { checksum }
    });

    return {
      artifact_id: nanoid(),
      release_id: releaseId,
      file_name: file.name,
      content_type: file.type,
      size_bytes: file.size,
      checksum,
      storage_uri: `s3://asw-artifacts/${key}`,
      upload_status: 'completed',
      created_at: new Date()
    };
  }

  async download(artifactId: string): Promise<string> {
    // 서명된 URL 생성 (만료 시간 포함)
    return this.s3Client.getSignedUrl('getObject', {
      Bucket: 'asw-artifacts',
      Key: artifact.storage_uri,
      Expires: 3600  // 1시간
    });
  }
}
```

**3. 업로드 검증 (9.4 보안)**
```typescript
const ALLOWED_MIME_TYPES = [
  'application/zip',
  'application/x-tar',
  'application/gzip',
  'application/octet-stream'
];

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

function validateUpload(file: File): void {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('파일 크기 초과 (최대 500MB)');
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('허용되지 않은 파일 형식');
  }
}
```

---

### 4.5~4.6 프로파일 모델 (Runtime/HW)

#### 📋 아키텍처 설계

**Runtime Profile**
```typescript
interface RuntimeProfile {
  runtime_profile_id: string;
  os_family: string;      // Linux
  kernel: string;         // PREEMPT_RT 포함
  middleware: string;     // ROS2 등
  container_support: boolean;
  notes: string;
  created_at: Date;
}
```

**HW Profile**
```typescript
interface HWProfile {
  hw_profile_id: string;
  manufacturer: string;   // TYMICT
  model: string;          // ICU 모델/세대
  firmware_version?: string;
  interfaces: string[];   // CAN, Ethernet
  notes: string;
  created_at: Date;
}
```

#### 💻 현재 구현
```typescript
// ❌ 두 엔티티 모두 전혀 없음
```

#### ✅ 보완 방안

**1. 스키마 추가**
```typescript
// src/lib/types/profiles.ts
export interface RuntimeProfile {
  runtime_profile_id: string;
  name: string;  // 표시용 이름 (예: "PREEMPT_RT Linux 5.15")
  os_family: 'Linux' | 'RTOS';
  kernel: string;
  kernel_rt: boolean;  // PREEMPT_RT 여부
  middleware?: string;
  container_support: boolean;
  notes?: string;
  created_at: Date;
}

export interface HWProfile {
  hw_profile_id: string;
  name: string;  // 표시용 이름 (예: "TYMICT ICU v2.0")
  manufacturer: string;
  model: string;
  generation?: string;
  firmware_version?: string;
  interfaces: string[];  // ['CAN', 'Ethernet', 'RS485']
  cpu_arch?: string;
  notes?: string;
  created_at: Date;
}
```

**2. 운영자 등록 UI (정책 A)**
```svelte
<!-- src/routes/(operator)/profiles/runtime/new/+page.svelte -->
<script lang="ts">
  let profile: Partial<RuntimeProfile> = {
    os_family: 'Linux',
    kernel_rt: true,
    container_support: false
  };

  async function createProfile() {
    await fetch('/api/profiles/runtime', {
      method: 'POST',
      body: JSON.stringify(profile)
    });
  }
</script>

<form on:submit|preventDefault={createProfile}>
  <label>
    이름: <input bind:value={profile.name} required />
  </label>
  <label>
    OS:
    <select bind:value={profile.os_family}>
      <option value="Linux">Linux</option>
      <option value="RTOS">RTOS</option>
    </select>
  </label>
  <label>
    Kernel: <input bind:value={profile.kernel} />
  </label>
  <label>
    <input type="checkbox" bind:checked={profile.kernel_rt} />
    PREEMPT_RT 지원
  </label>
  <!-- ... -->
</form>
```

**3. 초기 프로파일 세트 (시드 데이터)**
```typescript
// src/lib/data/seedProfiles.ts
export const seedRuntimeProfiles: RuntimeProfile[] = [
  {
    runtime_profile_id: 'RT-001',
    name: 'PREEMPT_RT Linux 5.15',
    os_family: 'Linux',
    kernel: '5.15.0-rt',
    kernel_rt: true,
    middleware: 'ROS2 Humble',
    container_support: true,
    notes: '표준 ICU 런타임',
    created_at: new Date('2025-01-01')
  },
  // ...
];

export const seedHWProfiles: HWProfile[] = [
  {
    hw_profile_id: 'HW-001',
    name: 'TYMICT ICU v2.0',
    manufacturer: 'TYMICT',
    model: 'ICU-2000',
    generation: 'Gen2',
    firmware_version: '2.0.5',
    interfaces: ['CAN', 'Ethernet', 'RS485'],
    cpu_arch: 'ARM64',
    created_at: new Date('2025-01-01')
  },
  // ...
];
```

---

### 4.7 검증 리포트(Verification Report) 모델

#### 📋 아키텍처 설계
```typescript
interface VerificationReport {
  report_id: string;
  target_type: 'Release' | 'Artifact';
  target_id: string;
  report_type: string;  // bench_test, field_test, conformance
  result: 'pass' | 'fail' | 'partial';
  summary: string;
  executed_at: Date;
  attachments: string[];  // 파일 참조
  submitted_by: string;
  submitted_at: Date;
}
```

#### 💻 현재 구현
```typescript
// ❌ VerificationReport 없음
// QualityCheck은 간단한 형태만 존재:
interface QualityCheck {
  name: 'Security' | 'Tests' | 'Performance' | 'Coverage' | 'Code Quality';
  status: 'pass' | 'warn' | 'fail';
  value?: number;
  threshold?: number;
  details?: string;
}
```

#### ✅ 보완 방안

**1. 스키마 확장**
```typescript
export interface VerificationReport {
  report_id: string;
  target_type: 'Release' | 'Artifact';
  target_id: string;
  report_type: 'bench_test' | 'field_test' | 'conformance' | 'integration';
  result: 'pass' | 'fail' | 'partial';
  summary: string;
  executed_at: Date;
  environment?: {
    runtime_profile_id?: string;
    hw_profile_id?: string;
    conditions?: string;  // 시험 환경 조건
  };
  checks: QualityCheck[];  // 기존 QualityCheck 재사용
  attachments: ReportAttachment[];
  submitted_by: string;
  submitted_at: Date;
}

interface ReportAttachment {
  attachment_id: string;
  file_name: string;
  file_type: 'pdf' | 'log' | 'image' | 'video' | 'data';
  storage_uri: string;
  size_bytes: number;
}
```

**2. 리포트 제출 UI**
```svelte
<!-- src/routes/(developer)/releases/[id]/submit-report/+page.svelte -->
<script lang="ts">
  import { uploadFile } from '$lib/services/storage.service';

  let report: Partial<VerificationReport> = {
    report_type: 'bench_test',
    result: 'pass',
    checks: []
  };

  let attachments: File[] = [];

  async function submitReport() {
    // 1. 첨부 파일 업로드
    const uploadedAttachments = await Promise.all(
      attachments.map(file => uploadFile(file, 'reports'))
    );

    // 2. 리포트 생성
    await fetch(`/api/releases/${releaseId}/reports`, {
      method: 'POST',
      body: JSON.stringify({
        ...report,
        attachments: uploadedAttachments
      })
    });
  }
</script>
```

**3. 템플릿 제공 (13.2.2)**
```typescript
// src/lib/templates/reportTemplate.ts
export const reportTemplate: Partial<VerificationReport> = {
  report_type: 'bench_test',
  summary: `
## 시험 개요
- 대상: [릴리즈 이름 및 버전]
- 환경: [Runtime/HW 프로파일]
- 수행일: [YYYY-MM-DD]

## 시험 절차
1. [단계별 절차 기술]

## 시험 결과
- [핵심 지표 및 관찰 사항]

## 결론
- [pass/fail 판정 근거]
  `,
  checks: [
    { name: 'Security', status: 'pass', value: 0, threshold: 0 },
    { name: 'Tests', status: 'pass', value: 85, threshold: 80 },
    { name: 'Performance', status: 'pass', value: 250, threshold: 500 }
  ]
};
```

---

### 4.8 호환성 선언(Compatibility Declaration) 모델

#### 📋 아키텍처 설계
```typescript
interface CompatibilityDeclaration {
  declaration_id: string;
  release_id: string;
  runtime_profile_id: string;
  hw_profile_id: string;
  since_version?: string;
  until_version?: string;
  status: 'active' | 'deprecated' | 'blocked';
  evidence_report_ids: string[];  // 근거 리포트
  declared_by: string;
  created_at: Date;
}
```

#### 💻 현재 구현
```typescript
// ❌ 전혀 없음
```

#### ✅ 보완 방안

**1. 스키마 추가**
```typescript
export interface CompatibilityDeclaration {
  declaration_id: string;
  release_id: string;
  runtime_profile_id: string;
  hw_profile_id: string;

  // 버전 범위 (선택)
  since_version?: string;
  until_version?: string;

  // 상태
  status: 'active' | 'deprecated' | 'blocked';

  // 근거
  evidence_report_ids: string[];

  // 제약/알려진 이슈
  notes?: string;
  known_issues?: string[];

  // 메타
  declared_by: string;
  created_at: Date;
  updated_at: Date;
}
```

**2. 선언 작성 UI (정책 A)**
```svelte
<!-- src/routes/(developer)/releases/[id]/declare-compatibility/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  let runtimeProfiles: RuntimeProfile[] = [];
  let hwProfiles: HWProfile[] = [];
  let reports: VerificationReport[] = [];

  let declaration: Partial<CompatibilityDeclaration> = {
    status: 'active',
    evidence_report_ids: []
  };

  onMount(async () => {
    // 프로파일 및 리포트 목록 로드
    runtimeProfiles = await fetch('/api/profiles/runtime').then(r => r.json());
    hwProfiles = await fetch('/api/profiles/hw').then(r => r.json());
    reports = await fetch(`/api/releases/${releaseId}/reports`).then(r => r.json());
  });

  async function submitDeclaration() {
    await fetch(`/api/releases/${releaseId}/compatibility-declarations`, {
      method: 'POST',
      body: JSON.stringify(declaration)
    });
  }
</script>

<form on:submit|preventDefault={submitDeclaration}>
  <h3>호환 프로파일 선택</h3>
  <label>
    Runtime Profile:
    <select bind:value={declaration.runtime_profile_id} required>
      {#each runtimeProfiles as profile}
        <option value={profile.runtime_profile_id}>{profile.name}</option>
      {/each}
    </select>
  </label>

  <label>
    HW Profile:
    <select bind:value={declaration.hw_profile_id} required>
      {#each hwProfiles as profile}
        <option value={profile.hw_profile_id}>{profile.name}</option>
      {/each}
    </select>
  </label>

  <h3>근거 리포트 선택 (최소 1개)</h3>
  {#each reports as report}
    <label>
      <input
        type="checkbox"
        value={report.report_id}
        bind:group={declaration.evidence_report_ids}
      />
      {report.report_type} - {report.result} ({new Date(report.executed_at).toLocaleDateString()})
    </label>
  {/each}

  <button type="submit" disabled={declaration.evidence_report_ids.length === 0}>
    선언 제출
  </button>
</form>
```

**3. 선언 검증 (필수 조건)**
```typescript
// src/lib/services/compatibility.service.ts
function validateDeclaration(declaration: CompatibilityDeclaration): void {
  if (!declaration.runtime_profile_id || !declaration.hw_profile_id) {
    throw new Error('프로파일을 모두 선택해야 합니다');
  }

  if (declaration.evidence_report_ids.length === 0) {
    throw new Error('최소 1개의 검증 리포트를 연결해야 합니다');
  }

  // 리포트가 해당 릴리즈에 속하는지 확인
  const reportsValid = declaration.evidence_report_ids.every(reportId => {
    const report = getReportById(reportId);
    return report && report.target_id === declaration.release_id;
  });

  if (!reportsValid) {
    throw new Error('잘못된 리포트 참조');
  }
}
```

---

## Chapter 5. 핵심 기능 아키텍처

### 5.1 Developer Portal 기능 범위

#### 📋 아키텍처 설계
- DP-01: 로그인/접근 (기관/개발자 계정)
- DP-02: 내 패키지 목록 (필수/일반 구분)
- DP-03: 패키지 생성/편집
- DP-04: 릴리즈 생성/편집 (Draft)
- DP-05: 아티팩트 업로드/관리
- DP-06: 검증 리포트 제출
- DP-07: 호환성 선언 작성/열람
- DP-08: 제출(Submitted) 및 상태 추적

#### 💻 현재 구현
현재 구현된 Developer Portal 화면:
- `/projects` - 프로젝트 목록
- `/projects/new` - 프로젝트 생성
- `/projects/[slug]` - 프로젝트 상세
- `/projects/[slug]/edit` - 프로젝트 편집
- `/projects/[slug]/pipelines` - 파이프라인 관리
- `/builds` - 빌드 목록
- `/dashboard` - 대시보드

#### 🔍 갭 분석

| 아키텍처 화면 | 현재 구현 | 갭 |
|------------|----------|---|
| DP-02 패키지 목록 | `/projects` | ✅ 유사 (매핑 가능) |
| DP-03 패키지 생성/편집 | `/projects/new`, `/projects/[slug]/edit` | ⚠️ 필수 필드 누락 (is_required, tags, links) |
| DP-04 릴리즈 생성 | ❌ 없음 | 🔴 **누락** |
| DP-05 아티팩트 업로드 | ❌ 없음 | 🔴 **누락** |
| DP-06 검증 리포트 제출 | ❌ 없음 | 🔴 **누락** |
| DP-07 호환성 선언 | ❌ 없음 | 🔴 **누락** |
| DP-08 제출/상태 추적 | ❌ 없음 | 🔴 **누락** |

#### ✅ 보완 방안

**1. 기존 Projects 화면 확장**
```typescript
// src/routes/(app)/projects/[slug]/+page.svelte 수정
<script lang="ts">
  export let data: { project: Project };

  // ✅ 추가: 릴리즈 목록 표시
  let releases: Release[] = [];

  onMount(async () => {
    releases = await fetch(`/api/packages/${data.project.id}/releases`)
      .then(r => r.json());
  });
</script>

<div class="project-detail">
  <!-- 기존 프로젝트 정보 -->

  <!-- ✅ 추가: 릴리즈 섹션 -->
  <section class="releases">
    <h2>Releases</h2>
    <a href="/projects/{data.project.slug}/releases/new">
      + New Release
    </a>

    {#each releases as release}
      <div class="release-card">
        <h3>{release.version}</h3>
        <span class="status">{release.status}</span>
        <p>{release.release_notes}</p>
        <a href="/projects/{data.project.slug}/releases/{release.release_id}">
          상세보기
        </a>
      </div>
    {/each}
  </section>
</div>
```

**2. 릴리즈 생성 화면 추가**
```svelte
<!-- src/routes/(app)/projects/[slug]/releases/new/+page.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let release: Partial<Release> = {
    version: '',
    release_notes: '',
    status: 'Draft'
  };

  async function createRelease() {
    const response = await fetch(`/api/packages/${$page.params.slug}/releases`, {
      method: 'POST',
      body: JSON.stringify(release)
    });

    const created = await response.json();
    goto(`/projects/${$page.params.slug}/releases/${created.release_id}`);
  }
</script>

<form on:submit|preventDefault={createRelease}>
  <h1>새 릴리즈 생성</h1>

  <label>
    버전:
    <input
      bind:value={release.version}
      placeholder="1.0.0"
      pattern="\d+\.\d+\.\d+"
      required
    />
  </label>

  <label>
    릴리즈 노트:
    <textarea bind:value={release.release_notes} rows="10" required />
  </label>

  <button type="submit">생성 (Draft)</button>
</form>
```

**3. 릴리즈 상세 화면 (통합 관리)**
```svelte
<!-- src/routes/(app)/projects/[slug]/releases/[releaseId]/+page.svelte -->
<script lang="ts">
  export let data: { release: Release };

  let artifacts: Artifact[] = [];
  let reports: VerificationReport[] = [];
  let declarations: CompatibilityDeclaration[] = [];

  onMount(async () => {
    // 데이터 로드
  });
</script>

<div class="release-detail">
  <h1>{data.release.version}</h1>
  <span class="status-badge status-{data.release.status}">
    {data.release.status}
  </span>

  <!-- 아티팩트 관리 -->
  <section class="artifacts">
    <h2>Artifacts</h2>
    {#if data.release.status === 'Draft'}
      <button on:click={() => uploadArtifact()}>+ Upload Artifact</button>
    {/if}
    <!-- 목록 -->
  </section>

  <!-- 검증 리포트 -->
  <section class="reports">
    <h2>Verification Reports</h2>
    {#if data.release.status === 'Draft'}
      <a href="./submit-report">+ Submit Report</a>
    {/if}
    <!-- 목록 -->
  </section>

  <!-- 호환성 선언 -->
  <section class="compatibility">
    <h2>Compatibility Declarations</h2>
    {#if data.release.status === 'Draft' || data.release.status === 'Submitted'}
      <a href="./declare-compatibility">+ Declare Compatibility</a>
    {/if}
    <!-- 목록 -->
  </section>

  <!-- 상태 전이 버튼 -->
  <div class="actions">
    {#if data.release.status === 'Draft'}
      <button on:click={submit} disabled={!canSubmit}>
        제출 (Submit)
      </button>
    {/if}
  </div>
</div>
```

---

### 5.2 운영자 콘솔(Operator Console) 기능 범위

#### 📋 아키텍처 설계
- OP-01: 승인 대기 목록 (Submitted 릴리즈)
- OP-02: 릴리즈 검토 상세
- OP-03: 반려 처리 (사유 템플릿)
- OP-04: 승인 처리 (체크리스트)
- OP-05: 공개/철회 관리
- OP-06: 이력/감사 로그

#### 💻 현재 구현
```typescript
// src/routes/(app)/approvals/+page.svelte
// - Approval 목록 표시 (deployment/merge/release/configuration/access)
// - 상태: pending/approved/rejected/on-hold
// - QualityCheck 표시
```

#### 🔍 갭 분석

현재 `Approval` 엔티티는 **Release 승인이 아닌** Deployment/Merge Approval 용도로 사용 중.

| 항목 | 현재 Approval | 아키텍처 Release Approval | 관계 |
|------|--------------|------------------------|------|
| 대상 | deployment/merge/release/configuration | Release 엔티티 | ⚠️ **다름** |
| 상태 | pending/approved/rejected/on-hold | Draft→Submitted→Verified→Approved→Published | ⚠️ **다름** |
| 체크 | QualityCheck (간단) | 체크리스트 (필수 필드/리포트/선언) | ⚠️ 확장 필요 |

#### ✅ 보완 방안

**Option 1: Approval 타입 확장**
```typescript
// 기존 Approval에 Release 타입 추가
type ApprovalType =
  | 'deployment'
  | 'merge'
  | 'release'      // ✅ 기존 타입
  | 'release_asw'  // ✅ A-SW Release 승인 (새 타입)
  | 'configuration'
  | 'access';

interface ReleaseApproval extends Approval {
  type: 'release_asw';
  releaseId: string;
  releaseStatus: ReleaseStatus;
  checklist: ChecklistResult;
}
```

**Option 2: ReleaseApproval 분리 (권장)**
```typescript
// 별도 엔티티로 관리
interface ReleaseApproval {
  approval_id: string;
  release_id: string;
  status: 'pending' | 'approved' | 'rejected';
  checklist: ChecklistResult;
  reviewer: User;
  reviewed_at?: Date;
  comments?: string;
  rejection_reason?: RejectionReason;
}

interface ChecklistResult {
  checklist_version: string;  // v1.0
  items: ChecklistItem[];
  passed: boolean;
}

interface ChecklistItem {
  category: 'package' | 'release' | 'artifact' | 'report' | 'declaration';
  description: string;
  status: 'pass' | 'fail' | 'n/a';
  notes?: string;
}
```

**운영자 콘솔 UI 수정**
```svelte
<!-- src/routes/(operator)/approvals/releases/+page.svelte -->
<script lang="ts">
  let pendingReleases: Release[] = [];

  onMount(async () => {
    pendingReleases = await fetch('/api/ops/submissions')
      .then(r => r.json());
  });
</script>

<h1>릴리즈 승인 대기</h1>

<table>
  <thead>
    <tr>
      <th>패키지</th>
      <th>버전</th>
      <th>제출일</th>
      <th>제출자</th>
      <th>상태</th>
      <th>액션</th>
    </tr>
  </thead>
  <tbody>
    {#each pendingReleases as release}
      <tr>
        <td>{release.package?.name}</td>
        <td>{release.version}</td>
        <td>{new Date(release.submitted_at).toLocaleDateString()}</td>
        <td>{release.submitted_by}</td>
        <td><span class="badge">{release.status}</span></td>
        <td>
          <a href="/operator/approvals/releases/{release.release_id}">
            검토
          </a>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
```

**검토 상세 화면**
```svelte
<!-- src/routes/(operator)/approvals/releases/[releaseId]/+page.svelte -->
<script lang="ts">
  export let data: {
    release: Release,
    package: Package,
    artifacts: Artifact[],
    reports: VerificationReport[],
    declarations: CompatibilityDeclaration[]
  };

  let checklist: ChecklistItem[] = [
    { category: 'package', description: '패키지 필수 필드 충족', status: 'pass' },
    { category: 'release', description: '릴리즈 노트 존재', status: 'pass' },
    { category: 'artifact', description: '아티팩트 1개 이상', status: data.artifacts.length > 0 ? 'pass' : 'fail' },
    { category: 'report', description: '검증 리포트 1개 이상', status: data.reports.length > 0 ? 'pass' : 'fail' },
    { category: 'declaration', description: '호환성 선언 1개 이상', status: data.declarations.length > 0 ? 'pass' : 'fail' }
  ];

  let canApprove = checklist.every(item => item.status !== 'fail');

  async function approve() {
    await fetch(`/api/releases/${data.release.release_id}:approve`, {
      method: 'POST',
      body: JSON.stringify({ checklist })
    });
  }

  async function reject(reason: string) {
    await fetch(`/api/releases/${data.release.release_id}:reject`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }
</script>

<div class="review-panel">
  <h1>릴리즈 검토: {data.package.name} v{data.release.version}</h1>

  <!-- 체크리스트 -->
  <section class="checklist">
    <h2>승인 체크리스트</h2>
    {#each checklist as item}
      <div class="checklist-item">
        <input type="checkbox" checked={item.status === 'pass'} disabled />
        <span>{item.description}</span>
        <span class="status-{item.status}">{item.status}</span>
      </div>
    {/each}
  </section>

  <!-- 릴리즈 정보 -->
  <section class="release-info">
    <h2>릴리즈 정보</h2>
    <pre>{data.release.release_notes}</pre>
  </section>

  <!-- 아티팩트 -->
  <section class="artifacts">
    <h2>Artifacts ({data.artifacts.length})</h2>
    {#each data.artifacts as artifact}
      <div>{artifact.file_name} ({artifact.size_bytes} bytes)</div>
    {/each}
  </section>

  <!-- 검증 리포트 -->
  <section class="reports">
    <h2>Verification Reports ({data.reports.length})</h2>
    {#each data.reports as report}
      <div>
        <strong>{report.report_type}</strong> - {report.result}
        <a href="/reports/{report.report_id}">상세보기</a>
      </div>
    {/each}
  </section>

  <!-- 호환성 선언 -->
  <section class="declarations">
    <h2>Compatibility Declarations ({data.declarations.length})</h2>
    {#each data.declarations as decl}
      <div>
        Runtime: {decl.runtime_profile?.name}, HW: {decl.hw_profile?.name}
      </div>
    {/each}
  </section>

  <!-- 액션 -->
  <div class="actions">
    <button on:click={approve} disabled={!canApprove} class="btn-approve">
      승인 및 공개
    </button>
    <button on:click={() => showRejectModal = true} class="btn-reject">
      반려
    </button>
  </div>
</div>
```

---

### 5.3 카탈로그/탐색(Catalog/Discovery) 기능 범위

#### 📋 아키텍처 설계
- CT-01: 카탈로그 홈 (필수 A-SW 10종 섹션)
- CT-02: 검색 결과 (프로파일 필터)
- CT-03: 패키지 상세
- CT-04: 릴리즈 상세 (호환성 선언, 다운로드)
- CT-05: 가이드/레퍼런스

#### 💻 현재 구현
- `/projects` - 프로젝트 목록 (검색/필터: category/status/language)

#### ✅ 보완 방안

**1. 필수 A-SW 섹션 추가**
```svelte
<!-- src/routes/(public)/catalog/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  let requiredPackages: Package[] = [];
  let allPackages: Package[] = [];

  onMount(async () => {
    const packages = await fetch('/api/catalog/packages').then(r => r.json());
    requiredPackages = packages.filter(p => p.is_required);
    allPackages = packages;
  });
</script>

<div class="catalog-home">
  <!-- 필수 A-SW 섹션 -->
  <section class="required-asw">
    <h2>필수 A-SW 10종</h2>
    <div class="required-grid">
      {#each requiredPackages as pkg}
        <div class="package-card required">
          <span class="badge-required">필수</span>
          <h3>{pkg.name}</h3>
          <p>{pkg.summary}</p>
          <a href="/catalog/packages/{pkg.package_id}">자세히 보기</a>
        </div>
      {/each}
    </div>
  </section>

  <!-- 전체 카탈로그 -->
  <section class="all-packages">
    <h2>전체 A-SW</h2>
    <!-- 검색/필터 UI -->
  </section>
</div>
```

**2. 프로파일 기반 필터 추가**
```svelte
<script lang="ts">
  let selectedRuntime: string | null = null;
  let selectedHW: string | null = null;
  let filteredPackages: Package[] = [];

  async function applyProfileFilter() {
    const params = new URLSearchParams();
    if (selectedRuntime) params.set('runtime_profile_id', selectedRuntime);
    if (selectedHW) params.set('hw_profile_id', selectedHW);

    filteredPackages = await fetch(`/api/catalog/releases?${params}`)
      .then(r => r.json());
  }
</script>

<div class="profile-filter">
  <h3>호환 프로파일 필터</h3>
  <select bind:value={selectedRuntime} on:change={applyProfileFilter}>
    <option value={null}>전체 Runtime</option>
    {#each runtimeProfiles as profile}
      <option value={profile.runtime_profile_id}>{profile.name}</option>
    {/each}
  </select>

  <select bind:value={selectedHW} on:change={applyProfileFilter}>
    <option value={null}>전체 HW</option>
    {#each hwProfiles as profile}
      <option value={profile.hw_profile_id}>{profile.name}</option>
    {/each}
  </select>
</div>
```

**3. 릴리즈 상세 (다운로드 + 호환성)**
```svelte
<!-- src/routes/(public)/catalog/releases/[releaseId]/+page.svelte -->
<script lang="ts">
  export let data: {
    release: Release,
    package: Package,
    artifacts: Artifact[],
    declarations: CompatibilityDeclaration[]
  };

  async function downloadArtifact(artifactId: string) {
    const url = await fetch(`/api/artifacts/${artifactId}:download`)
      .then(r => r.json())
      .then(data => data.url);

    window.location.href = url;
  }
</script>

<div class="release-detail-public">
  <h1>{data.package.name} v{data.release.version}</h1>

  <!-- 다운로드 섹션 -->
  <section class="downloads">
    <h2>다운로드</h2>
    {#each data.artifacts as artifact}
      <div class="artifact-download">
        <span>{artifact.file_name}</span>
        <span>{(artifact.size_bytes / 1024 / 1024).toFixed(2)} MB</span>
        <button on:click={() => downloadArtifact(artifact.artifact_id)}>
          다운로드
        </button>
        <small>SHA-256: {artifact.checksum}</small>
      </div>
    {/each}
  </section>

  <!-- 호환성 정보 -->
  <section class="compatibility">
    <h2>호환 환경</h2>
    {#each data.declarations as decl}
      <div class="compat-card">
        <div>
          <strong>Runtime:</strong> {decl.runtime_profile?.name}
        </div>
        <div>
          <strong>Hardware:</strong> {decl.hw_profile?.name}
        </div>
        <div>
          <strong>검증 근거:</strong>
          {#each decl.evidence_reports as report}
            <a href="/reports/{report.report_id}">{report.report_type}</a>
          {/each}
        </div>
      </div>
    {/each}
  </section>

  <!-- 설치 가이드 -->
  <section class="guides">
    <h2>설치 및 실행 가이드</h2>
    <ul>
      <li><a href="/docs/installation">설치 가이드</a></li>
      <li><a href="/docs/execution">실행 가이드</a></li>
      <li><a href="/docs/verification">검증 가이드</a></li>
    </ul>
  </section>
</div>
```

---

## Chapter 8. 데이터 저장 및 API

### 8.1 데이터 저장 구조

#### 📋 아키텍처 설계
- **RDB**: Package/Release/Status/Profiles/Declarations/Reports/Approval/Audit
- **Object Storage**: Artifacts, Report Attachments
- **(선택) Search Index**

#### 💻 현재 구현
```bash
$ find . -name "*.prisma"
# (결과 없음)
```

❌ **Prisma 스키마 파일이 전혀 없음** - 모든 데이터가 Mock으로만 존재

#### ✅ 보완 방안

**1. Prisma 스키마 초기 설정**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// 핵심 도메인 (Chapter 4)
// ============================================

model Package {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  summary     String
  description String
  ownerOrg    String   @map("owner_org")
  category    String
  tags        String[]
  isRequired  Boolean  @default(false) @map("is_required")

  // Links (JSON 또는 별도 테이블)
  docsUrl     String?  @map("docs_url")
  supportUrl  String?  @map("support_url")
  repoUrl     String?  @map("repo_url")

  visibility  String   @default("public") // public/private
  license     String?

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  releases    Release[]

  @@map("packages")
}

model Release {
  id           String        @id @default(cuid())
  packageId    String        @map("package_id")
  package      Package       @relation(fields: [packageId], references: [id], onDelete: Cascade)

  version      String
  releaseNotes String        @map("release_notes")
  status       ReleaseStatus @default(Draft)

  submittedAt  DateTime?     @map("submitted_at")
  publishedAt  DateTime?     @map("published_at")

  createdAt    DateTime      @default(now()) @map("created_at")
  updatedAt    DateTime      @updatedAt @map("updated_at")

  artifacts    Artifact[]
  reports      VerificationReport[]
  declarations CompatibilityDeclaration[]
  approvals    ReleaseApproval[]

  @@unique([packageId, version])
  @@index([status])
  @@map("releases")
}

enum ReleaseStatus {
  Draft
  Submitted
  Verified
  Approved
  Published
  Withdrawn
}

model Artifact {
  id          String   @id @default(cuid())
  releaseId   String   @map("release_id")
  release     Release  @relation(fields: [releaseId], references: [id], onDelete: Cascade)

  fileName    String   @map("file_name")
  contentType String   @map("content_type")
  sizeBytes   BigInt   @map("size_bytes")
  checksum    String   // SHA-256
  storageUri  String   @map("storage_uri")

  uploadStatus String  @default("completed") @map("upload_status")

  createdAt   DateTime @default(now()) @map("created_at")

  @@map("artifacts")
}

model RuntimeProfile {
  id               String   @id @default(cuid())
  name             String
  osFamily         String   @map("os_family")
  kernel           String
  kernelRt         Boolean  @default(false) @map("kernel_rt")
  middleware       String?
  containerSupport Boolean  @default(false) @map("container_support")
  notes            String?

  createdAt        DateTime @default(now()) @map("created_at")

  declarations     CompatibilityDeclaration[]

  @@map("runtime_profiles")
}

model HWProfile {
  id              String   @id @default(cuid())
  name            String
  manufacturer    String
  model           String
  generation      String?
  firmwareVersion String?  @map("firmware_version")
  interfaces      String[] // JSON array
  cpuArch         String?  @map("cpu_arch")
  notes           String?

  createdAt       DateTime @default(now()) @map("created_at")

  declarations    CompatibilityDeclaration[]

  @@map("hw_profiles")
}

model VerificationReport {
  id             String   @id @default(cuid())
  targetType     String   @map("target_type") // Release/Artifact
  targetId       String   @map("target_id")
  release        Release? @relation(fields: [targetId], references: [id], onDelete: Cascade)

  reportType     String   @map("report_type")
  result         String   // pass/fail/partial
  summary        String
  executedAt     DateTime @map("executed_at")

  // Environment (JSON or separate fields)
  environmentJson String? @map("environment_json")

  submittedBy    String   @map("submitted_by")
  submittedAt    DateTime @default(now()) @map("submitted_at")

  attachments    ReportAttachment[]
  declarations   CompatibilityDeclaration[]

  @@index([targetId])
  @@map("verification_reports")
}

model ReportAttachment {
  id        String             @id @default(cuid())
  reportId  String             @map("report_id")
  report    VerificationReport @relation(fields: [reportId], references: [id], onDelete: Cascade)

  fileName   String @map("file_name")
  fileType   String @map("file_type")
  storageUri String @map("storage_uri")
  sizeBytes  BigInt @map("size_bytes")

  createdAt  DateTime @default(now()) @map("created_at")

  @@map("report_attachments")
}

model CompatibilityDeclaration {
  id               String          @id @default(cuid())
  releaseId        String          @map("release_id")
  release          Release         @relation(fields: [releaseId], references: [id], onDelete: Cascade)

  runtimeProfileId String          @map("runtime_profile_id")
  runtimeProfile   RuntimeProfile  @relation(fields: [runtimeProfileId], references: [id])

  hwProfileId      String          @map("hw_profile_id")
  hwProfile        HWProfile       @relation(fields: [hwProfileId], references: [id])

  sinceVersion     String?         @map("since_version")
  untilVersion     String?         @map("until_version")

  status           String          @default("active") // active/deprecated/blocked
  notes            String?
  knownIssues      String[]        @map("known_issues")

  // 근거 리포트 (Many-to-Many)
  evidenceReports  VerificationReport[]

  declaredBy       String          @map("declared_by")
  createdAt        DateTime        @default(now()) @map("created_at")
  updatedAt        DateTime        @updatedAt @map("updated_at")

  @@unique([releaseId, runtimeProfileId, hwProfileId])
  @@map("compatibility_declarations")
}

// ============================================
// 승인 및 감사 (Chapter 7)
// ============================================

model ReleaseApproval {
  id                String   @id @default(cuid())
  releaseId         String   @map("release_id")
  release           Release  @relation(fields: [releaseId], references: [id], onDelete: Cascade)

  status            String   // pending/approved/rejected
  checklistVersion  String   @map("checklist_version")
  checklistResult   Json     @map("checklist_result")

  reviewerId        String?  @map("reviewer_id")
  reviewedAt        DateTime? @map("reviewed_at")
  comments          String?
  rejectionReason   String?  @map("rejection_reason")

  createdAt         DateTime @default(now()) @map("created_at")

  @@map("release_approvals")
}

model AuditLog {
  id          String   @id @default(cuid())
  eventType   String   @map("event_type") // state_transition/approval/rejection/publish/withdraw
  entityType  String   @map("entity_type") // release/package/declaration
  entityId    String   @map("entity_id")

  actorId     String   @map("actor_id")
  action      String
  metadata    Json?

  createdAt   DateTime @default(now()) @map("created_at")

  @@index([entityType, entityId])
  @@index([eventType])
  @@map("audit_logs")
}
```

**2. 마이그레이션 실행**
```bash
# .env 파일 설정
DATABASE_URL="postgresql://user:password@localhost:5432/asw_hub"

# Prisma 클라이언트 생성
npx prisma generate

# 마이그레이션 실행
npx prisma migrate dev --name init

# 시드 데이터 (선택)
npx prisma db seed
```

**3. Prisma 클라이언트 사용**
```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

---

### 8.2~8.3 API 엔드포인트

#### 📋 아키텍처 설계 (8.3.2~8.3.9)

주요 엔드포인트:
- `/api/packages` - 패키지 CRUD
- `/api/packages/{id}/releases` - 릴리즈 생성
- `/api/releases/{id}:submit` - 상태 전이
- `/api/artifacts/{id}:download` - 다운로드
- `/api/profiles/runtime`, `/api/profiles/hw`
- `/api/catalog/packages`, `/api/catalog/releases`
- `/api/ops/submissions` - 승인 대기 목록

#### 💻 현재 구현
```bash
$ find src/routes -name "+server.ts"
# (결과 없음)
```

❌ **API 엔드포인트가 전혀 없음** - SvelteKit 서버 액션 미사용

#### ✅ 보완 방안

**1. 패키지 API**
```typescript
// src/routes/api/packages/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/db';

export const GET: RequestHandler = async ({ url }) => {
  const search = url.searchParams.get('search');
  const isRequired = url.searchParams.get('is_required');

  const packages = await prisma.package.findMany({
    where: {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(isRequired && { isRequired: isRequired === 'true' })
    },
    include: {
      releases: {
        where: { status: 'Published' },
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });

  return json(packages);
};

export const POST: RequestHandler = async ({ request, locals }) => {
  // 인증 체크 (locals.user)
  const data = await request.json();

  const package = await prisma.package.create({
    data: {
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      name: data.name,
      summary: data.summary,
      description: data.description,
      ownerOrg: locals.user.organization,
      category: data.category,
      tags: data.tags || [],
      isRequired: data.isRequired || false,
      docsUrl: data.links?.docs,
      supportUrl: data.links?.support,
      repoUrl: data.links?.repo
    }
  });

  return json(package, { status: 201 });
};
```

**2. 릴리즈 생성 API**
```typescript
// src/routes/api/packages/[packageId]/releases/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/db';

export const POST: RequestHandler = async ({ params, request, locals }) => {
  const { packageId } = params;
  const data = await request.json();

  // 권한 체크: 패키지 소유자만 릴리즈 생성 가능
  const package = await prisma.package.findUnique({
    where: { id: packageId }
  });

  if (!package) {
    throw error(404, 'Package not found');
  }

  if (package.ownerOrg !== locals.user.organization) {
    throw error(403, 'Unauthorized');
  }

  // 버전 중복 체크
  const existing = await prisma.release.findUnique({
    where: {
      packageId_version: {
        packageId,
        version: data.version
      }
    }
  });

  if (existing) {
    throw error(409, 'Version already exists');
  }

  const release = await prisma.release.create({
    data: {
      packageId,
      version: data.version,
      releaseNotes: data.release_notes,
      status: 'Draft'
    }
  });

  return json(release, { status: 201 });
};
```

**3. 상태 전이 API (Custom Action)**
```typescript
// src/routes/api/releases/[releaseId]/actions/submit/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/db';

export const POST: RequestHandler = async ({ params, locals }) => {
  const { releaseId } = params;

  const release = await prisma.release.findUnique({
    where: { id: releaseId },
    include: { artifacts: true }
  });

  if (!release) {
    throw error(404, 'Release not found');
  }

  if (release.status !== 'Draft') {
    throw error(400, 'Can only submit Draft releases');
  }

  // 사전 조건 검증
  if (release.artifacts.length === 0) {
    throw error(400, 'Release must have at least one artifact');
  }

  const updated = await prisma.release.update({
    where: { id: releaseId },
    data: {
      status: 'Submitted',
      submittedAt: new Date()
    }
  });

  // 감사 로그
  await prisma.auditLog.create({
    data: {
      eventType: 'state_transition',
      entityType: 'release',
      entityId: releaseId,
      actorId: locals.user.id,
      action: 'submit',
      metadata: { from: 'Draft', to: 'Submitted' }
    }
  });

  return json(updated);
};
```

**4. 아티팩트 업로드 API**
```typescript
// src/routes/api/releases/[releaseId]/artifacts/+server.ts
import { json, error } from '@sveltejs/kit';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  }
});

export const POST: RequestHandler = async ({ params, request }) => {
  const { releaseId } = params;

  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    throw error(400, 'No file provided');
  }

  // 파일 크기 검증
  const MAX_SIZE = 500 * 1024 * 1024; // 500MB
  if (file.size > MAX_SIZE) {
    throw error(413, 'File too large');
  }

  // 체크섬 계산
  const buffer = Buffer.from(await file.arrayBuffer());
  const checksum = crypto.createHash('sha256').update(buffer).digest('hex');

  // S3 업로드
  const key = `releases/${releaseId}/${file.name}`;
  await s3.send(new PutObjectCommand({
    Bucket: 'asw-artifacts',
    Key: key,
    Body: buffer,
    ContentType: file.type,
    Metadata: { checksum }
  }));

  // DB 저장
  const artifact = await prisma.artifact.create({
    data: {
      releaseId,
      fileName: file.name,
      contentType: file.type,
      sizeBytes: BigInt(file.size),
      checksum,
      storageUri: `s3://asw-artifacts/${key}`,
      uploadStatus: 'completed'
    }
  });

  return json(artifact, { status: 201 });
};
```

**5. 다운로드 API**
```typescript
// src/routes/api/artifacts/[artifactId]/download/+server.ts
import { json, error } from '@sveltejs/kit';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const GET: RequestHandler = async ({ params }) => {
  const { artifactId } = params;

  const artifact = await prisma.artifact.findUnique({
    where: { id: artifactId },
    include: {
      release: {
        include: { package: true }
      }
    }
  });

  if (!artifact) {
    throw error(404, 'Artifact not found');
  }

  // Published 릴리즈만 다운로드 가능
  if (artifact.release.status !== 'Published') {
    throw error(403, 'Artifact not publicly available');
  }

  // S3 서명된 URL 생성 (1시간 유효)
  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: 'asw-artifacts',
      Key: artifact.storageUri.replace('s3://asw-artifacts/', '')
    }),
    { expiresIn: 3600 }
  );

  return json({ url, checksum: artifact.checksum });
};
```

**6. 카탈로그 검색 API (프로파일 필터)**
```typescript
// src/routes/api/catalog/releases/+server.ts
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
  const keyword = url.searchParams.get('keyword');
  const isRequired = url.searchParams.get('is_required');
  const runtimeProfileId = url.searchParams.get('runtime_profile_id');
  const hwProfileId = url.searchParams.get('hw_profile_id');

  const releases = await prisma.release.findMany({
    where: {
      status: 'Published',
      ...(isRequired && {
        package: { isRequired: true }
      }),
      ...(keyword && {
        OR: [
          { package: { name: { contains: keyword, mode: 'insensitive' } } },
          { package: { description: { contains: keyword, mode: 'insensitive' } } }
        ]
      }),
      ...((runtimeProfileId || hwProfileId) && {
        declarations: {
          some: {
            ...(runtimeProfileId && { runtimeProfileId }),
            ...(hwProfileId && { hwProfileId }),
            status: 'active'
          }
        }
      })
    },
    include: {
      package: true,
      artifacts: true,
      declarations: {
        where: { status: 'active' },
        include: {
          runtimeProfile: true,
          hwProfile: true,
          evidenceReports: true
        }
      }
    },
    orderBy: { publishedAt: 'desc' }
  });

  return json(releases);
};
```

---

## Chapter 9. 운영 및 유지보수

### 9.1~9.4 전체 누락

#### 📋 아키텍처 설계
- Changelog 운영
- 백업/보관/삭제 정책
- 모니터링 (API 가용성, 업로드/다운로드 성공률)
- 업로드 보안 (파일 크기, MIME, 체크섬, AV 스캔)

#### 💻 현재 구현
❌ 전혀 없음

#### ✅ 보완 방안

**1. Changelog 모델**
```prisma
model Changelog {
  id          String   @id @default(cuid())
  version     String   // 플랫폼 버전
  title       String
  description String
  changes     Json     // 변경 항목 배열
  publishedAt DateTime @default(now()) @map("published_at")

  @@map("changelogs")
}
```

**2. 백업 정책 (문서 + 스크립트)**
```bash
# scripts/backup-db.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backups/db_backup_$DATE.sql

# S3 백업 (선택)
aws s3 sync /path/to/artifacts s3://asw-backups/artifacts/$DATE/
```

**3. 모니터링 (간단 예시)**
```typescript
// src/lib/middleware/metrics.ts
export async function metricsMiddleware(request: Request, handler: () => Promise<Response>) {
  const start = Date.now();

  const response = await handler();

  const duration = Date.now() - start;

  // 메트릭 기록 (Prometheus/CloudWatch 등)
  recordMetric('http_request_duration_ms', duration, {
    method: request.method,
    path: new URL(request.url).pathname,
    status: response.status
  });

  return response;
}
```

**4. 업로드 보안**
```typescript
// src/lib/validators/upload.validator.ts
const ALLOWED_MIME_TYPES = [
  'application/zip',
  'application/x-tar',
  'application/gzip',
  'application/octet-stream',
  'application/pdf',
  'text/plain',
  'image/png',
  'image/jpeg'
];

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

export function validateUpload(file: File): void {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`파일 크기 초과 (최대 ${MAX_FILE_SIZE / 1024 / 1024}MB)`);
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`허용되지 않은 파일 형식: ${file.type}`);
  }

  // 확장자 검증
  const ext = file.name.split('.').pop()?.toLowerCase();
  const dangerousExtensions = ['exe', 'sh', 'bat', 'cmd'];
  if (dangerousExtensions.includes(ext || '')) {
    throw new Error('실행 파일은 업로드할 수 없습니다');
  }
}

// (선택) ClamAV 연동
export async function scanFile(buffer: Buffer): Promise<boolean> {
  // ClamAV 소켓 연결 및 스캔
  // 구현 생략
  return true; // clean
}
```

---

## Chapter 10. 필수 A-SW 10종 적용

### 10.1~10.3 필수 표기 및 완결 조건

#### 📋 아키텍처 설계
- `Package.is_required = true`
- 필수 A-SW REQ-01~10 코드 체계
- 완결 조건: Package + Published Release + Artifact + Report + Declaration

#### 💻 현재 구현
```typescript
// src/lib/types/index.ts
interface Project {
  // ❌ is_required 없음
}
```

#### ✅ 보완 방안

**1. 타입 확장**
```typescript
export interface Package {
  // ... 기존 필드
  is_required: boolean;
  required_code?: string;  // REQ-01 ~ REQ-10
}
```

**2. 필수 A-SW 시드 데이터**
```typescript
// prisma/seed/requiredPackages.ts
const requiredPackages = [
  {
    slug: 'agricultural-task-analysis',
    name: '농작업 분석 모듈',
    summary: '무인자율 농작업 분석 및 A-SW 모듈화 파라미터 정립',
    isRequired: true,
    requiredCode: 'REQ-01',
    ownerOrg: 'KITECH',
    category: 'crop-management'
  },
  {
    slug: 'path-control-system',
    name: '경로 제어 시스템',
    summary: '경로 생성/추종/속도 제어 통합 시스템',
    isRequired: true,
    requiredCode: 'REQ-02',
    ownerOrg: 'KITECH',
    category: 'farm-analytics'
  },
  // ... REQ-03 ~ REQ-10
];
```

**3. 완결 조건 체크**
```typescript
// src/lib/services/required-asw.service.ts
export async function checkRequiredASWCompletion(packageId: string): Promise<{
  completed: boolean;
  missing: string[];
}> {
  const pkg = await prisma.package.findUnique({
    where: { id: packageId },
    include: {
      releases: {
        where: { status: 'Published' },
        include: {
          artifacts: true,
          reports: true,
          declarations: true
        }
      }
    }
  });

  if (!pkg || !pkg.isRequired) {
    return { completed: false, missing: ['Not a required package'] };
  }

  const missing: string[] = [];

  if (pkg.releases.length === 0) {
    missing.push('Published 릴리즈 없음');
    return { completed: false, missing };
  }

  const release = pkg.releases[0];

  if (release.artifacts.length === 0) missing.push('아티팩트 없음');
  if (release.reports.length === 0) missing.push('검증 리포트 없음');
  if (release.declarations.length === 0) missing.push('호환성 선언 없음');

  return {
    completed: missing.length === 0,
    missing
  };
}
```

**4. 운영자 대시보드 (필수 10종 현황)**
```svelte
<!-- src/routes/(operator)/dashboard/required-asw/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  let requiredStatus: Array<{
    package: Package;
    completion: { completed: boolean; missing: string[] };
  }> = [];

  onMount(async () => {
    const packages = await fetch('/api/packages?is_required=true').then(r => r.json());

    requiredStatus = await Promise.all(
      packages.map(async (pkg) => ({
        package: pkg,
        completion: await fetch(`/api/packages/${pkg.id}/completion`).then(r => r.json())
      }))
    );
  });
</script>

<h1>필수 A-SW 10종 완결 현황</h1>

<table>
  <thead>
    <tr>
      <th>코드</th>
      <th>이름</th>
      <th>담당기관</th>
      <th>완결 상태</th>
      <th>미완 항목</th>
    </tr>
  </thead>
  <tbody>
    {#each requiredStatus as item}
      <tr class:completed={item.completion.completed}>
        <td>{item.package.requiredCode}</td>
        <td>{item.package.name}</td>
        <td>{item.package.ownerOrg}</td>
        <td>
          {#if item.completion.completed}
            <span class="badge-success">완료</span>
          {:else}
            <span class="badge-warning">미완</span>
          {/if}
        </td>
        <td>
          {#if !item.completion.completed}
            <ul>
              {#each item.completion.missing as missing}
                <li>{missing}</li>
              {/each}
            </ul>
          {:else}
            -
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
```

---

## 추가 발견: BusinessPlan 타입과 플랫폼 엔티티의 관계

### 현재 구현: 사업 계획 타입 (businessPlan.ts)

현재 코드에는 아키텍처 문서에 **명시되지 않은** 다음 타입들이 존재:

```typescript
- Institution (기관 정보)
- Deliverable (산출물: SYS/UI/INT/DATA/OPS/DOC)
- ProjectPhase (단계별 계획: 1단계 3년 + 2단계 2년)
- Milestone (마일스톤)
- GanttTask (간트 차트)
- BusinessPlan (통합)
```

#### 🔍 갭 분석

| 엔티티 | 용도 | 플랫폼 엔티티와 관계 |
|--------|------|-------------------|
| `Institution` | 참여 기관 관리 | Package.ownerOrg와 매핑 가능 |
| `Deliverable` | 사업 산출물 관리 | Release와 **개념적으로 다름** |
| `Milestone` | 사업 일정 관리 | Release.publishedAt와 무관 |

#### ⚠️ 주요 불일치: `Deliverable` vs `Release`

**Deliverable**
- 목적: 사업 계획 관점의 산출물 (SYS-01-01 형식)
- 상태: planned/in_progress/completed/verified/deployed
- 기관/연도/단계 중심

**Release**
- 목적: 플랫폼 배포 단위
- 상태: Draft→Submitted→Verified→Approved→Published
- 버전/아티팩트/호환성 중심

#### ✅ 보완 방안

**Option 1: 분리 유지 (권장)**
```typescript
// Deliverable과 Release는 별도 관리
// 연결은 참조 필드로만

interface Deliverable {
  // ... 기존 필드
  releaseId?: string;  // ✅ 추가: 플랫폼 릴리즈 연결
}

interface Release {
  // ... 기존 필드
  deliverableId?: string;  // ✅ 추가: 사업 산출물 연결
}
```

**Option 2: 통합 매핑 테이블**
```prisma
model DeliverableReleaseMapping {
  id            String @id @default(cuid())
  deliverableId String @map("deliverable_id")
  releaseId     String @map("release_id")

  createdAt     DateTime @default(now())

  @@unique([deliverableId, releaseId])
  @@map("deliverable_release_mappings")
}
```

---

## 우선순위별 보완 로드맵

### Phase 1: 핵심 SSoT 스키마 (1~2주)
- [ ] Prisma 스키마 정의 (Package/Release/Artifact)
- [ ] DB 마이그레이션 실행
- [ ] 기본 CRUD API (Package, Release)
- [ ] Mock 데이터 → DB 마이그레이션

### Phase 2: 상태 관리 및 워크플로우 (1~2주)
- [ ] Release 상태 머신 구현
- [ ] 상태 전이 API (:submit/:verify/:approve/:publish)
- [ ] Developer Portal 릴리즈 화면
- [ ] Operator Console 승인 대기 목록

### Phase 3: 프로파일 및 호환성 (1~2주)
- [ ] Runtime/HW Profile 스키마
- [ ] 프로파일 등록 UI (운영자)
- [ ] Compatibility Declaration 스키마
- [ ] 호환성 선언 작성 UI (개발자)
- [ ] 카탈로그 프로파일 필터

### Phase 4: 검증 리포트 (1주)
- [ ] Verification Report 스키마
- [ ] 리포트 제출 UI + 템플릿
- [ ] Report Attachment 업로드

### Phase 5: 아티팩트 관리 (1~2주)
- [ ] Object Storage 연동 (S3/MinIO)
- [ ] 아티팩트 업로드 API
- [ ] 다운로드 링크 생성 (서명된 URL)
- [ ] 체크섬 검증

### Phase 6: 카탈로그 및 공개 (1주)
- [ ] Published 릴리즈 카탈로그
- [ ] 필수 A-SW 섹션
- [ ] 프로파일 기반 검색
- [ ] 다운로드 + 가이드 링크

### Phase 7: 운영 기능 (1주)
- [ ] 감사 로그 (AuditLog)
- [ ] Changelog 관리
- [ ] 백업 스크립트
- [ ] 업로드 보안 강화

### Phase 8: 필수 10종 온보딩 (1주)
- [ ] is_required 필드 추가
- [ ] 필수 A-SW 시드 데이터
- [ ] 완결 조건 체크 API
- [ ] 운영자 대시보드

---

## 총평 및 권장사항

### 핵심 발견
1. **도메인 모델 불일치**: 아키텍처는 Package/Release 중심, 현재 구현은 Project/Build 중심
2. **Release 엔티티 전체 누락**: 플랫폼의 핵심 개념이 구현되지 않음
3. **DB 레이어 부재**: Prisma 스키마가 없어 모든 데이터가 Mock
4. **API 레이어 부재**: 백엔드 엔드포인트가 전혀 없음
5. **호환성/검증 미구현**: Profile, Declaration, Report 모두 누락

### 권장 접근 방식
1. **단계적 마이그레이션**: 기존 Project/Build를 Package/Release로 점진적 전환
2. **DB 우선**: Prisma 스키마부터 구축하여 SSoT 확립
3. **E2E 빠른 완성**: Phase 1~3까지 완료하면 기본 흐름 동작 가능
4. **필수 10종 조기 투입**: Phase 6 이후 즉시 온보딩 테스트

### 예상 소요 기간
- **최소 기능 (MVP)**: 6~8주
- **차년도 완성**: 10~12주
- **안정화 및 운영**: +2~4주

---

**작성자**: Claude (Architecture Gap Analysis)
**검토 필요**: VIA 개발팀, 아키텍트
**다음 액션**: Phase 1 착수 (Prisma 스키마 정의)
