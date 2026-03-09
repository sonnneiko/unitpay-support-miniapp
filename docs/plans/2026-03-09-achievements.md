# Achievements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 4 per-topic achievements awarded only on 100% correct answers, with an animated popup and a visible section on the TopicsPage.

**Architecture:** Achievement definitions live in `src/data/achievements.ts`. Earned achievements are persisted in `localStorage` via `src/store/achievements.ts` (same pattern as `quizResults.ts`). QuizPage detects a perfect score on finish and shows an `AchievementPopup`. TopicsPage renders an `AchievementsSection` as a horizontal row of 4 badge circles.

**Tech Stack:** React, TypeScript, CSS animations (keyframes), localStorage

---

### Task 1: Achievement data + store

**Files:**
- Create: `src/data/achievements.ts`
- Create: `src/store/achievements.ts`

**Step 1: Create achievement definitions**

```ts
// src/data/achievements.ts
export interface Achievement {
  topicId: string;
  emoji: string;
  title: string;
}

export const achievements: Achievement[] = [
  { topicId: 'basics',     emoji: '🏅', title: 'Знаток UnitPay'  },
  { topicId: 'accounting', emoji: '💎', title: 'Супер помощник'  },
  { topicId: 'security',   emoji: '🛡️', title: 'Страж'           },
  { topicId: 'technical',  emoji: '⚙️', title: 'Технарь'         },
];
```

**Step 2: Create achievements store**

```ts
// src/store/achievements.ts
const KEY = 'achievements';

const load = (): string[] => {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; }
};

export const unlockAchievement = (topicId: string): boolean => {
  const earned = load();
  if (earned.includes(topicId)) return false; // already earned
  earned.push(topicId);
  localStorage.setItem(KEY, JSON.stringify(earned));
  return true; // newly earned → show popup
};

export const getEarnedAchievements = (): string[] => load();
```

**Step 3: Commit**
```bash
git add src/data/achievements.ts src/store/achievements.ts
git commit -m "feat: add achievements data and localStorage store"
```

---

### Task 2: AchievementPopup component

**Files:**
- Create: `src/components/AchievementPopup/AchievementPopup.tsx`
- Create: `src/components/AchievementPopup/AchievementPopup.css`

**Step 1: Create CSS with bounceIn animation**

```css
/* src/components/AchievementPopup/AchievementPopup.css */
@keyframes achievementBounceIn {
  0%   { opacity: 0; transform: scale(0.4); }
  60%  { opacity: 1; transform: scale(1.1); }
  80%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}

@keyframes achievementFadeOut {
  0%   { opacity: 1; }
  100% { opacity: 0; pointer-events: none; }
}

.achievement-popup {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  animation: achievementBounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.achievement-popup--hiding {
  animation: achievementFadeOut 0.3s ease forwards;
}

.achievement-popup__card {
  background: var(--tg-theme-bg-color, #fff);
  border-radius: 24px;
  padding: 32px 28px;
  text-align: center;
  max-width: 280px;
  width: 85vw;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
}

.achievement-popup__emoji {
  font-size: 64px;
  line-height: 1;
  margin-bottom: 12px;
}

.achievement-popup__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--tg-theme-button-color, #2AABEE);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 6px;
}

.achievement-popup__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--tg-theme-text-color, #000);
  margin: 0 0 20px;
}

.achievement-popup__dismiss {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: var(--tg-theme-button-color, #2AABEE);
  color: var(--tg-theme-button-text-color, #fff);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
```

**Step 2: Create the component**

```tsx
// src/components/AchievementPopup/AchievementPopup.tsx
import { FC, useEffect, useState } from 'react';
import './AchievementPopup.css';

interface Props {
  emoji: string;
  title: string;
  onClose: () => void;
}

export const AchievementPopup: FC<Props> = ({ emoji, title, onClose }) => {
  const [hiding, setHiding] = useState(false);

  const dismiss = () => {
    setHiding(true);
    setTimeout(onClose, 280);
  };

  useEffect(() => {
    const timer = setTimeout(dismiss, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`achievement-popup${hiding ? ' achievement-popup--hiding' : ''}`}
      onClick={dismiss}
    >
      <div className="achievement-popup__card" onClick={e => e.stopPropagation()}>
        <div className="achievement-popup__emoji">{emoji}</div>
        <p className="achievement-popup__label">Новая ачивка!</p>
        <p className="achievement-popup__title">{title}</p>
        <button className="achievement-popup__dismiss" onClick={dismiss}>
          Супер!
        </button>
      </div>
    </div>
  );
};
```

