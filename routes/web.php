<?php

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
// PÁGINA PRINCIPAL PÚBLICA
// ============================================================

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// ============================================================
// ÁREA AUTENTICADA
// ============================================================

Route::middleware(['auth', 'verified'])->group(function () {

    // --- Dashboard dinámico según rol ---
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // ============================================================
    // MÓDULOS ACADÉMICOS (ADMINISTRATIVOS / SUPERUSUARIO)
    // ============================================================

    // --- Cursos ---
    Route::resource('cursos', CursoController::class)
        ->parameters(['cursos' => 'curso'])
        ->middleware('role:superusuario|administrativo');

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
    // ÁREA PROFESOR
    // ============================================================

    Route::middleware('role:superusuario|profesor')->group(function () {
        // Mis cursos asignados
        Route::get('/profesor/cursos', [CursoController::class, 'indexProfesor'])
            ->name('profesor.cursos.index');

        Route::get('/profesor/cursos/{curso}', [CursoController::class, 'showProfesor'])
            ->name('profesor.cursos.show');

        // Asistencias del profesor
        Route::get('/profesor/asistencias', [AsistenciaController::class, 'index'])
            ->name('profesor.asistencias.index');

        Route::get('profesor/cursos/{curso}/asistencias', [AsistenciaController::class, 'historial'])
            ->name('profesor.asistencias.historial');
    });

    // ============================================================
    // ÁREA ALUMNO
    // ============================================================
    Route::middleware('role:superusuario|alumno')->group(function () {
        // Cursos
        Route::get('/alumno/cursos', [CursoController::class, 'alumnoIndex'])
            ->name('alumno.cursos.index');

        Route::get('/alumno/mis-cursos', [CursoController::class, 'alumnoMisCursos'])
            ->name('alumno.mis-cursos.index');

        Route::get('/alumno/cursos/{curso}', [CursoController::class, 'alumnoShow'])
            ->name('alumno.cursos.show');

        // 🔹 NUEVO: Pagos (placeholder hasta implementar el módulo)
        Route::get('/alumno/pagos', function () {
            return Inertia::render('Pagos/AlumnoIndex', [
                'mensaje' => 'Módulo de pagos de alumno próximamente disponible.',
            ]);
        })->name('alumno.pagos.index');

        // Asistencias (ya existentes)
        Route::get('/alumno/asistencias', [AsistenciaController::class, 'index'])
            ->name('alumno.asistencias.index');
    });



    // ============================================================
    // ÁREA ADMINISTRATIVO
    // ============================================================

    Route::middleware('role:superusuario|administrativo')->group(function () {
        Route::get('/administrativo/pagos', [PagoController::class, 'index'])
            ->name('administrativo.pagos.index');
        Route::get('/administrativo/inscripciones', [InscripcionController::class, 'index'])
            ->name('administrativo.inscripciones.index');
    });
});

// ============================================================
// ÁREA DE ADMINISTRACIÓN AVANZADA (solo superusuario)
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
// CONFIGURACIONES Y AUTENTICACIÓN
// ============================================================

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
