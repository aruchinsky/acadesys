<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Curso;
use App\Models\Inscripcion;
use App\Models\Pago;
use App\Models\Asistencia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $rol = $user->getRoleNames()->first();

        switch ($rol) {
            case 'alumno':
                return $this->dashboardAlumno($user);

            case 'profesor':
                return $this->dashboardProfesor($user);

            case 'administrativo':
                return $this->dashboardAdministrativo($user);

            case 'superusuario':
                return $this->dashboardAdminSistema($user);

            default:
                abort(403, 'Rol no reconocido o sin acceso al dashboard');
        }
    }

    /**
     * 📊 Dashboard del Administrador del Sistema
     */
    private function dashboardAdminSistema($user)
    {
        $stats = [
            'cursosActivos' => Curso::where('activo', true)->count(),
            'profesores'    => User::role('profesor')->count(),
            'alumnos'       => User::role('alumno')->count(),
            'inscripciones' => Inscripcion::count(),

            // 🔥 KPIs corregidos
            'pagosTotales'  => Pago::where('anulado', false)->count(),
            'pagosAnulados' => Pago::where('anulado', true)->count(),

            'ingresosMes'   => Pago::where('anulado', false)
                                ->whereMonth('pagado_at', now()->month)
                                ->sum('monto'),

            'asistenciasMes'=> Asistencia::whereMonth('fecha', now()->month)->count(),
        ];


        return Inertia::render('Dashboards/AdminSistema', [
            'user'  => $user,
            'stats' => $stats,
        ]);
    }

    /**
     * 📋 Dashboard Administrativo (Secretaría / Caja)
     */
    private function dashboardAdministrativo($user)
    {
        $stats = [
            'inscripcionesPendientes' => Inscripcion::where('estado', 'pendiente')->count(),

            // 🔥 Solo pagos válidos (NO anulados)
            'pagosHoy' => Pago::where('anulado', false)
                ->whereDate('pagado_at', now())
                ->sum('monto'),

            'totalCursos' => Curso::count(),
        ];

        return Inertia::render('Dashboards/Administrativo', [
            'user'  => $user,
            'stats' => $stats,
        ]);
    }


    /**
     * 🎓 Dashboard Profesor
     */
    private function dashboardProfesor($user)
    {
        // Cursos dictados con conteo de inscripciones
        $cursos = $user->cursosDictados()
            ->withCount('inscripciones')
            ->get();

        // Total de alumnos sumando inscripciones de todos sus cursos
        $totalAlumnos = $cursos->sum('inscripciones_count');

        // Última asistencia registrada por el profesor
        $ultimaAsistencia = Asistencia::whereHas('inscripcion.curso.profesores', fn($q) =>
            $q->where('users.id', $user->id)
        )
        ->latest('fecha')
        ->value('fecha');

        return Inertia::render('Dashboards/Profesor', [
            'user'          => $user,
            'cursos'        => $cursos,
            'stats' => [
                'cursosAsignados' => $cursos->count(),
                'alumnosActivos'  => $totalAlumnos,
                'ultimaClase'     => $ultimaAsistencia ? $ultimaAsistencia : null,
            ]
        ]);
    }


    /**
     * 🧑‍💻 Dashboard Alumno
     */
    private function dashboardAlumno($user)
    {
        $inscripciones = $user->inscripciones()
            ->with(['curso', 'pagos'])
            ->latest('fecha_inscripcion')
            ->take(3)
            ->get();

        $stats = [
            'totalCursos'  => $user->inscripciones()->count(),
            'pagosRealizados' => $user->pagos()->count(),
            'asistencias'  => Asistencia::whereHas('inscripcion', fn($q) => $q->where('user_id', $user->id))->count(),
        ];

        return Inertia::render('Dashboards/Alumno', [
            'user'          => $user,
            'inscripciones' => $inscripciones,
            'stats'         => $stats,
        ]);
    }
}
