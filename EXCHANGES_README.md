# Управление биржами

## Обзор

Реализована полная функциональность управления биржами в Laravel + React приложении.

## Структура базы данных

### Таблица `exchanges`
- `id` - первичный ключ
- `name` - название биржи (обязательное)
- `code` - уникальный код биржи (обязательное, максимум 10 символов)
- `environment` - окружение: "sandbox" или "production" (обязательное)
- `api_key` - API ключ (необязательное)
- `api_secret` - API секрет (необязательное) 
- `api_passphrase` - API пароль/фраза (необязательное)
- `is_active` - статус активности (boolean, по умолчанию true)
- `created_at`, `updated_at` - временные метки

## Backend

### Модель Exchange
- **Fillable поля**: name, code, environment, api_key, api_secret, api_passphrase, is_active
- **Hidden поля**: api_key, api_secret, api_passphrase (скрыты в JSON)
- **Accessors**: 
  - `api_key_masked` - маскированный API ключ (****xxxx)
  - `api_secret_masked` - маскированный API секрет (****xxxx)  
  - `api_passphrase_masked` - маскированная API фраза (****xxxx)
- **Scopes**:
  - `active()` - активные биржи
  - `production()` - продакшн биржи
  - `sandbox()` - sandbox биржи

### Контроллер ExchangeController
- **index()** - список бирж с пагинацией
- **create()** - форма создания
- **store()** - сохранение новой биржи
- **show()** - просмотр биржи
- **edit()** - форма редактирования
- **update()** - обновление биржи (сохраняет существующие API ключи при пустых значениях)
- **destroy()** - удаление биржи

### Валидация
- **name**: обязательное, строка, максимум 255 символов
- **code**: обязательное, строка, максимум 10 символов, уникальное
- **environment**: обязательное, только "sandbox" или "production"
- **api_key**: необязательное, строка, максимум 255 символов
- **api_secret**: необязательное, строка, максимум 255 символов
- **api_passphrase**: необязательное, строка, максимум 255 символов
- **is_active**: boolean

### Маршруты
```php
Route::resource('exchanges', ExchangeController::class);
```

### Seeder
Создает 5 тестовых записей с популярными биржами:
- Binance (Production & Sandbox)
- Bybit (Production)
- OKX (Production)
- Coinbase (Sandbox)
- Kraken (Production)

## Frontend

### React компоненты
- **exchanges/index.tsx** - список бирж с пагинацией
- **exchanges/create.tsx** - форма создания биржи
- **exchanges/edit.tsx** - форма редактирования биржи  
- **exchanges/show.tsx** - просмотр деталей биржи

### Навигация
Добавлен пункт "Биржи" в главное меню с иконкой TrendingUp.

### Функции
- Просмотр списка бирж
- Создание новой биржи
- Редактирование существующих бирж
- Просмотр деталей биржи
- Удаление биржи
- Поддержка пагинации
- Отображение маскированных API ключей в интерфейсе

## Тестирование

### Feature тесты (10 тестов, 65 assertions)
1. **exchanges_index_works** - тестирует список бирж
2. **exchanges_create_works** - тестирует форму создания
3. **exchanges_store_works** - тестирует создание биржи
4. **exchanges_store_validation_fails** - тестирует валидацию при создании
5. **exchanges_code_must_be_unique** - тестирует уникальность кода
6. **exchanges_show_works** - тестирует просмотр биржи
7. **exchanges_edit_works** - тестирует форму редактирования
8. **exchanges_update_works** - тестирует обновление биржи
9. **exchanges_update_preserves_api_keys_when_empty** - тестирует сохранение API ключей
10. **exchanges_delete_works** - тестирует удаление биржи

Все тесты проходят успешно.

## Использование

### Доступ к функциональности
1. Перейти в раздел "Биржи" в главном меню
2. Просмотреть список существующих бирж
3. Создать новую биржу через кнопку "Добавить"
4. Редактировать существующие биржи
5. Просматривать детали бирж
6. Удалять ненужные биржи

### API интеграция
Модель предоставляет методы для:
- Получения активных бирж: `Exchange::active()->get()`
- Получения продакшн бирж: `Exchange::production()->get()`
- Получения sandbox бирж: `Exchange::sandbox()->get()`
- Безопасного отображения API данных через accessors
