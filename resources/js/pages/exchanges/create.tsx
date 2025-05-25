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
        title: 'Биржи',
        href: '/exchanges',
    },
    {
        title: 'Создать',
        href: '/exchanges/create',
    },
]

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        environment: 'sandbox' as 'sandbox' | 'production',
        api_key: '',
        api_secret: '',
        api_passphrase: '',
        is_active: true as boolean,
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('exchanges.store'))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Создать биржу" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <h1 className="text-2xl font-bold mb-6">Создать биржу</h1>
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-4">
                                <div>
                                    <Label htmlFor="name">Название биржи</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        className="mt-1"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Например: Binance"
                                        required
                                        autoFocus
                                    />
                                    <InputError className="mt-2" message={errors.name} />
                                </div>

                                <div>
                                    <Label htmlFor="code">Код биржи</Label>
                                    <Input
                                        id="code"
                                        type="text"
                                        className="mt-1"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        placeholder="Например: BINANCE"
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.code} />
                                </div>
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="environment">Окружение</Label>
                                <select
                                    id="environment"
                                    value={data.environment}
                                    onChange={(e) => setData('environment', e.target.value as 'sandbox' | 'production')}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                >
                                    <option value="sandbox">Песочница</option>
                                    <option value="production">Продакшн</option>
                                </select>
                                <InputError className="mt-2" message={errors.environment} />
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">API настройки</h3>
                                
                                <div className="mb-4">
                                    <Label htmlFor="api_key">API ключ</Label>
                                    <Input
                                        id="api_key"
                                        type="password"
                                        className="mt-1"
                                        value={data.api_key}
                                        onChange={(e) => setData('api_key', e.target.value)}
                                        placeholder="Введите API ключ"
                                    />
                                    <InputError className="mt-2" message={errors.api_key} />
                                </div>

                                <div className="mb-4">
                                    <Label htmlFor="api_secret">API секрет</Label>
                                    <Input
                                        id="api_secret"
                                        type="password"
                                        className="mt-1"
                                        value={data.api_secret}
                                        onChange={(e) => setData('api_secret', e.target.value)}
                                        placeholder="Введите API секрет"
                                    />
                                    <InputError className="mt-2" message={errors.api_secret} />
                                </div>

                                <div className="mb-4">
                                    <Label htmlFor="api_passphrase">API фраза (опционально)</Label>
                                    <Input
                                        id="api_passphrase"
                                        type="password"
                                        className="mt-1"
                                        value={data.api_passphrase}
                                        onChange={(e) => setData('api_passphrase', e.target.value)}
                                        placeholder="Введите passphrase (если требуется)"
                                    />
                                    <InputError className="mt-2" message={errors.api_passphrase} />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="flex items-center">
                                    <Checkbox
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked === true)}
                                    />
                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Активировать биржу</span>
                                </label>
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <Link
                                    href={route('exchanges.index')}
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
