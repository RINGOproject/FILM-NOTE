import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Movie type definitions
interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string | string[];
  year: number;
  duration: number;
  rating: number;
  reviewCount: number;
  poster: string;
  director: string;
  cast: string[];
  platform: string;
}

interface Review {
  id: string;
  movieId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

// User type definition
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  bio: string;
  verified: boolean;
  followersCount: number;
  followingCount: number;
  watchedMovies: string[];
  stats: {
    totalReviews: number;
    averageRating: number;
    totalMoviesWatched: number;
    platforms: string[];
  };
}

// BlogPost type definition
interface BlogPost {
  id: string;
  authorId: string;
  author: string;
  authorAvatar: string;
  movieId?: string;
  movieTitle?: string;
  moviePoster?: string;
  rating?: number;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  hasSpoiler?: boolean;
  likedBy?: string[];
}

// FollowRelation type definition
interface FollowRelation {
  id: string;
  followerId: string;
  followingId: string;
  date: string;
}

// Extended movie data with more genres and platforms
const initialMovies: Movie[] = [
  // Action Movies
  {
    id: '1',
    title: '귀멸의 칼날: 절대 지지 않겠다',
    description: '대정시대, 가족을 도깨비에게 잃은 탄지로가 여동생 네즈코를 구하기 위해 도깨비 사냥꾼이 되어 펼치는 액션 어드벤처.',
    genre: 'Action',
    year: 2024,
    duration: 142,
    rating: 4.3,
    reviewCount: 2847,
    poster: 'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGFjdGlvbnxlbnwxfHx8fDE3NTgwNTgzMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '소토자키 하루오',
    cast: ['하나에 나츠키', '사토 타쿠마', '시모노 히로'],
    platform: 'Netflix'
  },
  {
    id: '7',
    title: 'Fast & Furious: Final Chapter',
    description: '도미닉과 패밀리의 마지막 모험. 전 세계를 무대로 펼쳐지는 스펙터클한 액션.',
    genre: 'Action',
    year: 2024,
    duration: 148,
    rating: 4.2,
    reviewCount: 3654,
    poster: 'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGFjdGlvbnxlbnwxfHx8fDE3NTgwNTgzMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '저스틴 린',
    cast: ['빈 디젤', '미셸 로드리게스', '타이리스 깁슨'],
    platform: 'Prime Video'
  },
  {
    id: '8',
    title: 'Cyber Agent Zero',
    description: '사이버 테러리스트들과 맞서는 특수요원의 하이테크 액션 스릴러.',
    genre: 'Action',
    year: 2023,
    duration: 125,
    rating: 3.9,
    reviewCount: 1876,
    poster: 'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGFjdGlvbnxlbnwxfHx8fDE3NTgwNTgzMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '맥스 랜디스',
    cast: ['크리스 에반스', '스칼렛 요한슨', '안소니 마키'],
    platform: 'Apple TV+'
  },

  // Romance Movies
  {
    id: '2',
    title: 'Hearts in Seoul',
    description: '서울을 배경으로 한 감동적인 로맨스 드라마. 두 사람의 운명적인 만남과 사랑 이야기.',
    genre: 'Romance',
    year: 2024,
    duration: 118,
    rating: 4.6,
    reviewCount: 3921,
    poster: 'https://images.unsplash.com/photo-1745118037962-3c86d081e592?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMHJvbWFuY2V8ZW58MXx8fHwxNzU4MDUxNzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '박찬욱',
    cast: ['박서준', '김고은', '이정재'],
    platform: 'Disney+'
  },
  {
    id: '9',
    title: 'Paris in Spring',
    description: '파리의 봄을 배경으로 한 클래식 로맨스. 예술가와 작가의 아름다운 사랑 이야기.',
    genre: 'Romance',
    year: 2023,
    duration: 102,
    rating: 4.4,
    reviewCount: 2354,
    poster: 'https://images.unsplash.com/photo-1745118037962-3c86d081e592?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMHJvbWFuY2V8ZW58MXx8fHwxNzU4MDUxNzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '클로이 자오',
    cast: ['티모시 샬라메', '사이어시 로넌', '오스카 아이작'],
    platform: 'Netflix'
  },

  // Comedy Movies
  {
    id: '3',
    title: 'The Last Laugh',
    description: '웃음과 감동이 가득한 코미디. 은퇴한 코미디언의 마지막 공연 준비 과정을 그린 작품.',
    genre: 'Comedy',
    year: 2023,
    duration: 105,
    rating: 4.1,
    reviewCount: 1564,
    poster: 'https://images.unsplash.com/photo-1747807112118-6dd39da7f7fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNvbWVkeXxlbnwxfHx8fDE3NTgxMTEwMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '제임스 L. 브룩스',
    cast: ['로빈 윌리엄스', '스티브 카렐', '에이미 포엘러'],
    platform: 'Netflix'
  },
  {
    id: '10',
    title: 'Office Chaos',
    description: '회사에서 벌어지는 기상천외한 일들을 다룬 직장 코미디.',
    genre: 'Comedy',
    year: 2024,
    duration: 98,
    rating: 3.8,
    reviewCount: 2198,
    poster: 'https://images.unsplash.com/photo-1747807112118-6dd39da7f7fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNvbWVkeXxlbnwxfHx8fDE3NTgxMTEwMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '저드 아패토우',
    cast: ['라이언 레이놀즈', '엠마 스톤', '조나 힐'],
    platform: 'Prime Video'
  },
  {
    id: '11',
    title: 'Wedding Crashers 2',
    description: '결혼식 크래셔들의 두 번째 모험. 더욱 황당하고 재미있는 이야기.',
    genre: 'Comedy',
    year: 2024,
    duration: 112,
    rating: 4.0,
    reviewCount: 1823,
    poster: 'https://images.unsplash.com/photo-1747807112118-6dd39da7f7fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNvbWVkeXxlbnwxfHx8fDE3NTgxMTEwMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '데이비드 도브킨',
    cast: ['오웬 윌슨', '빈스 본', '레이첼 맥아담스'],
    platform: 'Disney+'
  },

  // Horror Movies
  {
    id: '4',
    title: 'Midnight Terror',
    description: '심야에 펼쳐지는 공포의 연속. 어둠 속에서 벌어지는 섬뜩한 사건들.',
    genre: 'Horror',
    year: 2024,
    duration: 96,
    rating: 3.8,
    reviewCount: 892,
    poster: 'https://images.unsplash.com/photo-1712456298333-5747a9506a5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGhvcnJvcnxlbnwxfHx8fDE3NTgwODczNTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '아리 애스터',
    cast: ['토니 콜렛', '가브리엘 번', '알렉스 울프'],
    platform: 'Disney+'
  },
  {
    id: '12',
    title: 'The Haunted Manor',
    description: '오래된 저택에서 벌어지는 초자연적 현상들. 클래식 호러의 진수.',
    genre: 'Horror',
    year: 2023,
    duration: 108,
    rating: 3.7,
    reviewCount: 1456,
    poster: 'https://images.unsplash.com/photo-1712456298333-5747a9506a5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGhvcnJvcnxlbnwxfHx8fDE3NTgwODczNTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '제임스 완',
    cast: ['베라 파미가', '패트릭 윌슨', '매디슨 울��'],
    platform: 'Netflix'
  },

  // Sci-Fi Movies
  {
    id: '5',
    title: 'Beyond Tomorrow',
    description: '미래 세계를 그린 SF 대작. 인공지능과 인간의 공존에 대한 철학적 질문을 던진다.',
    genre: 'Sci-Fi',
    year: 2024,
    duration: 156,
    rating: 4.4,
    reviewCount: 4231,
    poster: 'https://images.unsplash.com/photo-1659835347242-97835d671db7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMHNjaS1maXxlbnwxfHx8fDE3NTc5ODI5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '데니 빌뇌브',
    cast: ['라이언 고슬링', '에이미 아담스', '제레미 레너'],
    platform: 'Netflix'
  },
  {
    id: '13',
    title: 'Galactic Wars: Episode IX',
    description: '은하계 전쟁의 마지막 장. 우주를 구하기 위한 마지막 전투가 시작된다.',
    genre: 'Sci-Fi',
    year: 2024,
    duration: 142,
    rating: 4.5,
    reviewCount: 5678,
    poster: 'https://images.unsplash.com/photo-1659835347242-97835d671db7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMHNjaS1maXxlbnwxfHx8fDE3NTc5ODI5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: 'J.J. 아브럼스',
    cast: ['데이지 리들리', '아담 드라이버', '오스카 아이작'],
    platform: 'Disney+'
  },
  {
    id: '14',
    title: 'Time Paradox',
    description: '시간여행을 다룬 복잡하고 흥미진진한 SF 스릴러.',
    genre: 'Sci-Fi',
    year: 2023,
    duration: 128,
    rating: 4.2,
    reviewCount: 2987,
    poster: 'https://images.unsplash.com/photo-1659835347242-97835d671db7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMHNjaS1maXxlbnwxfHx8fDE3NTc5ODI5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '크리스토퍼 놀란',
    cast: ['조셉 고든-레빗', '마리용 꼬띠아르', '톰 하디'],
    platform: 'Apple TV+'
  },

  // Drama Movies
  {
    id: '6',
    title: 'Family Matters',
    description: '가족의 소중함을 다시 한번 깨닫게 해주는 감동적인 드라마.',
    genre: 'Drama',
    year: 2023,
    duration: 134,
    rating: 4.5,
    reviewCount: 2156,
    poster: 'https://images.unsplash.com/photo-1572700432881-42c60fe8c869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGRyYW1hfGVufDF8fHx8MTc1ODA4NzM2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '켄 로치',
    cast: ['메릴 스트립', '톰 행크스', '샐리 필드'],
    platform: 'Disney+'
  },
  {
    id: '15',
    title: 'The Artist\'s Journey',
    description: '예술가의 성장과 고뇌를 그린 깊이 있는 인간 드라마.',
    genre: 'Drama',
    year: 2024,
    duration: 145,
    rating: 4.3,
    reviewCount: 1789,
    poster: 'https://images.unsplash.com/photo-1572700432881-42c60fe8c869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGRyYW1hfGVufDF8fHx8MTc1ODA4NzM2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '다미엔 셰젤',
    cast: ['라이언 고슬링', '엠마 스톤', 'J.K. 시몬스'],
    platform: 'Netflix'
  },
  {
    id: '16',
    title: 'Broken Dreams',
    description: '삶의 좌절과 희망을 다룬 감동적인 휴먼 드라마.',
    genre: 'Drama',
    year: 2023,
    duration: 121,
    rating: 4.1,
    reviewCount: 2456,
    poster: 'https://images.unsplash.com/photo-1572700432881-42c60fe8c869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGRyYW1hfGVufDF8fHx8MTc1ODA4NzM2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '바리 젠킨스',
    cast: ['마허샬라 알리', '나오미 해리스', '트레반테 로즈'],
    platform: 'Prime Video'
  },

  // New Genres - Thriller
  {
    id: '17',
    title: 'Dark Secrets',
    description: '비밀을 파헤치는 수사관의 스릴 넘치는 추적극.',
    genre: 'Thriller',
    year: 2024,
    duration: 115,
    rating: 4.0,
    reviewCount: 2134,
    poster: 'https://images.unsplash.com/photo-1710988486821-9af47f60d62b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMHRocmlsbGVyfGVufDF8fHx8MTc1ODQ5OTAzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '데이비드 핀처',
    cast: ['제이크 질렌할', '로자먼드 파이크', '닐 패트릭 해리스'],
    platform: 'Netflix'
  },
  {
    id: '18',
    title: 'The Silent Witness',
    description: '목격자 없는 범죄를 둘러싼 심리 스릴러.',
    genre: 'Thriller',
    year: 2023,
    duration: 103,
    rating: 3.9,
    reviewCount: 1567,
    poster: 'https://images.unsplash.com/photo-1710988486821-9af47f60d62b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMHRocmlsbGVyfGVufDF8fHx8MTc1ODQ5OTAzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '드니 빌뇌브',
    cast: ['에이미 아담스', '제레미 레너', '포레스트 휘태커'],
    platform: 'Disney+'
  },

  // Animation
  {
    id: '19',
    title: 'Magic Kingdom Adventures',
    description: '마법의 왕국에서 펼쳐지는 모험을 그린 가족 애니메이션.',
    genre: 'Animation',
    year: 2024,
    duration: 95,
    rating: 4.6,
    reviewCount: 4521,
    poster: 'https://images.unsplash.com/photo-1614500166678-73b0de0bb934?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGFuaW1hdGlvbnxlbnwxfHx8fDE3NTg1MDYwMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '존 라세터',
    cast: ['크리스 프랫', '엘사 샤냐', '이드리스 엘바'],
    platform: 'Disney+'
  },
  {
    id: '20',
    title: 'Robot Dreams',
    description: '로봇과 인간의 우정을 그린 따뜻한 애니메이션.',
    genre: 'Animation',
    year: 2023,
    duration: 88,
    rating: 4.4,
    reviewCount: 2876,
    poster: 'https://images.unsplash.com/photo-1614500166678-73b0de0bb934?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGFuaW1hdGlvbnxlbnwxfHx8fDE3NTg1MDYwMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '피트 닥터',
    cast: ['톰 행크스', '팀 알렌', '조안 쿠삭'],
    platform: 'Netflix'
  },

  // Fantasy
  {
    id: '21',
    title: 'The Last Dragon Keeper',
    description: '마지막 드래곤을 지키는 수호자의 판타지 모험.',
    genre: 'Fantasy',
    year: 2024,
    duration: 138,
    rating: 4.3,
    reviewCount: 3421,
    poster: 'https://images.unsplash.com/photo-1573917308539-f1ba0c83ae4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGZhbnRhc3l8ZW58MXx8fHwxNzU4NDk5MDM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '피터 잭슨',
    cast: ['엘리야 우드', '이안 맥켈런', '비고 모텐슨'],
    platform: 'Prime Video'
  },
  {
    id: '22',
    title: 'Enchanted Forest',
    description: '마법의 숲에서 벌어지는 신비로운 이야기.',
    genre: 'Fantasy',
    year: 2023,
    duration: 124,
    rating: 4.1,
    reviewCount: 2145,
    poster: 'https://images.unsplash.com/photo-1573917308539-f1ba0c83ae4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGZhbnRhc3l8ZW58MXx8fHwxNzU4NDk5MDM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '기예르모 델 토로',
    cast: ['샐리 호킨스', '마이클 섀넌', '리처드 젠킨스'],
    platform: 'Apple TV+'
  },

  // War
  {
    id: '23',
    title: 'Battle of Heroes',
    description: '전쟁 중 영웅들의 희생과 용기를 그린 대서사시.',
    genre: 'War',
    year: 2024,
    duration: 158,
    rating: 4.4,
    reviewCount: 2987,
    poster: 'https://images.unsplash.com/photo-1709888246886-fe4d99231d60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMHdhcnxlbnwxfHx8fDE3NTg1MDYwMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '크리스토퍼 놀란',
    cast: ['톰 하디', '킬리언 머피', '케네스 브래너'],
    platform: 'Netflix'
  },
  {
    id: '24',
    title: 'The Last Stand',
    description: '마지막 방어선에서 벌어지는 치열한 전투.',
    genre: 'War',
    year: 2023,
    duration: 142,
    rating: 4.2,
    reviewCount: 1876,
    poster: 'https://images.unsplash.com/photo-1709888246886-fe4d99231d60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMHdhcnxlbnwxfHx8fDE3NTg1MDYwMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '스티븐 스필버그',
    cast: ['톰 행크스', '맷 데이먼', '에드워드 번스'],
    platform: 'Disney+'
  },

  // Mystery
  {
    id: '25',
    title: 'The Missing Files',
    description: '사라진 증거를 찾아가는 탐정의 미스터리 수사극.',
    genre: 'Mystery',
    year: 2024,
    duration: 118,
    rating: 4.0,
    reviewCount: 2234,
    poster: 'https://images.unsplash.com/photo-1643677841226-d6427625f118?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMG15c3Rlcnl8ZW58MXx8fHwxNzU4NTA2MDM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '라이언 존슨',
    cast: ['다니엘 크레이그', '크리스 에반스', '제이미 리 커티스'],
    platform: 'Prime Video'
  },
  {
    id: '26',
    title: 'Cold Case Revival',
    description: '20년 전 미해결 사건을 다시 조사하는 형사들의 이야기.',
    genre: 'Mystery',
    year: 2023,
    duration: 135,
    rating: 3.8,
    reviewCount: 1654,
    poster: 'https://images.unsplash.com/photo-1643677841226-d6427625f118?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMG15c3Rlcnl8ZW58MXx8fHwxNzU4NTA2MDM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '데니스 빌뇌브',
    cast: ['에이미 아담스', '제레미 레너', '포레스트 휘태커'],
    platform: 'Apple TV+'
  },

  // Documentary
  {
    id: '27',
    title: 'Ocean\'s Secrets',
    description: '바다의 숨겨진 비밀을 탐구하는 자연 다큐멘터리.',
    genre: 'Documentary',
    year: 2024,
    duration: 92,
    rating: 4.5,
    reviewCount: 1432,
    poster: 'https://images.unsplash.com/photo-1679699316094-a74534381e22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGRvY3VtZW50YXJ5fGVufDF8fHx8MTc1ODUwNjAyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '데이비드 아텐버러',
    cast: ['데이비드 아텐버러'],
    platform: 'Netflix'
  },
  {
    id: '28',
    title: 'The AI Revolution',
    description: '인공지능이 인간 사회에 미치는 영향을 다룬 기술 다큐멘터리.',
    genre: 'Documentary',
    year: 2023,
    duration: 105,
    rating: 4.3,
    reviewCount: 987,
    poster: 'https://images.unsplash.com/photo-1679699316094-a74534381e22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGRvY3VtZW50YXJ5fGVufDF8fHx8MTc1ODUwNjAyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '알렉스 기브니',
    cast: ['내레이터: 모건 프리먼'],
    platform: 'Disney+'
  }
];

