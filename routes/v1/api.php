<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\UserController;
use App\Http\Controllers\V1\ServiceController;
use App\Http\Controllers\V1\ReportController;
use App\Http\Controllers\V1\DashboardController;
use App\Http\Controllers\V1\CorporateController;


Route::prefix('report')->name('report.')->group(function () {
	Route::post('/area', [ReportController::class, 'getReportByArea'])->name('report-by-Area');
	Route::post('/allReport', [ReportController::class, 'allReport'])->name('allReport');
	Route::post('/getNearByReport', [ReportController::class, 'getNearByReport'])->name('getNearByReport');
	Route::post('/checkReport', [ReportController::class, 'checkReport'])->name('checkReport');
});

Route::prefix('crime')->name('crime.')->group(function () {
	Route::get('/', [ReportController::class, 'crimeIndex'])->name('index');
	Route::get('/{id}', [ReportController::class, 'crimeShow'])->name('show');
});

Route::get('/report', [ReportController::class, 'index'])->name('report');
Route::get('/burglary', [ReportController::class, 'burglary'])->name('burglary');
Route::get('/robbery', [ReportController::class, 'robbery'])->name('robbery');
// car
Route::get('/carMake', [ReportController::class, 'carMake'])->name('carMake');
Route::post('/getCarModel', [ReportController::class, 'getCarModel'])->name('getCarModel');
Route::get('/CarModel/{carMake}', [ReportController::class, 'CarModel'])->name('CarModel');
Route::get('/carColor', [ReportController::class, 'carColor'])->name('carColor');
// resend otp 
Route::post('/resendOtp', [DashboardController::class, 'resendOtp']);
Route::get('/corAdminList', [CorporateController::class, 'corAdminList'])->name('corAdminList');
Route::get('/corporateList', [CorporateController::class, 'corporateList'])->name('corporateList');
Route::post('/addCorUser', [CorporateController::class, 'addCorUser'])->name('addCorUser');

Route::group(['middleware' => 'jwt.verify'], function ($router) {
	Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
	Route::get('/getProfile', [DashboardController::class, 'getProfile']);
	Route::get('/removeAccount', [DashboardController::class, 'removeAccount']);
	Route::get('/listAddress', [DashboardController::class, 'listAddress']);
	Route::post('/updateAddress', [DashboardController::class, 'updateAddress']);
	Route::get('/deleteAddress/{id}', [DashboardController::class, 'deleteAddress']);
	Route::get('/notificationList', [DashboardController::class, 'notificationList'])->name('notificationList');
	Route::get('/readNotification', [DashboardController::class, 'readNotification'])->name('readNotification');
	Route::get('/reportList', [DashboardController::class, 'reportList'])->name('reportList');
	Route::get('/removeReport/{id}', [DashboardController::class, 'removeReport'])->name('removeReport');
	// corporate admin
	Route::post('/addCorAdmin', [CorporateController::class, 'addCorAdmin'])->name('addCorAdmin');
	Route::post('/switchToCorAdmin', [CorporateController::class, 'switchToCorAdmin'])->name('switchToCorAdmin');
	Route::post('/switchToCorUser', [CorporateController::class, 'switchToCorUser'])->name('switchToCorUser');
	Route::post('/verifyCorporate/{cor_id}', [CorporateController::class, 'verifyCorporate'])->name('verifyCorporate');
	// corporate user 
	Route::get('/corporateUserList/{cor_id}', [CorporateController::class, 'corporateUserList'])->name('corporateUserList');
	Route::get('/CorporateRequest/{cor_id}', [CorporateController::class, 'CorporateRequest'])->name('CorporateRequest');
	Route::post('/changeRequestStatus', [CorporateController::class, 'changeRequestStatus'])->name('changeRequestStatus');
	Route::post('/switchToCorUser', [CorporateController::class, 'switchToCorUser'])->name('switchToCorUser');

	Route::prefix('user')->name('user.')->group(function () {
		Route::get('/', [UserController::class, 'index'])->name('index');
		Route::post('/', [UserController::class, 'store'])->name('create');
		Route::put('/', [UserController::class, 'update'])->name('update');
		Route::post('/update', [UserController::class, 'updateUser'])->name('update-user');
		Route::delete('/{id}', [UserController::class, 'delete'])->name('delete');
		Route::post('/status', [UserController::class, 'changeStatus'])->name('status');
		Route::get('/auth', [UserController::class, 'showAuthUser'])->name('auth');
		Route::get('/{id}', [UserController::class, 'show'])->name('show');	
		Route::post('/addAddress', [UserController::class, 'addAddress'])->name('addAddress');
		Route::put('/update-address', [UserController::class, 'updateAddress'])->name('update-address');	
	});

	Route::prefix('report')->name('report.')->group(function () {
		Route::post('update/{id}', [ReportController::class, 'update'])->name('update');
		Route::post('/image-upload', [ReportController::class, 'image_upload'])->name('image-upload');
		Route::get('/my', [ReportController::class, 'getMyReport'])->name('my');
		Route::delete('/{id}', [ReportController::class, 'delete'])->name('delete');
		Route::post('/status', [ReportController::class, 'status'])->name('status');
		Route::get('/{id}', [ReportController::class, 'show'])->name('show');
		Route::post('/', [ReportController::class, 'store'])->name('store');
		Route::get('/get_note/{id}', [ReportController::class, 'get_note'])->name('get_note');
		Route::post('/add_not/{id}', [ReportController::class, 'add_not']);
	});

});

