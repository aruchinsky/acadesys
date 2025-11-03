<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserRoleController extends Controller
{
    /**
     * Vista de asignación de roles (si se necesitara independiente)
     */
    public function index()
    {
        $users = User::with('roles:id,name')->get();
        $roles = Role::select('id', 'name')->get();

        return inertia('Usuarios/Index', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    /**
     * Actualización masiva de roles desde el listado de usuarios.
     */
    public function update(Request $request)
    {
        $rolesData = $request->input('roles', []);

        foreach ($rolesData as $userId => $roleName) {
            $user = User::find($userId);

            if ($user && $roleName && Role::where('name', $roleName)->exists()) {
                $user->syncRoles([$roleName]);
            }
        }

        return redirect()
            ->route('usuarios.index')
            ->with('success', 'Roles de usuarios actualizados correctamente.');
    }
}