const initialReviews: Review[] = [
  {
    id: '1',
    movieId: '1',
    author: '영화광김씨',
    rating: 4,
    comment: '액션 시퀀스가 정말 대단해요. 특히 추격신이 손에 땀을 쥐게 만들더군요. 스토리도 탄탄하고 배우들의 연기도 훌륭합니다.',
    date: '2024-03-15',
    helpful: 24
  },
  {
    id: '2',
    movieId: '1',
    author: '액션덕후',
    rating: 5,
    comment: '올해 본 액션 영화 중 최고! 마이클 베이 특유의 스타일이 잘 살아있어요.',
    date: '2024-03-10',
    helpful: 18
  },
  {
    id: '3',
    movieId: '2',
    author: '로맨스러버',
    rating: 5,
    comment: '서울의 아름다운 풍경과 함께 펼쳐지는 사랑 이야기가 너무 감동적이에요. 박서준과 김고은의 케미가 환상적!',
    date: '2024-03-12',
    helpful: 31
  },
  {
    id: '4',
    movieId: '2',
    author: '드라마퀸',
    rating: 4,
    comment: '한국적인 정서가 잘 담긴 로맨스 영화. 울면서 봤어요 ㅠㅠ',
    date: '2024-03-08',
    helpful: 27
  },
  {
    id: '5',
    movieId: '5',
    author: 'SF마니아',
    rating: 5,
    comment: '데니 빌뇌브의 또 다른 걸작! 시각적 효과가 압도적이고 철학적 메시지도 깊이 있어요.',
    date: '2024-03-14',
    helpful: 42
  }
];

