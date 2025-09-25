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
        $users = User::with('roles')->get();

        $roles = Role::all();

        return Inertia::render('Users/Roles', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    public function update(Request $request)
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
                ->route('users.roles.index')
                ->with('success', 'Roles del usuario actualizados correctamente.');
    }
}
