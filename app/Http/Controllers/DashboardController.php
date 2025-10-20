<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Curso;
use App\Models\Pago;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->hasRole('superusuario')) {
            // Datos dinámicos
            $totalCursos = Curso::count();
            $totalPagos = Pago::count();
            $ingresos = Pago::sum('monto');

            return Inertia::render('Dashboards/DashboardSuperusuario', [
                'dashboard' => [
                    'totalCursos' => $totalCursos,
                    'totalPagos' => $totalPagos,
                    'ingresos' => $ingresos,
                ],
            ]);
        }

        if ($user->hasRole('administrativo')) {
            return Inertia::render('Dashboards/DashboardAdmin');
        }

        if ($user->hasRole('profesor')) {
            return Inertia::render('Dashboards/DashboardProfesor');
        }

        if ($user->hasRole('alumno')) {
            return Inertia::render('Dashboards/DashboardAlumno');
        }

        abort(403, 'Rol no autorizado');
    }
}
