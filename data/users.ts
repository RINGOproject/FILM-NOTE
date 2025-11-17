import { UserProfile, BlogPost, FollowRelation } from '../types/movie';

// 다른 사용자들
export const otherUsers: UserProfile[] = [
  {
    id: 'user_2',
    name: '이시네마',
    email: 'cinema@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    joinDate: '2023-11-20',
    bio: '영화 전문 리뷰어입니다. SF와 액션 영화를 특히 좋아합니다 🎬',
    verified: 'glasses', // 1000+ 팔로워
    verificationLevel: 'glasses',
    followersCount: 1245,
    followingCount: 342,
    watchedMovies: ['1', '3', '5', '7', '9'],
    stats: {
      totalReviews: 89,
      averageRating: 4.3,
      watchedMovies: 156,
      totalMoviesWatched: 156,
      platforms: ['Netflix', 'Disney+', 'Apple TV+', 'Amazon Prime'],
      followers: 1245,
      following: 342
    }
  },
  {
    id: 'user_3',
    name: '박무비',
    email: 'movie@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    joinDate: '2024-01-03',
    bio: '로맨스와 드라마 영화 러버 💕 감성적인 영화들을 좋아해요',
    verified: 'popcorn', // 200+ 팔로워
    verificationLevel: 'popcorn',
    followersCount: 432,
    followingCount: 187,
    watchedMovies: ['1', '2', '4', '6'],
    stats: {
      totalReviews: 34,
      averageRating: 4.1,
      watchedMovies: 78,
      platforms: ['Netflix', 'Wavve', 'Tving']
    }
  },
  {
    id: 'user_4',
    name: '최영화',
    email: 'film@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    joinDate: '2023-08-15',
    bio: '독립영화와 예술영화 전문. 깊이 있는 리뷰를 추구합니다 🎭',
    verified: 'glasses', // 1000+ 팔로워
    followersCount: 892,
    followingCount: 145,
    watchedMovies: ['3', '5', '7', '8', '10'],
    stats: {
      totalReviews: 67,
      averageRating: 4.0,
      watchedMovies: 234,
      platforms: ['Netflix', 'Mubi', 'Disney+']
    }
  },
  {
    id: 'user_5',
    name: '정프로',
    email: 'pro@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    joinDate: '2022-03-10',
    bio: '전문 영화 평론가. 다양한 매체에서 활동하고 있습니다 🎯',
    verified: 'pro', // 5000+ 팔로워 (전문가)
    followersCount: 8432,
    followingCount: 234,
    watchedMovies: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    stats: {
      totalReviews: 245,
      averageRating: 4.1,
      watchedMovies: 567,
      platforms: ['Netflix', 'Disney+', 'Apple TV+', 'Amazon Prime', 'Mubi', 'Tving', 'Wavve']
    }
  }
];

// 현재 사용자 (업데이트)
export const currentUser: UserProfile = {
  id: 'user_1',
  name: '김영화',
  email: 'moviefan@example.com',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
  joinDate: '2024-01-15',
  bio: '영화를 사랑하는 평범한 직장인입니다. 다양한 장르의 영화를 즐겨보며 감상을 나누고 싶어요! 🍿',
  verified: false,
  followersCount: 23,
  followingCount: 12,
  watchedMovies: ['1', '2', '5'],
  stats: {
    totalReviews: 12,
    averageRating: 4.2,
    watchedMovies: 28,
    platforms: ['Netflix', 'Disney+', 'Wavve']
  }
};

// 팔로우 관계
export const followRelations: FollowRelation[] = [
  { followerId: 'user_1', followingId: 'user_2', date: '2024-02-01' },
  { followerId: 'user_1', followingId: 'user_3', date: '2024-02-15' },
  { followerId: 'user_1', followingId: 'user_4', date: '2024-03-01' },
];

