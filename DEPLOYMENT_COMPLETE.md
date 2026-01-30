# ✅ Деплой завершён!

## 🎉 Ваши URL:

**Backend:** https://prompt-generator-backend-production.up.railway.app
**Frontend:** https://prompt-generator-frontend-production.up.railway.app

**GitHub Repo:** https://github.com/DavidV-coder/prompt-generator

---

## ⚙️ Финальная настройка (2 минуты):

### 1. Настройте CORS в Backend:

1. Откройте [Railway Dashboard](https://railway.app)
2. Найдите проект **prompt-generator-backend**
3. Перейдите в **Variables**
4. Добавьте переменную:
   ```
   Name: CORS_ORIGINS
   Value: https://prompt-generator-frontend-production.up.railway.app
   ```
5. Сохраните (backend перезапустится автоматически)

### 2. Настройте API URL в приложении:

1. Откройте https://prompt-generator-frontend-production.up.railway.app
2. Нажмите **⚙️ Админ** → **🔌 API**
3. В поле **URL сервера API** введите:
   ```
   https://prompt-generator-backend-production.up.railway.app
   ```
4. Нажмите **💾 Сохранить**

### 3. Настройте провайдера:

1. Вернитесь на главную страницу
2. Нажмите **Настроить**
3. Выберите провайдер (OpenRouter, OpenAI, Anthropic, xAI или ZAI)
4. Введите ваш API ключ
5. Нажмите **Тест** для проверки
6. Выберите модель
7. Нажмите **Сохранить**

---

## 🚀 Готово к использованию!

Откройте frontend URL и начните генерировать промпты.

---

## 🔄 Как обновлять код:

```bash
cd "/Users/admin/Documents/Projects/Prompt Ing"
git add .
git commit -m "Update: описание изменений"
git push origin main

# Railway автоматически задеплоит изменения за 1-2 минуты
```

Или через Railway CLI:
```bash
# Backend
cd backend
railway up

# Frontend
cd frontend
railway up
```

---

## 📊 Мониторинг:

### Логи Backend:
```bash
cd backend
railway logs
```

### Логи Frontend:
```bash
cd frontend
railway logs
```

### Веб-интерфейс:
- [Backend Dashboard](https://railway.app/project/6846f800-c70d-4f7c-b085-9111419c5764)
- [Frontend Dashboard](https://railway.app/project/4ecb5894-d365-429a-a880-e86348e7cf98)

---

## 🐛 Troubleshooting:

### Backend не отвечает:
```bash
cd backend
railway logs
# Проверьте ошибки в логах
```

### Frontend показывает ошибку API:
1. Проверьте CORS в backend (Variables)
2. Проверьте API URL в админ панели frontend
3. Убедитесь что backend запущен: https://prompt-generator-backend-production.up.railway.app/api/health

### Как перезапустить:
В Railway Dashboard → Settings → Redeploy

---

## 💰 Стоимость:

Railway Hobby Plan: **$5/месяц**
- Включает 2 проекта (backend + frontend)
- 500 часов выполнения
- 8GB RAM

---

## 🎯 Следующие шаги:

- ✅ Протестируйте генерацию промптов
- ✅ Настройте кастомный системный промпт в админ панели
- ✅ Подключите кастомный домен (если нужно)

Готово! Ваше приложение в продакшене 🚀
