# Как передеплоить на Railway

## Через Dashboard (проще всего):

### Frontend:
1. Откройте https://railway.app/project/4ecb5894-d365-429a-a880-e86348e7cf98
2. Нажмите на **Deployments**
3. Найдите последний деплой
4. Нажмите **⋮** (три точки) → **Redeploy**

### Backend:
1. Откройте https://railway.app/project/6846f800-c70d-4f7c-b085-9111419c5764
2. Нажмите на **Deployments**
3. Найдите последний деплой
4. Нажмите **⋮** → **Redeploy**

---

## Настроить автодеплой из GitHub:

### Frontend:
1. Откройте Frontend проект → **Settings**
2. Нажмите **Connect Repo**
3. Выберите **DavidV-coder/prompt-generator**
4. **Root Directory:** `/frontend`
5. Сохраните

### Backend:
1. Откройте Backend проект → **Settings**
2. Нажмите **Connect Repo**
3. Выберите **DavidV-coder/prompt-generator**
4. **Root Directory:** `/backend`
5. Сохраните

После этого Railway будет автоматически деплоить при `git push`!

---

## Через CLI:

```bash
# Frontend
cd frontend
railway link 4ecb5894-d365-429a-a880-e86348e7cf98
railway up

# Backend
cd backend
railway link 6846f800-c70d-4f7c-b085-9111419c5764
railway up
```
