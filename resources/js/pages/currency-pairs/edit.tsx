import { Head, Link, useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import AppLayout from '@/layouts/app-layout'
import InputError from '@/components/input-error'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { type BreadcrumbItem } from '@/types'

interface Symbol {
    id: number
    name: string
    symbol: string
}

interface CurrencyPair {
    id: number
    base_symbol_id: number
    quote_symbol_id: number
    type: 'spot' | 'futures'
    is_active: boolean
    baseSymbol: Symbol
    quoteSymbol: Symbol
}

interface Props {
    currencyPair: CurrencyPair
    symbols: Symbol[]
}

export default function Edit({ currencyPair, symbols }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Валютные пары',
            href: '/currency-pairs',
        },
        {
            title: 'Редактировать',
            href: `/currency-pairs/${currencyPair.id}/edit`,
        },
    ]

    const { data, setData, put, processing, errors } = useForm({
        base_symbol_id: currencyPair.base_symbol_id.toString(),
        quote_symbol_id: currencyPair.quote_symbol_id.toString(),
        type: currencyPair.type,
        is_active: currencyPair.is_active,
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        put(route('currency-pairs.update', currencyPair.id))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Редактировать валютную пару" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <h1 className="text-2xl font-bold mb-6">
                            Редактировать валютную пару: {currencyPair.baseSymbol.symbol}/{currencyPair.quoteSymbol.symbol}
                        </h1>
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-4">
                                <div>
                                    <Label htmlFor="base_symbol_id">Базовая валюта</Label>
                                    <select
                                        id="base_symbol_id"
                                        value={data.base_symbol_id}
                                        onChange={(e) => setData('base_symbol_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">Выберите базовую валюту</option>
                                        {symbols.map((symbol) => (
                                            <option key={symbol.id} value={symbol.id}>
                                                {symbol.symbol} - {symbol.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError className="mt-2" message={errors.base_symbol_id} />
                                </div>

                                <div>
                                    <Label htmlFor="quote_symbol_id">Котируемая валюта</Label>
                                    <select
                                        id="quote_symbol_id"
                                        value={data.quote_symbol_id}
                                        onChange={(e) => setData('quote_symbol_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">Выберите котируемую валюту</option>
                                        {symbols.map((symbol) => (
                                            <option 
                                                key={symbol.id} 
                                                value={symbol.id}
                                                disabled={symbol.id.toString() === data.base_symbol_id}
                                            >
                                                {symbol.symbol} - {symbol.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError className="mt-2" message={errors.quote_symbol_id} />
                                </div>
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="type">Тип торговли</Label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value as 'spot' | 'futures')}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="spot">Спот</option>
                                    <option value="futures">Фьючерсы</option>
                                </select>
                                <InputError className="mt-2" message={errors.type} />
                            </div>

                            {/* Предварительный просмотр */}
                            {data.base_symbol_id && data.quote_symbol_id && (
                                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                                    <Label>Предварительный просмотр</Label>
                                    <div className="mt-2 text-lg font-medium">
                                        {(() => {
                                            const baseSymbol = symbols.find(s => s.id.toString() === data.base_symbol_id)
                                            const quoteSymbol = symbols.find(s => s.id.toString() === data.quote_symbol_id)
                                            if (!baseSymbol || !quoteSymbol) return ''
                                            
                                            if (data.type === 'futures') {
                                                return `${baseSymbol.symbol}/${quoteSymbol.symbol}:${quoteSymbol.symbol}`
                                            }
                                            return `${baseSymbol.symbol}/${quoteSymbol.symbol}`
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
                                    href={route('currency-pairs.index')}
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