// Initialize database with movie data and sample social data
const initializeDatabase = async () => {
  try {
    // Check if movies are already initialized
    const existingMovies = await kv.get('movies_initialized');
    if (!existingMovies) {
      console.log('Initializing movies database with', initialMovies.length, 'movies...');
      
      // Store each movie individually
      for (const movie of initialMovies) {
        await kv.set(`movie:${movie.id}`, movie);
      }
      
      // Store movie IDs list
      await kv.set('movie_ids', initialMovies.map(m => m.id));
      
      // Mark as initialized
      await kv.set('movies_initialized', true);
      
      console.log('Movies database initialized successfully with', initialMovies.length, 'movies');
    } else {
      console.log('Movies database already initialized');
    }

    // ALWAYS check and initialize reviews (separate from movies)
    // This ensures review mappings are created even if movies were initialized earlier
    const existingReviewsInit = await kv.get('reviews_initialized');
    if (!existingReviewsInit) {
      console.log('🎬 Initializing movie reviews with', initialReviews.length, 'reviews...');
      
      // Store reviews and organize by movie
      const movieReviewsMap: Record<string, string[]> = {};
      
      for (const review of initialReviews) {
        console.log(`  💾 Storing review ${review.id} for movie ${review.movieId} (${review.author}: ${review.rating}★)`);
        await kv.set(`review:${review.id}`, review);
        
        // Group review IDs by movie
        if (!movieReviewsMap[review.movieId]) {
          movieReviewsMap[review.movieId] = [];
        }
        movieReviewsMap[review.movieId].push(review.id);
      }
      
      // Store review IDs list for each movie
      for (const [movieId, reviewIds] of Object.entries(movieReviewsMap)) {
        await kv.set(`movie_reviews:${movieId}`, reviewIds);
        console.log(`  📋 Movie ${movieId}: stored ${reviewIds.length} review(s) - IDs: [${reviewIds.join(', ')}]`);
      }
      
      // Store global review IDs list
      const reviewIdsList = initialReviews.map(r => r.id);
      await kv.set('review_ids', reviewIdsList);
      console.log(`  📚 Global review_ids list: [${reviewIdsList.join(', ')}]`);
      
      // Mark reviews as initialized
      await kv.set('reviews_initialized', true);
      
      console.log('✅ Movie reviews initialized successfully!');
      console.log(`   Total reviews: ${initialReviews.length}`);
      console.log(`   Movies with reviews: ${Object.keys(movieReviewsMap).length}`);
      console.log(`   Review distribution:`, JSON.stringify(
        Object.entries(movieReviewsMap).reduce((acc, [movieId, ids]) => {
          acc[`Movie ${movieId}`] = `${ids.length} reviews`;
          return acc;
        }, {} as Record<string, string>)
      ));
    } else {
      console.log('✓ Movie reviews already initialized');
      // 디버깅: 현재 저장된 리뷰 ID 목록 확인
      const currentReviewIds = await kv.get('review_ids') as string[] || [];
      console.log(`  Current review_ids in DB: ${currentReviewIds.length} reviews - [${currentReviewIds.join(', ')}]`);
    }

    // Initialize empty lists for social features if not exists
    const postIds = await kv.get('post_ids');
    if (!postIds) {
      await kv.set('post_ids', []);
      console.log('Initialized empty post_ids list');
    }

    const commentIds = await kv.get('comment_ids');
    if (!commentIds) {
      await kv.set('comment_ids', []);
      console.log('Initialized empty comment_ids list');
    }

    const followIds = await kv.get('follow_ids');
    if (!followIds) {
      await kv.set('follow_ids', []);
      console.log('Initialized empty follow_ids list');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Initialize database on startup
await initializeDatabase();

// Health check endpoint
app.get("/make-server-7f106327/health", (c) => {
  return c.json({ status: "ok" });
});

// Reset reviews initialization (for debugging)
app.post("/make-server-7f106327/reset-reviews", async (c) => {
  try {
    console.log('[RESET] Resetting reviews initialization flag...');
    await kv.del('reviews_initialized');
    
    // Re-initialize reviews
    await initializeDatabase();
    
    return c.json({ message: 'Reviews reset and re-initialized successfully' });
  } catch (error) {
    console.error('[RESET] Error resetting reviews:', error);
    return c.json({ error: 'Failed to reset reviews' }, 500);
  }
});

// Movies API endpoints

// Search movies (must come before /movies/:id to avoid conflicts)
app.get("/make-server-7f106327/movies/search", async (c) => {
  try {
    const query = c.req.query('q') || '';
    const genre = c.req.query('genre');
    const platform = c.req.query('platform');
    
    const movieIds = await kv.get('movie_ids') as string[] || [];
    const movies: Movie[] = [];
    
    for (const id of movieIds) {
      const movie = await kv.get(`movie:${id}`) as Movie;
      if (movie) {
        movies.push(movie);
      }
    }
    
    // Filter movies based on search criteria
    let filteredMovies = movies;
    
    if (query) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (genre && genre !== 'All') {
      filteredMovies = filteredMovies.filter(movie => {
        const movieGenres = Array.isArray(movie.genre) ? movie.genre : [movie.genre];
        return movieGenres.some(g => g.includes(genre));
      });
    }
    
    if (platform && platform !== 'All') {
      filteredMovies = filteredMovies.filter(movie => movie.platform === platform);
    }
    
    return c.json({ movies: filteredMovies });
  } catch (error) {
    console.error('Error searching movies:', error);
    return c.json({ error: 'Failed to search movies' }, 500);
  }
});

// Get all movies
app.get("/make-server-7f106327/movies", async (c) => {
  try {
    const movieIds = await kv.get('movie_ids') as string[] || [];
    const movies: Movie[] = [];
    
    for (const id of movieIds) {
      const movie = await kv.get(`movie:${id}`) as Movie;
      if (movie) {
        movies.push(movie);
      }
    }
    
    return c.json({ movies });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return c.json({ error: 'Failed to fetch movies' }, 500);
  }
});

// Get movie by ID
app.get("/make-server-7f106327/movies/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const movie = await kv.get(`movie:${id}`) as Movie;
    
    if (!movie) {
      return c.json({ error: 'Movie not found' }, 404);
    }
    
    return c.json({ movie });
  } catch (error) {
    console.error('Error fetching movie:', error);
    return c.json({ error: 'Failed to fetch movie' }, 500);
  }
});

// Add new movie
app.post("/make-server-7f106327/movies", async (c) => {
  try {
    const movieData = await c.req.json() as Omit<Movie, 'id'>;
    const id = `movie_${Date.now()}`;
    
    const newMovie: Movie = {
      id,
      ...movieData
    };
    
    // Store the movie
    await kv.set(`movie:${id}`, newMovie);
    
    // Update movie IDs list
    const movieIds = await kv.get('movie_ids') as string[] || [];
    movieIds.push(id);
    await kv.set('movie_ids', movieIds);
    
    return c.json({ movie: newMovie }, 201);
  } catch (error) {
    console.error('Error adding movie:', error);
    return c.json({ error: 'Failed to add movie' }, 500);
  }
});

// Update movie
app.put("/make-server-7f106327/movies/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const movieData = await c.req.json() as Partial<Movie>;
    
    const existingMovie = await kv.get(`movie:${id}`) as Movie;
    if (!existingMovie) {
      return c.json({ error: 'Movie not found' }, 404);
    }
    
    const updatedMovie: Movie = {
      ...existingMovie,
      ...movieData,
      id // Ensure ID doesn't change
    };
    
    await kv.set(`movie:${id}`, updatedMovie);
    
    return c.json({ movie: updatedMovie });
  } catch (error) {
    console.error('Error updating movie:', error);
    return c.json({ error: 'Failed to update movie' }, 500);
  }
});

