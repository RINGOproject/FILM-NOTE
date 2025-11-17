import { BlogPost } from '../types/movie';

export const myBlogPosts: BlogPost[] = [
  {
    id: 'post_1',
    movieId: '1',
    movieTitle: 'Shadow Strike',
    moviePoster: 'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGFjdGlvbnxlbnwxfHx8fDE3NTgwNTgzMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    platform: 'Netflix',
    spoiler: false,
    title: 'Shadow Strike - 완벽한 액션의 교과서',
    summary: '크리스 에반스와 스칼렛 요한슨이 선보이는 완벽한 액션 영화',
    content: `이 영화는 정말 놀라웠습니다. 첫 장면부터 마지막까지 긴장감이 끊이지 않았어요.

**액션 시퀀스**
특히 추격 장면에서의 카메라워크와 액션 시퀀스는 정말 대단했습니다. 실제 스턴트와 CG의 조화가 완벽했어요.

**스토리라인**
스토리 라인도 예측하기 어려워서 계속 집중하게 되더군요. 중간중간 반전이 있어서 지루할 틈이 없었습니다.

**연기력**
크리스 에반스의 연기도 훌륭했고, 스칼렛 요한슨과의 케미스트리도 좋았습니다. 특히 감정적인 장면에서의 연기가 인상적이었어요.

**아쉬운 점**
다만 일부 액션 장면에서 CG가 조금 어색한 부분이 있었지만, 전체적으로는 매우 만족스러운 작품이었습니다.

액션 영화 좋아하시는 분들께 강력 추천드립니다!`,
    pros: [
      '완벽한 액션 시퀀스',
      '예측 불가능한 스토리',
      '뛰어난 연기력'
    ],
    cons: [
      '일부 어색한 CG',
      '다소 예측 가능한 결말'
    ],
    recommendation: 'highly_recommended',
    spoilerFree: true,
    author: '김영화',
    authorId: 'user_1',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    rating: 4,
    date: '2024-03-15',
    tags: ['액션', '스릴러', '추천작'],
    likes: 24,
    comments: 8,
    isLiked: false
  },
  {
    id: 'post_2',
    movieId: '2',
    movieTitle: 'Hearts in Seoul',
    moviePoster: 'https://images.unsplash.com/photo-1745118037962-3c86d081e592?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMHJvbWFuY2V8ZW58MXx8fHwxNzU4MDUxNzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    platform: 'Disney+',
    spoiler: false,
    title: 'Hearts in Seoul - 서울의 아름다움과 사랑',
    summary: '서울을 배경으로 한 완벽한 로맨스 영화',
    content: `한국을 배경으로 한 로맨스 영화 중에서 정말 오랜만에 좋은 작품을 만났습니다.

**로케이션의 매력**
서울의 여러 명소들이 아름답게 담겨있어서 보는 내내 설레더라구요. 특히 한강공원과 북촌한옥마을의 풍경이 정말 아름다웠어요.

**연기와 케미스트리**
박서준과 김고은의 연기는 정말 자연스러웠고, 두 사람의 케미도 환상적이었습니다. 특히 한강에서의 데이트 장면은 정말 로맨틱했어요.

**스토리**
스토리도 뻔하지 않고 감동적이었습니다. 마지막 장면에서는 정말 울컥했어요.

현실적인 연애담과 서울의 아름다운 풍경이 잘 어우러진 작품입니다. 로맨스 영화 좋아하시는 분들께 꼭 추천드립니다!`,
    pros: [
      '아름다운 서울 풍경',
      '자연스러운 연기',
      '감동적인 스토리',
      '현실적인 로맨스'
    ],
    cons: [
      '일부 뻔한 전개',
      '아쉬운 러닝타임'
    ],
    recommendation: 'highly_recommended',
    spoilerFree: true,
    author: '김영화',
    authorId: 'user_1',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    date: '2024-03-12',
    tags: ['로맨스', '한국영화', '감동'],
    likes: 31,
    comments: 12,
    isLiked: true
  },
  {
    id: 'post_3',
    movieId: '5',
    movieTitle: 'Beyond Tomorrow',
    moviePoster: 'https://images.unsplash.com/photo-1659835347242-97835d671db7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMHNjaS1maXxlbnwxfHx8fDE3NTc5ODI5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    platform: 'Netflix',
    spoiler: false,
    title: 'Beyond Tomorrow - SF의 새로운 지평',
    summary: '데니 빌뇌브 감독이 선사하는 철학적 SF 걸작',
    content: `데니 빌뇌브 감독의 또 다른 걸작입니다.

**시각적 효과**
시각적 효과가 정말 압도적이었고, 미래에 대한 철학적 질문들도 깊이 있게 다뤄졌어요.

**철학적 메시지**
인공지능과 인간의 관계에 대한 메시지가 특히 인상깊었습니다. 단순한 SF 액션이 아니라 정말 생각해볼 거리가 많은 영화였어요.

**연기와 연출**
라이언 고슬링의 연기도 훌륭했고, 음악과 촬영도 완벽했습니다. 특히 미래 도시의 모습이 아름다우면서도 섬뜩했어요.

**깊이 있는 주제**
AI의 의식과 감정에 대한 질문들이 관객으로 하여금 많은 생각을 하게 만듭니다.

SF를 좋아하시고 깊이 있는 영화를 원하시는 분들께 강력 추천드립니다!`,
    pros: [
      '압도적인 시각 효과',
      '깊이 있는 철학적 주제',
      '뛰어난 연기력',
      '완벽한 음악과 촬영'
    ],
    cons: [
      '다소 어려운 내용',
      '느린 전개',
      '긴 러닝타임'
    ],
    recommendation: 'recommended',
    spoilerFree: true,
    author: '김영화',
    authorId: 'user_1',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    date: '2024-03-10',
    tags: ['SF', '철학적', '시각미'],
    likes: 42,
    comments: 18,
    isLiked: false
  }
];