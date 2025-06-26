import { Head, Link, router } from '@inertiajs/react'
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
    readonly currencyPairs: CurrencyPair[]
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Валютные пары',
        href: '/currency-pairs',
    },
]

export default function Index({ currencyPairs }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Вы уверены, что хотите удалить эту валютную пару?')) {
            router.delete(route('currency-pairs.destroy', id))
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Валютные пары" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">Валютные пары</h1>
                            <Link href={route('currency-pairs.create')}>
                                <Button>Создать валютную пару</Button>
                            </Link>
                        </div>

                        {currencyPairs.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <p>Валютные пары не найдены</p>
                                <Link href={route('currency-pairs.create')} className="mt-4 inline-block">
                                    <Button>Создать первую валютную пару</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Валютная пара
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Базовая валюта
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Котируемая валюта
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Тип
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
                                        {currencyPairs.map((pair) => (
                                            <tr key={pair.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {pair.display_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                        {pair.base_symbol.symbol} ({pair.base_symbol.name})
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                        {pair.quote_symbol.symbol} ({pair.quote_symbol.name})
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        pair.type === 'futures' 
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                                                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                    }`}>
                                                        {pair.type === 'futures' ? 'Фьючерсы' : 'Спот'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        pair.is_active 
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                    }`}>
                                                        {pair.is_active ? 'Активна' : 'Неактивна'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <Link
                                                        href={route('currency-pairs.show', pair.id)}
                                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                                                    >
                                                        Просмотр
                                                    </Link>
                                                    <Link
                                                        href={route('currency-pairs.edit', pair.id)}
                                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                                                    >
                                                        Редактировать
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(pair.id)}
                                                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                                    >
                                                        Удалить
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
