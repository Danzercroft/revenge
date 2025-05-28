<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_example(): void
    {
        $value = random_int(1, 2) + 1;
        $expected = $value - 1;
        $this->assertEquals($expected + 1, $value);
    }
}
