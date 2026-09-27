# Task Order

**Project Name**: A-SW Hub Platform Development
**Contract Period**: September 1, 2025 ~ October 25, 2025 (55 days)
**Contracting Agency**: Korea Institute of Industrial Technology (KITECH)
**Performing Organization**: VIA Corporation
**Document Number**: TO-2025-ASW-001
**Date**: September 1, 2025
**Version**: 1.0

---

## 1. Background and Objectives

### 1.1 Background

Developing autonomous agricultural machinery software (A-SW) is a complex task requiring convergence of various specialized technologies, necessitating an efficient collaboration system among five participating institutions (KITECH, TYMICT, JBNU, VIA, OntarioTech).

Traditional collaboration methods using email and file sharing have the following limitations:
- Delayed development cycles (3-6 months) due to limited real-time collaboration
- Version conflicts and quality issues during code integration
- Inefficiencies from manual build/deployment processes
- Difficulty tracking project progress

### 1.2 Objectives

This task aims to build an **integrated collaboration platform (A-SW Hub)** for autonomous agricultural machinery software development, establishing a real-time collaboration system among participating institutions and improving development efficiency by more than 75%.

---

## 2. Scope of Work

### 2.1 Core Features

#### 2.1.1 Authentication & Authorization
- Email/Password authentication + GitHub OAuth 2.0 integration
- Role-Based Access Control (RBAC): Admin, Developer, Viewer
- JWT-based session management with automatic renewal

#### 2.1.2 Project Management
- Integrated management of agricultural machinery A-SW projects
- Git repository integration (GitHub/GitLab)
- Project settings: General, Repository, Build, Deployment, Notifications
- Collaborator management and permission settings

#### 2.1.3 CI/CD Pipeline
- Automatic build triggers (Git Push → Build → Test → Deploy)
- Real-time build log streaming
- 9-stage build process visualization
- Automatic notifications and rollback on build failures

#### 2.1.4 Deployment Management
- Multi-stage deployment environments: Development, Staging, Production
- Deployment approval workflows
- Deployment history tracking

#### 2.1.5 Quality Management
- Code quality metrics: Coverage, Complexity, Duplication
- Multi-level approval workflows (2-tier approval)
- Automatic quality gate verification

#### 2.1.6 Dashboard & Monitoring
- Real-time KPI dashboard
- Build success rate, deployment frequency, average lead time tracking
- Activity feed and notifications
- Project distribution visualization by language

#### 2.1.7 Timeline Management
- 5-year plan Gantt chart visualization
- Progress tracking of 136 deliverables
- Hierarchical structure by institution/year
- Milestone and dependency management

### 2.2 Technical Requirements

- **Frontend**: SvelteKit 2.x, TypeScript 5.x (Strict Mode)
- **State Management**: Svelte Stores
- **Validation**: Zod (runtime type validation)
- **Visualization**: Chart.js
- **Design**: Extreme Black & White Industrial Design
- **Testing**: Vitest (Unit), Playwright (E2E)
- **Build**: Zero TypeScript Errors, Zero Warnings

### 2.3 Non-Functional Requirements

- **Performance**: Lighthouse scores Performance 95+, Accessibility 100
- **Security**: HTTPS Only, OAuth 2.0, JWT, RBAC, CORS, CSP
- **Accessibility**: WCAG 2.1 AA compliant
- **Browsers**: Chrome 90+, Safari 14+, Firefox 88+
- **Responsive**: Desktop (1024px+), Tablet (768px+), Mobile (< 768px)

---

## 3. Deliverables

### 3.1 Software Deliverables

| No. | Deliverable | Format | Notes |
|-----|-------------|--------|-------|
| 1 | A-SW Hub Platform Source Code | Git Repository | GitHub/GitLab |
| 2 | Production Build Package | ZIP | Static files |
| 3 | Environment Configuration (.env.example) | ENV | With deployment guide |

### 3.2 Documentation Deliverables

| No. | Document | Format | Notes |
|-----|----------|--------|-------|
| 4 | System Architecture Design | Markdown/PDF | Korean/English |
| 5 | API Documentation | Markdown | RESTful endpoints |
| 6 | User Manual | Markdown/PDF | Korean/English, with screenshots |
| 7 | Administrator Guide | Markdown/PDF | Installation, configuration, operations |
| 8 | Design System Documentation | Markdown | B&W Industrial Design |
| 9 | Final Report | PDF | Korean/English |

### 3.3 Training Materials

| No. | Material | Format | Notes |
|-----|----------|--------|-------|
| 10 | Onboarding Training Program | Presentation | < 10 minutes |
| 11 | Hands-on Practice Guide | Markdown | Step-by-step |

---

## 4. Schedule

### 4.1 Overall Schedule (55 days)

| Period | Phase | Key Activities | Deliverables |
|--------|-------|----------------|--------------|
| 09.01~09.15 (15 days) | Requirements Analysis & Design | - System architecture design<br>- UX/UI design guide<br>- Development environment setup | Design documents, Design guide |
| 09.16~09.30 (15 days) | Core Feature Development | - Auth/Authorization system<br>- Project management module<br>- CI/CD pipeline (basic) | Feature implementation complete |
| 10.01~10.15 (15 days) | Advanced Feature Development | - Dashboard & metrics<br>- Quality management system<br>- Timeline Gantt chart | Advanced features complete |
| 10.16~10.25 (10 days) | Testing & Documentation | - Integration testing<br>- User manual<br>- Final report | All deliverables |

