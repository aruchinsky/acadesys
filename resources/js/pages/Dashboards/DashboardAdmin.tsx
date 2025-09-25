import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { PieChart, ResponsiveContainer, Pie } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Administrativo', href: '/dashboard' },
];

const colors = ['#2662d9','#2EB88A','#E23670','#F5A623','#AF57DB'];

export default function DashboardAdmin() {
    const totalCursos = 35;
    const totalPagos = 500;
    const ingresos = 120000;

    const cursosPorCategoria = {
        Programación: 10,
        Redes: 8,
        Diseño: 7,
        Marketing: 10,
    };

    const pieChartData = Object.entries(cursosPorCategoria).map(([cat, count], i) => ({
        especialidad: cat,
        count,
        fill: colors[i % colors.length],
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Administrativo" />
            <div className="grid auto-rows-min gap-4 md:grid-cols-3 p-4">
                <Card><CardHeader><CardTitle>Cursos</CardTitle></CardHeader><CardContent><h2 className="text-6xl text-blue-500">{totalCursos}</h2></CardContent><CardFooter>Total cursos activos</CardFooter></Card>
                <Card><CardHeader><CardTitle>Pagos</CardTitle></CardHeader><CardContent><h2 className="text-6xl text-green-500">{totalPagos}</h2></CardContent><CardFooter>Total de pagos procesados</CardFooter></Card>
                <Card><CardHeader><CardTitle>Ingresos</CardTitle></CardHeader><CardContent><h2 className="text-6xl text-purple-500">${ingresos}</h2></CardContent><CardFooter>Ingresos totales</CardFooter></Card>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <Card>
                    <CardHeader><CardTitle>Cursos por Categoría</CardTitle><CardDescription>2025</CardDescription></CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="mx-auto aspect-square max-h-[370px]">
                            <PieChart>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Pie data={pieChartData} dataKey="count" nameKey="especialidad" outerRadius={180} />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </ResponsiveContainer>
        </AppLayout>
    );
}
