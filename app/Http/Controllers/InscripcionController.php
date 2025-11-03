<?php

namespace App\Http\Controllers;

use App\Models\Inscripcion;
use App\Models\Curso;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InscripcionController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $inscripciones = $user->hasRole('alumno')
            ? $user->inscripciones()->with('curso')->latest()->get()
            : Inscripcion::with(['usuario', 'curso'])->latest()->get();

        return Inertia::render('Inscripciones/Index', [
            'inscripciones' => $inscripciones,
        ]);
    }

    public function create()
    {
        $cursos = Curso::where('activo', true)->get(['id', 'nombre']);
        $alumnos = User::role('alumno')->select('id', 'nombre', 'apellido')->get();

        return Inertia::render('Inscripciones/Create', compact('cursos', 'alumnos'));
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'curso_id' => 'required|exists:cursos,id',
            'user_id'  => 'nullable|exists:users,id',
        ]);

        if ($user->hasRole('alumno')) {
            $validated['user_id'] = $user->id;
            $validated['estado']  = 'pendiente';
            $validated['origen']  = 'landing';
        } else {
            $validated['estado'] = 'confirmada';
            $validated['origen'] = 'admin';
        }

        Inscripcion::create($validated);

        return redirect()->route('inscripciones.index')
            ->with('success', 'Inscripción registrada correctamente.');
    }

    public function update(Request $request, Inscripcion $inscripcion)
    {
        $validated = $request->validate([
            'estado' => 'required|in:pendiente,confirmada,rechazada',
        ]);

        $inscripcion->update($validated);

        return redirect()->route('inscripciones.index')
            ->with('success', 'Estado actualizado correctamente.');
    }

    public function destroy(Inscripcion $inscripcion)
    {
        $inscripcion->delete();

        return redirect()->route('inscripciones.index')
            ->with('success', 'Inscripción eliminada correctamente.');
    }
}
