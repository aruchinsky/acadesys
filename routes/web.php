<?php

//SIEMPRE QUE SE MODIFIQUEN ROLES, PERMISOS O SEEDERS, EJECUTAR:
// php artisan cache:clear
// php artisan permission:cache-reset
// php artisan route:clear
// php artisan optimize:clear

use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserRoleController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
// Controladores para las rutas
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\InscripcionController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\AsistenciaController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    // Ruta para el dashboard, que redirige al controlador DashboardController
    // El controlador decide que vista cargar segun el rol del usuario
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('cursos', CursoController::class)->except(['show']);
    Route::resource('inscripciones', InscripcionController::class);
    Route::resource('pagos', PagoController::class);
    Route::resource('asistencias', AsistenciaController::class);

});

// Los ENDPOINT de roles o de asignacion de roles solo los puede ver el superusuario
// Para que las paginas de roles y asignacion de roles estes siempre protegidas con ROL:SUPERUSUARIO
// ============================================================
// ÁREA DE ADMINISTRACIÓN AVANZADA (solo adminsistema)
// ============================================================
Route::middleware(['auth', 'verified', 'role:superusuario|administrativo'])->group(function () {

    // --- Gestión de Roles ---
    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
    Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');

    // --- Asignación de roles a usuarios ---
    Route::get('/users/roles', [UserRoleController::class, 'index'])->name('users.roles.index');
    Route::put('/users/roles', [UserRoleController::class, 'update'])->name('users.roles.update');

    // --- Gestión de Usuarios (solo adminsistema) ---
    Route::resource('users', UserController::class);

});


// ============================================================
// CONFIGURACIONES Y AUTENTICACIÓN
// ============================================================
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
