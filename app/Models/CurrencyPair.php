<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CurrencyPair extends Model
{
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

    public function baseSymbol(): BelongsTo
    {
        return $this->belongsTo(Symbol::class, 'base_symbol_id');
    }

    public function quoteSymbol(): BelongsTo
    {
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
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
