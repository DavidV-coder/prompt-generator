# Быстрый старт

## Локальный запуск

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # или venv\Scripts\activate на Windows
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (в другом терминале)
cd frontend
npm install
npm run dev
```

Откройте http://localhost:5173

---

## Docker (рекомендуется для деплоя)

```bash
# Запуск
docker-compose up -d

# Остановка
docker-compose down

# Просмотр логов
docker-compose logs -f

# Перезапуск после изменений
docker-compose restart
```

Frontend: http://localhost:3000
Backend: http://localhost:8000

---

## Деплой на VPS

### Первый раз

```bash
# 1. Склонируйте репозиторий
git clone https://github.com/your-username/prompt-generator.git
cd prompt-generator

# 2. Запустите деплой
./deploy-vps.sh
```

### Обновление

```bash
# Автоматическое обновление (git pull + rebuild)
./update.sh

# Или вручную
git pull origin main
docker-compose down
docker-compose build
docker-compose up -d
```

### Прямое редактирование на сервере

```bash
# Подключитесь по SSH
ssh user@your-server-ip

# Отредактируйте файлы
nano /path/to/backend/app/services/ai_service.py

# Перезапустите нужный сервис
docker-compose restart backend
# или
docker-compose restart frontend
```

---

## Деплой на Railway

1. Создайте репозиторий на GitHub
2. Запушьте код: `git push origin main`
3. Зайдите на [railway.app](https://railway.app)
4. Создайте новый проект из GitHub репозитория
5. Railway автоматически задеплоит приложение

**Обновление:** просто делайте `git push` — Railway автоматически задеплоит изменения

---

## Конфигурация

### Backend API URL

После деплоя обновите URL в админ панели:
1. Откройте приложение
2. Нажмите "⚙️ Админ"
3. Вкладка "🔌 API"
4. Укажите URL вашего сервера (например: `https://your-app.railway.app`)
5. Сохраните

### CORS

Если фронтенд и бэкенд на разных доменах, обновите CORS в `backend/app/main.py`:

```python
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-frontend.com",  # добавьте ваш домен
]
```

---

## Полезные команды

```bash
# Проверка здоровья API
curl http://localhost:8000/api/health

# Просмотр логов конкретного сервиса
docker-compose logs backend
docker-compose logs frontend

# Войти в контейнер
docker-compose exec backend bash
docker-compose exec frontend sh

# Очистка Docker
docker system prune -a -f

# Бэкап базы данных SQLite
docker cp prompt-backend:/app/prompt_generator.db ./backup.db
```

---

## Структура проекта

```
.
├── backend/           # FastAPI бэкенд
│   ├── app/
│   │   ├── main.py   # Точка входа
│   │   ├── routers/  # API эндпоинты
│   │   ├── services/ # Бизнес-логика
│   │   └── models/   # БД модели
│   └── Dockerfile
├── frontend/          # React фронтенд
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
├── deploy-vps.sh     # Скрипт деплоя
└── update.sh         # Скрипт обновления
```

---

## Troubleshooting

### Backend не запускается

```bash
# Проверьте логи
docker-compose logs backend

# Перезапустите с пересборкой
docker-compose down
docker-compose up -d --build backend
```

### Frontend показывает ошибку API

1. Откройте админ панель → API
2. Проверьте URL бэкенда
3. Убедитесь что бэкенд запущен: `curl http://localhost:8000/api/health`

### Порты заняты

```bash
# Измените порты в docker-compose.yml
ports:
  - "8001:8000"  # вместо 8000:8000
  - "3001:80"    # вместо 3000:80
```

---

Подробная документация: [DEPLOY.md](./DEPLOY.md)