// Delete movie
app.delete("/make-server-7f106327/movies/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    const existingMovie = await kv.get(`movie:${id}`) as Movie;
    if (!existingMovie) {
      return c.json({ error: 'Movie not found' }, 404);
    }
    
    // Delete the movie
    await kv.del(`movie:${id}`);
    
    // Update movie IDs list
    const movieIds = await kv.get('movie_ids') as string[] || [];
    const updatedIds = movieIds.filter(movieId => movieId !== id);
    await kv.set('movie_ids', updatedIds);
    
    return c.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    return c.json({ error: 'Failed to delete movie' }, 500);
  }
});

// Get reviews for a movie
app.get("/make-server-7f106327/movies/:id/reviews", async (c) => {
  try {
    const movieId = c.req.param('id');
    console.log(`[REVIEWS] Fetching reviews for movie ${movieId}`);
    
    // Get all review IDs from database - with error handling
    let allReviewIds: string[] = [];
    try {
      const ids = await kv.get('review_ids');
      allReviewIds = (ids as string[]) || [];
    } catch (kvError) {
      console.warn(`[REVIEWS] Could not fetch review_ids from KV store:`, kvError);
      // Continue with empty array if KV store is not initialized
    }
    
    console.log(`[REVIEWS] Total reviews in database: ${allReviewIds.length}`);
    
    // Load all reviews and filter by movieId
    const reviews: Review[] = [];
    
    for (const reviewId of allReviewIds) {
      try {
        const review = await kv.get(`review:${reviewId}`) as Review;
        if (review && review.movieId === movieId) {
          reviews.push(review);
          console.log(`[REVIEWS] ✓ Found review ${reviewId} for movie ${movieId}: rating=${review.rating}, author=${review.author}`);
        }
      } catch (reviewError) {
        console.warn(`[REVIEWS] Could not fetch review ${reviewId}:`, reviewError);
        // Skip this review and continue
      }
    }
    
    console.log(`[REVIEWS] ✅ Returning ${reviews.length} reviews for movie ${movieId}`);
    if (reviews.length === 0) {
      console.log(`[REVIEWS] ⚠️ No reviews found for movie ${movieId} in database`);
    }
    
    return c.json({ reviews });
  } catch (error) {
    console.error('[REVIEWS] ❌ Error fetching reviews:', error);
    return c.json({ error: 'Failed to fetch reviews', message: String(error) }, 500);
  }
});

