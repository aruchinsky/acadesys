<?php

namespace App\Http\Controllers;

use App\Models\Asistencia;
use App\Models\Inscripcion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AsistenciaController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Solo los cursos del profesor autenticado
        $cursos = $user->cursosDictados()
            ->with(['inscripciones.usuario:id,nombre,apellido,dni'])
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Cursos/ProfesorAsistencias', [
            'cursos' => $cursos,
            'fechaHoy' => now()->toDateString(),
        ]);
    }


    public function create()
    {
        $inscripciones = Inscripcion::with(['usuario', 'curso'])->get();

        return Inertia::render('Asistencias/Create', compact('inscripciones'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'curso_id'   => 'required|exists:cursos,id',
            'fecha'      => 'required|date',
            'asistencias' => 'required|array',
        ]);

        $cursoId = $validated['curso_id'];
        $fecha = $validated['fecha'];
        $asistencias = $validated['asistencias'];

        $inscripciones = \App\Models\Inscripcion::where('curso_id', $cursoId)->get();

        foreach ($inscripciones as $inscripcion) {
            $data = $asistencias[$inscripcion->user_id] ?? ['presente' => false, 'observacion' => null];

            Asistencia::updateOrCreate(
                [
                    'inscripcion_id' => $inscripcion->id,
                    'fecha' => $fecha,
                ],
                [
                    'presente' => (bool)($data['presente'] ?? false),
                    'observacion' => $data['observacion'] ?? null,
                ]
            );
        }

        return redirect()->back()->with('success', 'Asistencias registradas correctamente.');
    }



    public function destroy(Asistencia $asistencia)
    {
        $asistencia->delete();

        return redirect()->route('asistencias.index')
            ->with('success', 'Asistencia eliminada correctamente.');
    }

    public function historial($cursoId)
    {
        $curso = \App\Models\Curso::with([
            'inscripciones.usuario:id,nombre,apellido,dni',
            'inscripciones.asistencias' => fn($q) => $q->orderBy('fecha', 'asc')
        ])->findOrFail($cursoId);

        $fechas = \App\Models\Asistencia::whereIn('inscripcion_id', $curso->inscripciones->pluck('id'))
            ->distinct()
            ->orderBy('fecha', 'asc')
            ->pluck('fecha');

        return Inertia::render('Cursos/ProfesorAsistenciasHistorial', [
            'curso' => $curso,
            'fechas' => $fechas,
        ]);
    }

}
