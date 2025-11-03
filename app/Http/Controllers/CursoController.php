<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CursoController extends Controller
{
    public function index()
    {
        $cursos = Curso::with(['profesores'])
            ->withCount('inscripciones')
            ->get();

        return Inertia::render('Cursos/Index', [
            'cursos' => $cursos,
        ]);
    }


    public function show(Curso $curso)
    {
        $curso->load([
            'profesores:id,nombre,apellido',
            'horarios',
            'inscripciones.usuario:id,nombre,apellido'
        ]);

        return Inertia::render('Cursos/Show', ['curso' => $curso]);
    }

    public function create()
    {
        $profesores = User::role('profesor')->select('id', 'nombre', 'apellido')->get();

        return Inertia::render('Cursos/Create', [
            'profesores' => $profesores,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'        => 'required|string|max:150',
            'descripcion'   => 'nullable|string',
            'fecha_inicio'  => 'nullable|date',
            'fecha_fin'     => 'nullable|date|after_or_equal:fecha_inicio',
            'arancel_base'  => 'nullable|numeric|min:0',
            'modalidad'     => 'required|in:Presencial,Virtual',
            'activo'        => 'boolean',
            'profesores'    => 'array',
            'profesores.*'  => 'exists:users,id',
            'horarios'      => 'array',
            'horarios.*.dia_en_texto' => 'nullable|string|max:20',
            'horarios.*.hora_inicio'  => 'nullable|string|max:10',
            'horarios.*.duracion_min' => 'nullable|integer|min:0',
            'horarios.*.sala'         => 'nullable|string|max:50',
            'horarios.*.turno'        => 'nullable|string|max:20',
        ]);

        $curso = Curso::create($validated);

        // Asignar profesores
        if (!empty($validated['profesores'])) {
            $curso->profesores()->sync($validated['profesores']);
        }

        // Crear horarios
        if (!empty($validated['horarios'])) {
            foreach ($validated['horarios'] as $horario) {
                $curso->horarios()->create($horario);
            }
        }

        return redirect()->route('cursos.index')
            ->with('success', 'Curso creado correctamente.');
    }

    public function edit(Curso $curso)
    {
        $curso->load('profesores', 'horarios');
        $profesores = User::role('profesor')->select('id', 'nombre', 'apellido')->get();

        return Inertia::render('Cursos/Edit', compact('curso', 'profesores'));
    }

    public function update(Request $request, Curso $curso)
    {
        $validated = $request->validate([
            'nombre'        => 'required|string|max:150',
            'descripcion'   => 'nullable|string',
            'fecha_inicio'  => 'nullable|date',
            'fecha_fin'     => 'nullable|date|after_or_equal:fecha_inicio',
            'arancel_base'  => 'nullable|numeric|min:0',
            'modalidad'     => 'required|in:Presencial,Virtual',
            'activo'        => 'boolean',
            'profesores'    => 'array',
            'profesores.*'  => 'exists:users,id',
            'horarios'      => 'array',
            'horarios.*.dia_en_texto' => 'nullable|string|max:20',
            'horarios.*.hora_inicio'  => 'nullable|string|max:10',
            'horarios.*.duracion_min' => 'nullable|integer|min:0',
            'horarios.*.sala'         => 'nullable|string|max:50',
            'horarios.*.turno'        => 'nullable|string|max:20',
        ]);

        $curso->update($validated);

        // Actualizar profesores
        $curso->profesores()->sync($validated['profesores'] ?? []);

        // Actualizar horarios (eliminamos los viejos y guardamos los nuevos)
        $curso->horarios()->delete();
        if (!empty($validated['horarios'])) {
            foreach ($validated['horarios'] as $horario) {
                $curso->horarios()->create($horario);
            }
        }

        return redirect()->route('cursos.show', $curso)
            ->with('success', 'Curso actualizado correctamente.');
    }

    public function destroy(Curso $curso)
    {
        $curso->delete();

        return redirect()->route('cursos.index')
            ->with('success', 'Curso eliminado correctamente.');
    }

    public function indexProfesor()
    {
        $user = Auth::user();

        // Traer solo los cursos donde el profesor está asignado
        $cursos = $user->cursosDictados()
            ->with(['horarios', 'inscripciones'])
            ->withCount('inscripciones')
            ->orderBy('fecha_inicio', 'asc')
            ->get();

        return Inertia::render('Cursos/ProfesorIndex', [
            'cursos' => $cursos,
        ]);
    }

    public function showProfesor(Curso $curso)
    {
        $curso->load([
            'horarios',
            'inscripciones.usuario:id,nombre,apellido,dni',
        ]);

        return Inertia::render('Cursos/ProfesorShow', [
            'curso' => $curso,
        ]);
    }

}
