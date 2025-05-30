<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimePeriod extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'minutes',
        'description',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Scope для фильтрации активных временных периодов
     */
    /**
     * @param \Illuminate\Database\Eloquent\Builder<\App\Models\TimePeriod> $query
     * @return \Illuminate\Database\Eloquent\Builder<\App\Models\TimePeriod>
     */
    public function scopeActive(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where('is_active', true);
    }
}
