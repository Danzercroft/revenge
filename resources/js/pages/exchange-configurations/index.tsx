import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Exchange {
    id: number;
    name: string;
}

interface TimePeriod {
    id: number;
    name: string;
}

interface Symbol {
    id: number;
    symbol: string;
}

interface CurrencyPair {
    id: number;
    display_name: string;
    type: 'spot' | 'futures';
    base_symbol: Symbol;
    quote_symbol: Symbol;
}

interface ExchangeConfiguration {
    id: number;
    is_active: boolean;
    display_name: string;
    exchange: Exchange;
    currency_pair: CurrencyPair;
    time_period: TimePeriod;
    additional_config: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData {
    data: ExchangeConfiguration[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    path: string;
}

interface IndexProps {
    configurations: PaginatedData;
    exchanges: Exchange[];
    timePeriods: TimePeriod[];
    filters: {
        exchange_id?: string;
        time_period_id?: string;
        is_active?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Конфигурации бирж',
        href: '/exchange-configurations',
    },
];

export default function Index({ configurations, exchanges, timePeriods, filters }: Readonly<IndexProps>) {
    const [filterValues, setFilterValues] = useState({
        exchange_id: filters.exchange_id ?? 'all',
        time_period_id: filters.time_period_id ?? 'all',
        is_active: filters.is_active ?? 'all',
    });

    const handleFilter = () => {
        const params = Object.entries(filterValues)
            .filter(([, value]) => value !== 'all')
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
        
        router.get(route('exchange-configurations.index'), params, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setFilterValues({
            exchange_id: 'all',
            time_period_id: 'all',
            is_active: 'all',
        });
        router.get(route('exchange-configurations.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const hasFilters = Object.values(filterValues).some(value => value !== 'all');

    const handleDelete = (id: number) => {
        if (confirm('Вы уверены, что хотите удалить эту конфигурацию?')) {
            router.delete(route('exchange-configurations.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Конфигурации бирж" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Управление конфигурациями бирж</h3>
                                <Link
                                    href={route('exchange-configurations.create')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                >
                                    Добавить конфигурацию
                                </Link>
                            </div>

                            {/* Фильтры */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Фильтры</h4>
                                    {hasFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            Очистить фильтры
                                        </button>
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label htmlFor="filter-exchange" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Биржа
                                        </label>
                                        <select
                                            id="filter-exchange"
                                            value={filterValues.exchange_id}
                                            onChange={(e) => setFilterValues(prev => ({ ...prev, exchange_id: e.target.value }))}
                                            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="all">Все биржи</option>
                                            {exchanges.map((exchange) => (
                                                <option key={exchange.id} value={exchange.id.toString()}>
                                                    {exchange.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="filter-time-period" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Временной интервал
                                        </label>
                                        <select
                                            id="filter-time-period"
                                            value={filterValues.time_period_id}
                                            onChange={(e) => setFilterValues(prev => ({ ...prev, time_period_id: e.target.value }))}
                                            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="all">Все интервалы</option>
                                            {timePeriods.map((period) => (
                                                <option key={period.id} value={period.id.toString()}>
                                                    {period.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Статус
                                        </label>
                                        <select
                                            id="filter-status"
                                            value={filterValues.is_active}
                                            onChange={(e) => setFilterValues(prev => ({ ...prev, is_active: e.target.value }))}
                                            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="all">Все статусы</option>
                                            <option value="1">Активные</option>
                                            <option value="0">Неактивные</option>
                                        </select>
                                    </div>

                                    <div className="flex items-end">
                                        <button
                                            onClick={handleFilter}
                                            className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                        >
                                            Применить фильтры
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Биржа
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Валютная пара
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Тип
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Временной интервал
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Статус
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Создано
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Действия
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {configurations.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                                    Конфигурации не найдены
                                                </td>
                                            </tr>
                                        ) : (
                                            configurations.data.map((config) => (
                                                <tr key={config.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {config.exchange.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                        {config.currency_pair.display_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            config.currency_pair.type === 'spot' 
                                                                ? 'bg-blue-100 text-blue-800' 
                                                                : 'bg-purple-100 text-purple-800'
                                                        }`}>
                                                            {config.currency_pair.type === 'spot' ? 'Спот' : 'Фьючерс'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                        {config.time_period.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={config.is_active 
                                                            ? 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800' 
                                                            : 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'}>
                                                            {config.is_active ? 'Активна' : 'Неактивна'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                        {new Date(config.created_at).toLocaleDateString('ru-RU')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link
                                                            href={route('exchange-configurations.show', config.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                        >
                                                            Просмотр
                                                        </Link>
                                                        <Link
                                                            href={route('exchange-configurations.edit', config.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                        >
                                                            Редактировать
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(config.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Удалить
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Пагинация */}
                            {configurations.last_page > 1 && (
                                <div className="mt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Показано {configurations.from}-{configurations.to} из {configurations.total} результатов
                                        </div>
                                        <nav className="flex gap-2">
                                            {configurations.links.map((link: PaginationLink) => (
                                                <button
                                                    key={`${link.label}-${link.url ?? ''}`}
                                                    onClick={() => link.url && router.visit(link.url)}
                                                    disabled={!link.url}
                                                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                        link.active
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    } ${
                                                        !link.url ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
