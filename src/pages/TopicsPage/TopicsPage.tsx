import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { backButton } from '@tma.js/sdk-react';

import { version } from '../../../package.json';
import { topicsData } from '@/data/questions';
import { getTopicResults, getTopicProgress } from '@/store/quizResults';
import { backfillAchievements, getEarnedAchievements } from '@/store/achievements';
import { QuizRing } from '@/components/QuizRing/QuizRing';
import { AchievementsSection } from '@/components/AchievementsSection/AchievementsSection';
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
    id: 'security',
    icon: '🔒',
    title: 'Служба безопасности',
    desc: 'Документооборот, одобряемые проекты, требования',
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
    backfillAchievements();
    backButton.show();
    return backButton.onClick(() => navigate('/onboarding'));
  }, [navigate]);

  const earnedAchievements = getEarnedAchievements();
  const examUnlocked = ['basics', 'accounting', 'security', 'technical'].every(id =>
    earnedAchievements.includes(id)
  );

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
          const savedResults = getTopicResults(topic.id) ?? getTopicProgress(topic.id)?.results ?? null;
          // Если ачивка есть, но результаты были сброшены — показываем кольцо как полностью пройденное
          const results = savedResults ?? (earnedAchievements.includes(topic.id) ? Array(total).fill('correct') : null);

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
      <div className="topics__exam-section">
        <button
          className={`topics__exam-card${examUnlocked ? '' : ' topics__exam-card--locked'}`}
          onClick={() => examUnlocked && navigate('/quiz/exam')}
        >
          <div className="topics__exam-icon">{examUnlocked ? '🎓' : '🔐'}</div>
          <div className="topics__card-body">
            <p className="topics__card-title">Финальный экзамен</p>
            <p className="topics__card-desc">
              {examUnlocked
                ? '30 вопросов из всех разделов без подсказок'
                : 'Пройди все разделы без ошибок, чтобы разблокировать'}
            </p>
          </div>
        </button>
      </div>
      <AchievementsSection />
      <p className="topics__version">v{version}</p>
    </div>
  );
};
