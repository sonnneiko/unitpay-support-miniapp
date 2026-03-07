export interface Question {
  text: string;
  options: string[];
  correctIndex: number;
}

export interface TopicData {
  id: string;
  title: string;
  questions: Question[];
}

export const topicsData: TopicData[] = [
  {
    id: 'basics',
    title: 'Основы UnitPay',
    questions: [
      {
        text: 'Что такое UnitPay?',
        options: [
          'Платёжный агрегатор',
          'Банк',
          'Магазин',
          'Онлайн-касса',
        ],
        correctIndex: 0,
      },
      {
        text: 'Методы приёма платежей в UnitPay?',
        options: [
          'Карты, СБП, SberPay, Tpay',
          'Форма, виджет, редирект',
          '131 Банк, Сбербанк, Точка банк, Т-банк',
          'Юнит.Чеки, Атол, МодульКасса',
        ],
        correctIndex: 0,
      },
      {
        text: 'Что можно добавить в UnitPay, где принимать оплату?',
        options: [
          'Всё что есть в интернете',
          'Сайт',
          'Свой банковский счёт',
          'Сайт, сообщество ВК, Telegram (канал, бот или мини-апп)',
        ],
        correctIndex: 3,
      },
      {
        text: 'Что такое банк-эмитент?',
        options: [
          'Банк, который подключает бизнес к приёму безналичных платежей',
          'Банк, выпустивший карту плательщика (покупателя)',
          'Банк-партнёр UnitPay',
          'Банк',
        ],
        correctIndex: 1,
      },
      {
        text: 'Что такое платёжный агрегатор?',
        options: [
          'Банк, который подключает бизнес к приёму безналичных платежей',
          'Онлайн-платежи',
          'Сервис, который помогает бизнесу принимать онлайн-платежи',
          'Альтернативный вариант онлайн-кассы от UnitPay',
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'accounting',
    title: 'Аккаунтинг',
    questions: [],
  },
  {
    id: 'technical',
    title: 'Техническая часть',
    questions: [],
  },
];
