import { FC, useState } from 'react';
import { Achievement, achievements } from '@/data/achievements';
import { getEarnedAchievements } from '@/store/achievements';
import { AchievementPopup } from '@/components/AchievementPopup/AchievementPopup';
import './AchievementsSection.css';

export const AchievementsSection: FC = () => {
  const earned = getEarnedAchievements();
  const [selected, setSelected] = useState<{ achievement: Achievement; isEarned: boolean } | null>(null);

  return (
    <div className="achievements">
      <p className="achievements__title">Ачивки</p>
      <div className="achievements__row">
        {achievements.map(a => {
          const isEarned = earned.includes(a.topicId);
          return (
            <button
              key={a.topicId}
              className="achievements__badge"
              onClick={() => setSelected({ achievement: a, isEarned })}
            >
              <div className={`achievements__circle${isEarned ? ' achievements__circle--earned' : ''}`}>
                {a.emoji}
              </div>
              <span className={`achievements__name${isEarned ? ' achievements__name--earned' : ''}`}>
                {a.title}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <AchievementPopup
          emoji={selected.achievement.emoji}
          title={selected.achievement.title}
          label={selected.isEarned ? 'Твоя ачивка ✨' : 'Как получить?'}
          description={selected.achievement.description}
          dismissLabel={selected.isEarned ? 'Круто!' : 'Понятно'}
          earned={selected.isEarned}
          autoClose={false}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};
