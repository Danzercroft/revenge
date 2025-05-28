<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CandleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'currency_pair' => 'nullable|string',
            'exchange' => 'nullable|string',
            'timeframe' => 'nullable|string',
            'from' => 'nullable|date',
            'to' => 'nullable|date|after_or_equal:from',
            'limit' => 'nullable|integer|min:1|max:1000',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'currency_pair.required' => 'Торговая пара обязательна',
            'currency_pair.exists' => 'Указанная торговая пара не найдена',
            'exchange.required' => 'Биржа обязательна',
            'exchange.exists' => 'Указанная биржа не найдена',
            'timeframe.required' => 'Тайм-фрейм обязателен',
            'timeframe.exists' => 'Указанный тайм-фрейм не поддерживается',
            'from.date' => 'Неверный формат даты начала',
            'to.date' => 'Неверный формат даты окончания',
            'to.after_or_equal' => 'Дата окончания должна быть больше или равна дате начала',
            'limit.integer' => 'Лимит должен быть числом',
            'limit.max' => 'Максимальный лимит: 1000',
        ];
    }
}
