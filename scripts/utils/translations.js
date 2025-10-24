/**
 * PDF Generator - 번역 파일 로드 유틸리티
 *
 * 언어별(en/ko) 번역 JSON 파일을 읽어옵니다.
 */

import path from 'path';
import fs from 'fs';
import { TRANSLATIONS_DIR } from '../constants.js';

/**
 * 번역 파일 로드
 *
 * @param {string} lang - 언어 코드 ('en' 또는 'ko')
 * @returns {Object} 페이지 및 공통 번역 객체
 * @returns {Object} .pages - 페이지별 번역 (pages-{lang}.json)
 * @returns {Object} .common - 공통 번역 (common-{lang}.json)
 *
 * @example
 * const translations = loadTranslations('ko');
 * console.log(translations.common.title); // "A-SW 플랫폼"
 * console.log(translations.pages['DASH-001'].name); // "대시보드"
 */
export function loadTranslations(lang) {
  const pagesPath = path.join(TRANSLATIONS_DIR, `pages-${lang}.json`);
  const commonPath = path.join(TRANSLATIONS_DIR, `common-${lang}.json`);

  return {
    pages: JSON.parse(fs.readFileSync(pagesPath, 'utf-8')),
    common: JSON.parse(fs.readFileSync(commonPath, 'utf-8')),
  };
}
