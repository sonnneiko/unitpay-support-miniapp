# Quiz Errors View Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** After finishing a quiz, users can tap the "ошибок" stat to see a review screen with every mistake: question → user's wrong answer → correct answer → explanation.

**Architecture:** Inline view within `QuizPage` — adds `showErrors` boolean state and a `mistakes` array populated as user answers wrong. No new routes. Back button returns to finish screen.

**Tech Stack:** React + TypeScript, CSS (BEM-like), React Router (no new routes needed), Telegram Mini App SDK (`backButton`)

---

### Task 1: Track wrong answer selections in QuizPage state

**Files:**
- Modify: `src/pages/QuizPage/QuizPage.tsx`

**Step 1: Add `mistakes` state and type**

In `QuizPage.tsx`, after the existing state declarations (around line 45), add:

```tsx
type Mistake = { questionIndex: number; selectedIndex: number };

// inside QuizPage component, after existing useState declarations:
const [mistakes, setMistakes] = useState<Mistake[]>([]);
```

**Step 2: Populate mistakes on wrong answer**

In `handleSelect` (around line 49), after `setAnswerState('wrong')`, add:

```tsx
} else {
  setAnswerState('wrong');
  setMistakes(prev => [...prev, { questionIndex: currentIndex, selectedIndex: optionIndex }]);
}
```

**Step 3: Reset mistakes on restart**

In `handleRestart` (around line 61), add:

```tsx
setMistakes([]);
```

**Step 4: Manual smoke test**

Run `npm run dev`, open the quiz, answer a question wrong, open React DevTools and verify the `mistakes` state grows with the correct `{questionIndex, selectedIndex}` values.

**Step 5: Commit**

```bash
git add src/pages/QuizPage/QuizPage.tsx
git commit -m "feat: track wrong answer selections in quiz mistakes state"
```

---

### Task 2: Make the "ошибок" stat block clickable on finish screen

**Files:**
- Modify: `src/pages/QuizPage/QuizPage.tsx`
- Modify: `src/pages/QuizPage/QuizPage.css`

**Step 1: Add `showErrors` state**

Inside `QuizPage`, after the `mistakes` state:

```tsx
const [showErrors, setShowErrors] = useState(false);
```

**Step 2: Replace the wrong-stat `<div>` with a conditional button**

Find the `quiz__finish-stat--wrong` block (around line 139) and replace it:

```tsx
{mistakes.length > 0 ? (
  <button
    className="quiz__finish-stat quiz__finish-stat--wrong quiz__finish-stat--clickable"
    onClick={() => setShowErrors(true)}
  >
    <span className="quiz__finish-stat-value">{total - correctCount}</span>
    <span className="quiz__finish-stat-label">ошибок →</span>
  </button>
) : (
  <div className="quiz__finish-stat quiz__finish-stat--wrong">
    <span className="quiz__finish-stat-value">{total - correctCount}</span>
    <span className="quiz__finish-stat-label">ошибок</span>
  </div>
)}
```

**Step 3: Add CSS for clickable stat**

In `QuizPage.css`, after `.quiz__finish-stat--wrong` block:

```css
.quiz__finish-stat--clickable {
  border: none;
  cursor: pointer;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.15s ease;
}

.quiz__finish-stat--clickable:active {
  opacity: 0.7;
}
```

**Step 4: Manual smoke test**

Finish quiz with errors → verify "ошибок →" label appears and tapping it doesn't crash (console no errors). If no errors, verify label stays "ошибок" without arrow.

**Step 5: Commit**

```bash
git add src/pages/QuizPage/QuizPage.tsx src/pages/QuizPage/QuizPage.css
git commit -m "feat: make ошибок stat clickable when mistakes exist"
```

---

### Task 3: Render the errors view inside QuizPage

**Files:**
- Modify: `src/pages/QuizPage/QuizPage.tsx`
- Modify: `src/pages/QuizPage/QuizPage.css`

**Step 1: Wire up back button for errors view**

Update the `useEffect` for `backButton` to handle errors view:

```tsx
useEffect(() => {
  backButton.show();
  return backButton.onClick(() => {
    if (showErrors) {
      setShowErrors(false);
    } else {
      navigate('/topics');
    }
  });
}, [navigate, showErrors]);
```

**Step 2: Add the errors view render**

In the `if (finished)` block, BEFORE the existing `return`, add:

