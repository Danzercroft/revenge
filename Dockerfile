# Многоэтапная сборка для Laravel приложения с React/Inertia.js
FROM node:20-alpine AS frontend

WORKDIR /app

# Копируем файлы зависимостей Node.js
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY eslint.config.js ./
COPY components.json ./

# Устанавливаем зависимости Node.js
RUN npm ci --only=production

# Копируем исходный код фронтенда
COPY resources/ ./resources/
COPY public/ ./public/

# Собираем фронтенд
RUN npm run build

# Основная PHP сборка
FROM php:8.3-fpm-alpine AS backend

# Устанавливаем системные зависимости, расширения PHP и Redis
RUN apk add --no-cache \
    autoconf \
    bash \
    curl \
    freetype-dev \
    g++ \
    gcc \
    git \
    libjpeg-turbo-dev \
    libpng-dev \
    libxml2-dev \
    libzip-dev \
    make \
    nodejs \
    npm \
    postgresql-dev \
    supervisor \
    unzip \
    zip && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install \
    pdo \
    pdo_pgsql \
    bcmath \
    gd \
    xml \
    zip && \
    pecl install redis && \
    docker-php-ext-enable redis && \
    apk del autoconf gcc g++ make

# Устанавливаем Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Создаем пользователя для приложения
RUN addgroup -g 1000 -S www && \
    adduser -u 1000 -S www -G www

# Устанавливаем рабочую директорию
WORKDIR /var/www/html

# Копируем файлы зависимостей PHP
COPY composer.json composer.lock ./

# Устанавливаем зависимости PHP
RUN composer install --optimize-autoloader --no-dev --no-scripts

# Копируем исходный код приложения
COPY . .

# Копируем собранные фронтенд ресурсы
COPY --from=frontend /app/public/build ./public/build

# Устанавливаем права доступа
RUN chown -R www:www /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Создаем конфигурацию supervisor
COPY docker/supervisor.conf /etc/supervisor/conf.d/supervisord.conf

# Создаем скрипт запуска
COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

USER www

EXPOSE 9000

CMD ["/usr/local/bin/start.sh"]