### 4.2 Major Milestones

| Date | Milestone | Review Items |
|------|-----------|--------------|
| 09.15 | Design Complete | Architecture design, Design guide review |
| 09.30 | Core Features Complete | Auth, Project management, Basic CI/CD demo |
| 10.15 | All Features Complete | Integrated demo of all features |
| 10.25 | Final Delivery | Acceptance inspection of all deliverables |

---

## 5. Roles and Responsibilities

### 5.1 Contracting Agency: Korea Institute of Industrial Technology (KITECH)
- Overall task management and coordination
- Requirements review and approval
- Interim/final inspections
- Coordination among participating institutions

### 5.2 Performing Organization: VIA Corporation
- Complete design and development of A-SW Hub platform
- CI/CD pipeline construction
- Black & White Industrial Design System implementation
- TypeScript-based enterprise architecture implementation
- Complete documentation (Korean/English)
- Onboarding training program development and delivery

### 5.3 Collaborating Organizations
- **TYMICT, JBNU, OntarioTech**: Platform testing and feedback

---

## 6. Acceptance Criteria

### 6.1 Quantitative Criteria

| Item | Target | Measurement Method |
|------|--------|-------------------|
| Build Success Rate | 100% | CI/CD build log verification |
| TypeScript Type Coverage | 100% | Strict Mode compilation success |
| Development Cycle Reduction | 75% | Validate 3-6 months → 2-4 weeks |
| Lighthouse Performance | 95+ | Chrome DevTools measurement |
| Lighthouse Accessibility | 100 | Chrome DevTools measurement |
| Bundle Size | < 200KB (gzipped) | Build analysis |
| Unit Test Coverage | 85%+ | Vitest coverage report |

### 6.2 Qualitative Criteria

| Item | Inspection Method |
|------|-------------------|
| Feature Completeness | Verify 100% implementation vs requirements spec |
| Usability | Real-world testing based on user scenarios |
| Code Quality | Code review, SonarQube analysis |
| Documentation Completeness | Document review and practice feasibility check |
| Design Consistency | Extreme B&W Industrial Design compliance |

### 6.3 Acceptance Conditions

**All** of the following conditions must be met for acceptance:
1. ✅ All functional requirements implemented (per requirements specification)
2. ✅ All quantitative criteria achieved
3. ✅ All deliverables submitted (software, documentation, training materials)
4. ✅ Integration testing passed (100% of E2E critical flows)
5. ✅ Contracting agency approval

---

## 7. Reference Documents

Please refer to the following documents for task execution:

| Document | Filename | Purpose |
|----------|----------|---------|
| Requirements Specification | `requirements-spec.md` | Detailed functional/non-functional requirements |
| User Scenarios | `user-scenarios.md` | Actual usage flows and test scenarios |
| Architecture Guide | `architecture-guide.md` | Technical architecture and design principles |

---

## 8. Special Notes

### 8.1 Design Principles
- **Extreme Black & White Industrial Design**: Only #000000 and #FFFFFF, border-radius: 0
- **Configuration-Driven Architecture**: Environment variable-based control
- **Domain-Driven Design**: Independent module design by domain
- **Zero-Touch Deployment**: Fully automated from code push to deployment

### 8.2 Out of Scope
The following are **excluded** from this task:
- Actual agricultural machinery hardware control interfaces
- AI/ML model training and inference engines
- Real-time sensor data collection systems
- Native mobile apps (replaced with responsive web)
- Backend API server construction (uses mock data)

### 8.3 Intellectual Property Rights
- All intellectual property rights for deliverables belong to the **contracting agency (KITECH)**.
- External libraries with open-source licenses follow their respective licenses.

### 8.4 Change Management
- Scope changes require written agreement between contracting and performing organizations
- Schedule delays must be reported immediately with adjustment discussions

---

## 9. Contract Terms (Reference)

> This section is separately defined in the actual contract and is included here for reference only.

### 9.1 Task Compensation
- Total task amount: [Separate contract]
- Payment terms: [Separate contract]

### 9.2 Progress Reporting
- Weekly progress report: Every Friday (email)
- Monthly review meeting: End of each month (in-person/video)

### 9.3 Inspection and Delivery
- Interim inspection: October 15, 2025 (when all features development complete)
- Final inspection: October 25, 2025 (when all deliverables submitted)

---

## 10. Approval

| Role | Organization | Name | Signature | Date |
|------|--------------|------|-----------|------|
| Contracting Agency Lead | KITECH | | | 2025.09.01 |
| Performing Organization Lead | VIA | | | 2025.09.01 |

---

**Document History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025.09.01 | VIA | Initial creation |

---

**Appendices**
- Appendix A: Requirements Specification (`requirements-spec.md`)
- Appendix B: User Scenarios (`user-scenarios.md`)
- Appendix C: Architecture Guide (`architecture-guide.md`)