// Add review for a movie
app.post("/make-server-7f106327/movies/:id/reviews", async (c) => {
  try {
    const movieId = c.req.param('id');
    const reviewData = await c.req.json() as Omit<Review, 'id' | 'movieId'>;
    const id = `review_${Date.now()}`;
    
    const newReview: Review = {
      id,
      movieId,
      ...reviewData
    };
    
    // Store the review
    await kv.set(`review:${id}`, newReview);
    
    // Update global review IDs list
    let allReviewIds: string[] = [];
    try {
      const ids = await kv.get('review_ids');
      allReviewIds = (ids as string[]) || [];
    } catch (kvError) {
      console.warn('Could not fetch review_ids, initializing new array');
    }
    allReviewIds.push(id);
    await kv.set('review_ids', allReviewIds);
    
    // Update movie's review count
    try {
      const movie = await kv.get(`movie:${movieId}`) as Movie;
      if (movie) {
        const movieReviews = allReviewIds.filter(async (rid) => {
          const r = await kv.get(`review:${rid}`) as Review;
          return r && r.movieId === movieId;
        });
        movie.reviewCount = movieReviews.length;
        await kv.set(`movie:${movieId}`, movie);
      }
    } catch (movieError) {
      console.warn('Could not update movie review count:', movieError);
    }
    
    return c.json({ review: newReview }, 201);
  } catch (error) {
    console.error('Error adding review:', error);
    return c.json({ error: 'Failed to add review', message: String(error) }, 500);
  }
});

// Enhanced type definitions for social features
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  bio?: string;
  verified?: 'popcorn' | 'glasses' | 'pro' | false;
  followersCount: number;
  followingCount: number;
  watchedMovies: string[];
  stats: {
    totalReviews: number;
    averageRating: number;
    totalMoviesWatched: number;
    platforms: string[];
  };
}

interface BlogPost {
  id: string;
  movieId: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorAvatar: string;
  rating: number;
  date: string;
  tags: string[];
  likes: number;
  comments: number;
  isLiked?: boolean;
  summary?: string;
  pros?: string[];
  cons?: string[];
  recommendation?: 'highly_recommended' | 'recommended' | 'neutral' | 'not_recommended';
  spoilerFree?: boolean;
  spoiler?: boolean;
  movieTitle?: string;
  moviePoster?: string;
  platform?: string;
}

interface Comment {
  id: string;
  postId: string;
  author: string;
  authorId: string;
  authorAvatar: string;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  parentId?: string;
}

interface FollowRelation {
  followerId: string;
  followingId: string;
  date: string;
}

// Enhanced Blog Posts API

// Get all blog posts
app.get("/make-server-7f106327/posts", async (c) => {
  try {
    const postIds = await kv.get('post_ids') as string[] || [];
    const posts: BlogPost[] = [];
    
    for (const id of postIds) {
      const post = await kv.get(`post:${id}`) as BlogPost;
      if (post) {
        // Enrich with movie information
        const movie = await kv.get(`movie:${post.movieId}`) as Movie;
        if (movie) {
          post.movieTitle = movie.title;
          post.moviePoster = movie.poster;
          post.platform = movie.platform;
        }
        posts.push(post);
      }
    }
    
    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return c.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return c.json({ error: 'Failed to fetch posts' }, 500);
  }
});

// Get posts by movie
app.get("/make-server-7f106327/movies/:movieId/posts", async (c) => {
  try {
    const movieId = c.req.param('movieId');
    console.log(`[POSTS] Fetching posts for movie ${movieId}`);
    
    const postIds = await kv.get('post_ids') as string[] || [];
    const posts: BlogPost[] = [];
    
    for (const id of postIds) {
      const post = await kv.get(`post:${id}`) as BlogPost;
      if (post && post.movieId === movieId) {
        // Enrich with movie information
        const movie = await kv.get(`movie:${movieId}`) as Movie;
        if (movie) {
          post.movieTitle = movie.title;
          post.moviePoster = movie.poster;
          post.platform = movie.platform;
        }
        posts.push(post);
      }
    }
    
    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log(`[POSTS] ✅ Returning ${posts.length} posts for movie ${movieId}`);
    return c.json({ posts });
  } catch (error) {
    console.error('[POSTS] ❌ Error fetching posts for movie:', error);
    return c.json({ error: 'Failed to fetch posts for movie' }, 500);
  }
});

// Get posts by user
app.get("/make-server-7f106327/users/:userId/posts", async (c) => {
  try {
    const userId = c.req.param('userId');
    const postIds = await kv.get('post_ids') as string[] || [];
    const posts: BlogPost[] = [];
    
    for (const id of postIds) {
      const post = await kv.get(`post:${id}`) as BlogPost;
      if (post && post.authorId === userId) {
        // Enrich with movie information
        const movie = await kv.get(`movie:${post.movieId}`) as Movie;
        if (movie) {
          post.movieTitle = movie.title;
          post.moviePoster = movie.poster;
          post.platform = movie.platform;
        }
        posts.push(post);
      }
    }
    
    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return c.json({ posts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return c.json({ error: 'Failed to fetch user posts' }, 500);
  }
});

// Add new blog post
app.post("/make-server-7f106327/posts", async (c) => {
  try {
    const postData = await c.req.json() as Omit<BlogPost, 'id'>;
    const id = `post_${Date.now()}`;
    
    const newPost: BlogPost = {
      id,
      ...postData,
      date: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isLiked: false
    };
    
    // Store the post
    await kv.set(`post:${id}`, newPost);
    
    // Update post IDs list
    const postIds = await kv.get('post_ids') as string[] || [];
    postIds.push(id);
    await kv.set('post_ids', postIds);
    
    return c.json({ post: newPost }, 201);
  } catch (error) {
    console.error('Error adding post:', error);
    return c.json({ error: 'Failed to add post' }, 500);
  }
});

// Update blog post
app.put("/make-server-7f106327/posts/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const postData = await c.req.json() as Partial<BlogPost>;
    
    const existingPost = await kv.get(`post:${id}`) as BlogPost;
    if (!existingPost) {
      return c.json({ error: 'Post not found' }, 404);
    }
    
    const updatedPost: BlogPost = {
      ...existingPost,
      ...postData,
      id // Ensure ID doesn't change
    };
    
    await kv.set(`post:${id}`, updatedPost);
    
    return c.json({ post: updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    return c.json({ error: 'Failed to update post' }, 500);
  }
});

// Delete blog post
app.delete("/make-server-7f106327/posts/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    const existingPost = await kv.get(`post:${id}`) as BlogPost;
    if (!existingPost) {
      return c.json({ error: 'Post not found' }, 404);
    }
    
    // Delete the post
    await kv.del(`post:${id}`);
    
    // Update post IDs list
    const postIds = await kv.get('post_ids') as string[] || [];
    const updatedIds = postIds.filter(postId => postId !== id);
    await kv.set('post_ids', updatedIds);
    
    // Delete associated comments
    const commentIds = await kv.get('comment_ids') as string[] || [];
    for (const commentId of commentIds) {
      const comment = await kv.get(`comment:${commentId}`) as Comment;
      if (comment && comment.postId === id) {
        await kv.del(`comment:${commentId}`);
      }
    }
    
    return c.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return c.json({ error: 'Failed to delete post' }, 500);
  }
});

// Like/Unlike post
app.post("/make-server-7f106327/posts/:id/like", async (c) => {
  try {
    const id = c.req.param('id');
    const { userId, isLiked } = await c.req.json();
    
    const post = await kv.get(`post:${id}`) as BlogPost;
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }
    
    // Update like count
    const updatedPost: BlogPost = {
      ...post,
      likes: isLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
      isLiked
    };
    
    await kv.set(`post:${id}`, updatedPost);
    
    return c.json({ post: updatedPost });
  } catch (error) {
    console.error('Error updating post like:', error);
    return c.json({ error: 'Failed to update post like' }, 500);
  }
});

// Comments API

// Get comments for a post
app.get("/make-server-7f106327/posts/:id/comments", async (c) => {
  try {
    const postId = c.req.param('id');
    const commentIds = await kv.get('comment_ids') as string[] || [];
    const comments: Comment[] = [];
    
    for (const id of commentIds) {
      const comment = await kv.get(`comment:${id}`) as Comment;
      if (comment && comment.postId === postId) {
        comments.push(comment);
      }
    }
    
    // Sort by date (oldest first for threaded conversation)
    comments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return c.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return c.json({ error: 'Failed to fetch comments' }, 500);
  }
});

