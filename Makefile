# Makefile для управления Docker окружением Revenge приложения

# ==============================================
# ПЕРЕМЕННЫЕ
# ==============================================
DOCKER_COMPOSE = docker-compose
DOCKER = docker
APP_CONTAINER = revenge_app
DB_CONTAINER = revenge_postgres
NGINX_CONTAINER = revenge_nginx

.PHONY: help build up down restart logs shell db-shell nginx-shell clean install migrate seed fresh test phpstan

# ==============================================
# СПРАВКА
# ==============================================
help: ## Показать справку по командам
	@echo "Доступные команды для Revenge приложения:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ==============================================
# ОСНОВНЫЕ КОМАНДЫ DOCKER
# ==============================================
build: ## Собрать все Docker образы
	$(DOCKER_COMPOSE) build --no-cache

up: ## Запустить все сервисы
	$(DOCKER_COMPOSE) up -d

down: ## Остановить все сервисы
	$(DOCKER_COMPOSE) down

restart: ## Перезапустить все сервисы
	$(DOCKER_COMPOSE) restart

logs: ## Показать логи всех сервисов
	$(DOCKER_COMPOSE) logs -f

logs-app: ## Показать логи приложения
	$(DOCKER_COMPOSE) logs -f app

logs-nginx: ## Показать логи Nginx
	$(DOCKER_COMPOSE) logs -f nginx

logs-postgres: ## Показать логи PostgreSQL
	$(DOCKER_COMPOSE) logs -f postgres

# ==============================================
# SHELL ДОСТУП
# ==============================================
shell: ## Войти в контейнер приложения
	$(DOCKER_COMPOSE) exec app sh

db-shell: ## Войти в PostgreSQL
	$(DOCKER_COMPOSE) exec postgres psql -U revenge_user -d revenge

nginx-shell: ## Войти в контейнер Nginx
	$(DOCKER_COMPOSE) exec nginx sh

# ==============================================
# УСТАНОВКА И НАСТРОЙКА
# ==============================================
install: ## Первоначальная установка (сборка + запуск + миграции)
	make build
	make up
	sleep 10
	make migrate
	make key-generate
	@echo "🚀 Приложение готово! Откройте http://localhost"

fresh-install: ## Полная переустановка (очистка + установка)
	make clean
	make install

# ==============================================
# LARAVEL КОМАНДЫ
# ==============================================
migrate: ## Выполнить миграции базы данных
	$(DOCKER_COMPOSE) exec app php artisan migrate --force

migrate-fresh: ## Полная переустановка БД с сидами
	$(DOCKER_COMPOSE) exec app php artisan migrate:fresh --seed --force

seed: ## Заполнить базу данных тестовыми данными
	$(DOCKER_COMPOSE) exec app php artisan db:seed --force

key-generate: ## Сгенерировать ключ приложения
	$(DOCKER_COMPOSE) exec app php artisan key:generate --force

cache-clear: ## Очистить кэш приложения
	$(DOCKER_COMPOSE) exec app php artisan cache:clear
	$(DOCKER_COMPOSE) exec app php artisan config:clear
	$(DOCKER_COMPOSE) exec app php artisan route:clear
	$(DOCKER_COMPOSE) exec app php artisan view:clear

optimize: ## Оптимизировать приложение для production
	$(DOCKER_COMPOSE) exec app php artisan config:cache
	$(DOCKER_COMPOSE) exec app php artisan route:cache
	$(DOCKER_COMPOSE) exec app php artisan view:cache
	$(DOCKER_COMPOSE) exec app composer dump-autoload --optimize

# ==============================================
# ТЕСТИРОВАНИЕ И АНАЛИЗ
# ==============================================
test: ## Запустить тесты
	$(DOCKER_COMPOSE) exec app php artisan test

phpstan: ## Запустить PHPStan анализ
	$(DOCKER_COMPOSE) exec app ./vendor/bin/phpstan analyse --memory-limit=2G

phpstan-baseline: ## Сгенерировать PHPStan baseline
	$(DOCKER_COMPOSE) exec app ./vendor/bin/phpstan analyse --generate-baseline phpstan-baseline.neon --memory-limit=2G

# ==============================================
# РАБОТА С ФРОНТЕНДОМ
# ==============================================
npm-install: ## Установить npm зависимости
	$(DOCKER_COMPOSE) exec app npm install

npm-dev: ## Запустить фронтенд в dev режиме
	$(DOCKER_COMPOSE) exec app npm run dev

npm-build: ## Собрать фронтенд для production
	$(DOCKER_COMPOSE) exec app npm run build

# ==============================================
# ОЧИСТКА И ОБСЛУЖИВАНИЕ
# ==============================================
clean: ## Полная очистка (контейнеры, образы, тома)
	$(DOCKER_COMPOSE) down -v --rmi all --remove-orphans
	$(DOCKER) system prune -f

clean-containers: ## Удалить только контейнеры
	$(DOCKER_COMPOSE) down --remove-orphans

clean-volumes: ## Удалить тома (ОСТОРОЖНО: удалятся данные БД!)
	$(DOCKER_COMPOSE) down -v

# ==============================================
# МОНИТОРИНГ
# ==============================================
status: ## Показать статус всех сервисов
	$(DOCKER_COMPOSE) ps

stats: ## Показать статистику ресурсов
	$(DOCKER) stats

# ==============================================
# BACKUP И RESTORE
# ==============================================
db-backup: ## Создать резервную копию БД
	@mkdir -p ./backups
	$(DOCKER_COMPOSE) exec postgres pg_dump -U revenge_user revenge > ./backups/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Резервная копия создана в ./backups/"

db-restore: ## Восстановить БД из резервной копии (указать файл: make db-restore FILE=backup.sql)
	$(DOCKER_COMPOSE) exec -T postgres psql -U revenge_user -d revenge < ./backups/$(FILE)

# ==============================================
# РАЗРАБОТКА
# ==============================================
dev-up: ## Запустить в режиме разработки
	cp .env.example .env
	$(DOCKER_COMPOSE) up -d
	make npm-install
	make migrate
	@echo "🔧 Режим разработки готов!"

prod-up: ## Запустить в production режиме
	cp .env.docker .env
	make build
	make up
	make migrate
	make optimize
	@echo "🚀 Production режим готов!"
