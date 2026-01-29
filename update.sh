#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Обновление Prompt Generator ===${NC}"

# Проверка Git
if [ -d ".git" ]; then
    echo -e "${YELLOW}Получаю обновления из Git...${NC}"
    git pull origin main

    if [ $? -ne 0 ]; then
        echo -e "${RED}Ошибка при получении обновлений из Git${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Git репозиторий не найден, пропускаю git pull${NC}"
fi

# Остановка контейнеров
echo -e "${YELLOW}Останавливаю контейнеры...${NC}"
docker-compose down

# Пересборка образов
echo -e "${YELLOW}Пересобираю образы...${NC}"
docker-compose build --no-cache

# Запуск контейнеров
echo -e "${YELLOW}Запускаю контейнеры...${NC}"
docker-compose up -d

# Ожидание запуска
echo -e "${YELLOW}Ожидаю запуск сервисов...${NC}"
sleep 5

# Проверка статуса
echo -e "${GREEN}Статус контейнеров:${NC}"
docker-compose ps

# Проверка здоровья
echo -e "${YELLOW}Проверяю здоровье сервисов...${NC}"
sleep 2

# Проверка бэкенда
backend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/health)
if [ "$backend_status" == "200" ]; then
    echo -e "${GREEN}✓ Backend: OK${NC}"
else
    echo -e "${RED}✗ Backend: Ошибка (код: $backend_status)${NC}"
fi

# Проверка фронтенда
frontend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$frontend_status" == "200" ]; then
    echo -e "${GREEN}✓ Frontend: OK${NC}"
else
    echo -e "${RED}✗ Frontend: Ошибка (код: $frontend_status)${NC}"
fi

# Очистка старых образов
echo -e "${YELLOW}Очищаю старые образы и контейнеры...${NC}"
docker system prune -f

echo ""
echo -e "${GREEN}=== Обновление завершено ===${NC}"
echo ""
echo "Сервисы доступны:"
echo "  Frontend: http://localhost:3000"
echo "  Backend: http://localhost:8000"
echo ""
echo "Команды:"
echo "  Логи: docker-compose logs -f"
echo "  Статус: docker-compose ps"
echo "  Остановка: docker-compose down"
