import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type pageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Activity, BarChart3, BookOpen, ClipboardList, Layers, Settings2, Sparkles, UserCog, Users, Wallet } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];
interface AdminStats {
    cursosActivos?: number;
    profesores?: number;
    alumnos?: number;
    inscripciones?: number;
    pagosTotales?: number;
    ingresosMes?: number;
    asistenciasMes?: number;
}

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.06, duration: 0.4 },
    }),
};

export default function AdminSistema() {
    const { auth, stats = {} } = usePage<pageProps & { stats: AdminStats }>().props;
    const user = auth?.user ?? null;

    const dataCards = [
        { label: 'Cursos activos', value: stats.cursosActivos ?? 0, icon: BookOpen },
        { label: 'Profesores', value: stats.profesores ?? 0, icon: UserCog },
        { label: 'Alumnos', value: stats.alumnos ?? 0, icon: Users },
        { label: 'Inscripciones', value: stats.inscripciones ?? 0, icon: ClipboardList },
        { label: 'Pagos registrados', value: stats.pagosTotales ?? 0, icon: Wallet },
        { label: 'Ingresos del mes', value: `$${stats.ingresosMes ?? 0}`, icon: BarChart3 },
        { label: 'Asistencias del mes', value: stats.asistenciasMes ?? 0, icon: Activity },
    ];

    const accesos = [
        { titulo: 'Cursos', icono: BookOpen, href: route('cursos.index') },
        { titulo: 'Usuarios', icono: Users, href: route('usuarios.index') },
        { titulo: 'Pagos', icono: Wallet, href: route('administrativo.pagos.index') },
        { titulo: 'Asistencias', icono: ClipboardList, href: route('superusuario.asistencias.index') },
        { titulo: 'Roles y Permisos', icono: Settings2, href: route('roles.index') },
        { titulo: 'Reportes', icono: BarChart3, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Superusuario" />

            {/* ===== HERO ===== */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative mx-2 overflow-hidden rounded-xl border border-border bg-gradient-to-r from-primary/15 via-background to-secondary/15 p-6 shadow-sm sm:mx-4 md:mx-8"
            >
                <div className="relative z-10">
                    <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
                        <Layers className="h-6 w-6 text-primary" /> Panel de Control
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Bienvenido, <strong>{user?.name}</strong>. Administrá cursos, usuarios y supervisá la actividad del campus.
                    </p>
                </div>
                <motion.div
                    animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 8 }}
                    className="absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-primary/25 blur-3xl"
                />
            </motion.div>

            {/* ===== MÉTRICAS ===== */}
            <div className="mt-8 grid gap-4 px-2 sm:grid-cols-2 sm:px-4 md:px-8 lg:grid-cols-3 xl:grid-cols-4">
                {dataCards.map((card, i) => (
                    <motion.div key={card.label} variants={fadeIn} initial="hidden" animate="visible" custom={i}>
                        <Card className="border-border transition-all duration-300 hover:shadow-md">
                            <CardContent className="flex items-center gap-3 py-5">
                                <div className="rounded-full bg-primary/10 p-3">
                                    <card.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{card.label}</p>
                                    <p className="text-lg font-semibold text-foreground">{card.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* ===== ACCESOS ===== */}
            <div className="mt-10 px-2 sm:px-4 md:px-8">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Sparkles className="h-5 w-5 text-primary" /> Accesos rápidos
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {accesos.map((item, i) => (
                        <motion.div key={i} variants={fadeIn} initial="hidden" animate="visible" custom={i}>
                            <Card className="group h-full border-border transition-all hover:shadow-md">
                                <CardHeader className="relative pb-1">
                                    <div className="absolute inset-0 rounded-t-lg bg-gradient-to-r from-primary/40 to-secondary/20 opacity-[0.07]" />
                                    <div className="relative flex items-center justify-between">
                                        <CardTitle className="text-sm font-semibold">{item.titulo}</CardTitle>
                                        <div className="rounded-full bg-muted/50 p-2">
                                            <item.icono className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-col justify-between py-3">
                                    <Button asChild size="sm" className="w-full">
                                        <Link href={item.href}>Ingresar</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ===== ACTIVIDAD ===== */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative mx-2 mt-12 overflow-hidden rounded-xl border border-border p-6 sm:mx-4 md:mx-8"
            >
                <PlaceholderPattern className="pointer-events-none absolute inset-0 stroke-muted/10" />
                <h2 className="relative z-10 mb-3 flex items-center gap-2 text-lg font-semibold text-primary">
                    <Activity className="h-5 w-5" /> Actividad reciente
                </h2>
                <p className="relative z-10 text-sm text-muted-foreground">
                    Visualizá los movimientos generales del sistema: pagos, inscripciones y nuevas altas.
                </p>
                <div className="relative z-10 mt-4 flex flex-wrap gap-2 text-sm">
                    <Badge className="bg-primary/10 text-primary">💳 {stats.pagosTotales} pagos</Badge>
                    <Badge className="bg-secondary/10 text-secondary-foreground">📚 {stats.cursosActivos} cursos</Badge>
                    <Badge className="bg-accent/10 text-accent-foreground">👩‍🏫 {stats.profesores} docentes</Badge>
                </div>
            </motion.div>
        </AppLayout>
    );
}
