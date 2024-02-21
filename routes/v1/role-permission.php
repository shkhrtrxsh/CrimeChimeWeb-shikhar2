<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\V1\RolePermission\RoleController;

Route::group(['middleware' => 'jwt.verify'], function ($router) {

	Route::prefix('role')->name('role.')->group(function () {
		Route::get('/', [RoleController::class, 'index'])->name('index');
		Route::post('/', [RoleController::class, 'store'])->name('create');
		Route::put('/', [RoleController::class, 'update'])->name('update');
		Route::delete('/{id}', [RoleController::class, 'delete'])->name('delete');
		Route::post('/status', [RoleController::class, 'changeStatus'])->name('status');
		Route::get('/{id}', [RoleController::class, 'show'])->name('show');
	});

});

