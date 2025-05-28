-- Создание пользователя и базы данных для приложения
-- Этот файл выполняется при инициализации PostgreSQL контейнера

\echo 'Создание базы данных revenge...'

-- Создаем базу данных если она не существует
SELECT 'CREATE DATABASE revenge'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'revenge')\gexec

-- Предоставляем права пользователю
GRANT ALL PRIVILEGES ON DATABASE revenge TO revenge_user;

\echo 'База данных revenge готова!'
