# 🚀 Revenge - Docker Deployment Guide

Полное руководство по развертыванию Laravel приложения Revenge с использованием Docker и PostgreSQL.

## 📋 Требования

- Docker 20.10+
- Docker Compose 2.0+
- Git

## 🏗️ Архитектура

Приложение состоит из следующих сервисов:

- **nginx** - Веб-сервер (порт 80)
- **app** - Laravel приложение (PHP 8.3-FPM)
- **postgres** - База данных PostgreSQL 16
- **redis** - Кэширование и очереди
- **queue** - Обработчик фоновых задач
- **scheduler** - Laravel планировщик задач

## 🚀 Быстрый старт

### 1. Автоматическое развертывание

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd revenge

# Режим разработки
./deploy.sh dev

# Или production режим
./deploy.sh prod
```

### 2. Ручное развертывание

```bash
# Копируйте конфигурацию
cp .env.example .env

# Соберите и запустите
make install

# Или используя docker-compose напрямую
docker-compose up -d
```

## 🛠️ Доступные команды

### Makefile команды

```bash
make help                  # Показать справку
make build                 # Собрать образы
make up                    # Запустить сервисы
make down                  # Остановить сервисы
make restart               # Перезапустить сервисы
make logs                  # Показать логи
make shell                 # Войти в контейнер приложения
make db-shell              # Войти в PostgreSQL
make install               # Полная установка
make migrate               # Выполнить миграции
make test                  # Запустить тесты
make phpstan               # Анализ кода PHPStan
make clean                 # Полная очистка
make status                # Статус сервисов
```

### Docker Compose команды

```bash
docker-compose up -d                    # Запустить в фоне
docker-compose down                     # Остановить
docker-compose logs -f                  # Логи в реальном времени
docker-compose logs -f app              # Логи приложения
docker-compose exec app sh              # Войти в контейнер
docker-compose exec app php artisan migrate  # Выполнить миграции
docker-compose ps                       # Статус контейнеров
```

## 🔧 Конфигурация

### Переменные окружения

Основные переменные в `.env`:

```bash
# Приложение
APP_NAME=Revenge
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost

# PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=revenge
DB_USERNAME=revenge_user
DB_PASSWORD=revenge_password

# Redis
REDIS_HOST=redis
REDIS_PASSWORD=redis_password
REDIS_PORT=6379

# Кэширование и очереди
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
```

### Файлы конфигурации

- `docker-compose.yml` - Основная конфигурация сервисов
- `Dockerfile` - Образ приложения
- `docker/nginx/` - Конфигурация Nginx
- `docker/postgres/` - Инициализация PostgreSQL
- `.env.docker` - Production конфигурация
- `.env.example` - Пример конфигурации для разработки

## 📁 Структура проекта

```
revenge/
├── docker/                     # Docker конфигурации
│   ├── nginx/                  # Конфигурация Nginx
│   │   ├── nginx.conf
│   │   └── sites/default.conf
│   ├── postgres/               # Инициализация PostgreSQL
│   │   └── init/01-init.sql
│   ├── start.sh               # Скрипт запуска приложения
│   └── supervisor.conf        # Конфигурация Supervisor
├── Dockerfile                 # Образ приложения
├── docker-compose.yml         # Конфигурация сервисов
├── .dockerignore             # Исключения для Docker
├── Makefile                  # Команды управления
├── deploy.sh                 # Скрипт автоматического развертывания
├── .env.docker              # Production конфигурация
└── .env.example             # Пример конфигурации
```

## 🔍 Мониторинг и отладка

### Просмотр логов

```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f app
docker-compose logs -f nginx
docker-compose logs -f postgres

# Логи Laravel
docker-compose exec app tail -f storage/logs/laravel.log
```

### Проверка состояния

```bash
# Статус контейнеров
docker-compose ps

# Использование ресурсов
docker stats

# Проверка соединения с БД
docker-compose exec app php artisan migrate:status
```

### Вход в контейнеры

```bash
# Приложение (Laravel)
docker-compose exec app sh

# База данных
docker-compose exec postgres psql -U revenge_user -d revenge

# Nginx
docker-compose exec nginx sh

# Redis
docker-compose exec redis redis-cli
```

## 🗄️ Работа с базой данных

### Миграции

```bash
# Выполнить миграции
docker-compose exec app php artisan migrate

# Откат миграций
docker-compose exec app php artisan migrate:rollback

# Пересоздать БД с сидами
docker-compose exec app php artisan migrate:fresh --seed
```

### Резервное копирование

```bash
# Создать резервную копию
make db-backup

# Или вручную
docker-compose exec postgres pg_dump -U revenge_user revenge > backup.sql

# Восстановить из резервной копии
make db-restore FILE=backup.sql
```

## 🚀 Production развертывание

### 1. Подготовка

```bash
# Скопируйте production конфигурацию
cp .env.docker .env

# Обновите переменные для вашего окружения
vim .env
```

### 2. Развертывание

```bash
# Автоматическое развертывание
./deploy.sh prod

# Или вручную
make prod-up
```

### 3. Оптимизация

```bash
# Кэширование конфигурации
docker-compose exec app php artisan config:cache
docker-compose exec app php artisan route:cache
docker-compose exec app php artisan view:cache

# Оптимизация автозагрузчика
docker-compose exec app composer dump-autoload --optimize
```

## 🔒 Безопасность

### Рекомендации для production

1. **Измените пароли по умолчанию** в `.env`
2. **Настройте SSL/HTTPS** в конфигурации Nginx
3. **Ограничьте доступ к портам** базы данных и Redis
4. **Используйте secrets** для чувствительных данных
5. **Настройте регулярные резервные копии**

### Обновление паролей

```bash
# Обновите в .env файле:
DB_PASSWORD=your_secure_password
REDIS_PASSWORD=your_redis_password

# Пересоздайте сервисы
docker-compose down
docker-compose up -d
```

## 🧪 Тестирование

```bash
# Запуск тестов
make test

# Или напрямую
docker-compose exec app php artisan test

# PHPStan анализ
make phpstan
```

## 🔧 Разработка

### Режим разработки

```bash
# Запуск с hot-reload фронтенда
make dev-up

# Установка npm зависимостей
make npm-install

# Разработка фронтенда
make npm-dev
```

### Отладка

```bash
# Включить отладку в .env
APP_DEBUG=true
LOG_LEVEL=debug

# Перезапустить приложение
docker-compose restart app
```

## ❗ Устранение неполадок

### Частые проблемы

1. **Контейнер не запускается**
   ```bash
   docker-compose logs app
   ```

2. **База данных недоступна**
   ```bash
   docker-compose exec postgres pg_isready -U revenge_user -d revenge
   ```

3. **Проблемы с правами доступа**
   ```bash
   docker-compose exec app chown -R www:www storage bootstrap/cache
   ```

4. **Очистка всех данных**
   ```bash
   make clean
   ```

### Сброс до исходного состояния

```bash
# Полная очистка и переустановка
make clean
make install
```

## 📞 Поддержка

Если у вас возникли проблемы:

1. Проверьте логи: `docker-compose logs -f`
2. Убедитесь, что все сервисы запущены: `docker-compose ps`
3. Проверьте конфигурацию `.env`
4. Попробуйте пересоздать контейнеры: `make clean && make install`

## 📝 Заметки

- Приложение доступно на `http://localhost`
- PostgreSQL доступен на порту `5432`
- Redis доступен на порту `6379`
- Данные базы данных сохраняются в Docker volume `postgres_data`
- Логи приложения находятся в `storage/logs/`
