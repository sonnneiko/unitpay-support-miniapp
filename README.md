# Шаблон React для Telegram Mini Apps

Этот шаблон демонстрирует, как разработчики могут создать одностраничное
приложение на платформе Telegram Mini Apps с использованием следующих технологий
и библиотек:

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TON Connect](https://docs.ton.org/develop/dapps/ton-connect/overview)
- [@tma.js SDK](https://docs.telegram-mini-apps.com/packages/tma-js-sdk)
- [Telegram UI](https://github.com/Telegram-Mini-Apps/TelegramUI)
- [Vite](https://vitejs.dev/)

> Шаблон был создан с использованием [npm](https://www.npmjs.com/). Поэтому
> для работы с этим проектом также необходимо использовать npm. При использовании
> других пакетных менеджеров вы получите соответствующую ошибку.

## Установка зависимостей

Если вы только что склонировали этот шаблон, установите зависимости проекта
с помощью команды:

```Bash
npm install
```

## Скрипты

Проект содержит следующие скрипты:

- `dev` — запускает приложение в режиме разработки.
- `dev:https` — запускает приложение в режиме разработки с локально созданными SSL-сертификатами.
- `build` — собирает приложение для продакшена.
- `lint` — запускает [eslint](https://eslint.org/) для проверки качества кода.
- `deploy` — публикует приложение на GitHub Pages.

Для запуска скрипта используйте команду `npm run`:

```Bash
npm run {скрипт}
# Пример: npm run build
```

## Создание бота и мини-приложения

Перед началом работы убедитесь, что у вас уже создан Telegram-бот. Здесь
находится [подробное руководство](https://docs.telegram-mini-apps.com/platform/creating-new-app)
по его созданию.

## Запуск

Хотя Mini Apps предназначены для открытия
внутри [Telegram](https://docs.telegram-mini-apps.com/platform/about#supported-applications),
в процессе разработки их можно разрабатывать и тестировать вне Telegram.

Для запуска приложения в режиме разработки используйте скрипт `dev`:

```bash
npm run dev:https
```

> [!NOTE]
> Поскольку используется [vite-plugin-mkcert](https://www.npmjs.com/package/vite-plugin-mkcert),
> при первом запуске режима разработки может появиться запрос пароля sudo.
> Плагин требует его для корректной настройки SSL-сертификатов. Чтобы отключить плагин, используйте команду `npm run dev`.

После запуска в терминале появится примерно следующее:

```bash
VITE v5.2.12  ready in 237 ms

➜  Local:   https://localhost:5173/reactjs-template
➜  Network: https://172.18.16.1:5173/reactjs-template
➜  Network: https://172.19.32.1:5173/reactjs-template
➜  Network: https://192.168.0.171:5173/reactjs-template
➜  press h + enter to show help
```

Здесь вы увидите ссылку `Local`, доступную локально, и ссылки `Network`,
доступные всем устройствам в той же сети.

Чтобы открыть приложение, откройте ссылку `Local`
(`https://localhost:5173/reactjs-template` в данном примере) в браузере:

![Приложение](assets/application.png)

Важно отметить, что некоторые библиотеки в этом шаблоне, например
`@tma.js/sdk`, не предназначены для использования вне Telegram.

Тем не менее, они работают корректно. Это связано с тем, что файл
`src/mockEnv.ts`, импортируемый в точке входа приложения (`src/index.ts`),
использует функцию `mockTelegramEnv` для имитации окружения Telegram.
Этот приём убеждает приложение, что оно работает внутри Telegram.
Поэтому будьте осторожны и не используйте эту функцию в продакшене,
если не понимаете полностью её последствий.

> [!WARNING]
> Поскольку используются самоподписанные SSL-сертификаты, приложения
> Telegram на Android и iOS не смогут отобразить приложение. Эти операционные
> системы применяют более строгие меры безопасности, препятствующие загрузке
> Mini App. Для решения этой проблемы обратитесь к
> [данному руководству](https://docs.telegram-mini-apps.com/platform/getting-app-link#remote).

## Деплой

Этот шаблон использует GitHub Pages для внешнего хостинга приложения.
GitHub Pages предоставляет CDN, что позволяет пользователям быстро получать
приложение. В качестве альтернативы можно использовать такие сервисы,
как [Heroku](https://www.heroku.com/) или [Vercel](https://vercel.com).

### Ручной деплой

Шаблон использует инструмент [gh-pages](https://www.npmjs.com/package/gh-pages),
который позволяет публиковать приложение прямо с вашего компьютера.

#### Настройка

Перед запуском процесса деплоя убедитесь, что вы выполнили следующее:

1. Заменили значение `homepage` в `package.json`. Инструмент деплоя GitHub Pages
   использует это значение для определения связанного проекта на GitHub.
2. Заменили значение `base` в `vite.config.ts`, установив его равным имени
   вашего репозитория на GitHub. Vite использует это значение при создании
   путей к статическим ресурсам.

Например, если ваш GitHub-логин — `telegram-mini-apps`, а репозиторий называется
`is-awesome`, поле `homepage` должно выглядеть так:

```json
{
  "homepage": "https://telegram-mini-apps.github.io/is-awesome"
}
```

А `vite.config.ts` должен содержать:

```ts
export default defineConfig({
  base: '/is-awesome/',
  // ...
});
```

Подробнее о настройке деплоя можно узнать в
[документации gh-pages](https://github.com/tschaub/gh-pages?tab=readme-ov-file#github-pages-project-sites).

#### Перед деплоем

Перед публикацией приложения убедитесь, что оно собрано и вы готовы
задеплоить свежие статические файлы:

```bash
npm run build
```

Затем запустите процесс деплоя с помощью скрипта `deploy`:

```Bash
npm run deploy
```

После успешного завершения деплоя перейдите на страницу с данными вашего
логина и репозитория. Пример ссылки на основе указанных выше данных:
https://telegram-mini-apps.github.io/is-awesome

### GitHub Workflow

Для упрощения процесса деплоя шаблон включает предварительно настроенный
[GitHub workflow](.github/workflows/github-pages-deploy.yml), который
автоматически публикует проект при отправке изменений в ветку `master`.

Чтобы включить этот workflow, создайте новое окружение (или отредактируйте
существующее) в настройках репозитория GitHub и назовите его `github-pages`.
Затем добавьте ветку `master` в список веток для деплоя.

Настройки окружения можно найти по адресу:
`https://github.com/{username}/{repository}/settings/environments`.

![img.png](.github/deployment-branches.png)

Если вы не хотите использовать автоматический деплой или не используете GitHub
для хранения кода, удалите директорию `.github`.

### Через веб-интерфейс GitHub

Разработчики также могут настроить автоматический деплой через веб-интерфейс
GitHub. Для этого перейдите по ссылке:
`https://github.com/{username}/{repository}/settings/pages`.

## TON Connect

Этот шаблон использует проект
[TON Connect](https://docs.ton.org/develop/dapps/ton-connect/overview)
для демонстрации того, как разработчики могут интегрировать функциональность,
связанную с криптовалютой TON.

Манифест TON Connect, используемый в шаблоне, хранится в папке `public`,
где находятся все публично доступные статические файлы. Не забудьте
[настроить](https://docs.ton.org/develop/dapps/ton-connect/manifest)
этот файл в соответствии с информацией о вашем проекте.

## Полезные ссылки

- [Документация платформы](https://docs.telegram-mini-apps.com/)
- [Документация @tma.js/sdk-react](https://docs.telegram-mini-apps.com/packages/tma-js-sdk-react)
- [Чат сообщества разработчиков Telegram](https://t.me/devs_cis)
