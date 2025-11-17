import { Movie, Review } from '../types/movie';

export const movies: Movie[] = [
  {
    id: '1',
    title: '귀멸의 칼날: 절대 지지 않겠다',
    description: '대정시대, 가족을 도깨비에게 잃은 탄지로가 여동생 네즈코를 구하기 위해 도깨비 사냥꾼이 되어 펼치는 액션 어드벤처.',
    genre: 'Action',
    year: 2024,
    duration: 142,
    rating: 4.3,
    reviewCount: 2847,
    poster: 'figma:asset/b3476824e569ecbd236ae11fcb7059cff25f028c.png',
    director: '소토자키 하루오',
    cast: ['하나에 나츠키', '사토 타쿠마', '시모노 히로'],
    platform: 'Netflix'
  },
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
  }
];

export const reviews: Review[] = [
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