import { Head, Link } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'

interface Exchange {
    id: number
    name: string
    code: string
    environment: 'sandbox' | 'production'
    api_key_masked?: string
    api_secret_masked?: string
    api_passphrase_masked?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

interface Props {
    exchange: Exchange
}

function ExchangeShow({ exchange }: Readonly<Props>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Главная',
            href: '/'
        },
        {
            title: 'Биржи',
            href: '/exchanges'
        },
        {
            title: exchange.name,
            href: `/exchanges/${exchange.id}`
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={exchange.name} />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {exchange.name}
                        </h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Детальная информация о бирже
                        </p>
                    </div>
                    <div className="flex space-x-4">
                        <Link
                            href={`/exchanges/${exchange.id}/edit`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            Редактировать
                        </Link>
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            Основная информация
                        </h3>
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    Название
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {exchange.name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    Код
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {exchange.code}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    Окружение
                                </dt>
                                <dd className="mt-1">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        exchange.environment === 'production' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {exchange.environment === 'production' ? 'Продакшн' : 'Песочница'}
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    Статус
                                </dt>
                                <dd className="mt-1">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        exchange.is_active 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {exchange.is_active ? 'Активен' : 'Неактивен'}
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    Дата создания
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {new Date(exchange.created_at).toLocaleString('ru-RU')}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    Последнее обновление
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {new Date(exchange.updated_at).toLocaleString('ru-RU')}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            API настройки
                        </h3>
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    API ключ
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 font-mono">
                                    {exchange.api_key_masked ?? (
                                        <span className="text-gray-400 italic">Не настроен</span>
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    API секрет
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 font-mono">
                                    {exchange.api_secret_masked ?? (
                                        <span className="text-gray-400 italic">Не настроен</span>
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    API фраза
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 font-mono">
                                    {exchange.api_passphrase_masked ?? (
                                        <span className="text-gray-400 italic">Не настроена</span>
                                    )}
                                </dd>
                            </div>
                        </dl>
                        
                        {(!exchange.api_key_masked || !exchange.api_secret_masked) && (
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-yellow-800">
                                            Требуются API настройки
                                        </h3>
                                        <p className="mt-1 text-sm text-yellow-700">
                                            Для полноценной работы с биржей необходимо настроить API ключи.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between">
                    <Link
                        href="/exchanges"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        ← Назад к списку
                    </Link>
                </div>
            </div>
        </AppLayout>
    )
}

export default ExchangeShow
