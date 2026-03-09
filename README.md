# UnitPay Support Mini App

Telegram Mini App — обучающий квиз для сотрудников поддержки UnitPay. Приложение позволяет проходить тематические тесты, закреплять знания о платёжном агрегаторе и получать достижения за безошибочное прохождение разделов.

**Стек:** React + TypeScript + Vite, [@tma.js/sdk-react](https://docs.telegram-mini-apps.com/packages/tma-js-sdk-react), [Telegram UI](https://github.com/Telegram-Mini-Apps/TelegramUI), TON Connect.

**Деплой:** [sonnneiko.github.io/unitpay-support-miniapp](https://sonnneiko.github.io/unitpay-support-miniapp)

## Установка и запуск

```bash
npm install
npm run dev          # без HTTPS
npm run dev:https    # с SSL (первый запуск запросит sudo)
```

> Используйте только `npm`. Другие пакетные менеджеры приведут к ошибке.

Приложение можно разрабатывать и тестировать вне Telegram — `src/mockEnv.ts` имитирует окружение Telegram через `mockTelegramEnv`. В продакшен-сборке этот код удаляется tree-shaking'ом.

> [!WARNING]
> При использовании `dev:https` создаются самоподписанные SSL-сертификаты, которые не принимаются Telegram на Android и iOS. Для тестирования на мобильных устройствах используйте [удалённый HTTPS](https://docs.telegram-mini-apps.com/platform/getting-app-link#remote).

## Скрипты

| Команда | Описание |
|---|---|
| `npm run dev` | Режим разработки без HTTPS |
| `npm run dev:https` | Режим разработки с SSL |
| `npm run build` | Проверка типов (tsc) + сборка для продакшена |
| `npm run lint` | Линтинг ESLint (0 предупреждений допускается) |
| `npm run lint:fix` | Линтинг с автоисправлением |
| `npm run deploy` | Сборка и деплой на GitHub Pages |

## Деплой

```bash
npm run deploy
```

При деплое на другой репозиторий обновите:
- `homepage` в `package.json`
- `base` в `vite.config.ts` (должно совпадать с именем репозитория)

## TON Connect

Манифест TON Connect хранится в `public/tonconnect-manifest.json`. При форке проекта [настройте его](https://docs.ton.org/develop/dapps/ton-connect/manifest) под свой проект.

## Полезные ссылки

- [Документация Telegram Mini Apps](https://docs.telegram-mini-apps.com/)
- [Документация @tma.js/sdk-react](https://docs.telegram-mini-apps.com/packages/tma-js-sdk-react)
- [Создание Telegram-бота и мини-приложения](https://docs.telegram-mini-apps.com/platform/creating-new-app)
