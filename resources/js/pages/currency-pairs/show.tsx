import { Head, Link } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { type BreadcrumbItem } from '@/types'

interface Symbol {
    id: number
    name: string
    symbol: string
}

interface CurrencyPair {
    id: number
    base_symbol: Symbol
    quote_symbol: Symbol
    type: 'spot' | 'futures'
    display_name: string
    is_active: boolean
    created_at: string
    updated_at: string
}

interface Props {
    currencyPair: CurrencyPair
}

export default function Show({ currencyPair }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Валютные пары',
            href: '/currency-pairs',
        },
        {
            title: currencyPair.display_name,
            href: `/currency-pairs/${currencyPair.id}`,
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={currencyPair.display_name} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold">{currencyPair.display_name}</h1>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Детальная информация о валютной паре
                                </p>
                            </div>
                            <div className="flex space-x-4">
                                <Link href={route('currency-pairs.edit', currencyPair.id)}>
                                    <Button>Редактировать</Button>
                                </Link>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Основная информация */}
                            <div>
                                <h3 className="text-lg font-medium mb-4">Основная информация</h3>
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Отображаемое название
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-mono text-lg">
                                            {currencyPair.display_name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Тип торговли
                                        </dt>
                                        <dd className="mt-1">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                currencyPair.type === 'futures' 
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                            }`}>
                                                {currencyPair.type === 'futures' ? 'Фьючерсы' : 'Спот'}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Статус
                                        </dt>
                                        <dd className="mt-1">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                currencyPair.is_active 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                            }`}>
                                                {currencyPair.is_active ? 'Активна' : 'Неактивна'}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Дата создания
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {new Date(currencyPair.created_at).toLocaleString('ru-RU')}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Информация о валютах */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-medium mb-4">Составляющие валюты</h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    {/* Базовая валюта */}
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
                                            Базовая валюта
                                        </h4>
                                        <dl className="space-y-2">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Символ
                                                </dt>
                                                <dd className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                                                    {currencyPair.base_symbol.symbol}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Название
                                                </dt>
                                                <dd className="text-sm text-gray-900 dark:text-gray-100">
                                                    {currencyPair.base_symbol.name}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>

                                    {/* Котируемая валюта */}
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
                                            Котируемая валюта
                                        </h4>
                                        <dl className="space-y-2">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Символ
                                                </dt>
                                                <dd className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                                                    {currencyPair.quote_symbol.symbol}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Название
                                                </dt>
                                                <dd className="text-sm text-gray-900 dark:text-gray-100">
                                                    {currencyPair.quote_symbol.name}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            {/* Описание формата отображения */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                                Формат отображения
                                            </h3>
                                            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                                <p>
                                                    <strong>Спот:</strong> {currencyPair.base_symbol.symbol}/{currencyPair.quote_symbol.symbol}
                                                </p>
                                                <p>
                                                    <strong>Фьючерсы:</strong> {currencyPair.base_symbol.symbol}/{currencyPair.quote_symbol.symbol}:{currencyPair.quote_symbol.symbol}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Link
                                href={route('currency-pairs.index')}
                                className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                            >
                                ← Назад к списку
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
