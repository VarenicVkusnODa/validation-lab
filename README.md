# validation-lab

## Запуск

1. Установите Node.js 18 или новее.
2. В терминале перейдите в папку проекта.
3. Выполните:

```bash
npm install
node server.js
```

4. Откройте http://localhost:3000

## Проверка серверной валидации

Отправьте некорректный запрос (должен вернуться HTTP 400 с errors):

```bash
curl -i -X POST http://localhost:3000/api/register -H "Content-Type: application/json" --data-binary "@bad.json"
```

Отправьте корректный запрос (должен вернуться HTTP 201; пароль не включён в ответ):

```bash
curl -i -X POST http://localhost:3000/api/register -H "Content-Type: application/json" --data-binary "@good.json"
```

В Windows PowerShell используйте `curl.exe` вместо `curl`.
