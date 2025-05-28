# PHPStan Configuration Guide

## Быстрый старт

1. **Запуск анализа**: `composer phpstan`
2. **VS Code**: Ctrl+Shift+P → "Tasks: Run Task" → "PHPStan: Анализ кода"
3. **Только app/**: `composer phpstan -- app --level=6`

## Обзор

PHPStan настроен для статического анализа PHP кода в Laravel проекте с использованием Larastan - расширения для Laravel.

## Файлы конфигурации

- `phpstan.neon` - основной конфигурационный файл
- `phpstan-baseline.neon` - baseline файл с текущими ошибками

## Доступные команды

### Composer скрипты

```bash
# Запуск анализа
composer phpstan

# Очистка кэша результатов
composer phpstan:clear

# Генерация нового baseline
composer phpstan:baseline
```

### Прямые команды

```bash
# Основной анализ
./vendor/bin/phpstan analyse --memory-limit=2G

# Анализ конкретной папки
./vendor/bin/phpstan analyse app --level=6

# Анализ с подробным выводом
./vendor/bin/phpstan analyse -v

# Генерация baseline
./vendor/bin/phpstan analyse --generate-baseline phpstan-baseline.neon

# Очистка кэша
./vendor/bin/phpstan clear-result-cache
```

## Настройки

### Текущий уровень: 6
- Уровни от 0 (самый мягкий) до 10 (самый строгий)
- Уровень 6 обеспечивает хороший баланс между строгостью и практичностью

### Анализируемые папки
- `app/` - основной код приложения
- `database/` - модели, миграции, фабрики, сидеры
- `tests/` - тесты

### Исключения
- `database/migrations/*.php` - миграции (автогенерируемый код)
- `vendor/*` - внешние зависимости

## Использование baseline

Baseline файл содержит текущие ошибки, которые не блокируют разработку. Новые ошибки будут выявляться при изменении кода.

### Обновление baseline

Когда исправлены существующие ошибки или добавлен новый код:

```bash
composer phpstan:baseline
```

## Интеграция с IDE

## VS Code интеграция

### Задачи (Tasks)
Доступны встроенные задачи:
- **PHPStan: Анализ кода** - полный анализ проекта
- **PHPStan: Анализ app/ (быстрый)** - только папка app/
- **PHPStan: Очистить кэш** - очистка кэша результатов
- **PHPStan: Генерировать baseline** - создание нового baseline

Запуск: `Ctrl+Shift+P` → "Tasks: Run Task"

### Расширения

Рекомендуемые расширения автоматически предлагаются при открытии проекта:
- **Intelephense** - PHP intellisense
- **PHPStan** - интеграция с анализатором
- **PHP Debug** - отладка PHP

### Интеграция с IDE

### VS Code

Установите расширение PHPStan для автоматической проверки:

```bash
code --install-extension swordev.phpstan
```

### PhpStorm

PHPStan поддерживается нативно через настройки Quality Tools.

## CI/CD интеграция

Добавьте в ваш CI pipeline:

```yaml
- name: Run PHPStan
  run: composer phpstan
```

## Рекомендации

1. **Регулярно запускайте анализ** перед коммитами
2. **Постепенно исправляйте ошибки** из baseline
3. **Повышайте уровень анализа** по мере улучшения типизации
4. **Добавляйте типы** к новому коду сразу

## Часто встречающиеся ошибки

### Missing return types
```php
// Плохо
public function index()

// Хорошо  
public function index(): \Inertia\Response
```

### Missing parameter types
```php
// Плохо
public function scopeActive($query)

// Хорошо
public function scopeActive(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
```

### Generic types for relationships
```php
// Плохо
public function user(): BelongsTo

// Хорошо
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}
```

## Полезные ссылки

- [PHPStan Documentation](https://phpstan.org/user-guide/getting-started)
- [Larastan Documentation](https://github.com/larastan/larastan)
- [Laravel Type Declarations](https://laravel.com/docs/eloquent-relationships#defining-relationships)
