<?php

namespace App\Http\Controllers;

use App\Models\Pago;
use App\Models\Inscripcion;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PagoController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->hasRole('alumno')) {
            $pagos = Pago::where('user_id', $user->id)
                         ->with(['inscripcion.curso'])
                         ->orderBy('id', 'desc')
                         ->get();
        } else {
            $pagos = Pago::with(['usuario', 'inscripcion.curso', 'administrativo'])
                         ->orderBy('id', 'desc')
                         ->get();
        }

        return Inertia::render('Pagos/Index', compact('pagos'));
    }

    public function create()
    {
        $alumnos = User::role('alumno')->get(['id', 'nombre', 'apellido']);
        $inscripciones = Inscripcion::with('curso')->get(['id', 'curso_id']);
        return Inertia::render('Pagos/Create', compact('alumnos', 'inscripciones'));
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'inscripcion_id' => 'nullable|exists:inscripciones,id',
            'monto' => 'required|numeric|min:0',
            'metodo_pago' => 'required|in:Efectivo,Transferencia,Tarjeta',
        ]);

        Pago::create([
            ...$validated,
            'administrativo_id' => $user->id,
        ]);

        return redirect()->route('pagos.index')->with('success', 'Pago registrado correctamente.');
    }

    public function destroy(Pago $pago)
    {
        $pago->delete();
        return redirect()->route('pagos.index')->with('success', 'Pago eliminado correctamente.');
    }
}
