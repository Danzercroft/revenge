<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CurrencyPair extends Model
{
    use HasFactory;

    protected $fillable = [
        'base_symbol_id',
        'quote_symbol_id',
        'type',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'display_name',
    ];

    /**
     * @return BelongsTo<\App\Models\Symbol, self>
     */
    public function baseSymbol(): BelongsTo
    {
        /** @var BelongsTo<\App\Models\Symbol, self> */
        return $this->belongsTo(Symbol::class, 'base_symbol_id');
    }

    /**
     * @return BelongsTo<\App\Models\Symbol, self>
     */
    public function quoteSymbol(): BelongsTo
    {
        /** @var BelongsTo<\App\Models\Symbol, self> */
        return $this->belongsTo(Symbol::class, 'quote_symbol_id');
    }


    public function getDisplayNameAttribute(): string
    {
        $baseName = $this->baseSymbol->symbol ?? '';
        $quoteName = $this->quoteSymbol->symbol ?? '';
        
        if ($this->type === 'futures') {
            return "{$baseName}/{$quoteName}:{$quoteName}";
        }
        
        return "{$baseName}/{$quoteName}";
    }

    /**
     * Scope для фильтрации активных валютных пар
     */
    /**
     * Scope для фильтрации активных валютных пар
     *
     * @param \Illuminate\Database\Eloquent\Builder<\App\Models\CurrencyPair> $query
     * @return \Illuminate\Database\Eloquent\Builder<\App\Models\CurrencyPair>
     */
    public function scopeActive(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where('is_active', true);
    }
}
