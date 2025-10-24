/**
 * PDF Generator - 기본 경로 상수
 *
 * 개발 서버 URL 및 파일 경로들을 정의합니다.
 * 이 파일을 수정하면 모든 PDF 생성에 영향을 미칩니다.
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 개발 서버 URL - 스크린샷을 캡처할 로컬 서버 주소
 */
export const BASE_URL = 'http://localhost:5174';

/**
 * PDF 출력 디렉토리 - 생성된 PDF 파일이 저장될 위치
 */
export const OUTPUT_DIR = path.join(__dirname, '../pdfs');

/**
 * 폰트 디렉토리 - PDF에 임베드할 폰트 파일 위치
 */
export const FONTS_DIR = path.join(__dirname, '../fonts');

/**
 * 번역 파일 디렉토리 - 한국어/영어 번역 JSON 파일 위치
 */
export const TRANSLATIONS_DIR = path.join(__dirname, '../translations');