**Step 3: Commit**
```bash
git add src/components/AchievementPopup/
git commit -m "feat: add AchievementPopup component with bounceIn animation"
```

---

### Task 3: Wire popup into QuizPage

**Files:**
- Modify: `src/pages/QuizPage/QuizPage.tsx`

**Step 1: Add achievement check in `handleNext` (when quiz finishes)**

In the `finished` block at the top of `QuizPage`, add state:
```tsx
const [earnedAchievement, setEarnedAchievement] = useState<{ emoji: string; title: string } | null>(null);
```

In `handleNext`, after `setFinished(true)`:
```tsx
// Check for perfect score
const isPerfect = newResults.every(r => r === 'correct');
if (isPerfect && topicId) {
  const wasNew = unlockAchievement(topicId);
  if (wasNew) {
    const achievement = achievements.find(a => a.topicId === topicId);
    if (achievement) setEarnedAchievement(achievement);
  }
}
```

**Step 2: Render popup when earned**

In the `finished` JSX return, add before the closing `</div>`:
```tsx
{earnedAchievement && (
  <AchievementPopup
    emoji={earnedAchievement.emoji}
    title={earnedAchievement.title}
    onClose={() => setEarnedAchievement(null)}
  />
)}
```

**Step 3: Add imports**
```tsx
import { unlockAchievement } from '@/store/achievements';
import { achievements } from '@/data/achievements';
import { AchievementPopup } from '@/components/AchievementPopup/AchievementPopup';
```

**Step 4: Commit**
```bash
git add src/pages/QuizPage/QuizPage.tsx
git commit -m "feat: show achievement popup on perfect quiz score"
```

---

### Task 4: AchievementsSection on TopicsPage

**Files:**
- Create: `src/components/AchievementsSection/AchievementsSection.tsx`
- Create: `src/components/AchievementsSection/AchievementsSection.css`
- Modify: `src/pages/TopicsPage/TopicsPage.tsx`

**Step 1: Create CSS**

```css
/* src/components/AchievementsSection/AchievementsSection.css */
.achievements {
  padding: 0 16px 24px;
}

.achievements__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--tg-theme-hint-color, #888);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 12px 4px;
}

.achievements__row {
  display: flex;
  gap: 8px;
  justify-content: space-between;
}

.achievements__badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.achievements__circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  background: var(--tg-theme-secondary-bg-color, #f4f4f5);
  transition: background 0.2s;
}

.achievements__circle--earned {
  background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
  box-shadow: 0 2px 8px rgba(255, 180, 0, 0.4);
}

.achievements__name {
  font-size: 10px;
  font-weight: 500;
  color: var(--tg-theme-hint-color, #888);
  text-align: center;
  line-height: 1.2;
  max-width: 64px;
}

.achievements__name--earned {
  color: var(--tg-theme-text-color, #000);
  font-weight: 600;
}
```

**Step 2: Create component**

```tsx
// src/components/AchievementsSection/AchievementsSection.tsx
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
                {isEarned ? a.emoji : '🔒'}
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
```

**Step 3: Add to TopicsPage** — in `TopicsPage.tsx`, after `</div>` closing `topics__list`, add:
```tsx
<AchievementsSection />
```
And add import:
```tsx
import { AchievementsSection } from '@/components/AchievementsSection/AchievementsSection';
```

**Step 4: Commit**
```bash
git add src/components/AchievementsSection/ src/pages/TopicsPage/TopicsPage.tsx
git commit -m "feat: add achievements section to TopicsPage"
```
