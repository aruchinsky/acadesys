<?php

// ============================================================
// 🧹 COMANDOS ÚTILES DE MANTENIMIENTO
// ============================================================
// php artisan cache:clear
// php artisan permission:cache-reset
// php artisan route:clear
// php artisan optimize:clear


use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Controladores
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\InscripcionController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\AsistenciaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserRoleController;


// ============================================================
// 🌐 PÁGINA PRINCIPAL PÚBLICA
// ============================================================

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


// ============================================================
// 🔒 ÁREA AUTENTICADA
// ============================================================

Route::middleware(['auth', 'verified'])->group(function () {

    // --- Dashboard dinámico según rol ---
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');


    // ============================================================
    // 📘 MÓDULOS ACADÉMICOS
    // ============================================================

    // --- Cursos ---
    Route::resource('cursos', CursoController::class)
        ->parameters(['cursos' => 'curso'])
        ->except(['show'])
        ->middleware('role:superusuario|administrativo|profesor');

    // --- Inscripciones ---
    Route::resource('inscripciones', InscripcionController::class)
        ->parameters(['inscripciones' => 'inscripcion'])
        ->middleware('role:superusuario|administrativo|profesor|alumno');

    // --- Pagos ---
    Route::resource('pagos', PagoController::class)
        ->parameters(['pagos' => 'pago'])
        ->middleware('role:superusuario|administrativo|alumno');

    // --- Asistencias ---
    Route::resource('asistencias', AsistenciaController::class)
        ->parameters(['asistencias' => 'asistencia'])
        ->middleware('role:superusuario|administrativo|profesor|alumno');


    // ============================================================
    // 👩‍🏫 ÁREAS POR ROL (Dashboards y vistas específicas)
    // ============================================================

    // --- Alumnos ---
    Route::middleware('role:superusuario|alumno')->group(function () {
        Route::get('/mis-cursos', [InscripcionController::class, 'index'])
            ->name('alumno.cursos.index');
        Route::get('/mis-pagos', [PagoController::class, 'index'])
            ->name('alumno.pagos.index');
        Route::get('/mis-asistencias', [AsistenciaController::class, 'index'])
            ->name('alumno.asistencias.index');
    });

    // --- Profesores ---
    Route::middleware('role:superusuario|profesor')->group(function () {
        Route::get('/profesor/cursos', [CursoController::class, 'index'])
            ->name('profesor.cursos.index');
        Route::get('/profesor/asistencias', [AsistenciaController::class, 'index'])
            ->name('profesor.asistencias.index');
    });

    // --- Administrativos ---
    Route::middleware('role:superusuario|administrativo')->group(function () {
        Route::get('/administrativo/pagos', [PagoController::class, 'index'])
            ->name('administrativo.pagos.index');
        Route::get('/administrativo/inscripciones', [InscripcionController::class, 'index'])
            ->name('administrativo.inscripciones.index');
    });
});


// ============================================================
// ⚙️ ÁREA DE ADMINISTRACIÓN AVANZADA (solo adminsistema)
// ============================================================

Route::middleware(['auth', 'verified', 'role:superusuario'])->group(function () {

    // --- Gestión de Roles ---
    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
    Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');

    // --- Asignación de roles a usuarios ---
    Route::get('/usuarios/roles', [UserRoleController::class, 'index'])->name('usuarios.roles.index');
    Route::put('/usuarios/roles', [UserRoleController::class, 'update'])->name('usuarios.roles.update');

    // --- Gestión de Usuarios ---
    Route::resource('usuarios', UserController::class)
        ->parameters(['usuarios' => 'usuario']);
});


// ============================================================
// 🧭 CONFIGURACIONES Y AUTENTICACIÓN
// ============================================================

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
