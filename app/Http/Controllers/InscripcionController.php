<?php

namespace App\Http\Controllers;

use App\Models\Inscripcion;
use App\Models\Curso;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class InscripcionController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->hasRole('alumno')) {
            $inscripciones = $user->inscripciones()->with('curso')->get();
        } else {
            $inscripciones = Inscripcion::with(['usuario', 'curso'])->orderBy('id', 'desc')->get();
        }

        return Inertia::render('Inscripciones/Index', [
            'inscripciones' => $inscripciones,
        ]);
    }

    public function create()
    {
        $cursos = Curso::all(['id', 'nombre']);
        $alumnos = User::role('alumno')->get(['id', 'nombre', 'apellido']);
        return Inertia::render('Inscripciones/Create', compact('cursos', 'alumnos'));
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'curso_id' => 'required|exists:cursos,id',
            'user_id' => 'nullable|exists:users,id',
            'estado' => 'nullable|in:pendiente,confirmada,rechazada',
            'origen' => 'nullable|in:landing,admin',
        ]);

        // Si es alumno, se preinscribe a sí mismo
        if ($user->hasRole('alumno')) {
            $validated['user_id'] = $user->id;
            $validated['origen'] = 'landing';
            $validated['estado'] = 'pendiente';
        } else {
            $validated['origen'] = $validated['origen'] ?? 'admin';
        }

        Inscripcion::create($validated);

        return redirect()->route('inscripciones.index')->with('success', 'Inscripción registrada correctamente.');
    }

    public function edit(Inscripcion $inscripcion)
    {
        $cursos = Curso::all(['id', 'nombre']);
        $alumnos = User::role('alumno')->get(['id', 'nombre', 'apellido']);
        return Inertia::render('Inscripciones/Edit', compact('inscripcion', 'cursos', 'alumnos'));
    }

    public function update(Request $request, Inscripcion $inscripcion)
    {
        $validated = $request->validate([
            'curso_id' => 'required|exists:cursos,id',
            'user_id' => 'required|exists:users,id',
            'estado' => 'required|in:pendiente,confirmada,rechazada',
        ]);

        $inscripcion->update($validated);

        return redirect()->route('inscripciones.index')->with('success', 'Inscripción actualizada correctamente.');
    }

    public function destroy(Inscripcion $inscripcion)
    {
        $inscripcion->delete();
        return redirect()->route('inscripciones.index')->with('success', 'Inscripción eliminada correctamente.');
    }
}
