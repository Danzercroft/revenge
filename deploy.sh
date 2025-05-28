#!/bin/bash

# Скрипт быстрого развертывания Revenge приложения с Docker
# Использование: ./deploy.sh [dev|prod]

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для вывода
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${BLUE}"
    echo "=================================================="
    echo "🚀 REVENGE - Docker Deployment Script"
    echo "=================================================="
    echo -e "${NC}"
}

# Проверка зависимостей
check_dependencies() {
    print_info "Проверка зависимостей..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker не установлен. Установите Docker и попробуйте снова."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose не установлен. Установите Docker Compose и попробуйте снова."
        exit 1
    fi
    
    print_success "Все зависимости найдены"
}

# Копирование конфигурации
setup_environment() {
    local mode=$1
    print_info "Настройка окружения для режима: $mode"
    
    if [ "$mode" = "prod" ]; then
        if [ ! -f .env.docker ]; then
            print_error "Файл .env.docker не найден!"
            exit 1
        fi
        cp .env.docker .env
        print_success "Скопирован .env.docker в .env (production)"
    else
        if [ ! -f .env.development ]; then
            print_warning "Файл .env.development не найден, используем .env.example"
            if [ ! -f .env.example ]; then
                print_error "Файл .env.example не найден!"
                exit 1
            fi
            cp .env.example .env
            print_success "Скопирован .env.example в .env"
        else
            cp .env.development .env
            print_success "Скопирован .env.development в .env (development)"
        fi
    fi
}

# Остановка существующих контейнеров
stop_existing() {
    print_info "Остановка существующих контейнеров..."
    docker-compose down --remove-orphans || true
    print_success "Существующие контейнеры остановлены"
}

# Сборка образов
build_images() {
    print_info "Сборка Docker образов..."
    docker-compose build --no-cache
    print_success "Образы собраны"
}

# Запуск сервисов
start_services() {
    print_info "Запуск сервисов..."
    docker-compose up -d
    print_success "Сервисы запущены"
}

# Ожидание готовности базы данных
wait_for_database() {
    print_info "Ожидание готовности PostgreSQL..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose exec -T postgres pg_isready -U revenge_user -d revenge &> /dev/null; then
            print_success "PostgreSQL готов"
            return 0
        fi
        
        print_info "Попытка $attempt/$max_attempts - ожидание PostgreSQL..."
        sleep 2
        ((attempt++))
    done
    
    print_error "PostgreSQL не готов после $max_attempts попыток"
    exit 1
}

# Выполнение миграций
run_migrations() {
    print_info "Выполнение миграций базы данных..."
    docker-compose exec app php artisan migrate --force
    print_success "Миграции выполнены"
}

# Генерация ключа приложения
generate_key() {
    print_info "Генерация ключа приложения..."
    docker-compose exec app php artisan key:generate --force
    print_success "Ключ приложения сгенерирован"
}

# Оптимизация для production
optimize_for_production() {
    print_info "Оптимизация для production..."
    docker-compose exec app php artisan config:cache
    docker-compose exec app php artisan route:cache
    docker-compose exec app php artisan view:cache
    docker-compose exec app composer dump-autoload --optimize
    print_success "Оптимизация завершена"
}

# Установка npm зависимостей и сборка фронтенда
build_frontend() {
    print_info "Установка npm зависимостей..."
    docker-compose exec app npm install
    
    print_info "Сборка фронтенда..."
    docker-compose exec app npm run build
    print_success "Фронтенд собран"
}

# Проверка состояния
check_status() {
    print_info "Проверка состояния сервисов..."
    docker-compose ps
    
    print_info "Проверка доступности приложения..."
    if curl -f http://localhost &> /dev/null; then
        print_success "Приложение доступно на http://localhost"
    else
        print_warning "Приложение может быть еще не готово. Попробуйте через несколько секунд."
    fi
}

# Основная функция развертывания
deploy() {
    local mode=${1:-dev}
    
    print_header
    print_info "Начало развертывания в режиме: $mode"
    
    check_dependencies
    setup_environment $mode
    stop_existing
    build_images
    start_services
    wait_for_database
    run_migrations
    generate_key
    
    if [ "$mode" = "prod" ]; then
        build_frontend
        optimize_for_production
    fi
    
    check_status
    
    print_success "Развертывание завершено!"
    echo ""
    echo "📋 Полезные команды:"
    echo "  - Просмотр логов: docker-compose logs -f"
    echo "  - Вход в контейнер: docker-compose exec app sh"
    echo "  - Остановка: docker-compose down"
    echo "  - Или используйте Makefile: make help"
    echo ""
    print_success "🎉 Приложение готово! Откройте http://localhost"
}

# Обработка параметров командной строки
case "${1:-dev}" in
    dev|development)
        deploy "dev"
        ;;
    prod|production)
        deploy "prod"
        ;;
    help|--help|-h)
        echo "Использование: $0 [dev|prod]"
        echo ""
        echo "Параметры:"
        echo "  dev  - Развертывание в режиме разработки (по умолчанию)"
        echo "  prod - Развертывание в production режиме"
        echo ""
        echo "Примеры:"
        echo "  $0          # Режим разработки"
        echo "  $0 dev      # Режим разработки"
        echo "  $0 prod     # Production режим"
        ;;
    *)
        print_error "Неизвестный режим: $1"
        echo "Используйте: $0 [dev|prod] или $0 help"
        exit 1
        ;;
esac
