<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:superusuario');
    }

    // Muestra todos los roles
    public function index()
    {
        // Usamos withCount con alias para devolver 'permission_count' (coincide con tu index.d.ts)
        $roles = Role::withCount(['permissions as permissions_count'])
                     ->orderBy('id', 'asc')
                     ->get();

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
        ]);
    }

    public function create(Request $request, Role $role)
    {
        return Inertia::render('Roles/Create');
    }

    // Ingresa a ese rol
    public function edit(Role $role)
    {
        $permissions = Permission::all()->groupBy(function ($permission) {
            return explode(' ', $permission->name)[1] ?? $permission->name;
        });

        $rolePermissions = $role->permissions->pluck('name')->toArray();

        return Inertia::render('Roles/Edit', [
            'role' => $role,
            'permissions' => $permissions,
            'rolePermissions' => $rolePermissions,
        ]);
    }
    
    // Actualiza el rol
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);
        $role->syncPermissions($validated['permissions'] ?? []);

        return redirect()
                ->route('roles.index')
                ->with('success', 'Rol actualizado correctamente.');
    }
}
