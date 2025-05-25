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
        title: 'Символы',
        href: '/symbols',
    },
    {
        title: 'Создать',
        href: '/symbols/create',
    },
]

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        symbol: '',
        description: '',
        is_active: true as boolean,
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('symbols.store'))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Создать символ" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <h1 className="text-2xl font-bold mb-6">Создать символ криптовалюты</h1>
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
                                <Label htmlFor="symbol">Символ</Label>
                                <Input
                                    id="symbol"
                                    type="text"
                                    className="mt-1"
                                    value={data.symbol}
                                    onChange={(e) => setData('symbol', e.target.value)}
                                    required
                                />
                                <InputError className="mt-2" message={errors.symbol} />
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="description">Описание</Label>
                                <textarea
                                    id="description"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                />
                                <InputError className="mt-2" message={errors.description} />
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
                                    href={route('symbols.index')}
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
