import { Head, Link, router } from '@inertiajs/react'
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

interface PaginatedExchanges {
    data: Exchange[]
    links: Array<{
        url?: string
        label: string
        active: boolean
    }>
    prev_page_url?: string
    next_page_url?: string
}

interface Props {
    exchanges: PaginatedExchanges
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Биржи',
        href: '/exchanges',
    },
]

export default function Index({ exchanges }: Props) {
    const deleteExchange = (id: number) => {
        if (confirm('Вы уверены, что хотите удалить эту биржу?')) {
            router.delete(route('exchanges.destroy', id))
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Биржи" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Управление биржами</h3>
                                <Link
                                    href={route('exchanges.create')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                >
                                    Добавить биржу
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Название
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Код
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Окружение
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                API ключ
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Статус
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Действия
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {exchanges.data.map((exchange) => (
                                            <tr key={exchange.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {exchange.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                    {exchange.code}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        exchange.environment === 'production' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {exchange.environment === 'production' ? 'Продакшн' : 'Песочница'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-mono">
                                                    {exchange.api_key_masked || 'Не настроен'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={exchange.is_active 
                                                        ? 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800' 
                                                        : 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'}>
                                                        {exchange.is_active ? 'Активен' : 'Неактивен'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={route('exchanges.show', exchange.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        Просмотр
                                                    </Link>
                                                    <Link
                                                        href={route('exchanges.edit', exchange.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        Редактировать
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteExchange(exchange.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Удалить
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Пагинация */}
                            {exchanges.links && Array.isArray(exchanges.links) && (
                                <div className="mt-6">
                                    <nav className="flex items-center justify-between">
                                        <div className="flex justify-between flex-1 sm:hidden">
                                            {exchanges.prev_page_url && (
                                                <Link
                                                    href={exchanges.prev_page_url}
                                                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:text-gray-400"
                                                >
                                                    Предыдущая
                                                </Link>
                                            )}
                                            {exchanges.next_page_url && (
                                                <Link
                                                    href={exchanges.next_page_url}
                                                    className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:text-gray-400"
                                                >
                                                    Следующая
                                                </Link>
                                            )}
                                        </div>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
