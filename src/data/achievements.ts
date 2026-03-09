export interface Achievement {
  topicId: string;
  emoji: string;
  title: string;
}

export const achievements: Achievement[] = [
  { topicId: 'basics',     emoji: '🏅', title: 'Знаток UnitPay'  },
  { topicId: 'accounting', emoji: '🤝', title: 'Супер помощник'  },
  { topicId: 'security',   emoji: '🛡️', title: 'Страж'           },
  { topicId: 'technical',  emoji: '⚙️', title: 'Технарь'         },
];
