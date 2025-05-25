import { Head, Link, useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import AppLayout from '@/layouts/app-layout'
import InputError from '@/components/input-error'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Временные периоды',
        href: '/time-periods',
    },
    {
        title: 'Создать',
        href: '/time-periods/create',
    },
]

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        minutes: '',
        is_active: true as boolean,
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('time-periods.store'))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Создать временной период" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <h1 className="text-2xl font-bold mb-6">Создать временной период</h1>
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <Label htmlFor="name">Название</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    className="mt-1"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoFocus
                                />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="minutes">Минуты</Label>
                                <Input
                                    id="minutes"
                                    type="number"
                                    className="mt-1"
                                    value={data.minutes}
                                    onChange={(e) => setData('minutes', e.target.value)}
                                    required
                                    min="1"
                                    placeholder="Введите количество минут"
                                />
                                <InputError className="mt-2" message={errors.minutes} />
                            </div>

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
                                    Создать
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
