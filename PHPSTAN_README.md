# PHPStan Quick Reference

## ✅ Настройка завершена

PHPStan настроен и готов к использованию:
- ✅ Уровень анализа: **6** (строгий, но практичный)
- ✅ Интеграция с **Larastan** для Laravel
- ✅ **Baseline** создан для существующих ошибок
- ✅ **VS Code задачи** настроены
- ✅ **Composer скрипты** добавлены

## 🚀 Команды

| Команда | Описание |
|---------|----------|
| `composer phpstan` | Полный анализ кода |
| `composer phpstan:clear` | Очистка кэша |
| `composer phpstan:baseline` | Обновление baseline |

## 📁 Анализируются

- `app/` - основной код
- `database/` - модели, фабрики, сидеры  
- `tests/` - тесты

**Исключения:** миграции, vendor

## 🎯 В VS Code

`Ctrl+Shift+P` → "Tasks: Run Task" → выбрать задачу PHPStan

## 📚 Документация

Подробная документация: [`PHPSTAN_GUIDE.md`](./PHPSTAN_GUIDE.md)
