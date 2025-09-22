<?php

use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserRoleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
// Controladores para las rutas
use App\Http\Controllers\UsuarioController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('usuarios', UsuarioController::class)->parameters([
        'usuarios' => 'usuario'
    ]);
    
    


});

// Los ENDPOINT de roles o de asignacion de roles solo los puede ver el superusuario
// Para que las paginas de roles y asignacion de roles estes siempre protegidas con ROL:SUPERUSUARIO
Route::middleware(['auth', 'verified', 'role:superusuario'])->group(function () {
    //Para roles
    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
    Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');
    Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create');
    //Permisos
    Route::get('usuarios/roles', [UserRoleController::class, 'index'])->name('usuarios.roles.index');
    Route::put('usuarios/{user}/roles', [UserRoleController::class, 'update'])->name('usuarios.roles.update');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
