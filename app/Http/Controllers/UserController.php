<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Listado de usuarios
     */
    public function index()
    {
        $users = User::with('roles')->get()->map(function ($user) {
            return [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'dni'   => $user->dni,
                'roles' => $user->roles->map(fn ($role) => [
                    'id'   => $role->id,
                    'name' => $role->name,
                ]),
            ];
        });
        $roles = Role::all();
        return Inertia::render('Users/Index', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    /**
     * Formulario de creación
     */
    public function create()
    {
        $roles = Role::all();

        return Inertia::render('Users/Create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Guardar usuario
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name'     => 'required|string|max:255',
                'email'    => 'required|string|email|max:255|unique:users',
                'password' => 'required|min:6|confirmed',
                'dni'      => 'required|string|max:20|unique:users',
                'role'    => 'required|exists:roles,name',
            ]);
                
            $user = User::create([
                'name'     => $validated['name'],
                'email'    => $validated['email'],
                'password' => Hash::make($validated['password']),
                'dni'      => $validated['dni'],
            ]);

            $user->assignRole($validated['role']);

            return redirect()->route('users.index')
                ->with('success', 'Usuario creado correctamente.');

        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Error al crear el usuario: ' . $e->getMessage());
        }
    }

    /**
     * Ver un usuario
     */
    public function show(User $user)
    {
        $user->load(['roles', 'inscripciones.curso', 'pagos']);

        return Inertia::render('Users/Show', [
            'user' => [
                'id'             => $user->id,
                'name'           => $user->name,
                'email'          => $user->email,
                'dni'            => $user->dni,
                'telefono'       => $user->telefono,
                'created_at'     => $user->created_at->format('d/m/Y H:i'),
                'roles'          => $user->roles->map(fn ($role) => [
                    'id'   => $role->id,
                    'name' => $role->name,
                ]),
                'inscripciones'  => $user->inscripciones->map(fn ($insc) => [
                    'id'               => $insc->id,
                    'curso'            => $insc->curso->nombre,
                    'estado'           => $insc->estado,
                    'fecha_inscripcion'=> $insc->fecha_inscripcion->format('d/m/Y'),
                ]),
                'pagos' => $user->pagos->map(fn ($pago) => [
                    'id'          => $pago->id,
                    'monto'       => $pago->monto,
                    'pagado_at'   => $pago->pagado_at->format('d/m/Y'),
                    'metodo_pago' => $pago->metodo_pago,
                ]),
                'cursos_dictados' => $user->cursosDictados->map(fn($curso) => [
                    'id' => $curso->id,
                    'nombre' => $curso->nombre,
                ]),
            ],
        ]);
    }

    /**
     * Formulario de edición
     */
    public function edit(User $user)
    {
        $roles = Role::all();

        return Inertia::render('Users/Edit', [
            'user'  => $user->load('roles'),
            'roles' => $roles,
        ]);
    }

    /**
     * Actualizar usuario
     */
    public function update(Request $request, User $user)
    {
        try {
            $validated = $request->validate([
                'name'     => 'required|string|max:255',
                'email'    => 'required|string|email|max:255|unique:users,email,' . $user->id,
                'role'     => 'required|exists:roles,name',
                'dni'      => 'required|string|max:20|unique:users,dni,' . $user->id,
            ]);
            $user->update([
                'name'     => $validated['name'],
                'email'    => $validated['email'],
                'dni'      => $validated['dni'],
            ]);
            $user->syncRoles($validated['role']);
            return redirect()
                ->route('users.index')
                ->with('success', 'Usuario actualizado correctamente.');    
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Error al actualizar el usuario: ' . $e->getMessage());
        }
    }

    public function update_rol(Request $request)
    {
        $validated = $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'string|exists:roles,name',
        ]);

        foreach ($validated['roles'] as $userId => $roleName) {
            $user = User::find($userId);
            if ($user){
                $user->syncRoles([$roleName]); // Sincroniza los roles del usuario
            }
            
        }

        return redirect()
                ->route('users.index')
                ->with('success', 'Roles del usuario actualizados correctamente.');
    }

    /**
     * Eliminar usuario
     */
    public function destroy(User $user)
    {
        try {
            $user->delete();
            return redirect()
                ->route('users.index')
                ->with('success', 'Usuario eliminado correctamente.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Error al eliminar el usuario: ' . $e->getMessage());
        }
    }
}
