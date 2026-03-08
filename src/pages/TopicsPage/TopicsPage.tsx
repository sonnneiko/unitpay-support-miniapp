import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { backButton } from '@tma.js/sdk-react';

import { topicsData } from '@/data/questions';
import { getTopicResults, getTopicProgress } from '@/store/quizResults';
import { QuizRing } from '@/components/QuizRing/QuizRing';
import './TopicsPage.css';

const topics = [
  {
    id: 'basics',
    icon: 'U',
    title: 'Основы UnitPay',
    desc: 'Как работает и базовые понятия',
  },
  {
    id: 'accounting',
    icon: '💬',
    title: 'Аккаунтинг',
    desc: 'Общение с клиентами, помощь и объяснения',
  },
  {
    id: 'technical',
    icon: '⚙️',
    title: 'Техническая часть',
    desc: 'Интеграции, API, ошибки и решения',
  },
];

export const TopicsPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    backButton.show();
    return backButton.onClick(() => navigate('/onboarding'));
  }, [navigate]);

  return (
    <div className="topics">
      <div className="topics__header">
        <p className="topics__title">Выбери тему</p>
        <p className="topics__subtitle">Пройди тренажёр по нужному разделу</p>
      </div>

      <div className="topics__list">
        {topics.map((topic) => {
          const topicData = topicsData.find(t => t.id === topic.id);
          const total = topicData?.questions.length ?? 0;
          const results = getTopicResults(topic.id) ?? getTopicProgress(topic.id)?.results ?? null;

          return (
            <button
              key={topic.id}
              className="topics__card"
              onClick={() => navigate(`/quiz/${topic.id}`)}
            >
              <div className="topics__card-icon">{topic.icon}</div>
              <div className="topics__card-body">
                <p className="topics__card-title">{topic.title}</p>
                <p className="topics__card-desc">{topic.desc}</p>
              </div>
              {total > 0 && (
                <QuizRing
                  results={results ?? []}
                  total={total}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
