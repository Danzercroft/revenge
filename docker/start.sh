#!/bin/sh

# Ждем готовности базы данных
echo "Ожидание готовности PostgreSQL..."
until php artisan migrate:status --env=production 2>/dev/null; do
  echo "Ожидаем подключение к базе данных..."
  sleep 2
done
echo "PostgreSQL готов!"

# Выполняем миграции и настройки Laravel
echo "Запуск миграций Laravel..."
php artisan migrate --force

echo "Очистка и оптимизация кэша..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Оптимизация автозагрузчика..."
composer dump-autoload --optimize

# Проверяем, нужно ли генерировать ключ
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ]; then
    echo "Генерация ключа приложения..."
    php artisan key:generate --force
fi

echo "Создание символических ссылок для storage..."
php artisan storage:link

echo "Установка прав доступа..."
chown -R www:www storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

echo "Запуск PHP-FPM..."
exec php-fpm
