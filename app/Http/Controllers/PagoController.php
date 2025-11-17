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
    /**
     * LISTADO DE PAGOS
     * - Administrativo / Superusuario → todos los pagos
     * - Alumno → solo los suyos
     */
    public function index()
    {
        $user = Auth::user();

        // ===== ALUMNO =====
        if ($user->hasRole('alumno')) {
            $pagos = Pago::whereHas('inscripcion', fn($q) => $q->where('user_id', $user->id))
                ->with([
                    'inscripcion.curso:id,nombre,arancel_base',
                ])
                ->orderBy('pagado_at', 'desc')
                ->get();

            return Inertia::render('Pagos/AlumnoIndex', compact('pagos'));
        }

        // ===== ADMINISTRATIVO / SUPERUSUARIO =====
        $pagos = Pago::with([
                'inscripcion.usuario:id,nombre,apellido',
                'inscripcion.curso:id,nombre,arancel_base',
                'administrativo:id,nombre,apellido',
            ])
            ->orderBy('pagado_at', 'desc')
            ->get();



        return Inertia::render('Pagos/AdminIndex', compact('pagos'));
    }

    /**
     * FORMULARIO DE CREACIÓN DE PAGO
     * Solo administrativo / superusuario
     */
    public function create()
    {
        $alumnos = User::role('alumno')
            ->select('id', 'nombre', 'apellido')
            ->orderBy('apellido')
            ->get();

        // Solo inscripciones confirmadas
        $inscripciones = Inscripcion::where('estado', 'confirmada')
            ->with('curso:id,nombre,arancel_base')
            ->get(['id', 'curso_id', 'user_id']);

        return Inertia::render('Pagos/Create', compact('alumnos', 'inscripciones'));
    }

    /**
     * GUARDAR PAGO
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'inscripcion_id' => 'required|exists:inscripciones,id',
            'monto'          => 'required|numeric|min:0',
            'metodo_pago'    => 'required|in:Efectivo,Transferencia,Tarjeta',
            'observacion'    => 'nullable|string|max:255',
        ]);

        // Validar inscripción confirmada
        $inscripcion = Inscripcion::findOrFail($validated['inscripcion_id']);
        if ($inscripcion->estado !== 'confirmada') {
            return back()->with('error', 'Solo se pueden registrar pagos para inscripciones confirmadas.');
        }

        Pago::create([
            ...$validated,
            'administrativo_id' => $user->id,
            'user_id' => $inscripcion->user_id,  // quién pagó
            'pagado_at' => now(),
            'anulado' => false,
        ]);

        return redirect()->route('administrativo.pagos.index')
            ->with('success', 'Pago registrado correctamente.');
    }

    /**
     * ANULAR UN PAGO (en vez de eliminar)
     */
    public function anular(Request $request, Pago $pago)
    {
        $validated = $request->validate([
            'motivo' => 'required|string|min:5|max:255',
        ]);

        if ($pago->anulado) {
            return back()->with('error', 'Este pago ya está anulado.');
        }

        $pago->update([
            'anulado' => true,
            'motivo_anulacion' => $validated['motivo'],
        ]);

        return back()->with('success', 'Pago anulado correctamente.');
    }

    /**
     * ELIMINAR DEFINITIVAMENTE (solo para administradores de sistema)
     * *NO* se usa para gestión normal — se mantiene solo para fines técnicos
     */
    public function destroy(Pago $pago)
    {
        if (!$pago->anulado) {
            return back()->with('error', 'No se puede eliminar un pago que no fue anulado.');
        }

        $pago->delete();

        return redirect()->back()
            ->with('success', 'Pago eliminado permanentemente.');
    }
}
