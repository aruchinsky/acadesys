import AppLayout from '@/layouts/app-layout';
import { pageProps, Pago } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertTriangle, CreditCard, DollarSign, FileText, Image as ImageIcon, Search, ShieldCheck, Trash2 } from 'lucide-react';

import { Toast } from '@/components/toast-provider';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useMemo, useState } from 'react';

export default function AdminIndex() {
    const { pagos = [] } = usePage<pageProps>().props as pageProps & {
        pagos: Pago[];
    };

    const auth = usePage<pageProps>().props.auth;
    const roles = auth?.roles ?? [];
    const isAdminLike = roles.includes('administrativo') || roles.includes('superusuario');

    const [search, setSearch] = useState('');
    const [mostrarAnulados, setMostrarAnulados] = useState(false);
    const [motivos, setMotivos] = useState<Record<number, string>>({});
    const [openModal, setOpenModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Abrir comprobante del alumno
    const abrirComprobante = (ruta?: string | null) => {
        if (!ruta) return Toast.error('No hay comprobante disponible.');

        setPreviewUrl(`/storage/${ruta}`);
        setOpenModal(true);
    };

    const fade = {
        hidden: { opacity: 0, y: 12 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.03 },
        }),
    };

    // FILTRO PRINCIPAL
    const filteredPagos = useMemo(() => {
        if (!search.trim()) return pagos;

        const term = search.toLowerCase();
        return pagos.filter((p) => {
            const alumno = p.inscripcion?.usuario?.nombre_completo?.toLowerCase() ?? '';
            const curso = p.inscripcion?.curso?.nombre?.toLowerCase() ?? '';
            const metodo = p.metodo_pago?.toLowerCase() ?? '';

            return alumno.includes(term) || curso.includes(term) || metodo.includes(term);
        });
    }, [pagos, search]);

    // TOTAL sin anulados
    const totalMonto = useMemo(() => {
        return filteredPagos.filter((p) => !p.anulado).reduce((acc, p) => acc + Number(p.monto ?? 0), 0);
    }, [filteredPagos]);

    const methodBadge = (metodo: string) => {
        const variants: Record<string, string> = {
            Efectivo: 'bg-emerald-100 text-emerald-700',
            Transferencia: 'bg-blue-100 text-blue-700',
            Tarjeta: 'bg-purple-100 text-purple-700',
            MercadoPago: 'bg-cyan-100 text-cyan-700',
        };

        return <Badge className={`text-xs ${variants[metodo] || 'bg-slate-200 text-slate-700'}`}>{metodo}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Pagos', href: route('administrativo.pagos.index') }]}>
            <Head title="Gestión de pagos" />

            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 p-4">
                {/* HEADER */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
                            <CreditCard className="h-6 w-6 text-primary" /> Gestión de pagos
                        </h1>
                        <p className="text-sm text-muted-foreground">Pagos registrados, comprobantes, anulados y filtros avanzados.</p>
                    </div>

                    {/* TOTAL */}
                    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                        <Card className="border border-border/60 shadow-sm sm:w-64">
                            <CardContent className="px-4 py-3">
                                <span className="flex items-center gap-1 text-xs tracking-wide text-muted-foreground uppercase">
                                    <DollarSign className="h-3 w-3" />
                                    Total cobrado
                                </span>
                                <span className="text-lg font-bold">
                                    {totalMonto.toLocaleString('es-AR', {
                                        style: 'currency',
                                        currency: 'ARS',
                                    })}
                                </span>
                            </CardContent>
                        </Card>

                        {/* BOTÓN CREAR PAGO */}
                        {isAdminLike && (
                            <Button
                                onClick={() => router.visit(route('administrativo.pagos.create'))}
                                className="bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                            >
                                + Generar pago
                            </Button>
                        )}
                    </div>
                </div>

                {/* FILTROS */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <Search className="h-4 w-4 text-primary" />
                            Buscar
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Ej: Juan Pérez, Programación, transferencia…"
                        />

                        {/* SWITCH */}
                        <div className="mt-4 flex items-center gap-3">
                            <Switch checked={mostrarAnulados} onCheckedChange={setMostrarAnulados} id="mostrar-anulados" />
                            <Label htmlFor="mostrar-anulados" className="cursor-pointer">
                                Mostrar pagos anulados
                            </Label>
                        </div>
                    </CardContent>
                </Card>

                {/* TABLA */}
                <Card className="overflow-x-auto border border-border/40 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            Listado de pagos
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {filteredPagos.length === 0 ? (
                            <p className="py-4 text-center text-sm text-muted-foreground">No hay pagos registrados.</p>
                        ) : (
                            <table className="min-w-full table-auto text-sm">
                                <thead className="bg-muted text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-2 text-left">ID</th>
                                        <th className="px-4 py-2 text-left">Alumno</th>
                                        <th className="px-4 py-2 text-left">Curso</th>
                                        <th className="px-4 py-2 text-left">Monto</th>
                                        {/* <th className="px-4 py-2 text-left">Fecha</th> */}
                                        <th className="px-4 py-2 text-left">Método</th>
                                        <th className="px-4 py-2 text-left">Comprobante Alumno</th>
                                        <th className="px-4 py-2 text-left">Recibo Pago</th>
                                        {/* <th className="px-4 py-2 text-left">Registrado por</th> */}
                                        <th className="px-4 py-2 text-left">Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredPagos
                                        .filter((p) => (mostrarAnulados ? true : !p.anulado))
                                        .map((pago, i) => (
                                            <motion.tr
                                                key={pago.id}
                                                variants={fade}
                                                initial="hidden"
                                                animate="visible"
                                                custom={i}
                                                className="border-b transition-colors hover:bg-accent/10"
                                            >
                                                <td className="px-4 py-2">{pago.id}</td>

                                                <td className="px-4 py-2">{pago.inscripcion?.usuario?.nombre_completo ?? '—'}</td>

                                                <td className="px-4 py-2">{pago.inscripcion?.curso?.nombre ?? '—'}</td>

                                                <td className="px-4 py-2 align-middle">
                                                    {pago.anulado ? (
                                                        <div className="flex flex-col">
                                                            {/* MONTO TACHADO */}
                                                            <span className="font-medium text-red-500/70 line-through">
                                                                {Number(pago.monto).toLocaleString('es-AR', {
                                                                    style: 'currency',
                                                                    currency: 'ARS',
                                                                })}
                                                            </span>

                                                            {/* MOTIVO (solo cuando se muestran pag. anulados) */}
                                                            {mostrarAnulados && pago.motivo_anulacion && (
                                                                <span className="mt-1 text-xs text-red-400 italic">
                                                                    Motivo: {pago.motivo_anulacion}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="font-medium">
                                                            {Number(pago.monto).toLocaleString('es-AR', {
                                                                style: 'currency',
                                                                currency: 'ARS',
                                                            })}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* <td className="px-4 py-2">{formatFechaLocal(pago.pagado_at)}</td> */}

                                                <td className="px-4 py-2">{methodBadge(pago.metodo_pago)}</td>

                                                {/* ✔ COMPROBANTE SUBIDO */}
                                                <td className="px-4 py-2">
                                                    {!pago.anulado && pago.comprobante ? (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => abrirComprobante(pago.comprobante)}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <ImageIcon className="h-4 w-4" />
                                                            Ver
                                                        </Button>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">—</span>
                                                    )}
                                                </td>

                                                {/* ✔ COMPROBANTE PDF SISTEMA */}
                                                <td className="px-4 py-2">
                                                    {!pago.anulado ? (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => window.open(route('pagos.comprobante', pago.id), '_blank')}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <FileText className="h-4 w-4" />
                                                            PDF
                                                        </Button>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">—</span>
                                                    )}
                                                </td>

                                                {/* <td className="px-4 py-2">
                          {pago.administrativo?.nombre_completo ?? "—"}
                        </td> */}

                                                {/* ACCIONES */}
                                                <td className="px-4 py-2 align-middle">
                                                    {pago.anulado ? (
                                                        <Badge className="bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                                                            ANULADO
                                                        </Badge>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            {/* 🗑️ Botón Anular */}
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button size="sm" variant="destructive" className="flex items-center gap-1">
                                                                        <Trash2 className="h-4 w-4" /> Anular
                                                                    </Button>
                                                                </AlertDialogTrigger>

                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle className="flex items-center gap-2">
                                                                            <AlertTriangle className="h-5 w-5 text-red-500" />
                                                                            Anular pago
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Debes ingresar un <strong>motivo</strong> para anular este pago.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>

                                                                    <div className="mt-3">
                                                                        <textarea
                                                                            className="w-full rounded-md border bg-background p-2 text-sm"
                                                                            rows={3}
                                                                            placeholder="Ej: pago duplicado, error administrativo..."
                                                                            onChange={(e) =>
                                                                                setMotivos({
                                                                                    ...motivos,
                                                                                    [pago.id]: e.target.value,
                                                                                })
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                            onClick={() => {
                                                                                const motivo = motivos[pago.id];
                                                                                if (!motivo || motivo.trim().length < 5) {
                                                                                    return Toast.error('Debes ingresar un motivo más detallado.');
                                                                                }

                                                                                router.post(
                                                                                    route('administrativo.pagos.anular', pago.id),
                                                                                    { motivo },
                                                                                    { preserveScroll: true },
                                                                                );
                                                                            }}
                                                                        >
                                                                            Anular
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* MODAL COMPROBANTE — GRANDE, CENTRADO, SIN SCROLL */}
            <AlertDialog open={openModal} onOpenChange={setOpenModal}>
                <AlertDialogContent className="/* ancho centrado */ /* límite elegante */ /* alto grande */ flex h-[90vh] max-h-none w-[70vw] max-w-4xl flex-col p-4">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Comprobante del pago</AlertDialogTitle>
                        <AlertDialogDescription>Vista previa del comprobante cargado por el alumno.</AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* CONTENEDOR DEL COMPROBANTE */}
                    <div className="flex flex-1 items-center justify-center overflow-hidden rounded-lg bg-background">
                        {previewUrl && previewUrl.endsWith('.pdf') ? (
                            <iframe src={previewUrl ?? ''} className="h-full w-full object-contain" style={{ border: 'none' }} />
                        ) : (
                            <img src={previewUrl ?? ''} className="max-h-full max-w-full rounded-md object-contain" />
                        )}
                    </div>

                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel onClick={() => setOpenModal(false)} className="w-full sm:w-auto">
                            Cerrar
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
