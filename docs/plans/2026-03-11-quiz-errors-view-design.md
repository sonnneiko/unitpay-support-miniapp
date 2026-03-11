# Quiz Errors View — Design

## Summary

After completing a quiz, users can tap the "ошибок" stat block to review all mistakes made during that session: question → user's wrong answer → correct answer → explanation.

## Architecture

Inline view within `QuizPage` — no new route. Adds `showErrors: boolean` state and a `mistakes` array tracked during the quiz.

## State Changes (`QuizPage.tsx`)

- **`mistakes: Array<{ questionIndex: number; selectedIndex: number }>`** — populated when user answers wrong (alongside existing `results` state)
- **`showErrors: boolean`** — toggles between finish screen and errors view

## Data Flow

1. User selects wrong answer → `handleSelect` pushes `{ questionIndex: currentIndex, selectedIndex: i }` to `mistakes`
2. Quiz finishes → `finished = true`, `mistakes` array is complete in memory
3. User taps "ошибок" block → `setShowErrors(true)`
4. Errors view reads `mistakes`, looks up each question from `questions[m.questionIndex]`
5. Back button (Telegram native) → `setShowErrors(false)` returns to finish screen

## Finish Screen Change

The "ошибок" stat block becomes a `<button>` when `mistakes.length > 0`. Adds a `→` arrow hint. If loaded from saved results (no live mistakes data), the block stays non-interactive.

## Errors View Layout

```
[scrollable body]
  For each mistake:
  ┌─────────────────────────────┐
  │ Вопрос N из M               │
  │ [question text]             │
  │ [chat messages, if any]     │
  │                             │
  │ Ваш ответ:                  │
  │ [wrong option — red style]  │
  │                             │
  │ Правильный ответ:           │
  │ [correct option — green]    │
  │                             │
  │ [explanation, if any]       │
  └─────────────────────────────┘

[footer]
  [Пройти ещё раз]
```

## Files Changed

- `src/pages/QuizPage/QuizPage.tsx` — state additions, errors view rendering
- `src/pages/QuizPage/QuizPage.css` — errors view styles (mistake cards, answer labels)

## Out of Scope

- Persisting mistakes to localStorage (not needed for MVP)
- Deep-linking to errors page
