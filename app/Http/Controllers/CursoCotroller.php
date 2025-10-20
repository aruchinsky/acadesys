<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CursoController extends Controller
{

    public function index()
    {
        $cursos = Curso::with(['profesores', 'horarios'])->get();
        return Inertia::render('Cursos/Index', ['cursos' => $cursos]);
    }

    public function create()
    {
        $profesores = User::role('profesor')->get(['id', 'nombre', 'apellido']);
        return Inertia::render('Cursos/Create', ['profesores' => $profesores]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:150',
            'descripcion' => 'nullable|string',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'profesores' => 'array',
            'profesores.*' => 'exists:users,id',
        ]);

        $curso = Curso::create($validated);
        if (!empty($validated['profesores'])) {
            $curso->profesores()->sync($validated['profesores']);
        }

        return redirect()->route('cursos.index')->with('success', 'Curso creado correctamente.');
    }

    public function edit(Curso $curso)
    {
        $curso->load('profesores', 'horarios');
        $profesores = User::role('profesor')->get(['id', 'nombre', 'apellido']);
        return Inertia::render('Cursos/Edit', compact('curso', 'profesores'));
    }

    public function update(Request $request, Curso $curso)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:150',
            'descripcion' => 'nullable|string',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'profesores' => 'array',
            'profesores.*' => 'exists:users,id',
        ]);

        $curso->update($validated);
        $curso->profesores()->sync($validated['profesores'] ?? []);

        return redirect()->route('cursos.index')->with('success', 'Curso actualizado correctamente.');
    }

    public function destroy(Curso $curso)
    {
        $curso->delete();
        return redirect()->route('cursos.index')->with('success', 'Curso eliminado.');
    }
}
