import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Alumno', href: '/dashboard' },
];

export default function DashboardAlumno() {
    const cursosInscripto = 3;
    const tareasCompletadas = 18;
    const proximoExamen = "15/10/2025 - Programación I";

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Alumno" />
            <div className="grid auto-rows-min gap-4 md:grid-cols-3 p-4">
                <Card><CardHeader><CardTitle>Cursos</CardTitle></CardHeader><CardContent><h2 className="text-6xl text-blue-500">{cursosInscripto}</h2></CardContent><CardFooter>Cursos inscritos</CardFooter></Card>
                <Card><CardHeader><CardTitle>Tareas</CardTitle></CardHeader><CardContent><h2 className="text-6xl text-green-500">{tareasCompletadas}</h2></CardContent><CardFooter>Tareas completadas</CardFooter></Card>
                <Card><CardHeader><CardTitle>Examen Próximo</CardTitle></CardHeader><CardContent><h2 className="text-xl text-red-500">{proximoExamen}</h2></CardContent><CardFooter>Fecha y materia</CardFooter></Card>
            </div>
        </AppLayout>
    );
}
