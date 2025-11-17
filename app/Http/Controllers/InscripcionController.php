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
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->hasRole('alumno')) {
            $inscripciones = $user->inscripciones()
                ->with('curso')
                ->latest()
                ->get();
        } else {
            $inscripciones = Inscripcion::with(['alumno', 'curso'])
                ->latest()
                ->get();
        }

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
        /** @var \App\Models\User $user */
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

            if (!isset($validated['user_id'])) {
                return back()->with('error', 'Debe seleccionar un alumno.');
            }
        }

        $existe = Inscripcion::where('user_id', $validated['user_id'])
            ->where('curso_id', $validated['curso_id'])
            ->first();

        if ($existe) {
            return back()->with('error', 'Ya existe una inscripción para este curso.');
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
            ->with('success', 'Estado actualizado.');
    }

    public function destroy(Inscripcion $inscripcion)
    {
        $inscripcion->delete();

        return redirect()->route('inscripciones.index')
            ->with('success', 'Inscripción eliminada.');
    }

    // ============================================
    // 🔹 MÉTODO DE PREINSCRIPCIÓN (ALUMNO)
    // ============================================
    public function preinscribir($cursoId)
    {
        $user = Auth::user();

        // Evitar duplicados
        $existe = Inscripcion::where('user_id', $user->id)
            ->where('curso_id', $cursoId)
            ->first();

        if ($existe) {
            return back()->with('error', 'Ya tienes una inscripción (pendiente o confirmada) para este curso.');
        }

        Inscripcion::create([
            'user_id' => $user->id,
            'curso_id' => $cursoId,
            'estado' => 'pendiente',
            'origen' => 'landing',
        ]);

        return back()->with('success', '¡Preinscripción enviada! Un administrador la revisará.');
    }

    // ============================================
    // 🔹 ADMINISTRADOR APRUEBA INSCRIPCIÓN
    // ============================================
    public function aprobar($id)
    {
        $inscripcion = Inscripcion::findOrFail($id);
        $inscripcion->estado = 'confirmada';
        $inscripcion->save();

        return back()->with('success', 'Inscripción aprobada.');
    }

    // ============================================
    // 🔹 ADMINISTRADOR RECHAZA INSCRIPCIÓN
    // ============================================
    public function rechazar($id)
    {
        $inscripcion = Inscripcion::findOrFail($id);
        $inscripcion->estado = 'rechazada';
        $inscripcion->save();

        return back()->with('success', 'Inscripción rechazada.');
    }
}
