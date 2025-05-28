import React, { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
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

interface CreateProps {
    exchanges: Exchange[];
    timePeriods: TimePeriod[];
    currencyPairs: CurrencyPair[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Конфигурации бирж',
        href: '/exchange-configurations',
    },
    {
        title: 'Создать',
        href: '/exchange-configurations/create',
    },
];

export default function Create({ exchanges, timePeriods, currencyPairs }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm<{
        exchange_id: string;
        currency_pair_id: string;
        time_period_id: string;
        is_active: boolean;
    }>({
        exchange_id: '',
        currency_pair_id: '',
        time_period_id: '',
        is_active: true,
    });

    const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null);
    const [selectedCurrencyPair, setSelectedCurrencyPair] = useState<CurrencyPair | null>(null);
    const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('exchange-configurations.store'));
    };

    React.useEffect(() => {
        if (data.exchange_id) {
            const exchange = exchanges.find(e => e.id.toString() === data.exchange_id);
            setSelectedExchange(exchange || null);
        } else {
            setSelectedExchange(null);
        }
        
        if (data.currency_pair_id) {
            const currencyPair = currencyPairs.find(cp => cp.id.toString() === data.currency_pair_id);
            setSelectedCurrencyPair(currencyPair || null);
        } else {
            setSelectedCurrencyPair(null);
        }
        
        if (data.time_period_id) {
            const timePeriod = timePeriods.find(tp => tp.id.toString() === data.time_period_id);
            setSelectedTimePeriod(timePeriod || null);
        } else {
            setSelectedTimePeriod(null);
        }
    }, [data.exchange_id, data.currency_pair_id, data.time_period_id, exchanges, timePeriods, currencyPairs]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Создать конфигурацию биржи" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Создать конфигурацию биржи</h3>
                                <Link
                                    href={route('exchange-configurations.index')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-300 dark:bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-gray-700 dark:text-gray-200 uppercase tracking-widest hover:bg-gray-400 dark:hover:bg-gray-500 focus:bg-gray-400 dark:focus:bg-gray-500 active:bg-gray-500 dark:active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                >
                                    ← Назад к списку
                                </Link>
                            </div>

                            <form onSubmit={submit}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Основная форма */}
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                                                Параметры конфигурации
                                            </h4>
                                            
                                            {/* Выбор биржи */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Биржа
                                                </label>
                                                <select
                                                    value={data.exchange_id}
                                                    onChange={(e) => setData('exchange_id', e.target.value)}
                                                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                >
                                                    <option value="">Выберите биржу</option>
                                                    {exchanges.map((exchange) => (
                                                        <option key={exchange.id} value={exchange.id.toString()}>
                                                            {exchange.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.exchange_id && (
                                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.exchange_id}</p>
                                                )}
                                            </div>

                                            {/* Выбор валютной пары */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Валютная пара
                                                </label>
                                                <select
                                                    value={data.currency_pair_id}
                                                    onChange={(e) => setData('currency_pair_id', e.target.value)}
                                                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                >
                                                    <option value="">Выберите валютную пару</option>
                                                    {currencyPairs.map((pair) => (
                                                        <option key={pair.id} value={pair.id.toString()}>
                                                            {pair.display_name} ({pair.type === 'spot' ? 'Спот' : 'Фьючерс'})
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.currency_pair_id && (
                                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.currency_pair_id}</p>
                                                )}
                                            </div>

                                            {/* Выбор временного интервала */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Временной интервал
                                                </label>
                                                <select
                                                    value={data.time_period_id}
                                                    onChange={(e) => setData('time_period_id', e.target.value)}
                                                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                >
                                                    <option value="">Выберите временной интервал</option>
                                                    {timePeriods.map((period) => (
                                                        <option key={period.id} value={period.id.toString()}>
                                                            {period.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.time_period_id && (
                                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.time_period_id}</p>
                                                )}
                                            </div>

                                            {/* Активность */}
                                            <div className="mb-4">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.is_active}
                                                        onChange={(e) => setData('is_active', e.target.checked)}
                                                        className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                                        Активная конфигурация
                                                    </span>
                                                </label>
                                                {errors.is_active && (
                                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.is_active}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Кнопки действий */}
                                        <div className="flex gap-4">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className={`inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 ${processing ? 'opacity-25' : ''}`}
                                            >
                                                {processing ? 'Сохранение...' : 'Сохранить конфигурацию'}
                                            </button>
                                            <Link
                                                href={route('exchange-configurations.index')}
                                                className="inline-flex items-center px-4 py-2 bg-gray-300 dark:bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-gray-700 dark:text-gray-200 uppercase tracking-widest hover:bg-gray-400 dark:hover:bg-gray-500 focus:bg-gray-400 dark:focus:bg-gray-500 active:bg-gray-500 dark:active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                            >
                                                Отмена
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Предварительный просмотр */}
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                                                Предварительный просмотр
                                            </h4>
                                            
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div>
                                                        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Биржа</span>
                                                        <span className="text-sm text-gray-900 dark:text-gray-100">
                                                            {selectedExchange?.name || 'Не выбрана'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Валютная пара</span>
                                                        <span className="text-sm text-gray-900 dark:text-gray-100">
                                                            {selectedCurrencyPair?.display_name || 'Не выбрана'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Тип</span>
                                                        <span className="text-sm text-gray-900 dark:text-gray-100">
                                                            {selectedCurrencyPair?.type === 'spot' ? 'Спот' : 
                                                             selectedCurrencyPair?.type === 'futures' ? 'Фьючерс' : 'Не выбран'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Временной интервал</span>
                                                        <span className="text-sm text-gray-900 dark:text-gray-100">
                                                            {selectedTimePeriod?.name || 'Не выбран'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Статус</span>
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            data.is_active 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {data.is_active ? 'Активна' : 'Неактивна'}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {selectedExchange && selectedCurrencyPair && selectedTimePeriod && (
                                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                                        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                            Результирующая конфигурация
                                                        </span>
                                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                                                            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                                {selectedExchange.name} - {selectedCurrencyPair.display_name} - {selectedTimePeriod.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
