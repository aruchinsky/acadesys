<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UsuarioController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:ver usuarios')->only(['index', 'show']);
        $this->middleware('permission:crear usuarios')->only(['create', 'store']);
        $this->middleware('permission:editar usuarios')->only(['edit', 'update']);
        $this->middleware('permission:eliminar usuarios')->only(['destroy']);
    }

    public function index()
    {
        $usuarios = User::with(['inscripciones', 'cursos'])->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'nombre' => $user->nombre,
                'apellido' => $user->apellido,
                'nombre_completo' => $user->nombre_completo,
                'dni' => $user->dni,
                'telefono' => $user->telefono,
                'cursos_count' => $user->cursos->count(),
                'inscripciones_count' => $user->inscripciones->count(),
                'created_at' => $user->created_at->format('d/m/Y H:i'),
                'updated_at' => $user->updated_at->format('d/m/Y H:i'),
            ];
        });

        return Inertia::render('Usuarios/Index', [
            'usuarios' => $usuarios,
        ]);
    }

    public function create()
    {
        return Inertia::render('Usuarios/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'dni' => 'required|string|max:20|unique:users',
            'telefono' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'dni' => $request->dni,
            'telefono' => $request->telefono,
        ]);

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario creado correctamente.');
    }

    public function show(User $usuario)
    {
        $usuario->load(['inscripciones.curso', 'cursos', 'pagos']);
        
        return Inertia::render('Usuarios/Show', [
            'usuario' => [
                'id' => $usuario->id,
                'name' => $usuario->name,
                'email' => $usuario->email,
                'nombre' => $usuario->nombre,
                'apellido' => $usuario->apellido,
                'nombre_completo' => $usuario->nombre_completo,
                'dni' => $usuario->dni,
                'telefono' => $usuario->telefono,
                'created_at' => $usuario->created_at->format('d/m/Y H:i'),
                'inscripciones' => $usuario->inscripciones->map(function ($inscripcion) {
                    return [
                        'id' => $inscripcion->id,
                        'curso' => $inscripcion->curso->nombre,
                        'estado' => $inscripcion->estado,
                        'fecha_inscripcion' => $inscripcion->fecha_inscripcion->format('d/m/Y'),
                    ];
                }),
                'pagos' => $usuario->pagos->map(function ($pago) {
                    return [
                        'id' => $pago->id,
                        'monto' => $pago->monto,
                        'fecha' => $pago->pagado_at->format('d/m/Y'),
                        'metodo_pago' => $pago->metodo_pago,
                    ];
                }),
            ],
        ]);
    }

    public function edit(User $usuario)
    {
        return Inertia::render('Usuarios/Edit', [
            'usuario' => [
                'id' => $usuario->id,
                'name' => $usuario->name,
                'email' => $usuario->email,
                'nombre' => $usuario->nombre,
                'apellido' => $usuario->apellido,
                'dni' => $usuario->dni,
                'telefono' => $usuario->telefono,
                'created_at' => $usuario->created_at->format('d/m/Y H:i'),
            ],
        ]);
    }

    public function update(Request $request, User $usuario)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $usuario->id,
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'dni' => 'required|string|max:20|unique:users,dni,' . $usuario->id,
            'telefono' => 'nullable|string|max:20',
            'password' => $request->password ? ['required', 'confirmed', Rules\Password::defaults()] : '',
        ]);

        $usuario->update([
            'name' => $request->name,
            'email' => $request->email,
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'dni' => $request->dni,
            'telefono' => $request->telefono,
        ]);

        if ($request->filled('password')) {
            $usuario->update(['password' => Hash::make($request->password)]);
        }

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario actualizado correctamente.');
    }

    public function destroy(User $usuario)
    {
        // Protección para no eliminar al usuario actual
        if ($usuario->id === Auth::id()) {
            return redirect()->route('usuarios.index')
                ->with('error', 'No puedes eliminar tu propio usuario.');
        }

        // Verificar si el usuario tiene inscripciones o pagos antes de eliminar
        if ($usuario->inscripciones()->count() > 0 || $usuario->pagos()->count() > 0) {
            return redirect()->route('usuarios.index')
                ->with('error', 'No se puede eliminar el usuario porque tiene inscripciones o pagos asociados.');
        }

        $usuario->delete();

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario eliminado correctamente.');
    }
}
