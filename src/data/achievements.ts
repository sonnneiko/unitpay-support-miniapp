export interface Achievement {
  topicId: string;
  emoji: string;
  title: string;
  description: string;
}

export const achievements: Achievement[] = [
  { topicId: 'basics',     emoji: '🏅', title: 'Знаток UnitPay',  description: 'За прохождение раздела «Основы UnitPay» без единой ошибки'    },
  { topicId: 'accounting', emoji: '🤝', title: 'Помощник',  description: 'За прохождение раздела «Аккаунтинг» без единой ошибки'         },
  { topicId: 'security',   emoji: '🛡️', title: 'Страж',           description: 'За прохождение раздела «Служба безопасности» без единой ошибки' },
  { topicId: 'technical',  emoji: '⚙️', title: 'Технарь',         description: 'За прохождение раздела «Техническая часть» без единой ошибки'   },
];
