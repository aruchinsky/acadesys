<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserRoleController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:superusuario');
    }

    public function index()
    {
        $usuarios = User::with('roles')->get();

        $roles = Role::all();

        return Inertia::render('Usuarios/Roles', [
            'usuarios' => $usuarios,
            'roles' => $roles,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'roles' => 'array',
            'roles.*' => 'string|exists:roles,name',
        ]);

        $user->syncRoles($validated['roles'] ?? []);

        return redirect()
                ->route('usuarios.roles.index')
                ->with('success', 'Roles del usuario actualizados correctamente.');
    }
}
