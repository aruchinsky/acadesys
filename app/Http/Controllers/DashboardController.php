<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct()
    {
        // Garantizamos que solo usuarios autenticados y verificados accedan
        $this->middleware(['auth', 'verified']);
    }

    public function index()
    {
        $user = Auth::user();

        if ($user->hasRole('superusuario')) {
            return Inertia::render('Dashboards/DashboardSuperusuario');
        } elseif ($user->hasRole('administrativo')) {
            return Inertia::render('Dashboards/DashboardAdmin');
        } elseif ($user->hasRole('profesor')) {
            return Inertia::render('Dashboards/DashboardProfesor');
        } elseif ($user->hasRole('alumno')) {
            return Inertia::render('Dashboards/DashboardAlumno');
        }

        // Si el rol no está contemplado
        abort(403, 'Rol no autorizado');
    }
}
