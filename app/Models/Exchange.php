<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Exchange extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'environment',
        'api_key',
        'api_secret',
        'api_passphrase',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $hidden = [
        'api_key',
        'api_secret',
        'api_passphrase'
    ];

    /**
     * Accessor для маскировки API ключа в интерфейсе
     */
    /**
     * @return Attribute<string|null, never>
     */
    protected function apiKeyMasked(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->api_key ? '****' . substr($this->api_key, -4) : null,
        );
    }

    /**
     * Accessor для маскировки API секрета в интерфейсе
     */
    /**
     * @return Attribute<string|null, never>
     */
    protected function apiSecretMasked(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->api_secret ? '****' . substr($this->api_secret, -4) : null,
        );
    }

    /**
     * Accessor для маскировки API passphrase в интерфейсе
     */
    /**
     * @return Attribute<string|null, never>
     */
    protected function apiPassphraseMasked(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->api_passphrase ? '****' . substr($this->api_passphrase, -4) : null,
        );
    }

    /**
     * Scope для активных бирж
     */
    /**
     * @param \Illuminate\Database\Eloquent\Builder<\App\Models\Exchange> $query
     * @return \Illuminate\Database\Eloquent\Builder<\App\Models\Exchange>
     */
    public function scopeActive(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope для продакшн бирж
     *
     * @param \Illuminate\Database\Eloquent\Builder<\App\Models\Exchange> $query
     * @return \Illuminate\Database\Eloquent\Builder<\App\Models\Exchange>
     */
    public function scopeProduction(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where('environment', 'production');
    }

    /**
     * Scope для sandbox бирж
     *
     * @param \Illuminate\Database\Eloquent\Builder<\App\Models\Exchange> $query
     * @return \Illuminate\Database\Eloquent\Builder<\App\Models\Exchange>
     */
    public function scopeSandbox(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where('environment', 'sandbox');
    }
}