// 다른 사용자들의 블로그 포스트
export const otherBlogPosts: BlogPost[] = [
  {
    id: 'post_other_1',
    movieId: '1',
    movieTitle: 'Shadow Strike',
    moviePoster: 'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGFjdGlvbnxlbnwxfHx8fDE3NTgwNTgzMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    platform: 'Netflix',
    spoiler: false,
    title: 'Shadow Strike: 액션 영화의 새로운 패러다임',
    summary: 'Chris Evans의 카리스마와 Scarlett Johansson의 완벽한 액션 연기가 돋보이는 작품',
    content: `올해 최고의 액션 블록버스터라고 확신합니다. 

**스토리라인**
예측 불가능한 전개와 반전의 연속으로 마지막까지 긴장감을 놓을 수 없었습니다. 특히 중반부 추격 장면은 정말 숨을 멎게 하더군요.

**액션 시퀀스**
실제 스턴트와 CG의 완벽한 조화. 특히 빌딩에서 빌딩으로 넘어가는 장면은 IMAX로 봐야 그 웅장함을 제대로 느낄 수 있습니다.

**연기력**
Chris Evans는 캡틴 아메리카를 벗어던지고 완전히 새로운 캐릭터로 거듭났습니다. Scarlett Johansson 역시 블랙 위도우와는 전혀 다른 매력을 보여줍니다.

**기술적 완성도**
사운드 디자인이 특히 인상적이었습니다. 총격전과 폭발 장면의 음향 효과가 실제 현장에 있는 듯한 몰입감을 주었어요.

액션 영화 팬이라면 절대 놓쳐서는 안 될 작품입니다!`,
    pros: [
      '예측 불가능한 스토리라인',
      '완벽한 액션 시퀀스',
      '뛰어난 연기력',
      '몰입감 넘치는 사운드'
    ],
    cons: [
      '일부 CG가 어색한 부분 있음',
      '러닝타임이 다소 길어 지루할 수 있음'
    ],
    recommendation: 'highly_recommended',
    spoilerFree: true,
    author: '이시네마',
    authorId: 'user_2',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    date: '2024-03-14',
    tags: ['액션', '스릴러', 'IMAX추천', '블록버스터'],
    likes: 156,
    comments: 23,
    isLiked: false
  },
  {
    id: 'post_other_2',
    movieId: '2',
    movieTitle: 'Hearts in Seoul',
    moviePoster: 'https://images.unsplash.com/photo-1745118037962-3c86d081e592?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMHJvbWFuY2V8ZW58MXx8fHwxNzU4MDUxNzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    platform: 'Disney+',
    spoiler: false,
    title: 'Hearts in Seoul - 한국의 아름다움을 담은 로맨스',
    summary: '서울의 사계절과 함께 펼쳐지는 아름다운 사랑 이야기',
    content: `한국을 배경으로 한 로맨스 영화 중 단연 최고작입니다.

**로케이션의 매력**
서울의 숨겨진 명소들을 발견하는 재미가 쏠쏠했습니다. 북촌한옥마을, 이화동 벽화마을, 한강공원까지... 마치 서울 여행 가이드를 보는 듯했어요.

**케미스트리**
박서준과 김고은의 자연스러운 연기가 인상적이었습니다. 특히 첫 만남 장면에서의 어색함부터 점점 가까워지는 과정이 너무나 현실적으로 그려졌어요.

**감정의 깊이**
단순한 달달한 로맨스가 아니라, 현대인의 고독과 사랑에 대한 갈증을 깊이 있게 다뤘습니다. 

**음악과 영상미**
특히 한강에서의 데이트 장면과 함께 흐르는 OST는 정말 완벽했습니다. 며칠째 머릿속에서 멤돌고 있어요.

로맨스 영화 좋아하시는 분들께는 강력 추천드립니다!`,
    pros: [
      '아름다운 서울의 풍경',
      '자연스러운 연기와 케미스트리',
      '감성적인 OST',
      '깊이 있는 스토리'
    ],
    cons: [
      '예측 가능한 결말',
      '일부 설정이 비현실적'
    ],
    recommendation: 'highly_recommended',
    spoilerFree: true,
    author: '박무비',
    authorId: 'user_3',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    date: '2024-03-13',
    tags: ['로맨스', '한국영화', '서울', '감성'],
    likes: 89,
    comments: 15,
    isLiked: true
  },
  {
    id: 'post_other_3',
    movieId: '5',
    movieTitle: 'Beyond Tomorrow',
    moviePoster: 'https://images.unsplash.com/photo-1659835347242-97835d671db7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMHNjaS1maXxlbnwxfHx8fDE3NTc5ODI5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    platform: 'Netflix',
    spoiler: false,
    title: 'Beyond Tomorrow: SF 영화의 철학적 성찰',
    summary: 'AI와 인간의 공존에 대한 깊이 있는 질문을 던지는 작품',
    content: `데니 빌뇌브 감독의 또 다른 걸작이 탄생했습니다.

**철학적 주제**
단순한 SF 액션이 아닌, 인공지능과 인간의 관계에 대한 깊은 성찰을 담았습니다. '의식이란 무엇인가?', '감정이란 무엇인가?'에 대한 질문들이 관객들로 하여금 생각하게 만듭니다.

**시각적 완성도**
'블레이드 러너 2049'를 연상시키는 압도적인 시각 효과. 미래 도시의 모습이 아름답으면서도 동시에 섬뜩합니다.

**라이언 고슬링의 연기**
AI와 인간 사이에서 고뇌하는 캐릭터를 완벽하게 소화했습니다. 특히 후반부 감정적 폭발 장면은 소름이 돋을 정도였어요.

**음악과 사운드**
한스 짐머의 웅장한 스코어가 영화의 몰입도를 극대화합니다.

**메시지**
기술 발전에 대한 무조건적인 찬양이 아닌, 균형 잡힌 시각을 제시합니다.

SF 영화를 좋아한다면, 그리고 깊이 있는 사고를 원한다면 꼭 봐야 할 작품입니다.`,
    pros: [
      '깊이 있는 철학적 주제',
      '압도적인 시각 효과',
      '뛰어난 연기력',
      '웅장한 음악'
    ],
    cons: [
      '다소 어려운 내용',
      '긴 러닝타임',
      '느린 전개'
    ],
    recommendation: 'recommended',
    spoilerFree: true,
    author: '최영화',
    authorId: 'user_4',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 4,
    date: '2024-03-11',
    tags: ['SF', '철학', '예술영화', '성찰'],
    likes: 124,
    comments: 31,
    isLiked: false
  }
];