<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ChartController extends Controller
{
    /**
     * Отобразить страницу графиков свечей
     */
    public function index(): Response
    {
        return Inertia::render('charts');
    }
}
