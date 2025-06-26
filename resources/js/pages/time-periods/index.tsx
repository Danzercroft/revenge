import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'

interface TimePeriod {
    id: number
    name: string
    minutes: number
    description?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

interface PaginatedTimePeriods {
    data: TimePeriod[]
    links: Array<{
        url?: string
        label: string
        active: boolean
    }>
    prev_page_url?: string
    next_page_url?: string
}

interface Props {
    readonly timePeriods: PaginatedTimePeriods
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Временные периоды',
        href: '/time-periods',
    },
]

export default function Index({ timePeriods }: Props) {
    const deleteTimePeriod = (id: number) => {
        if (confirm('Вы уверены, что хотите удалить этот временной период?')) {
            router.delete(route('time-periods.destroy', id))
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Временные периоды" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Справочник временных периодов</h3>
                                <Link
                                    href={route('time-periods.create')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                >
                                    Добавить период
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
                                                Значение
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Описание
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
                                        {timePeriods.data.map((timePeriod) => (
                                            <tr key={timePeriod.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {timePeriod.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                    {timePeriod.minutes}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">
                                                    {timePeriod.description}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={timePeriod.is_active 
                                                        ? 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800' 
                                                        : 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'}>
                                                        {timePeriod.is_active ? 'Активен' : 'Неактивен'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={route('time-periods.edit', timePeriod.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        Редактировать
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteTimePeriod(timePeriod.id)}
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
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
