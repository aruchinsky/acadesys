import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, ClipboardList, GraduationCap, Sparkles, Wallet } from 'lucide-react';

export default function Alumno() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const opciones = [
        {
            titulo: 'Cursos disponibles',
            descripcion: 'Explorá los cursos abiertos para inscripción.',
            icono: GraduationCap,
            href: route('alumno.cursos.index'),
        },
        {
            titulo: 'Mis Cursos',
            descripcion: 'Visualizá tus cursos activos y progreso.',
            icono: BookOpen,
            href: route('alumno.mis-cursos.index'),
        },
        {
            titulo: 'Pagos',
            descripcion: 'Consultá tus cuotas, comprobantes y estado.',
            icono: Wallet,
            href: route('alumno.pagos.index'),
        },
        {
            titulo: 'Mis Asistencias',
            descripcion: 'Revisá tus registros de asistencia.',
            icono: ClipboardList,
            href: route('alumno.asistencias.index'),
        },
        // {
        //   titulo: "Calendario",
        //   descripcion: "Fechas importantes y próximos exámenes.",
        //   icono: CalendarCheck,
        //   href: "#",
        // },
    ];

    const fade = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }),
    };

    return (
        <AppLayout>
            <Head title="Dashboard Estudiante" />

            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mx-2 rounded-xl border border-border bg-gradient-to-r from-primary/15 via-background to-secondary/15 p-6 shadow-sm sm:mx-4 md:mx-8"
            >
                <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
                    <GraduationCap className="h-6 w-6 text-primary" /> ¡Hola, {user?.nombre ?? 'Estudiante'}!
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Bienvenido a tu panel de estudiante 🎓. Consultá tus cursos, pagos y asistencias desde aquí.
                </p>
            </motion.div>

            <div className="mt-8 grid gap-4 px-2 sm:grid-cols-2 sm:px-4 md:px-8 lg:grid-cols-3 xl:grid-cols-4">
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
