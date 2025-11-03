<?php

namespace App\Http\Controllers;

use App\Models\Pago;
use App\Models\Inscripcion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PagoController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $pagos = $user->hasRole('alumno')
            ? Pago::whereHas('inscripcion', fn($q) => $q->where('user_id', $user->id))
                ->with('inscripcion.curso')
                ->latest()
                ->get()
            : Pago::with(['inscripcion.usuario', 'inscripcion.curso', 'administrativo'])
                ->latest()
                ->get();

        return Inertia::render('Pagos/Index', compact('pagos'));
    }

    public function create()
    {
        $alumnos = User::role('alumno')->select('id', 'nombre', 'apellido')->get();
        $inscripciones = Inscripcion::with('curso:id,nombre')->get(['id', 'curso_id']);

        return Inertia::render('Pagos/Create', compact('alumnos', 'inscripciones'));
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'inscripcion_id' => 'required|exists:inscripciones,id',
            'monto'          => 'required|numeric|min:0',
            'metodo_pago'    => 'required|in:Efectivo,Transferencia,Tarjeta',
        ]);

        Pago::create([
            ...$validated,
            'administrativo_id' => $user->id,
        ]);

        return redirect()->route('pagos.index')
            ->with('success', 'Pago registrado correctamente.');
    }

    public function destroy(Pago $pago)
    {
        $pago->delete();

        return redirect()->route('pagos.index')
            ->with('success', 'Pago eliminado correctamente.');
    }
}
