<?php

// use App\Http\Controllers\ChatController;

use App\Http\Controllers\AuthenticateController;
use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });


// Route::get('/user', [ChatController::class, 'getChat']);
// Route::get('/user-two', [ChatController::class, 'getAnotherUser']);
// Route::post('chat-message', [ChatController::class, 'chatMessages'])->name("chatMessages");


Route::get('login', [AuthenticateController::class, 'login'])->name("login");
Route::get('register', [AuthenticateController::class, 'register'])->name("register");
Route::post('register', [AuthenticateController::class, 'postRegister'])->name("postRegister");
Route::post('checkLogin', [AuthenticateController::class, 'checkLogin'])->name("checkLogin");

Route::middleware(userLogin::class)->group(function () {
    Route::get('dashboard', [AuthenticateController::class, 'dashboard'])->name("dashboard");
    Route::post('get-chat-messages', [ChatController::class, 'getChatMessages'])->name('getChatMessages');
    Route::get('logout', [AuthenticateController::class, 'logout'])->name('logout');
});