// Add comment to post
app.post("/make-server-7f106327/posts/:id/comments", async (c) => {
  try {
    const postId = c.req.param('id');
    const commentData = await c.req.json() as Omit<Comment, 'id' | 'postId'>;
    const id = `comment_${Date.now()}`;
    
    const newComment: Comment = {
      id,
      postId,
      ...commentData,
      date: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };
    
    // Store the comment
    await kv.set(`comment:${id}`, newComment);
    
    // Update comment IDs list
    const commentIds = await kv.get('comment_ids') as string[] || [];
    commentIds.push(id);
    await kv.set('comment_ids', commentIds);
    
    // Update post comment count
    const post = await kv.get(`post:${postId}`) as BlogPost;
    if (post) {
      const updatedPost: BlogPost = {
        ...post,
        comments: post.comments + 1
      };
      await kv.set(`post:${postId}`, updatedPost);
    }
    
    return c.json({ comment: newComment }, 201);
  } catch (error) {
    console.error('Error adding comment:', error);
    return c.json({ error: 'Failed to add comment' }, 500);
  }
});

// Users API

// Get user by ID
app.get("/make-server-7f106327/users/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const user = await kv.get(`user:${id}`) as User;
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Calculate real-time statistics
    const stats = await calculateUserStats(id);
    const userWithStats = {
      ...user,
      stats: {
        ...user.stats,
        totalReviews: stats.totalReviews
      },
      followersCount: stats.followersCount
    };
    
    return c.json({ user: userWithStats });
  } catch (error) {
    console.error('Error fetching user:', error);
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

// Update user profile
app.put("/make-server-7f106327/users/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const userData = await c.req.json() as Partial<User>;
    
    const existingUser = await kv.get(`user:${id}`) as User;
    if (!existingUser) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    const updatedUser: User = {
      ...existingUser,
      ...userData,
      id // Ensure ID doesn't change
    };
    
    await kv.set(`user:${id}`, updatedUser);
    
    return c.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return c.json({ error: 'Failed to update user' }, 500);
  }
});

