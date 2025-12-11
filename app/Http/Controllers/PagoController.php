<?php

namespace App\Http\Controllers;

use App\Models\Pago;
use App\Models\Inscripcion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

// 🔥 SDK Nuevo de MercadoPago
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Client\Payment\PaymentClient;

class PagoController extends Controller
{
    // ============================================================
    // 📌 LISTADO GENERAL / LISTADO PARA ALUMNO
    // ============================================================
    public function index()
    {
        $user = Auth::user();

        // Vista del ALUMNO → solo sus pagos
        if ($user->hasRole('alumno')) {
            $pagos = Pago::whereHas('inscripcion', fn ($q) => $q->where('user_id', $user->id))
                ->with([
                    'inscripcion.curso:id,nombre,arancel_base',
                ])
                ->orderBy('pagado_at', 'desc')
                ->get();

            return Inertia::render('Pagos/AlumnoIndex', compact('pagos'));
        }

        // Vista ADMINISTRATIVO / SUPER
        $pagos = Pago::with([
                'inscripcion.usuario:id,nombre,apellido',
                'inscripcion.curso:id,nombre,arancel_base',
                'administrativo:id,nombre,apellido',
            ])
            ->orderBy('pagado_at', 'desc')
            ->get();

        return Inertia::render('Pagos/AdminIndex', compact('pagos'));
    }

    // ============================================================
    // 📌 FORM ADMIN
    // ============================================================
    public function create()
    {
        $alumnos = User::role('alumno')
            ->select('id', 'nombre', 'apellido')
            ->orderBy('apellido')
            ->get();

        $inscripciones = Inscripcion::where('estado', 'confirmada')
            ->with('curso:id,nombre,arancel_base,fecha_inicio,fecha_fin')
            ->get(['id', 'curso_id', 'user_id']);

        return Inertia::render('Pagos/Create', compact('alumnos', 'inscripciones'));
    }

