<?php

namespace Tests\Feature;

use App\Models\Symbol;
use App\Models\TimePeriod;
use App\Models\Exchange;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ControllerTest extends TestCase
{
    use RefreshDatabase;

    private $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    #[Test]
    public function symbols_index_works()
    {
        Symbol::factory()->create(['name' => 'Bitcoin', 'symbol' => 'BTC']);
        Symbol::factory()->create(['name' => 'Ethereum', 'symbol' => 'ETH']);

        $response = $this->actingAs($this->user)->get('/symbols');

        $response->assertStatus(200);
        // Проверяем что вернулся правильный Inertia компонент
        $response->assertInertia(fn($page) => $page
            ->component('symbols/index')
            ->has('symbols.data', 2)
        );
    }

    #[Test]
    public function symbols_create_works()
    {
        $response = $this->actingAs($this->user)->get('/symbols/create');

        $response->assertStatus(200);
        // Проверяем что вернулся правильный Inertia компонент
        $response->assertInertia(fn($page) => $page
            ->component('symbols/create')
        );
    }

    #[Test]
    public function symbols_store_works()
    {
        $data = [
            'name' => 'Bitcoin',
            'symbol' => 'BTC',
            'description' => 'Digital currency',
            'is_active' => true
        ];

        $response = $this->actingAs($this->user)->post('/symbols', $data);

        $response->assertRedirect('/symbols');
        $this->assertDatabaseHas('symbols', $data);
    }

    #[Test]
    public function symbols_store_validation_fails()
    {
        $response = $this->actingAs($this->user)->post('/symbols', []);

        $response->assertSessionHasErrors(['name', 'symbol']);
    }

    #[Test]
    public function symbols_update_works()
    {
        $symbol = Symbol::factory()->create(['name' => 'Bitcoin', 'symbol' => 'BTC']);

        $updateData = [
            'name' => 'Bitcoin Updated',
            'symbol' => 'BTC',
            'description' => 'Updated description',
            'is_active' => false
        ];

        $response = $this->actingAs($this->user)->put("/symbols/{$symbol->id}", $updateData);

        $response->assertRedirect('/symbols');
        $this->assertDatabaseHas('symbols', $updateData);
    }

    #[Test]
    public function symbols_delete_works()
    {
        $symbol = Symbol::factory()->create(['name' => 'Bitcoin', 'symbol' => 'BTC']);

        $response = $this->actingAs($this->user)->delete("/symbols/{$symbol->id}");

        $response->assertRedirect('/symbols');
        $this->assertDatabaseMissing('symbols', ['id' => $symbol->id]);
    }

    #[Test]
    public function time_periods_index_works()
    {
        TimePeriod::factory()->create(['name' => '1 минута', 'minutes' => 1]);
        TimePeriod::factory()->create(['name' => '5 минут', 'minutes' => 5]);

        $response = $this->actingAs($this->user)->get('/time-periods');

        $response->assertStatus(200);
        // Проверяем что вернулся правильный Inertia компонент
        $response->assertInertia(fn($page) => $page
            ->component('time-periods/index')
            ->has('timePeriods.data', 2)
        );
    }

    #[Test]
    public function time_periods_store_works()
    {
        $data = [
            'name' => '15 минут',
            'minutes' => 15,
            'description' => 'Fifteen minute period',
            'is_active' => true
        ];

        $response = $this->actingAs($this->user)->post('/time-periods', $data);

        $response->assertRedirect('/time-periods');
        $this->assertDatabaseHas('time_periods', $data);
    }

    #[Test]
    public function time_periods_store_validation_fails()
    {
        $response = $this->actingAs($this->user)->post('/time-periods', []);

        $response->assertSessionHasErrors(['name', 'minutes']);
    }

    #[Test]
    public function time_periods_update_works()
    {
        $timePeriod = TimePeriod::factory()->create(['name' => '1 минута', 'minutes' => 1]);

        $updateData = [
            'name' => '2 минуты',
            'minutes' => 2,
            'description' => 'Updated description',
            'is_active' => false
        ];

        $response = $this->actingAs($this->user)->put("/time-periods/{$timePeriod->id}", $updateData);

        $response->assertRedirect('/time-periods');
        $this->assertDatabaseHas('time_periods', $updateData);
    }

    #[Test]
    public function time_periods_delete_works()
    {
        $timePeriod = TimePeriod::factory()->create(['name' => '1 минута', 'minutes' => 1]);

        $response = $this->actingAs($this->user)->delete("/time-periods/{$timePeriod->id}");

        $response->assertRedirect('/time-periods');
        $this->assertDatabaseMissing('time_periods', ['id' => $timePeriod->id]);
    }

    // ===============================
    // EXCHANGE TESTS
    // ===============================

    #[Test]
    public function exchanges_index_works()
    {
        Exchange::factory()->create(['name' => 'Binance', 'code' => 'BINANCE', 'environment' => 'production']);
        Exchange::factory()->create(['name' => 'Bybit', 'code' => 'BYBIT', 'environment' => 'sandbox']);

        $response = $this->actingAs($this->user)->get('/exchanges');

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page
            ->component('exchanges/index')
            ->has('exchanges.data', 2)
        );
    }

    #[Test]
    public function exchanges_create_works()
    {
        $response = $this->actingAs($this->user)->get('/exchanges/create');

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page
            ->component('exchanges/create')
        );
    }

    #[Test]
    public function exchanges_store_works()
    {
        $exchangeData = [
            'name' => 'Test Exchange',
            'code' => 'TEST',
            'environment' => 'sandbox',
            'api_key' => 'test_api_key',
            'api_secret' => 'test_api_secret',
            'api_passphrase' => 'test_passphrase',
            'is_active' => true
        ];

        $response = $this->actingAs($this->user)->post('/exchanges', $exchangeData);

        $response->assertRedirect('/exchanges');
        $this->assertDatabaseHas('exchanges', [
            'name' => 'Test Exchange',
            'code' => 'TEST',
            'environment' => 'sandbox',
            'api_key' => 'test_api_key',
            'api_secret' => 'test_api_secret',
            'api_passphrase' => 'test_passphrase',
            'is_active' => true
        ]);
    }

    #[Test]
    public function exchanges_store_validation_fails()
    {
        $response = $this->actingAs($this->user)->post('/exchanges', []);

        $response->assertSessionHasErrors(['name', 'code', 'environment']);
    }

    #[Test]
    public function exchanges_code_must_be_unique()
    {
        Exchange::factory()->create(['code' => 'BINANCE', 'environment' => 'production']);

        $duplicateData = [
            'name' => 'Another Binance',
            'code' => 'BINANCE',
            'environment' => 'sandbox',
            'is_active' => true
        ];

        $response = $this->actingAs($this->user)->post('/exchanges', $duplicateData);

        $response->assertSessionHasErrors(['code']);
    }

    #[Test]
    public function exchanges_show_works()
    {
        $exchange = Exchange::factory()->create(['name' => 'Binance', 'code' => 'BINANCE', 'environment' => 'production']);

        $response = $this->actingAs($this->user)->get("/exchanges/{$exchange->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page
            ->component('exchanges/show')
            ->has('exchange')
        );
    }

    #[Test]
    public function exchanges_edit_works()
    {
        $exchange = Exchange::factory()->create(['name' => 'Binance', 'code' => 'BINANCE', 'environment' => 'production']);

        $response = $this->actingAs($this->user)->get("/exchanges/{$exchange->id}/edit");

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page
            ->component('exchanges/edit')
            ->has('exchange')
        );
    }

    #[Test]
    public function exchanges_update_works()
    {
        $exchange = Exchange::factory()->create(['name' => 'Old Name', 'code' => 'OLD', 'environment' => 'sandbox']);

        $updateData = [
            'name' => 'New Exchange Name',
            'code' => 'NEW',
            'environment' => 'production',
            'is_active' => false
        ];

        $response = $this->actingAs($this->user)->put("/exchanges/{$exchange->id}", $updateData);

        $response->assertRedirect('/exchanges');
        $this->assertDatabaseHas('exchanges', $updateData);
    }

    #[Test]
    public function exchanges_update_preserves_api_keys_when_empty()
    {
        $exchange = Exchange::factory()->create([
            'name' => 'Test Exchange',
            'code' => 'TEST',
            'environment' => 'sandbox',
            'api_key' => 'original_key',
            'api_secret' => 'original_secret',
            'api_passphrase' => 'original_passphrase'
        ]);

        $updateData = [
            'name' => 'Updated Exchange',
            'code' => $exchange->code,
            'environment' => $exchange->environment,
            'api_key' => '',
            'api_secret' => '',
            'api_passphrase' => '',
            'is_active' => true
        ];

        $response = $this->actingAs($this->user)->put("/exchanges/{$exchange->id}", $updateData);

        $response->assertRedirect('/exchanges');
        
        $exchange->refresh();
        $this->assertEquals('original_key', $exchange->api_key);
        $this->assertEquals('original_secret', $exchange->api_secret);
        $this->assertEquals('original_passphrase', $exchange->api_passphrase);
        $this->assertEquals('Updated Exchange', $exchange->name);
    }

    #[Test]
    public function exchanges_delete_works()
    {
        $exchange = Exchange::factory()->create(['name' => 'Test Exchange', 'code' => 'TEST', 'environment' => 'sandbox']);

        $response = $this->actingAs($this->user)->delete("/exchanges/{$exchange->id}");

        $response->assertRedirect('/exchanges');
        $this->assertDatabaseMissing('exchanges', ['id' => $exchange->id]);
    }
}
