import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BarChart3, BookOpen, CheckCircle2, ClipboardList, PlusCircle, Sparkles, Wallet } from 'lucide-react';

export default function Administrativo() {
    const { stats } = usePage<{
        stats: {
            inscripcionesPendientes: number;
            pagosHoy: number;
            totalCursos: number;
        };
    }>().props;

    // 🍃 Animación
    const fade = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.05 },
        }),
    };

    // 📌 Opciones sincronizadas con el sidebar
    const opciones = [
        {
            titulo: 'Gestión de Pagos',
            descripcion: 'Listá y administrá todos los pagos registrados.',
            icono: Wallet,
            href: route('administrativo.pagos.index'),
        },
        {
            titulo: 'Inscripciones',
            descripcion: 'Consultá alumnos inscriptos por curso.',
            icono: ClipboardList,
            href: route('inscripciones.index'),
        },
        {
            titulo: 'Cursos',
            descripcion: 'Administrá los cursos vigentes y su información.',
            icono: BookOpen,
            href: route('cursos.index'),
        },
        {
            titulo: 'Asistencias',
            descripcion: 'Visualizá y gestioná registros de asistencia.',
            icono: CheckCircle2,
            href: route('administrativo.asistencias.index'),
        },
        {
            titulo: 'Reportes',
            descripcion: 'Análisis y estadísticas del sistema.',
            icono: BarChart3,
            href: '#',
        },
    ];

    return (
        <AppLayout>
            <Head title="Dashboard Administrativo" />

            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mx-2 rounded-xl border border-border bg-gradient-to-r from-primary/15 via-background to-secondary/15 p-6 shadow-sm sm:mx-4 md:mx-8"
            >
                <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
                    <Sparkles className="h-6 w-6 text-primary" /> Panel Administrativo
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">Gestión económica y académica centralizada.</p>
            </motion.div>

            {/* KPI GENERADOS POR EL BACKEND */}
            <div className="mt-6 grid gap-4 px-2 sm:grid-cols-2 sm:px-4 md:px-8 lg:grid-cols-3 xl:grid-cols-3">
                <Card className="border-border p-4 shadow-sm">
                    <h3 className="text-sm text-muted-foreground">Inscripciones pendientes</h3>
                    <p className="mt-1 text-xl font-semibold">{stats.inscripcionesPendientes}</p>
                </Card>

                <Card className="border-border p-4 shadow-sm">
                    <h3 className="text-sm text-muted-foreground">Pagos registrados hoy</h3>
                    <p className="mt-1 text-xl font-semibold">${stats.pagosHoy.toLocaleString()}</p>
                </Card>

                <Card className="border-border p-4 shadow-sm">
                    <h3 className="text-sm text-muted-foreground">Total de cursos</h3>
                    <p className="mt-1 text-xl font-semibold">{stats.totalCursos}</p>
                </Card>
            </div>

            {/* ACCIÓN RÁPIDA */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mx-2 mt-6 sm:mx-4 md:mx-8"
            >
                <Card className="border border-primary/40 bg-primary/5 shadow-md transition-all hover:bg-primary/10">
                    <CardContent className="flex flex-col items-start justify-between gap-4 py-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="flex items-center gap-2 text-base font-semibold text-primary">
                                <PlusCircle className="h-5 w-5 text-primary" />
                                Acción rápida
                            </h2>
                            <p className="text-sm text-muted-foreground">Generar un nuevo pago presencial para un alumno.</p>
                        </div>

                        <Button
                            onClick={() => router.visit(route('administrativo.pagos.create'))}
                            className="flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/90"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Generar Pago
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>

            {/* NAVEGACIÓN PRINCIPAL */}
            <div className="mt-8 grid gap-4 px-2 pb-10 sm:grid-cols-2 sm:px-4 md:px-8 lg:grid-cols-3 xl:grid-cols-4">
                {opciones.map((op, i) => (
                    <motion.div key={op.titulo} variants={fade} initial="hidden" animate="visible" custom={i}>
                        <Card className="flex h-full flex-col border-border transition-all hover:shadow-md">
                            <CardHeader className="relative pb-1">
                                <div className="absolute inset-0 rounded-t-lg bg-gradient-to-r from-primary/30 to-secondary/20 opacity-[0.07]" />
                                <div className="relative flex items-center justify-between">
                                    <CardTitle className="text-sm font-semibold">{op.titulo}</CardTitle>
                                    <div className="rounded-full bg-muted/50 p-2">
                                        <op.icono className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="flex flex-1 flex-col justify-between py-3">
                                <p className="mb-3 text-sm text-muted-foreground">{op.descripcion}</p>
                                <Button asChild size="sm" className="w-full">
                                    <Link href={op.href}>
                                        <Sparkles className="mr-1 h-4 w-4" /> Ingresar
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </AppLayout>
    );
}
