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
    protected function apiKeyMasked(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->api_key ? '****' . substr($this->api_key, -4) : null,
        );
    }

    /**
     * Accessor для маскировки API секрета в интерфейсе
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
    protected function apiPassphraseMasked(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->api_passphrase ? '****' . substr($this->api_passphrase, -4) : null,
        );
    }

    /**
     * Scope для активных бирж
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope для продакшн бирж
     */
    public function scopeProduction($query)
    {
        return $query->where('environment', 'production');
    }

    /**
     * Scope для sandbox бирж
     */
    public function scopeSandbox($query)
    {
        return $query->where('environment', 'sandbox');
    }
}
