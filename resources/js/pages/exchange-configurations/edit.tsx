import { Head, Link, useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import AppLayout from '@/layouts/app-layout'
import InputError from '@/components/input-error'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { type BreadcrumbItem } from '@/types'

interface Exchange {
    id: number
    name: string
}

interface TimePeriod {
    id: number
    name: string
}

interface Symbol {
    id: number
    symbol: string
}

interface CurrencyPair {
    id: number
    display_name: string
    type: 'spot' | 'futures'
    base_symbol: Symbol
    quote_symbol: Symbol
}

interface ExchangeConfiguration {
    id: number
    exchange_id: number
    currency_pair_id: number
    time_period_id: number
    is_active: boolean
    exchange: Exchange
    currency_pair: CurrencyPair
    time_period: TimePeriod
}

interface Props {
    configuration: ExchangeConfiguration
    exchanges: Exchange[]
    currencyPairs: CurrencyPair[]
    timePeriods: TimePeriod[]
}

export default function Edit({ configuration, exchanges, currencyPairs, timePeriods }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Конфигурации бирж',
            href: '/exchange-configurations',
        },
        {
            title: 'Редактировать',
            href: `/exchange-configurations/${configuration.id}/edit`,
        },
    ]

    const { data, setData, put, processing, errors } = useForm({
        exchange_id: configuration.exchange_id.toString(),
        currency_pair_id: configuration.currency_pair_id.toString(),
        time_period_id: configuration.time_period_id.toString(),
        is_active: configuration.is_active,
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        put(route('exchange-configurations.update', configuration.id))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Редактировать конфигурацию биржи" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <h1 className="text-2xl font-bold mb-6">
                            Редактировать конфигурацию биржи #{configuration.id}
                        </h1>
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-4">
                                <div>
                                    <Label htmlFor="exchange_id">Биржа</Label>
                                    <select
                                        id="exchange_id"
                                        value={data.exchange_id}
                                        onChange={(e) => setData('exchange_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">Выберите биржу</option>
                                        {exchanges.map((exchange) => (
                                            <option key={exchange.id} value={exchange.id}>
                                                {exchange.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError className="mt-2" message={errors.exchange_id} />
                                </div>

                                <div>
                                    <Label htmlFor="currency_pair_id">Валютная пара</Label>
                                    <select
                                        id="currency_pair_id"
                                        value={data.currency_pair_id}
                                        onChange={(e) => setData('currency_pair_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">Выберите валютную пару</option>
                                        {currencyPairs.map((pair) => (
                                            <option key={pair.id} value={pair.id}>
                                                {pair.display_name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError className="mt-2" message={errors.currency_pair_id} />
                                </div>
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="time_period_id">Временной период</Label>
                                <select
                                    id="time_period_id"
                                    value={data.time_period_id}
                                    onChange={(e) => setData('time_period_id', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="">Выберите временной период</option>
                                    {timePeriods.map((period) => (
                                        <option key={period.id} value={period.id}>
                                            {period.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError className="mt-2" message={errors.time_period_id} />
                            </div>

                            {/* Предварительный просмотр */}
                            {data.exchange_id && data.currency_pair_id && data.time_period_id && (
                                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                                    <Label>Предварительный просмотр</Label>
                                    <div className="mt-2 text-lg font-medium">
                                        {(() => {
                                            const exchange = exchanges.find(e => e.id.toString() === data.exchange_id)
                                            const currencyPair = currencyPairs.find(cp => cp.id.toString() === data.currency_pair_id)
                                            const timePeriod = timePeriods.find(tp => tp.id.toString() === data.time_period_id)
                                            if (!exchange || !currencyPair || !timePeriod) return ''
                                            
                                            return `${exchange.name} - ${currencyPair.display_name} - ${timePeriod.name}`
                                        })()}
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="flex items-center">
                                    <Checkbox
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked === true)}
                                    />
                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Активна</span>
                                </label>
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <Link
                                    href={route('exchange-configurations.index')}
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
