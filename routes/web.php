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
// 🌐 CALLBACK DE MERCADOPAGO (PÚBLICO - SIN AUTH)
// ============================================================
//
// IMPORTANTE:
// MercadoPago NO puede acceder a rutas protegidas por auth.
// Por eso el callback DEBE estar FUERA del middleware.
//
Route::get('/alumno/pagos/mercadopago/callback', [PagoController::class, 'mercadoPagoCallback'])
    ->name('alumno.pagos.mercadopago.callback');


// ============================================================
// 🔐 ÁREA AUTENTICADA
// ============================================================

Route::middleware(['auth', 'verified'])->group(function () {

    // ============================================================
    // 📄 COMPROBANTE PDF
    // ============================================================
    Route::get('/pagos/{pago}/comprobante', [PagoController::class, 'comprobante'])
        ->name('pagos.comprobante');

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // ============================================================
    // 📚 MÓDULOS ACADÉMICOS (SUPERUSUARIO / ADMINISTRATIVO)
    // ============================================================

    Route::resource('cursos', CursoController::class)
        ->parameters(['cursos' => 'curso'])
        ->middleware('role:superusuario|administrativo');

    Route::resource('inscripciones', InscripcionController::class)
        ->parameters(['inscripciones' => 'inscripcion'])
        ->middleware('role:superusuario|administrativo|profesor|alumno');



    // ============================================================
    // 👨‍🏫 ÁREA PROFESOR
    // ============================================================
    Route::middleware('role:superusuario|profesor')->group(function () {

        Route::get('/profesor/cursos', [CursoController::class, 'indexProfesor'])
            ->name('profesor.cursos.index');

        Route::get('/profesor/cursos/{curso}', [CursoController::class, 'showProfesor'])
            ->name('profesor.cursos.show');

        // Ver cursos y tomar asistencia hoy
        Route::get('/profesor/asistencias', [AsistenciaController::class, 'index'])
            ->name('profesor.asistencias.index');

        // Guardar asistencia
        Route::post('/profesor/asistencias', [AsistenciaController::class, 'store'])
            ->name('profesor.asistencias.store');

        // Historial por curso
        Route::get('/profesor/cursos/{curso}/asistencias', [AsistenciaController::class, 'historial'])
            ->name('profesor.asistencias.historial');
    });


    // ============================================================
    // 🎓 ÁREA ALUMNO
    // ============================================================
    Route::middleware(['role:superusuario|alumno'])->group(function () {

        // Crear preferencia MP (requiere autenticación)
        Route::post('/alumno/pagos/mercadopago/preference', [PagoController::class, 'crearPreferencia'])
            ->name('alumno.pagos.mercadopago.preference');

        // Cursos disponibles
        Route::get('/alumno/cursos', [CursoController::class, 'alumnoIndex'])
            ->name('alumno.cursos.index');

        Route::get('/alumno/mis-cursos', [CursoController::class, 'alumnoMisCursos'])
            ->name('alumno.mis-cursos.index');

        Route::get('/alumno/cursos/{curso}', [CursoController::class, 'alumnoShow'])
            ->name('alumno.cursos.show');

        // Asistencias del alumno
        Route::get('/alumno/asistencias', [AsistenciaController::class, 'alumnoIndex'])
            ->name('alumno.asistencias.index');

        // Preinscripción
        Route::post('/cursos/{id}/preinscribir', [InscripcionController::class, 'preinscribir'])
            ->name('cursos.preinscribir');

        // Pagos
        Route::get('/alumno/pagos', [PagoController::class, 'index'])
            ->name('alumno.pagos.index');

        // Registrar pago manual
        Route::get('/alumno/pagos/create', [PagoController::class, 'createAlumno'])
            ->name('alumno.pagos.create');

        Route::post('/alumno/pagos', [PagoController::class, 'storeAlumno'])
            ->name('alumno.pagos.store');
    });


    // ============================================================
    // 🗂️ ÁREA ADMINISTRATIVO
    // ============================================================
    Route::middleware('role:superusuario|administrativo')->group(function () {

        // Asistencias - Administrativo
        Route::get('/administrativo/asistencias', [AsistenciaController::class, 'administrativoIndex'])
            ->name('administrativo.asistencias.index');

        Route::post('/administrativo/asistencias', [AsistenciaController::class, 'store'])
            ->name('administrativo.asistencias.store');

        // Historial por curso
        Route::get('/administrativo/asistencias/{curso}/historial', [AsistenciaController::class, 'historial'])
            ->name('administrativo.asistencias.historial');


        Route::post('/administrativo/pagos/{pago}/anular', [PagoController::class, 'anular'])
            ->name('administrativo.pagos.anular');

        Route::get('/administrativo/inscripciones', [InscripcionController::class, 'index'])
            ->name('administrativo.inscripciones.index');

        Route::post('/admin/inscripciones/{id}/aprobar', [InscripcionController::class, 'aprobar'])
            ->name('admin.inscripciones.aprobar');

        Route::post('/admin/inscripciones/{id}/rechazar', [InscripcionController::class, 'rechazar'])
            ->name('admin.inscripciones.rechazar');

        // Pagos admin
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
// ⚙️ ÁREA SUPERUSUARIO
// ============================================================
Route::middleware(['auth', 'verified', 'role:superusuario'])->group(function () {

    Route::resource('usuarios', UserController::class)
        ->parameters(['usuarios' => 'usuario']);

    // Asistencias - Superusuario
    Route::get('/superusuario/asistencias', [AsistenciaController::class, 'superusuarioIndex'])
        ->name('superusuario.asistencias.index');

    Route::post('/superusuario/asistencias', [AsistenciaController::class, 'store'])
        ->name('superusuario.asistencias.store');
        
    // Historial por curso
    Route::get('/superusuario/asistencias/{curso}/historial', [AsistenciaController::class, 'historial'])
        ->name('superusuario.asistencias.historial');


    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
    Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');

    Route::get('/usuarios/roles', [UserRoleController::class, 'index'])->name('usuarios.roles.index');
    Route::put('/super/usuarios/roles', [UserRoleController::class, 'update'])
        ->name('usuarios.roles.update');

});


// ============================================================
// 🔧 CONFIGURACIONES Y AUTENTICACIÓN
// ============================================================
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
