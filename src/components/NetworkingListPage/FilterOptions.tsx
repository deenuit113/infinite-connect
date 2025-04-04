// filterOptions.ts
import { detailsMap } from '@constants/userRole';

export const interests = [
  // 커리어/경력 관련
  '취업/이직',
  '사이드프로젝트',
  '창업',
  '외국계/유학',
  '프리랜서',
  '브랜딩',
  '리더십',
  '멘토링',
  '포트폴리오',
  '네트워킹',

  // 조직/문화 관련
  '스타트업',
  '애자일',
  '피드백',
  '협업',
  '디지털노마드',
  '조직문화',
  '커뮤니케이션',
  '협업툴',

  // 산업/기술 관련
  'AI',
  '블록체인',
  '헬스케어',
  '핀테크',
  '에듀테크',
  '콘텐츠',
  'ESG',
  'IoT',
  '게임',
  '모빌리티',

  // 라이프스타일 관련
  '독서',
  '기록',
  '여행',
  '자기계발',
  '운동',
  '워라밸',
];

export const filterOptions = {
  years: ['신입', '1~3년', '4~7년', '8~10년', '10년 이상'],
  jobs: Object.keys(detailsMap),
  subJobsMap: detailsMap,
  interests,
};
