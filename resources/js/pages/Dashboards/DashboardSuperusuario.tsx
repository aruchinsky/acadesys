import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { TrendingUp } from 'lucide-react';
import { PieChart, ResponsiveContainer, Pie } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Superusuario', href: '/dashboard' },
];

const colors = ['#2662d9','#2EB88A','#E23670','#F5A623','#AF57DB'];

export default function DashboardSuperusuario() {
    // Datos estáticos
    const totalUsuarios = 150;
    const totalRoles = 4;
    const rolesDistribucion = {
        Superusuario: 1,
        Admin: 5,
        Profesor: 20,
        Alumno: 124,
    };

    const pieChartData = Object.entries(rolesDistribucion).map(([rol, count], index) => ({
        especialidad: rol,
        count,
        fill: colors[index % colors.length],
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Superusuario" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card className="flex flex-col items-center p-6 shadow-sm">
                        <CardHeader><CardTitle>Usuarios</CardTitle></CardHeader>
                        <CardContent><h2 className="text-7xl text-violet-500">{totalUsuarios}</h2></CardContent>
                        <CardFooter>Total de usuarios en el sistema.</CardFooter>
                    </Card>
                    <Card className="flex flex-col items-center p-6 shadow-sm">
                        <CardHeader><CardTitle>Roles</CardTitle></CardHeader>
                        <CardContent><h2 className="text-7xl text-green-500">{totalRoles}</h2></CardContent>
                        <CardFooter>Total de roles configurados.</CardFooter>
                    </Card>
                </div>

                <ResponsiveContainer width="100%" height={400}>
                    <Card>
                        <CardHeader><CardTitle>Distribución de Roles</CardTitle><CardDescription>2025</CardDescription></CardHeader>
                        <CardContent>
                            <ChartContainer config={{}} className="mx-auto aspect-square max-h-[370px]">
                                <PieChart>
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Pie data={pieChartData} dataKey="count" nameKey="especialidad" outerRadius={180} />
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex items-center gap-2">Usuarios agrupados por rol <TrendingUp className="h-4 w-4" /></CardFooter>
                    </Card>
                </ResponsiveContainer>
            </div>
        </AppLayout>
    );
}
