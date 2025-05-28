import { Head, Link, useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import AppLayout from '@/layouts/app-layout'
import InputError from '@/components/input-error'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { type BreadcrumbItem } from '@/types'

interface TimePeriod {
    id: number
    name: string
    minutes: number
    is_active: boolean
    created_at: string
    updated_at: string
}

interface Props {
    timePeriod: TimePeriod
}

export default function Edit({ timePeriod }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Периоды времени',
            href: '/time-periods',
        },
        {
            title: 'Редактировать',
            href: `/time-periods/${timePeriod.id}/edit`,
        },
    ]

    const { data, setData, put, processing, errors } = useForm({
        name: timePeriod.name,
        minutes: timePeriod.minutes.toString(),
        is_active: timePeriod.is_active,
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        put(route('time-periods.update', timePeriod.id))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Редактировать период времени" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <h1 className="text-2xl font-bold mb-6">
                            Редактировать период времени: {timePeriod.name}
                        </h1>
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-4">
                                <div>
                                    <Label htmlFor="name">Название</Label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.name} />
                                </div>

                                <div>
                                    <Label htmlFor="minutes">Минуты</Label>
                                    <input
                                        id="minutes"
                                        type="number"
                                        value={data.minutes}
                                        onChange={(e) => setData('minutes', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        min="1"
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.minutes} />
                                </div>
                            </div>

                            {/* Предварительный просмотр */}
                            {data.name && data.minutes && (
                                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                                    <Label>Предварительный просмотр</Label>
                                    <div className="mt-2 text-lg font-medium">
                                        {data.name} ({data.minutes} мин.)
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="flex items-center">
                                    <Checkbox
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked === true)}
                                    />
                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Активен</span>
                                </label>
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <Link
                                    href={route('time-periods.index')}
                                    className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 mr-4"
                                >
                                    Отмена
                                </Link>

                                <Button className={processing ? 'opacity-25' : ''} disabled={processing}>
                                    Обновить
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
