# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Запуск в режиме разработки (без HTTPS)
npm run dev:https    # Запуск с локальными SSL-сертификатами (первый запуск запросит sudo)
npm run build        # Проверка типов (tsc) + сборка для продакшена
npm run lint         # Линтинг ESLint (0 предупреждений)
npm run lint:fix     # Линтинг с автоисправлением
npm run deploy       # Сборка и деплой на GitHub Pages
```

> Проект создан с использованием `npm`. Использование других пакетных менеджеров приведёт к ошибке.

## Архитектура

Это Telegram Mini App на React + TypeScript, собираемое через Vite. Приложение — обучающий квиз для сотрудников поддержки UnitPay (платёжный агрегатор).

**Точка входа:** `src/index.tsx`
1. Импортирует `src/mockEnv.ts` — в dev-режиме эмулирует окружение Telegram, если приложение запущено вне него (в продакшене код удаляется tree-shaking'ом)
2. Вызывает `init()` из `src/init.ts` — монтирует SDK-компоненты (`miniApp`, `themeParams`, `viewport`, `backButton`, `initData`) и опционально подключает Eruda (на iOS/Android в debug-режиме)
3. Рендерит `<Root>` или `<EnvUnsupported>` при ошибке инициализации

**Дерево провайдеров:**
```
Root
  └─ ErrorBoundary
       └─ TonConnectUIProvider  (манифест: public/tonconnect-manifest.json)
            └─ App
                 └─ AppRoot (@telegram-apps/telegram-ui)
                      └─ HashRouter
                           └─ Routes (из src/navigation/routes.tsx)
```

**Маршрутизация:** все маршруты декларативно описаны в `src/navigation/routes.tsx` в массиве `routes`. Для добавления новой страницы — добавить элемент в этот массив и создать компонент в `src/pages/`.

**Стили:** BEM-методология через хелперы `src/css/bem.ts` и `src/css/classnames.ts`. Паттерн: `const [b, e] = bem('block-name')`, затем `b()`, `e('element')` для генерации классов.

**Псевдоним путей:** `@/` → `src/` (настроено через `vite-tsconfig-paths` и `tsconfig.json`).

**Debug-режим** активируется автоматически в dev-сборке или если `tgWebAppStartParam` содержит строку `debug`.

**macOS Telegram** имеет баги с темой и safe area — в `src/init.ts` есть специальный обходной путь через `mockTelegramEnv`.

## Доменная логика

**Данные квизов** — `src/data/questions.ts`. Содержит массив `topicsData: TopicData[]`. Каждый топик имеет `id`, `title` и массив `questions`. Вопросы могут включать `chatMessages` (диалог для отображения в квизе) и `explanation` (объяснение после ответа). Ответы — `options: string[]` + `correctIndex: number`. Для добавления нового раздела — добавить объект в `topicsData`.

- В тексте вопроса и вариантов ответа поддерживается синтаксис `` `код` `` — рендерится как `<code>` через `renderWithCode()` в `QuizPage`.
- В `chatMessages` поле `isTyping: true` рендерит анимированные точки вместо текста.

**Достижения** — `src/data/achievements.ts`. Каждое достижение привязано к `topicId`. Разблокируется при прохождении раздела без единой ошибки (100% правильных ответов). Хранятся в `localStorage` через `src/store/achievements.ts`.

> **Важно:** `topicId` в `topicsData` и `achievements` должны совпадать. Текущие ID: `basics`, `accounting`, `security`, `technical`.

**Хранилище** — всё хранится в `localStorage` без внешнего стейт-менеджера:
- `src/store/quizResults.ts` — результаты (`quiz_results`) и прогресс в середине прохождения (`quiz_progress`)
- `src/store/achievements.ts` — разблокированные ачивки (`achievements`)

Порядок вопросов и вариантов ответов перемешивается случайно при старте. Порядок перемешивания сохраняется в `quiz_progress`, чтобы при возобновлении сессии вопросы шли в том же порядке. Если количество вопросов в теме изменилось — сохранённые результаты инвалидируются автоматически.

**Пользовательский флоу:** `IndexPage` → `OnboardingPage` → `TopicsPage` (список разделов с прогрессом и ачивками) → `QuizPage/:topicId` (сам квиз).

**Служебные страницы** (наследие шаблона, не показываются пользователям): `InitDataPage`, `LaunchParamsPage`, `ThemeParamsPage`, `TONConnectPage` — доступны по маршрутам в `routes.tsx`, но не задействованы в основном флоу.

## Деплой

Перед деплоем на другой репозиторий нужно обновить:
- `homepage` в `package.json`
- `base` в `vite.config.ts` (должен совпадать с именем репозитория)

## Git

> **ВАЖНО:** Никогда не менять `git remote origin` с SSH на HTTPS. Репозиторий работает только через SSH.