// Update user's watched movies
app.put("/make-server-7f106327/users/:id/watched-movies", async (c) => {
  try {
    const id = c.req.param('id');
    const { movieIds } = await c.req.json();
    
    console.log(`[SERVER] Updating watched movies for user ${id}`, movieIds);
    
    const existingUser = await kv.get(`user:${id}`) as User;
    if (!existingUser) {
      console.error(`[SERVER] User ${id} not found`);
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Calculate average rating from user's reviews
    const postIds = await kv.get('post_ids') as string[] || [];
    let totalRating = 0;
    let reviewCount = 0;
    
    for (const postId of postIds) {
      const post = await kv.get(`post:${postId}`) as BlogPost;
      if (post && post.authorId === id && post.rating) {
        totalRating += post.rating;
        reviewCount++;
      }
    }
    
    const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;
    
    const updatedUser: User = {
      ...existingUser,
      watchedMovies: movieIds,
      stats: {
        ...existingUser.stats,
        totalMoviesWatched: movieIds.length,
        averageRating: Number(averageRating.toFixed(1))
      }
    };
    
    await kv.set(`user:${id}`, updatedUser);
    console.log(`[SERVER] Watched movies updated successfully for user ${id}`);
    
    return c.json({ user: updatedUser });
  } catch (error) {
    console.error('[SERVER] Error updating watched movies:', error);
    return c.json({ error: 'Failed to update watched movies' }, 500);
  }
});

// Update user's platforms
app.put("/make-server-7f106327/users/:id/platforms", async (c) => {
  try {
    const id = c.req.param('id');
    const { platforms } = await c.req.json();
    
    console.log(`[SERVER] Updating platforms for user ${id}`, platforms);
    
    const existingUser = await kv.get(`user:${id}`) as User;
    if (!existingUser) {
      console.error(`[SERVER] User ${id} not found`);
      return c.json({ error: 'User not found' }, 404);
    }
    
    const updatedUser: User = {
      ...existingUser,
      stats: {
        ...existingUser.stats,
        platforms: platforms
      }
    };
    
    await kv.set(`user:${id}`, updatedUser);
    console.log(`[SERVER] Platforms updated successfully for user ${id}`);
    
    return c.json({ user: updatedUser });
  } catch (error) {
    console.error('[SERVER] Error updating platforms:', error);
    return c.json({ error: 'Failed to update platforms' }, 500);
  }
});

// Helper function to calculate user statistics
async function calculateUserStats(userId: string): Promise<{
  totalReviews: number;
  followersCount: number;
  followingCount: number;
}> {
  // Calculate total reviews
  const postIds = await kv.get('post_ids') as string[] || [];
  let totalReviews = 0;
  for (const id of postIds) {
    const post = await kv.get(`post:${id}`) as BlogPost;
    if (post && post.authorId === userId) {
      totalReviews++;
    }
  }

  // Calculate followers count
  const followIds = await kv.get('follow_ids') as string[] || [];
  let followersCount = 0;
  let followingCount = 0;
  
  for (const id of followIds) {
    const relation = await kv.get(`follow:${id}`) as FollowRelation;
    if (relation) {
      if (relation.followingId === userId) {
        followersCount++;
      }
      if (relation.followerId === userId) {
        followingCount++;
      }
    }
  }

  return { totalReviews, followersCount, followingCount };
}

// Get all users
app.get("/make-server-7f106327/users", async (c) => {
  try {
    const allUsersData = await kv.getByPrefix('user:');
    const allUsers = allUsersData as User[];
    
    // Calculate statistics for each user
    const usersWithStats = await Promise.all(
      allUsers.map(async (user) => {
        const stats = await calculateUserStats(user.id);
        return {
          ...user,
          stats: {
            ...user.stats,
            totalReviews: stats.totalReviews
          },
          followersCount: stats.followersCount
        };
      })
    );
    
    return c.json({ users: usersWithStats });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Follow/Unfollow user
app.post("/make-server-7f106327/users/:id/follow", async (c) => {
  try {
    const targetUserId = c.req.param('id');
    const { followerId, isFollowing } = await c.req.json();
    
    const relationId = `${followerId}_${targetUserId}`;
    
    if (isFollowing) {
      // Add follow relation
      const relation: FollowRelation = {
        followerId,
        followingId: targetUserId,
        date: new Date().toISOString()
      };
      await kv.set(`follow:${relationId}`, relation);
      
      // Update follow IDs list
      const followIds = await kv.get('follow_ids') as string[] || [];
      if (!followIds.includes(relationId)) {
        followIds.push(relationId);
        await kv.set('follow_ids', followIds);
      }
    } else {
      // Remove follow relation
      await kv.del(`follow:${relationId}`);
      
      // Update follow IDs list
      const followIds = await kv.get('follow_ids') as string[] || [];
      const updatedIds = followIds.filter(id => id !== relationId);
      await kv.set('follow_ids', updatedIds);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating follow relation:', error);
    return c.json({ error: 'Failed to update follow relation' }, 500);
  }
});

// Get user's followers
app.get("/make-server-7f106327/users/:id/followers", async (c) => {
  try {
    const userId = c.req.param('id');
    const followIds = await kv.get('follow_ids') as string[] || [];
    const followers: string[] = [];
    
    for (const id of followIds) {
      const relation = await kv.get(`follow:${id}`) as FollowRelation;
      if (relation && relation.followingId === userId) {
        followers.push(relation.followerId);
      }
    }
    
    return c.json({ followers });
  } catch (error) {
    console.error('Error fetching followers:', error);
    return c.json({ error: 'Failed to fetch followers' }, 500);
  }
});

// Get user's followers with full details
app.get("/make-server-7f106327/users/:id/followers/details", async (c) => {
  try {
    const userId = c.req.param('id');
    const followIds = await kv.get('follow_ids') as string[] || [];
    const followerUsers: User[] = [];
    
    for (const id of followIds) {
      const relation = await kv.get(`follow:${id}`) as FollowRelation;
      if (relation && relation.followingId === userId) {
        const follower = await kv.get(`user:${relation.followerId}`) as User;
        if (follower) {
          // Calculate stats for this follower
          const stats = await calculateUserStats(relation.followerId);
          followerUsers.push({
            ...follower,
            stats: {
              ...follower.stats,
              totalReviews: stats.totalReviews
            },
            followersCount: stats.followersCount
          });
        }
      }
    }
    
    return c.json({ followers: followerUsers });
  } catch (error) {
    console.error('Error fetching followers details:', error);
    return c.json({ error: 'Failed to fetch followers details' }, 500);
  }
});

// Get user's following with full details
app.get("/make-server-7f106327/users/:id/following/details", async (c) => {
  try {
    const userId = c.req.param('id');
    const followIds = await kv.get('follow_ids') as string[] || [];
    const followingUsers: User[] = [];
    
    for (const id of followIds) {
      const relation = await kv.get(`follow:${id}`) as FollowRelation;
      if (relation && relation.followerId === userId) {
        const following = await kv.get(`user:${relation.followingId}`) as User;
        if (following) {
          // Calculate stats for this user
          const stats = await calculateUserStats(relation.followingId);
          followingUsers.push({
            ...following,
            stats: {
              ...following.stats,
              totalReviews: stats.totalReviews
            },
            followersCount: stats.followersCount
          });
        }
      }
    }
    
    return c.json({ following: followingUsers });
  } catch (error) {
    console.error('Error fetching following details:', error);
    return c.json({ error: 'Failed to fetch following details' }, 500);
  }
});

// Get user's following
app.get("/make-server-7f106327/users/:id/following", async (c) => {
  try {
    const userId = c.req.param('id');
    const followIds = await kv.get('follow_ids') as string[] || [];
    const following: string[] = [];
    
    for (const id of followIds) {
      const relation = await kv.get(`follow:${id}`) as FollowRelation;
      if (relation && relation.followerId === userId) {
        following.push(relation.followingId);
      }
    }
    
    return c.json({ following });
  } catch (error) {
    console.error('Error fetching following:', error);
    return c.json({ error: 'Failed to fetch following' }, 500);
  }
});

// Get user's posts
app.get("/make-server-7f106327/users/:id/posts", async (c) => {
  try {
    const userId = c.req.param('id');
    const postIds = await kv.get('post_ids') as string[] || [];
    const userPosts: BlogPost[] = [];
    
    for (const id of postIds) {
      const post = await kv.get(`post:${id}`) as BlogPost;
      if (post && post.authorId === userId) {
        userPosts.push(post);
      }
    }
    
    // Sort by date (newest first)
    userPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return c.json({ posts: userPosts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return c.json({ error: 'Failed to fetch user posts' }, 500);
  }
});

// Authentication API endpoints

// User signup
app.post("/make-server-7f106327/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Check if user already exists
    const existingUserIds = await kv.getByPrefix('user:');
    for (const userData of existingUserIds) {
      const user = userData as User;
      if (user.email === email) {
        return c.json({ error: '이미 등록된 이메일입니다.' }, 400);
      }
    }

    // Create new user
    const userId = `user_${Date.now()}`;
    const newUser: User = {
      id: userId,
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      joinDate: new Date().toISOString().split('T')[0],
      bio: '',
      verified: false,
      followersCount: 0,
      followingCount: 0,
      watchedMovies: [],
      stats: {
        totalReviews: 0,
        averageRating: 0,
        totalMoviesWatched: 0,
        platforms: []
      }
    };

    await kv.set(`user:${userId}`, newUser);

    // Store email to userId mapping for login
    await kv.set(`email:${email}`, userId);

    // Store password hash (simplified - in production use proper hashing)
    await kv.set(`password:${userId}`, password);

    return c.json({ 
      user: newUser,
      message: '회원가입이 완료되었습니다.'
    }, 201);
  } catch (error) {
    console.error('Error during signup:', error);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// User login
app.post("/make-server-7f106327/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Missing email or password' }, 400);
    }

    // Get userId from email
    const userId = await kv.get(`email:${email}`) as string;
    
    if (!userId) {
      return c.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, 401);
    }

    // Check password
    const storedPassword = await kv.get(`password:${userId}`) as string;
    
    if (storedPassword !== password) {
      return c.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, 401);
    }

    // Get user data
    const user = await kv.get(`user:${userId}`) as User;
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ 
      user,
      message: '로그인 성공'
    });
  } catch (error) {
    console.error('Error during login:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Find user ID (email) by name and phone
app.post("/make-server-7f106327/auth/find-id", async (c) => {
  try {
    const { name, phone } = await c.req.json();
    
    if (!name || !phone) {
      return c.json({ error: 'Missing name or phone' }, 400);
    }

    // Search through all users
    const userIds = await kv.getByPrefix('user:');
    
    for (const userData of userIds) {
      const user = userData as User;
      // In production, phone would be stored in user profile
      // For now, we'll check by name only
      if (user.name === name) {
        return c.json({ email: user.email });
      }
    }

    return c.json({ error: '일치하는 사용자를 찾을 수 없습니다.' }, 404);
  } catch (error) {
    console.error('Error finding user ID:', error);
    return c.json({ error: 'Failed to find user ID' }, 500);
  }
});

// Reset password
app.post("/make-server-7f106327/auth/reset-password", async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email) {
      return c.json({ error: 'Missing email' }, 400);
    }

    // Check if user exists
    const userId = await kv.get(`email:${email}`) as string;
    
    if (!userId) {
      // Don't reveal if email exists or not for security
      return c.json({ message: '비밀번호 재설정 링크가 이메일로 전송되었습니다.' });
    }

    // In production, send actual reset email
    // For now, just return success
    console.log(`Password reset requested for user: ${userId}`);

    return c.json({ message: '비밀번호 재설정 링크가 이메일로 전송되었습니다.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return c.json({ error: 'Failed to reset password' }, 500);
  }
});

// Delete user account
app.delete("/make-server-7f106327/users/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    
    if (!userId) {
      return c.json({ error: 'Missing userId' }, 400);
    }
    
    // Get user data
    const user = await kv.get(`user:${userId}`) as any;
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Delete user's posts
    const userPosts = await kv.get(`user_posts:${userId}`) as string[] || [];
    for (const postId of userPosts) {
      // Delete post comments
      const commentIds = await kv.get(`post_comments:${postId}`) as string[] || [];
      for (const commentId of commentIds) {
        await kv.del(`comment:${commentId}`);
      }
      await kv.del(`post_comments:${postId}`);
      
      // Delete post
      await kv.del(`post:${postId}`);
    }
    await kv.del(`user_posts:${userId}`);
    
    // Delete user's comments on other posts
    const allPostIds = await kv.get('post_ids') as string[] || [];
    for (const postId of allPostIds) {
      const commentIds = await kv.get(`post_comments:${postId}`) as string[] || [];
      const updatedCommentIds = [];
      
      for (const commentId of commentIds) {
        const comment = await kv.get(`comment:${commentId}`) as any;
        if (comment && comment.authorId !== userId) {
          updatedCommentIds.push(commentId);
        } else {
          await kv.del(`comment:${commentId}`);
        }
      }
      
      if (updatedCommentIds.length !== commentIds.length) {
        await kv.set(`post_comments:${postId}`, updatedCommentIds);
      }
    }
    
    // Delete follow relationships
    const followers = await kv.get(`user_followers:${userId}`) as string[] || [];
    for (const followerId of followers) {
      const following = await kv.get(`user_following:${followerId}`) as string[] || [];
      await kv.set(`user_following:${followerId}`, following.filter(id => id !== userId));
    }
    await kv.del(`user_followers:${userId}`);
    
    const following = await kv.get(`user_following:${userId}`) as string[] || [];
    for (const followingId of following) {
      const followers = await kv.get(`user_followers:${followingId}`) as string[] || [];
      await kv.set(`user_followers:${followingId}`, followers.filter(id => id !== userId));
    }
    await kv.del(`user_following:${userId}`);
    
    // Remove user from user_ids list
    const userIds = await kv.get('user_ids') as string[] || [];
    await kv.set('user_ids', userIds.filter(id => id !== userId));
    
    // Delete email mapping
    await kv.del(`email:${user.email}`);
    
    // Delete user
    await kv.del(`user:${userId}`);
    
    console.log(`User ${userId} and all associated data deleted successfully`);
    return c.json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return c.json({ error: 'Failed to delete user account' }, 500);
  }
});

// ==================== COMMENT ROUTES ====================

// Get comments for a post
app.get("/make-server-7f106327/posts/:postId/comments", async (c) => {
  try {
    const postId = c.req.param('postId');
    const commentIds = await kv.get(`post_comments:${postId}`) as string[] || [];
    const comments = [];
    
    for (const commentId of commentIds) {
      const comment = await kv.get(`comment:${commentId}`);
      if (comment) {
        comments.push(comment);
      }
    }
    
    return c.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return c.json({ error: 'Failed to fetch comments' }, 500);
  }
});

// Add a comment to a post
app.post("/make-server-7f106327/posts/:postId/comments", async (c) => {
  try {
    const postId = c.req.param('postId');
    const body = await c.req.json();
    const { content, authorId, author, authorAvatar, parentId } = body;
    
    if (!content || !authorId || !author) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const comment = {
      id: commentId,
      postId,
      author,
      authorId,
      authorAvatar,
      content: content.trim(),
      date: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      likedBy: [],
      parentId: parentId || null,
      replies: []
    };
    
    // Save comment
    await kv.set(`comment:${commentId}`, comment);
    
    // Add to post's comment list
    const commentIds = await kv.get(`post_comments:${postId}`) as string[] || [];
    commentIds.push(commentId);
    await kv.set(`post_comments:${postId}`, commentIds);
    
    // If it's a reply, update parent comment
    if (parentId) {
      const parentComment = await kv.get(`comment:${parentId}`) as any;
      if (parentComment) {
        parentComment.replies = parentComment.replies || [];
        parentComment.replies.push(comment);
        await kv.set(`comment:${parentId}`, parentComment);
      }
    }
    
    return c.json({ comment });
  } catch (error) {
    console.error('Error adding comment:', error);
    return c.json({ error: 'Failed to add comment' }, 500);
  }
});

// Toggle comment like
app.post("/make-server-7f106327/comments/:commentId/like", async (c) => {
  try {
    const commentId = c.req.param('commentId');
    const body = await c.req.json();
    const { userId } = body;
    
    if (!userId) {
      return c.json({ error: 'Missing userId' }, 400);
    }
    
    const comment = await kv.get(`comment:${commentId}`) as any;
    if (!comment) {
      return c.json({ error: 'Comment not found' }, 404);
    }
    
    comment.likedBy = comment.likedBy || [];
    const isLiked = comment.likedBy.includes(userId);
    
    if (isLiked) {
      comment.likedBy = comment.likedBy.filter((id: string) => id !== userId);
      comment.likes = Math.max(0, comment.likes - 1);
      comment.isLiked = false;
    } else {
      comment.likedBy.push(userId);
      comment.likes += 1;
      comment.isLiked = true;
    }
    
    await kv.set(`comment:${commentId}`, comment);
    
    // Update in parent comment if it's a reply
    if (comment.parentId) {
      const parentComment = await kv.get(`comment:${comment.parentId}`) as any;
      if (parentComment && parentComment.replies) {
        parentComment.replies = parentComment.replies.map((r: any) => 
          r.id === commentId ? comment : r
        );
        await kv.set(`comment:${comment.parentId}`, parentComment);
      }
    }
    
    return c.json({ comment });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return c.json({ error: 'Failed to toggle like' }, 500);
  }
});

// Delete a comment
app.delete("/make-server-7f106327/comments/:commentId", async (c) => {
  try {
    const commentId = c.req.param('commentId');
    
    const comment = await kv.get(`comment:${commentId}`) as any;
    if (!comment) {
      return c.json({ error: 'Comment not found' }, 404);
    }
    
    // Delete the comment
    await kv.del(`comment:${commentId}`);
    
    // Remove from post's comment list
    const commentIds = await kv.get(`post_comments:${comment.postId}`) as string[] || [];
    const updatedIds = commentIds.filter(id => id !== commentId);
    await kv.set(`post_comments:${comment.postId}`, updatedIds);
    
    // If it's a reply, remove from parent
    if (comment.parentId) {
      const parentComment = await kv.get(`comment:${comment.parentId}`) as any;
      if (parentComment && parentComment.replies) {
        parentComment.replies = parentComment.replies.filter((r: any) => r.id !== commentId);
        await kv.set(`comment:${comment.parentId}`, parentComment);
      }
    }
    
    // Delete all replies recursively
    if (comment.replies && comment.replies.length > 0) {
      for (const reply of comment.replies) {
        await kv.del(`comment:${reply.id}`);
      }
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return c.json({ error: 'Failed to delete comment' }, 500);
  }
});

// Delete user account
app.delete("/make-server-7f106327/users/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    
    // Get user data
    const user = await kv.get(`user:${userId}`) as any;
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Delete all user's posts
    const postKeys = await kv.getByPrefix('post:');
    for (const { value } of postKeys) {
      const post = value as any;
      if (post.authorId === userId) {
        await kv.del(`post:${post.id}`);
        
        // Delete all comments for this post
        const commentIds = await kv.get(`post_comments:${post.id}`) as string[] || [];
        for (const commentId of commentIds) {
          await kv.del(`comment:${commentId}`);
        }
        await kv.del(`post_comments:${post.id}`);
      }
    }
    
    // Delete all user's comments
    const commentKeys = await kv.getByPrefix('comment:');
    for (const { value } of commentKeys) {
      const comment = value as any;
      if (comment.authorId === userId) {
        await kv.del(`comment:${comment.id}`);
      }
    }
    
    // Delete user's follows and followers
    await kv.del(`user_following:${userId}`);
    await kv.del(`user_followers:${userId}`);
    
    // Remove user from other users' following/followers lists
    const allUserKeys = await kv.getByPrefix('user:');
    for (const { key } of allUserKeys) {
      const otherUserId = key.split(':')[1];
      if (otherUserId !== userId) {
        const following = await kv.get(`user_following:${otherUserId}`) as string[] || [];
        if (following.includes(userId)) {
          await kv.set(`user_following:${otherUserId}`, following.filter(id => id !== userId));
        }
        
        const followers = await kv.get(`user_followers:${otherUserId}`) as string[] || [];
        if (followers.includes(userId)) {
          await kv.set(`user_followers:${otherUserId}`, followers.filter(id => id !== userId));
        }
      }
    }
    
    // Delete user data
    await kv.del(`user:${userId}`);
    
    return c.json({ success: true, message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    return c.json({ error: 'Failed to delete user account' }, 500);
  }
});

Deno.serve(app.fetch);