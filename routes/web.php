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
// 🏠 PÁGINA PRINCIPAL (PÚBLICA)
// ============================================================

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// ============================================================
// 🔐 ÁREA AUTENTICADA
// ============================================================

Route::middleware(['auth', 'verified'])->group(function () {

    // --- Dashboard dinámico según rol ---
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // ============================================================
    // 📚 MÓDULOS ACADÉMICOS (SUPERUSUARIO / ADMINISTRATIVO)
    // ============================================================

    // --- Cursos ---
    Route::resource('cursos', CursoController::class)
        ->parameters(['cursos' => 'curso'])
        ->middleware('role:superusuario|administrativo');

    // --- Inscripciones ---
    Route::resource('inscripciones', InscripcionController::class)
        ->parameters(['inscripciones' => 'inscripcion'])
        ->middleware('role:superusuario|administrativo|profesor|alumno');

    // --- Asistencias ---
    Route::resource('asistencias', AsistenciaController::class)
        ->parameters(['asistencias' => 'asistencia'])
        ->middleware('role:superusuario|administrativo|profesor|alumno');

    // ============================================================
    // 👨‍🏫 ÁREA PROFESOR
    // ============================================================
    Route::middleware('role:superusuario|profesor')->group(function () {

        // Cursos asignados
        Route::get('/profesor/cursos', [CursoController::class, 'indexProfesor'])
            ->name('profesor.cursos.index');

        Route::get('/profesor/cursos/{curso}', [CursoController::class, 'showProfesor'])
            ->name('profesor.cursos.show');

        // Registrar asistencias
        Route::get('/profesor/asistencias', [AsistenciaController::class, 'index'])
            ->name('profesor.asistencias.index');

        // Historial
        Route::get('/profesor/cursos/{curso}/asistencias', [AsistenciaController::class, 'historial'])
            ->name('profesor.asistencias.historial');
    });

    // ============================================================
    // 🎓 ÁREA ALUMNO
    // ============================================================
    Route::middleware('role:superusuario|alumno')->group(function () {

        // Cursos disponibles y mis cursos
        Route::get('/alumno/cursos', [CursoController::class, 'alumnoIndex'])
            ->name('alumno.cursos.index');

        Route::get('/alumno/mis-cursos', [CursoController::class, 'alumnoMisCursos'])
            ->name('alumno.mis-cursos.index');

        Route::get('/alumno/cursos/{curso}', [CursoController::class, 'alumnoShow'])
            ->name('alumno.cursos.show');

        // Asistencias del alumno
        Route::get('/alumno/asistencias', [AsistenciaController::class, 'index'])
            ->name('alumno.asistencias.index');

        // Preinscripción a cursos
        Route::post('/cursos/{id}/preinscribir', [InscripcionController::class, 'preinscribir'])
            ->name('cursos.preinscribir');

        // Pagos → Solo listado del alumno
        Route::get('/alumno/pagos', [PagoController::class, 'index'])
            ->name('alumno.pagos.index');
    });

    // ============================================================
    // 🗂️ ÁREA ADMINISTRATIVO (ADMINISTRACIÓN ACADÉMICA)
    // ============================================================
    Route::middleware('role:superusuario|administrativo')->group(function () {
        // Pagos anulación
        Route::post('/administrativo/pagos/{pago}/anular', [PagoController::class, 'anular'])
            ->name('administrativo.pagos.anular');

        // Inscripciones
        Route::get('/administrativo/inscripciones', [InscripcionController::class, 'index'])
            ->name('administrativo.inscripciones.index');

        Route::post('/admin/inscripciones/{id}/aprobar', [InscripcionController::class, 'aprobar'])
            ->name('admin.inscripciones.aprobar');

        Route::post('/admin/inscripciones/{id}/rechazar', [InscripcionController::class, 'rechazar'])
            ->name('admin.inscripciones.rechazar');

        // Pagos (CRUD parcial)
        Route::get('/administrativo/pagos', [PagoController::class, 'index'])
            ->name('administrativo.pagos.index');

        Route::get('/administrativo/pagos/create', [PagoController::class, 'create'])
            ->name('administrativo.pagos.create');

        Route::post('/administrativo/pagos', [PagoController::class, 'store'])
            ->name('administrativo.pagos.store');

        Route::delete('/administrativo/pagos/{pago}', [PagoController::class, 'destroy'])
            ->name('administrativo.pagos.destroy');
    });
});

// ============================================================
// 🛠️ ÁREA DE ADMINISTRACIÓN AVANZADA (SOLO SUPERUSUARIO)
// ============================================================

Route::middleware(['auth', 'verified', 'role:superusuario'])->group(function () {

    // Roles
    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
    Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');

    // Asignación de roles a usuarios
    Route::get('/usuarios/roles', [UserRoleController::class, 'index'])->name('usuarios.roles.index');
    Route::put('/usuarios/roles', [UserRoleController::class, 'update'])->name('usuarios.roles.update');

    // Gestión de usuarios
    Route::resource('usuarios', UserController::class)
        ->parameters(['usuarios' => 'usuario']);
});

// ============================================================
// ⚙️ CONFIGURACIONES Y AUTENTICACIÓN
// ============================================================

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