```tsx
if (finished && showErrors) {
  return (
    <div className="quiz">
      <div className="quiz__errors-header">
        <p className="quiz__errors-title">Ошибки</p>
        <p className="quiz__errors-subtitle">{mistakes.length} из {total}</p>
      </div>
      <div className="quiz__errors-list">
        {mistakes.map((mistake, idx) => {
          const q = questions[mistake.questionIndex];
          return (
            <div key={idx} className="quiz__error-card">
              <p className="quiz__error-num">Вопрос {mistake.questionIndex + 1}</p>
              <p className="quiz__error-question">{q.text}</p>

              {q.chatMessages && (
                <div className="quiz__chat quiz__chat--compact">
                  {q.chatMessages.map((msg, i) => (
                    <div key={i} className={`quiz__chat-msg quiz__chat-msg--${msg.side}`}>
                      <span className="quiz__chat-author">{msg.author}</span>
                      <div className="quiz__chat-bubble">
                        {msg.isTyping ? (
                          <div className="quiz__chat-typing">
                            <div className="quiz__chat-typing-dot" />
                            <div className="quiz__chat-typing-dot" />
                            <div className="quiz__chat-typing-dot" />
                          </div>
                        ) : msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="quiz__error-answers">
                <p className="quiz__error-label quiz__error-label--wrong">Ваш ответ</p>
                <div className="quiz__error-option quiz__error-option--wrong">
                  <span className="quiz__option-letter quiz__option-letter--wrong">
                    {LETTERS[mistake.selectedIndex]}
                  </span>
                  <span>{renderWithCode(q.options[mistake.selectedIndex])}</span>
                </div>
                <p className="quiz__error-label quiz__error-label--correct">Правильный ответ</p>
                <div className="quiz__error-option quiz__error-option--correct">
                  <span className="quiz__option-letter quiz__option-letter--correct">
                    {LETTERS[q.correctIndex]}
                  </span>
                  <span>{renderWithCode(q.options[q.correctIndex])}</span>
                </div>
              </div>

              {q.explanation && (
                <div className="quiz__feedback quiz__feedback--wrong">
                  <p className="quiz__feedback-text">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="quiz__footer">
        <button className="quiz__secondary" onClick={handleRestart}>
          Пройти ещё раз
        </button>
      </div>
    </div>
  );
}
```

**Step 3: Add CSS for errors view**

Append to `QuizPage.css`:

```css
/* Errors view */
.quiz__errors-header {
  padding: 20px 20px 8px;
  flex-shrink: 0;
}

.quiz__errors-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--tg-theme-text-color, #000);
  margin: 0 0 4px;
}

.quiz__errors-subtitle {
  font-size: 14px;
  color: var(--tg-theme-hint-color, #888);
  margin: 0;
}

.quiz__errors-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quiz__error-card {
  background: var(--tg-theme-secondary-bg-color, #f4f4f5);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quiz__error-num {
  font-size: 12px;
  font-weight: 600;
  color: var(--tg-theme-hint-color, #888);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.quiz__error-question {
  font-size: 16px;
  font-weight: 600;
  color: var(--tg-theme-text-color, #000);
  margin: 0;
  line-height: 1.35;
}

.quiz__chat--compact {
  margin-bottom: 0;
}

.quiz__error-answers {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.quiz__error-label {
  font-size: 12px;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.quiz__error-label--wrong {
  color: #c0392b;
}

.quiz__error-label--correct {
  color: #1a7a32;
}

.quiz__error-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
  color: var(--tg-theme-text-color, #000);
  line-height: 1.4;
}

.quiz__error-option--wrong {
  background: rgba(255, 59, 48, 0.10);
}

.quiz__error-option--correct {
  background: rgba(52, 199, 89, 0.12);
}

.quiz__option-letter--wrong {
  background: #FF3B30;
  opacity: 1;
}

.quiz__option-letter--correct {
  background: #34C759;
  opacity: 1;
}
```

**Step 4: Manual smoke test**

- Complete quiz with 2+ wrong answers
- Tap "ошибок →" → see errors screen
- Verify each card shows: question text, chat (if applicable), wrong answer in red, correct answer in green, explanation (if any)
- Tap native Telegram back button → returns to finish screen
- Tap "Пройти ещё раз" → quiz restarts correctly
- Complete quiz with 0 errors → "ошибок" label has no arrow, tapping doesn't navigate

**Step 5: Commit**

```bash
git add src/pages/QuizPage/QuizPage.tsx src/pages/QuizPage/QuizPage.css
git commit -m "feat: экран ошибок квиза — вопрос, неверный ответ, правильный, объяснение"
```

---

### Task 4: Build, deploy, push

**Step 1:**

```bash
npm run deploy
git push
```

Expected: build succeeds, GitHub Pages updated.
