import AppLayout from '@/layouts/app-layout';
import { Inscripcion, pageProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Check, Layers, Search, UserPlus, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useMemo, useState } from 'react';

export default function AdminInscripciones() {
    const { inscripciones = [] } = usePage<pageProps>().props as pageProps & {
        inscripciones: Inscripcion[];
    };

    const [search, setSearch] = useState('');
    const [mostrarPendientes, setMostrarPendientes] = useState(true);

    const fade = {
        hidden: { opacity: 0, y: 12 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.03 },
        }),
    };

    // BADGES DEL ESTADO
    const estadoBadge = (estado: string) => {
        const variants: Record<string, string> = {
            pendiente: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
            confirmada: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
            rechazada: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
        };
        return <Badge className={`text-xs ${variants[estado] || ''}`}>{estado}</Badge>;
    };

    // FILTRO PRINCIPAL
    const filtered = useMemo(() => {
        let data = inscripciones;

        if (mostrarPendientes) {
            data = data.filter((i) => i.estado === 'pendiente');
        }

        if (search.trim().length > 0) {
            const term = search.toLowerCase();
            data = data.filter(
                (i) =>
                    i.usuario?.nombre_completo?.toLowerCase().includes(term) ||
                    i.curso?.nombre?.toLowerCase().includes(term) ||
                    i.estado.toLowerCase().includes(term),
            );
        }

        return data;
    }, [inscripciones, search, mostrarPendientes]);

    const aprobar = (id: number) => {
        router.post(route('admin.inscripciones.aprobar', id));
    };

    const rechazar = (id: number) => {
        router.post(route('admin.inscripciones.rechazar', id));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Inscripciones', href: route('administrativo.inscripciones.index') }]}>
            <Head title="Gestión de Inscripciones" />

            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 p-4">
                {/* HEADER */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
                            <UserPlus className="h-6 w-6 text-primary" /> Gestión de Inscripciones
                        </h1>
                        <p className="text-sm text-muted-foreground">Aprobación, rechazo y revisión de solicitudes de inscripción.</p>
                    </div>
                </div>

                {/* FILTROS */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <Search className="h-4 w-4 text-primary" /> Buscar inscripciones
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ej: Juan Pérez, Programación, pendiente…" />

                        <div className="mt-4 flex items-center gap-3">
                            <Switch checked={mostrarPendientes} onCheckedChange={setMostrarPendientes} id="mostrar-pendientes" />
                            <Label htmlFor="mostrar-pendientes" className="cursor-pointer">
                                Mostrar solo pendientes
                            </Label>
                        </div>
                    </CardContent>
                </Card>

                {/* TABLA */}
                <Card className="overflow-x-auto border border-border/40 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Layers className="h-5 w-5 text-primary" />
                            Listado de inscripciones
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {filtered.length === 0 ? (
                            <p className="py-4 text-center text-sm text-muted-foreground">No hay inscripciones que coincidan con el filtro.</p>
                        ) : (
                            <table className="min-w-full table-auto text-sm">
                                <thead className="bg-muted text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Alumno</th>
                                        <th className="px-4 py-2 text-left">Curso</th>
                                        <th className="px-4 py-2 text-left">Estado</th>
                                        <th className="px-4 py-2 text-left">Origen</th>
                                        <th className="px-4 py-2 text-left">Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filtered.map((ins, i) => (
                                        <motion.tr
                                            key={ins.id}
                                            variants={fade}
                                            initial="hidden"
                                            animate="visible"
                                            custom={i}
                                            className="border-b transition-colors hover:bg-accent/10"
                                        >
                                            <td className="px-4 py-2 font-medium">{ins.usuario?.nombre_completo ?? '—'}</td>

                                            <td className="px-4 py-2">{ins.curso?.nombre ?? '—'}</td>

                                            <td className="px-4 py-2">{estadoBadge(ins.estado)}</td>

                                            <td className="px-4 py-2 capitalize">{ins.origen}</td>

                                            <td className="flex gap-2 px-4 py-2">
                                                {ins.estado === 'pendiente' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            className="bg-emerald-600 text-white hover:bg-emerald-700"
                                                            onClick={() => aprobar(ins.id)}
                                                        >
                                                            <Check className="mr-1 h-4 w-4" /> Aprobar
                                                        </Button>

                                                        <Button size="sm" variant="destructive" onClick={() => rechazar(ins.id)}>
                                                            <X className="mr-1 h-4 w-4" /> Rechazar
                                                        </Button>
                                                    </>
                                                )}

                                                {ins.estado !== 'pendiente' && (
                                                    <Badge className="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                                                        Ya procesada
                                                    </Badge>
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
        </AppLayout>
    );
}
