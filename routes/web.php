<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::get('config_cache', function () {
    \Artisan::call('config:cache');
    dd("config Cache is cleared");
});
Route::get('/migrate', function () {
    Artisan::call("migrate",array('--force' => true));
    dd("run migrate");
});
Route::get('cache_clear', function () {
    \Artisan::call('cache:clear');
    dd("Cache is cleared");
});
Route::get('optimize_clear', function () {
    \Artisan::call('optimize:clear');
    dd("optimize is cleared");
});
require __DIR__.'/auth.php';
