# Инструкции по деплою

## Вариант 1: Railway (рекомендуется)

### Преимущества:
- Автоматический деплой из GitHub
- Бесплатный SSL сертификат
- Встроенный мониторинг и логи
- Легко откатиться к предыдущей версии
- **Обновление**: просто `git push` в репозиторий

### Шаги:
1. Создайте репозиторий на GitHub и запушьте код
2. Зайдите на railway.app и создайте новый проект
3. Подключите GitHub репозиторий
4. Railway автоматически обнаружит Dockerfile
5. Добавьте переменные окружения (если нужны)
6. Деплой происходит автоматически

### Обновление кода на Railway:
```bash
git add .
git commit -m "Update"
git push origin main
# Railway автоматически задеплоит изменения
```

---

## Вариант 2: VPS (собственный сервер)

### Преимущества:
- Полный контроль
- Можно редактировать файлы напрямую через SSH
- Нет ограничений хостинга
- Один раз настроил — работает

### Требования:
- Ubuntu 20.04+ / Debian 11+
- Docker и Docker Compose установлены
- Минимум 1GB RAM

### Шаги установки:

#### 1. Подключитесь к серверу
```bash
ssh root@your-server-ip
```

#### 2. Установите Docker (если не установлен)
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install docker-compose -y
```

#### 3. Склонируйте репозиторий
```bash
cd /opt
git clone https://github.com/your-username/prompt-generator.git
cd prompt-generator
```

#### 4. Создайте .env файл (опционально)
```bash
nano .env
# Добавьте переменные окружения, если нужны
```

#### 5. Запустите приложение
```bash
docker-compose up -d
```

#### 6. Настройте Nginx (для домена)
```bash
apt install nginx certbot python3-certbot-nginx -y
nano /etc/nginx/sites-available/prompt-generator
```

Добавьте конфиг:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/prompt-generator /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
certbot --nginx -d your-domain.com
```

### Обновление кода на VPS:

#### Вариант А: Через Git (рекомендуется)
```bash
cd /opt/prompt-generator
git pull origin main
docker-compose down
docker-compose build
docker-compose up -d
```

#### Вариант Б: Прямое редактирование на сервере
```bash
# Подключитесь по SSH
ssh root@your-server-ip

# Отредактируйте нужный файл
nano /opt/prompt-generator/backend/app/services/ai_service.py

# Перезапустите контейнер
cd /opt/prompt-generator
docker-compose restart backend
```

#### Вариант В: Загрузка файлов через SCP
```bash
# С вашего компьютера
scp -r ./backend root@your-server-ip:/opt/prompt-generator/
scp -r ./frontend root@your-server-ip:/opt/prompt-generator/

# На сервере перезапустите
ssh root@your-server-ip "cd /opt/prompt-generator && docker-compose restart"
```

---

## Вариант 3: Комбинированный

### Frontend на Vercel
- Деплой фронтенда на Vercel (бесплатно)
- Автоматический деплой из GitHub
- CDN и SSL из коробки

### Backend на Railway/VPS
- Backend на Railway или VPS
- Настройте CORS для домена Vercel

### Шаги:
1. Загрузите frontend на Vercel через GitHub
2. Загрузите backend на Railway
3. В админ панели укажите URL бэкенда
4. Обновите CORS в backend/app/main.py

---

## Скрипт автообновления для VPS

Создайте файл `update.sh` на сервере:

```bash
#!/bin/bash
cd /opt/prompt-generator
echo "Pulling latest changes..."
git pull origin main

echo "Rebuilding containers..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

echo "Cleaning up..."
docker system prune -f

echo "Done! App is running."
docker-compose ps
```

Сделайте его исполняемым:
```bash
chmod +x update.sh
```

Теперь обновление одной командой:
```bash
./update.sh
```

---

## Проверка работы

### Проверьте логи:
```bash
# На VPS
docker-compose logs -f

# Отдельно для backend
docker-compose logs -f backend

# Отдельно для frontend
docker-compose logs -f frontend
```

### Проверьте статус:
```bash
docker-compose ps
```

### Проверьте API:
```bash
curl http://your-domain.com/api/health
```

---

## Мониторинг и обслуживание

### Автоматический перезапуск при падении:
В docker-compose уже настроен `restart: unless-stopped`

### Логи:
```bash
# Последние 100 строк
docker-compose logs --tail=100

# Следить за логами в реальном времени
docker-compose logs -f
```

### Очистка диска:
```bash
# Удалить неиспользуемые контейнеры и образы
docker system prune -a -f

# Удалить старые логи
truncate -s 0 /var/lib/docker/containers/*/*-json.log
```

---

## Резервное копирование

### База данных SQLite:
```bash
# Создать бэкап
docker cp prompt-backend:/app/prompt_generator.db ./backup_$(date +%Y%m%d).db

# Восстановить бэкап
docker cp ./backup_20260129.db prompt-backend:/app/prompt_generator.db
docker-compose restart backend
```

---

## Рекомендации

1. **Для быстрого старта**: Railway
   - Минимум настроек
   - Автообновление
   - Бесплатный план на старте

2. **Для полного контроля**: VPS
   - Можно редактировать прямо на сервере
   - SSH доступ
   - Нет ограничений

3. **Для production**: VPS + Nginx + SSL
   - Максимальная производительность
   - Собственный домен
   - Полный контроль

---

## Полезные команды

```bash
# Перезапустить всё
docker-compose restart

# Остановить
docker-compose down

# Запустить заново
docker-compose up -d

# Посмотреть логи
docker-compose logs -f

# Зайти внутрь контейнера
docker-compose exec backend bash
docker-compose exec frontend sh

# Обновить один сервис
docker-compose up -d --build backend
```
