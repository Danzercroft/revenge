import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface TimePeriod {
    id: number;
    name: string;
    minutes: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    time_period: TimePeriod;
}

export default function Edit({ time_period }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: time_period.name,
        minutes: time_period.minutes.toString(),
        is_active: time_period.is_active,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('time-periods.update', time_period.id));
    };

    const breadcrumbs = [
        { title: 'Главная', href: route('dashboard') },
        { title: 'Периоды времени', href: route('time-periods.index') },
        { title: 'Редактировать', href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Редактировать период времени" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-semibold mb-6">Редактировать период времени</h1>

                            <form onSubmit={submit} className="space-y-6 max-w-md">
                                <div>
                                    <Label htmlFor="name">Название</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    {errors.name && (
                                        <div className="text-red-600 text-sm mt-1">{errors.name}</div>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="minutes">Минуты</Label>
                                    <Input
                                        id="minutes"
                                        type="number"
                                        value={data.minutes}
                                        onChange={(e) => setData('minutes', e.target.value)}
                                        className="mt-1 block w-full"
                                        min="1"
                                        required
                                    />
                                    {errors.minutes && (
                                        <div className="text-red-600 text-sm mt-1">{errors.minutes}</div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked === true)}
                                    />
                                    <Label htmlFor="is_active">Активен</Label>
                                    {errors.is_active && (
                                        <div className="text-red-600 text-sm">{errors.is_active}</div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Отмена
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Сохранение...' : 'Обновить период времени'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
