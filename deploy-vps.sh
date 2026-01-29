#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Деплой Prompt Generator ===${NC}"

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker не установлен. Установите Docker и повторите.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose не установлен. Установите Docker Compose и повторите.${NC}"
    exit 1
fi

# Остановка контейнеров
echo -e "${YELLOW}Останавливаю контейнеры...${NC}"
docker-compose down

# Сборка образов
echo -e "${YELLOW}Собираю образы...${NC}"
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

# Проверка здоровья бэкенда
echo -e "${YELLOW}Проверяю здоровье бэкенда...${NC}"
sleep 2
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/health)

if [ "$response" == "200" ]; then
    echo -e "${GREEN}✓ Backend работает корректно${NC}"
else
    echo -e "${RED}✗ Backend не отвечает (код: $response)${NC}"
fi

# Очистка неиспользуемых ресурсов
echo -e "${YELLOW}Очищаю неиспользуемые образы...${NC}"
docker system prune -f

echo ""
echo -e "${GREEN}=== Деплой завершён ===${NC}"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000/api"
echo "Health Check: http://localhost:8000/api/health"
echo ""
echo "Для просмотра логов: docker-compose logs -f"
echo "Для остановки: docker-compose down"
