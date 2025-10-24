# A-SW Hub 최종 보고서 스크린샷

농업기계 자율주행 소프트웨어 개발을 위한 통합 협업 플랫폼(A-SW Hub) 구축 용역 최종 결과보고서의 주요 페이지 스크린샷입니다.

## 한글 보고서 (Korean Report) - 27페이지

### 📄 주요 페이지 스크린샷

#### 1. 표지 (Cover Page) - page-01-cover-01.png
- **내용**: 프로젝트 제목, (주)비아 작성 표기, 날짜
- **페이지**: 1/27
- **파일 크기**: 66KB
- **해상도**: 150 DPI

#### 2. 목차 (Table of Contents) - page-02-toc-02.png
- **내용**: 8개 장 + 부록 전체 목차
- **페이지**: 2/27
- **파일 크기**: 28KB

#### 3. 제1장 시작 (Chapter 1 Start) - page-03-chapter1-start-03.png
- **내용**: 연구개발과제 개요
- **페이지**: 3/27
- **파일 크기**: 124KB

#### 4. 참여기관 협업 다이어그램 - page-08-collaboration-diagram-08.png
- **내용**: 5개 참여기관 협업 구조 다이어그램 (Mermaid)
  - A-SW Hub 중심 협업 체계
  - KITECH (주관), TYMICT, JBNU, VIA, OntarioTech
- **페이지**: 8/27
- **파일 크기**: 163KB (다이어그램 포함)
- **다이어그램**: `collaboration` (graph TD)

#### 5. 시스템 아키텍처 다이어그램 - page-11-architecture-diagram-11.png
- **내용**: Domain-Driven Design 기반 4계층 아키텍처
  - Presentation Layer
  - Domain Layer
  - Service Layer
  - Infrastructure Layer
- **페이지**: 11/27
- **파일 크기**: 124KB
- **다이어그램**: `architecture` (graph TB)

#### 6. 도메인 모델 관계도 - page-14-domain-diagram-14.png
- **내용**: 핵심 엔티티 간 관계 (ER Diagram)
  - USER, PROJECT, BUILD, DEPLOYMENT, APPROVAL
- **페이지**: 14/27
- **파일 크기**: 125KB
- **다이어그램**: `domain` (erDiagram)

#### 7. 디자인 시스템 계층 구조 - page-17-design-system-diagram-17.png
- **내용**: Atomic Design 기반 컴포넌트 구조
  - Design Tokens → Atoms → Molecules → Organisms → Templates → Pages
- **페이지**: 17/27
- **파일 크기**: 110KB
- **다이어그램**: `designSystem` (graph TD)

#### 8. CI/CD 파이프라인 - page-20-cicd-diagram-20.png
- **내용**: Git Push부터 Production 배포까지 자동화 파이프라인
  - 9단계 프로세스: Clone → Build → Test → Deploy → Verify
- **페이지**: 20/27
- **파일 크기**: 55KB
- **다이어그램**: `cicd` (graph LR)

#### 9. 부록 - 용어 정의 - page-26-glossary-26.png
- **내용**: 주요 용어 정의
  - **A-SW**: Agricultural Open-Source Software (농기계 개방형 오픈소스 소프트웨어)
  - CI/CD, DDD, RBAC 등
- **페이지**: 26/27
- **파일 크기**: 62KB

---

## 생성 정보

- **생성 도구**: `pdftoppm` (Poppler Utils)
- **해상도**: 150 DPI
- **포맷**: PNG (24-bit RGB)
- **생성 일시**: 2025-10-25
- **원본 PDF**: `reports/ko/a-sw-hub-final-report-ko.pdf` (27 pages, 4.3MB)

## 다이어그램 정보

모든 다이어그램은 Mermaid.js로 정의되고 Playwright로 렌더링되어 Black & White 테마로 통일되었습니다.

- **총 다이어그램 수**: 5개 (timeline 제외)
- **테마**: Extreme Black & White Industrial Design
- **생성 위치**: `scripts/report/diagrams/outputs/`

## 파일 목록

```
screenshots/report/ko/
├── page-01-cover-01.png              (66KB)  - 표지
├── page-02-toc-02.png                 (28KB)  - 목차
├── page-03-chapter1-start-03.png      (124KB) - 제1장 시작
├── page-08-collaboration-diagram-08.png (163KB) - 협업 구조
├── page-11-architecture-diagram-11.png  (124KB) - 시스템 아키텍처
├── page-14-domain-diagram-14.png        (125KB) - 도메인 모델
├── page-17-design-system-diagram-17.png (110KB) - 디자인 시스템
├── page-20-cicd-diagram-20.png          (55KB)  - CI/CD 파이프라인
└── page-26-glossary-26.png              (62KB)  - 용어 정의
```

**총 용량**: ~857KB (9 images)

---

## 사용 방법

### 스크린샷 재생성

```bash
# 특정 페이지 추출 (150 DPI)
pdftoppm -png -f 1 -l 1 -r 150 reports/ko/a-sw-hub-final-report-ko.pdf screenshots/report/ko/page-01-cover

# 여러 페이지 일괄 추출
for page in 1 2 3 8 11 14 17 20 26; do
  pdftoppm -png -f $page -l $page -r 150 reports/ko/a-sw-hub-final-report-ko.pdf screenshots/report/ko/page-$page
done
```

### 이미지 보기 (macOS)

```bash
open screenshots/report/ko/page-01-cover-01.png
```

---

## 라이선스

본 스크린샷은 A-SW Hub 프로젝트의 일부이며, 원본 보고서와 동일한 라이선스를 따릅니다.

**작성**: (주)비아 (VIASOFT.AI)
**날짜**: 2025-10-26
