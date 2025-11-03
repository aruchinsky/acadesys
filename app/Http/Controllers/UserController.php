<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Mostrar listado de usuarios.
     */
    public function index()
    {
        $users = User::with('roles:id,name')->get();
        $roles = Role::select('id', 'name')->get();

        return Inertia::render('Usuarios/Index', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    /**
     * Mostrar formulario de creación.
     */
    public function create()
    {
        $roles = Role::select('id', 'name')->get();

        return Inertia::render('Usuarios/Create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Guardar nuevo usuario.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'dni' => ['required', 'string', 'max:15', 'unique:users,dni'],
            'telefono' => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', 'exists:roles,name'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'dni' => $validated['dni'],
            'telefono' => $validated['telefono'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignRole($validated['role']);

        return redirect()->route('usuarios.index')->with('success', 'Usuario creado correctamente.');
    }

    /**
     * Mostrar detalles de usuario.
     */
    public function show(User $usuario)
    {
        $usuario->load(['roles:id,name', 'inscripciones.curso', 'pagos']);

        return Inertia::render('Usuarios/Show', [
            'usuario' => $usuario,
        ]);
    }

    /**
     * Mostrar formulario de edición.
     */
    public function edit(User $usuario)
    {
        $roles = Role::select('id', 'name')->get();

        return Inertia::render('Usuarios/Edit', [
            'user' => $usuario->load('roles:id,name'),
            'roles' => $roles,
        ]);
    }

    /**
     * Actualizar usuario.
     */
    public function update(Request $request, User $usuario)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email,' . $usuario->id],
            'dni' => ['required', 'string', 'max:15', 'unique:users,dni,' . $usuario->id],
            'telefono' => ['nullable', 'string', 'max:20'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', 'exists:roles,name'],
        ]);

        $usuario->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'dni' => $validated['dni'],
            'telefono' => $validated['telefono'],
            'password' => $validated['password']
                ? Hash::make($validated['password'])
                : $usuario->password,
        ]);

        // Asignar rol (sin duplicar)
        $usuario->syncRoles([$validated['role']]);

        return redirect()->route('usuarios.index')->with('success', 'Usuario actualizado correctamente.');
    }

    /**
     * Eliminar usuario.
     */
    public function destroy(User $usuario)
    {
        $usuario->delete();

        return redirect()->route('usuarios.index')->with('warning', 'Usuario eliminado correctamente.');
    }
}
