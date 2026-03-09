import { FC } from 'react';
import { achievements } from '@/data/achievements';
import { getEarnedAchievements } from '@/store/achievements';
import './AchievementsSection.css';

export const AchievementsSection: FC = () => {
  const earned = getEarnedAchievements();

  return (
    <div className="achievements">
      <p className="achievements__title">Ачивки</p>
      <div className="achievements__row">
        {achievements.map(a => {
          const isEarned = earned.includes(a.topicId);
          return (
            <div key={a.topicId} className="achievements__badge">
              <div className={`achievements__circle${isEarned ? ' achievements__circle--earned' : ''}`}>
                {a.emoji}
              </div>
              <span className={`achievements__name${isEarned ? ' achievements__name--earned' : ''}`}>
                {a.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