    // ============================================================
    // 📌 STORE ADMINISTRATIVO (sin comprobante)
    // ============================================================
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'inscripcion_id' => 'required|exists:inscripciones,id',
            'monto'          => 'required|numeric|min:0',
            'metodo_pago'    => 'required|in:Efectivo,Transferencia,Tarjeta,MercadoPago',
            'observacion'    => 'nullable|string|max:255',
        ]);

        $inscripcion = Inscripcion::findOrFail($validated['inscripcion_id']);

        if ($inscripcion->estado !== 'confirmada') {
            return back()->with('error', 'Solo se permiten pagos para inscripciones confirmadas.');
        }

        Pago::create([
            ...$validated,
            'administrativo_id' => $user->id,
            'user_id' => $inscripcion->user_id,
            'pagado_at' => now(),
            'anulado' => false,
        ]);

        return redirect()
            ->route('administrativo.pagos.index')
            ->with('success', 'Pago registrado correctamente.');
    }

    // ============================================================
    // 📌 FORM ALUMNO
    // ============================================================
    public function createAlumno()
    {
        $user = Auth::user();

        $inscripciones = Inscripcion::where('user_id', $user->id)
            ->where('estado', 'confirmada')
            ->with('curso:id,nombre,arancel_base,fecha_inicio,fecha_fin')
            ->get(['id', 'curso_id', 'user_id']);

        return Inertia::render('Pagos/AlumnoCreate', [
            'inscripciones' => $inscripciones,
            'alias' => 'IG2000.CURSOS.ALIAS',
            'qrUrl' => asset('images/qr-ig2000.png'),
        ]);
    }

    // ============================================================
    // 📌 STORE ALUMNO — PAGO MANUAL CON COMPROBANTE
    // ============================================================
    public function storeAlumno(Request $request)
{
    $user = Auth::user();

    // ===========================
    // LOG DE DEPURACIÓN
    // ===========================
    \Log::info("🔥 DEBUG Pago Tarjeta recibido", [
        "data" => $request->all(),
        "files" => $request->file(),
        "metodo" => $request->metodo_pago
    ]);

    // ===============================
    // VALIDACIONES DINÁMICAS
    // ===============================
    $rules = [
        'inscripcion_id' => 'required|exists:inscripciones,id',
        'metodo_pago'    => 'required|in:Transferencia,Tarjeta',
    ];

    if ($request->metodo_pago === 'Transferencia') {
        $rules['comprobante'] = 'required|file|mimes:jpg,jpeg,png,pdf|max:5120';
    }

    if ($request->metodo_pago === 'Tarjeta') {
        $rules['comprobante'] = 'nullable';
    }

    $validated = $request->validate($rules);

    // Mostrar errores de validación en log
    if ($errors = $request->getSession()->get('errors')) {
        \Log::error("❌ VALIDATION ERROR storeAlumno", $errors->toArray());
    }

    // ===============================
    // VALIDAMOS INSCRIPCIÓN
    // ===============================
    $inscripcion = Inscripcion::where('id', $validated['inscripcion_id'])
        ->where('user_id', $user->id)
        ->where('estado', 'confirmada')
        ->firstOrFail();

    // ===============================
    // GUARDA COMPROBANTE SOLO TRANSFERENCIA
    // ===============================
    $path = null;

    if ($request->metodo_pago === 'Transferencia' && $request->hasFile('comprobante')) {
        $path = $request->file('comprobante')->store('comprobantes', 'public');
    }

    // ===============================
    // REGISTRO DEL PAGO
    // ===============================
    Pago::create([
        'inscripcion_id' => $inscripcion->id,
        'monto'          => (float) $inscripcion->curso->arancel_base,
        'metodo_pago'    => $validated['metodo_pago'],
        'user_id'        => $user->id,
        'administrativo_id' => null,
        'pagado_at'      => now(),
        'anulado'        => false,
        'comprobante'    => $path,
    ]);

    \Log::info("✅ Pago registrado correctamente", [
        "inscripcion" => $inscripcion->id,
        "metodo" => $validated['metodo_pago']
    ]);

    return redirect()
        ->route('alumno.pagos.index')
        ->with('success', 'Pago registrado correctamente. Quedará pendiente de revisión.');
}


    // ============================================================
    // 📌 MERCADOPAGO — CREAR PREFERENCIA
    // ============================================================
    public function crearPreferencia(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'inscripcion_id' => 'required|exists:inscripciones,id',
        ]);

        $inscripcion = Inscripcion::with('curso')
            ->where('id', $data['inscripcion_id'])
            ->where('user_id', $user->id)
            ->where('estado', 'confirmada')
            ->firstOrFail();

        $curso = $inscripcion->curso;

        try {
            MercadoPagoConfig::setAccessToken(config('services.mercadopago.token'));
            $client = new PreferenceClient();

            $preference = $client->create([
                "items" => [
                    [
                        "title" => $curso->nombre,
                        "quantity" => 1,
                        "unit_price" => (float) $curso->arancel_base,
                        "currency_id" => "ARS",
                    ]
                ],
                "external_reference" => (string) $inscripcion->id,

                // SDK v3 usa redirect_urls
                "redirect_urls" => [
                    "success" => url('/alumno/pagos/mercadopago/callback?status=approved'),
                    "failure" => url('/alumno/pagos/mercadopago/callback?status=failure'),
                    "pending" => url('/alumno/pagos/mercadopago/callback?status=pending'),
                ],
            ]);

            return response()->json([
                "preference_id" => $preference->id,
                "init_point"    => $preference->init_point,
            ]);

        } catch (\MercadoPago\Exceptions\MPApiException $e) {

            \Log::error("❌ ERROR MP API", [
                "status" => $e->getApiResponse()->getStatusCode(),
                "response" => $e->getApiResponse()->getContent(),
            ]);

            return response()->json([
                "error" => "MP_API_ERROR",
                "details" => $e->getApiResponse()->getContent(),
            ], 500);

        } catch (\Exception $e) {

            \Log::error("❌ ERROR GENERAL MP", [
                "message" => $e->getMessage(),
            ]);

            return response()->json([
                "error" => "MP_GENERAL_ERROR",
                "details" => $e->getMessage(),
            ], 500);
        }
    }

    // ============================================================
    // 📌 CALLBACK MERCADOPAGO — VERIFICACIÓN DEFINITIVA
    // ============================================================
    public function mercadoPagoCallback(Request $request)
    {
        $paymentId  = $request->query('payment_id');
        $reference  = $request->query('external_reference');

        if (!$reference) {
            return redirect()->route('alumno.pagos.index')
                ->with('error', 'No se pudo identificar la inscripción.');
        }

        $inscripcion = Inscripcion::find($reference);

        if (!$inscripcion) {
            return redirect()->route('alumno.pagos.index')
                ->with('error', 'Inscripción no encontrada.');
        }

        if (!$paymentId) {
            return redirect()->route('alumno.pagos.index')
                ->with('error', 'No se recibió información de pago.');
        }

        try {
            MercadoPagoConfig::setAccessToken(config('services.mercadopago.token'));
            $client = new PaymentClient();

            $payment = $client->get($paymentId);

            if ($payment->status !== 'approved') {
                return redirect()->route('alumno.pagos.index')
                    ->with('error', 'El pago no fue aprobado.');
            }

        } catch (\Exception $e) {
            return redirect()->route('alumno.pagos.index')
                ->with('error', 'Error al validar el pago con MercadoPago.');
        }

        // Evitar duplicados
        if (Pago::where('inscripcion_id', $inscripcion->id)
            ->where('metodo_pago', 'MercadoPago')
            ->where('anulado', false)
            ->exists()
        ) {
            return redirect()->route('alumno.pagos.index')
                ->with('info', 'Este pago ya estaba registrado.');
        }

        // Registrar pago aprobado
        Pago::create([
            'inscripcion_id' => $inscripcion->id,
            'monto' => (float) $inscripcion->curso->arancel_base,
            'metodo_pago' => 'MercadoPago',
            'user_id' => $inscripcion->user_id,
            'pagado_at' => now(),
            'anulado' => false,
            'numero_operacion' => $paymentId,
        ]);

        return redirect()
            ->route('alumno.pagos.index')
            ->with('success', 'Pago procesado correctamente.');
    }

    // ============================================================
    // 📌 PDF DE COMPROBANTE
    // ============================================================
    public function comprobante(Pago $pago)
    {
        $pago->load([
            'inscripcion.curso',
            'inscripcion.usuario',
            'administrativo',
        ]);

        $pdf = Pdf::loadView('pdf.comprobante-pago', compact('pago'));

        return $pdf->download("comprobante-pago-{$pago->id}.pdf");
    }

    /** 🛑 ANULAR UN PAGO (solo Administrativo / Superusuario) */
    public function anular(Request $request, Pago $pago)
    {
        $user = Auth::user();

        // Solo roles administrativos pueden anular
        if (!$user->hasRole(['administrativo', 'superusuario'])) {
            abort(403, 'No autorizado.');
        }

        $validated = $request->validate([
            'motivo' => 'required|string|min:5|max:500',
        ]);

        // No permitir anular dos veces
        if ($pago->anulado) {
            return redirect()
                ->back()
                ->with('info', 'El pago ya se encontraba anulado.');
        }

        // Marcar pago como anulado
        $pago->update([
            'anulado'          => true,
            'motivo_anulacion' => $validated['motivo'],
            'administrativo_id' => $user->id,
        ]);

        // Opcional: eliminar el comprobante asociado
        if ($pago->comprobante && \Storage::disk('public')->exists($pago->comprobante)) {
            \Storage::disk('public')->delete($pago->comprobante);
        }

        return redirect()
            ->back()
            ->with('success', 'Pago anulado correctamente.');
    }

}
