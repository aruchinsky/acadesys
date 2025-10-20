<?php

namespace App\Http\Controllers;

use App\Models\Asistencia;
use App\Models\Inscripcion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AsistenciaController extends Controller
{

    public function index()
    {
        $user = Auth::user();

        if ($user->hasRole('alumno')) {
            $asistencias = Asistencia::whereHas('inscripcion', fn($q) =>
                $q->where('user_id', $user->id)
            )->with('inscripcion.curso')->orderBy('fecha', 'desc')->get();
        } elseif ($user->hasRole('profesor')) {
            // El profesor solo ve las asistencias de sus cursos
            $asistencias = Asistencia::whereHas('inscripcion.curso.profesores', fn($q) =>
                $q->where('users.id', $user->id)
            )->with(['inscripcion.usuario', 'inscripcion.curso'])->orderBy('fecha', 'desc')->get();
        } else {
            $asistencias = Asistencia::with(['inscripcion.usuario', 'inscripcion.curso'])
                ->orderBy('fecha', 'desc')->get();
        }

        return Inertia::render('Asistencias/Index', compact('asistencias'));
    }

    public function create()
    {
        $inscripciones = Inscripcion::with(['usuario', 'curso'])->get();
        return Inertia::render('Asistencias/Create', compact('inscripciones'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'inscripcion_id' => 'required|exists:inscripciones,id',
            'fecha' => 'required|date',
            'presente' => 'required|boolean',
        ]);

        Asistencia::updateOrCreate(
            ['inscripcion_id' => $validated['inscripcion_id'], 'fecha' => $validated['fecha']],
            ['presente' => $validated['presente']]
        );

        return redirect()->route('asistencias.index')->with('success', 'Asistencia registrada correctamente.');
    }

    public function destroy(Asistencia $asistencia)
    {
        $asistencia->delete();
        return redirect()->route('asistencias.index')->with('success', 'Asistencia eliminada correctamente.');
    }
}
