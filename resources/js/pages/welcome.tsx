import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SharedData, User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import {InfoCard} from '@/components/info-card';
import { AnimatePresence, motion } from 'framer-motion';

const navItems = [
    {
        label: 'Primario',
        submenu: [
            { title: 'Inscripción', href: '/primario/inscripcion' },
            { title: 'Plan de estudio', href: '/primario/plan-de-estudio' },
        ],
    },
    {
        label: 'Secundario',
        submenu: [
            { title: 'Inscripción', href: '/secundario/inscripcion' },
            { title: 'Plan de estudio', href: '/secundario/plan-de-estudio' },
        ],
    },
    {
        label: 'Terciario',
        submenu: [
            { title: 'Carreras', href: '/terciario/carreras' },
            { title: 'Requisitos', href: '/terciario/requisitos' },
        ],
    },
    {
        label: 'Sobre Nosotros',
        submenu: [
            { title: 'Historia', href: '/sobre-nosotros/historia' },
            { title: 'Misión y Visión', href: '/sobre-nosotros/mision-vision' },
        ],
    },
    {
        label: 'Contacto',
        submenu: [
            { title: 'Ubicación', href: '/contacto/ubicacion' },
            { title: 'Formulario', href: '/contacto/formulario' },
        ],
    },
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const user: User | null = auth.user ?? null;

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const toggleIndex = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const heroImages = [
        '/hero/instituto.jpeg',
        '/hero/instituto2.jpg',
        '/hero/instituto3.jpg',
    ];

    function Hero() {
        const [currentIndex, setCurrentIndex] = useState(0);

        const goToPrevious = () => {
            setCurrentIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
        };

        const goToNext = () => {
            setCurrentIndex((prev) => (prev + 1) % heroImages.length);
        };

        useEffect(() => {
            const interval = setInterval(goToNext, 5000);
            return () => clearInterval(interval);
        }, []);

        return (
            <section className="relative h-[300px] w-full overflow-hidden lg:h-[400px]">
                <AnimatePresence>
                    <motion.div
                        key={heroImages[currentIndex]}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${heroImages[currentIndex]}')` }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    />
                </AnimatePresence>
                <div
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'var(--color-foreground)' }}
                >
                    <h1 className="mb-2 text-2xl font-bold md:text-3xl">
                        Bienvenidos a ACADESYS
                    </h1>
                    <p className="max-w-xl text-sm md:text-base">
                        Gestión académica moderna para todos los niveles educativos. Descubrí nuestras propuestas y servicios.
                    </p>
                </div>
                <button
                    onClick={goToPrevious}
                    className="absolute top-1/2 left-4 z-20 -translate-y-1/2 text-white hover:text-gray-300"
                >
                    <ChevronLeft size={32} />
                </button>
                <button
                    onClick={goToNext}
                    className="absolute top-1/2 right-4 z-20 -translate-y-1/2 text-white hover:text-gray-300"
                >
                    <ChevronRight size={32} />
                </button>
            </section>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
            {/* Header */}
            <header
                className="border-b"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
            >
                <div className="mx-auto flex h-16 items-center justify-between px-4 md:max-w-7xl">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <img src="/acadesys_logo.png" alt="Logo ACADESYS" className="h-10 w-auto" />
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden flex-1 justify-center lg:flex">
                        <div className="flex space-x-4">
                            {navItems.map((item, index) => (
                                <Popover key={index}>
                                    <PopoverTrigger className="px-4 py-2 text-base font-medium hover:bg-[var(--color-muted)] dark:hover:bg-[var(--color-muted-foreground)]">
                                        {item.label}
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48 bg-[var(--color-popover)] p-2 shadow-md dark:bg-[var(--color-popover-foreground)]">
                                        {item.submenu.map((subItem, subIndex) => (
                                            <Link
                                                key={subIndex}
                                                href={subItem.href}
                                                className="block rounded px-3 py-2 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-muted)] dark:hover:bg-[var(--color-muted-foreground)]"
                                            >
                                                {subItem.title}
                                            </Link>
                                        ))}
                                    </PopoverContent>
                                </Popover>
                            ))}
                        </div>
                    </nav>

                    {/* Botones acceso/panel */}
                    <div className="ml-4 flex items-center space-x-3">
                        {user ? (
                            <Button asChild variant="default">
                                <Link href={route('dashboard')}>Ir al Panel</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant="outline">
                                    <Link href={route('login')}>Acceder</Link>
                                </Button>
                                <Button asChild variant="default">
                                    <Link href={route('register')}>Registrarse</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Nav */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6 text-[var(--color-foreground)]" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-[var(--color-background)] p-4 [&>button.absolute]:hidden">
                                <div className="space-y-4">
                                    {navItems.map((item, index) => (
                                        <div key={index}>
                                            <button
                                                onClick={() => toggleIndex(index)}
                                                className="flex w-full items-center justify-between font-semibold text-[var(--color-foreground)]"
                                            >
                                                {item.label}
                                                <span className="ml-2">{openIndex === index ? '▲' : '▼'}</span>
                                            </button>
                                            {openIndex === index && (
                                                <ul className="mt-2 ml-4 space-y-1">
                                                    {item.submenu.map((subItem, subIndex) => (
                                                        <li key={subIndex}>
                                                            <Link
                                                                href={subItem.href}
                                                                className="block rounded px-3 py-2 text-sm text-[var(--color-foreground)] hover:text-[var(--color-primary)]"
                                                            >
                                                                {subItem.title}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}

                                    <div className="pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                                        {user ? (
                                            <Link
                                                href={route('dashboard')}
                                                className="block rounded bg-[var(--color-primary)] px-4 py-2 text-center text-[var(--color-primary-foreground)] hover:opacity-90"
                                            >
                                                Ir al Panel
                                            </Link>
                                        ) : (
                                            <>
                                                <Link
                                                    href={route('login')}
                                                    className="block rounded border px-4 py-2 text-center text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
                                                >
                                                    Acceder
                                                </Link>
                                                <Link
                                                    href={route('register')}
                                                    className="mt-2 block rounded bg-[var(--color-primary)] px-4 py-2 text-center text-[var(--color-primary-foreground)] hover:opacity-90"
                                                >
                                                    Registrarse
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <Hero />

            {/* Novedades */}
            <section className="mx-auto px-4 py-12 md:max-w-7xl">
                <h3 className="mb-6 text-center text-2xl font-semibold text-[var(--color-primary)]">
                    Novedades
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <InfoCard
                            key={i}
                            title={`Novedad ${i}`}
                            description={`Descripción breve de la novedad número ${i}. Más información próximamente.`}
                            imageUrl="/hero/instituto.jpeg"
                        />
                    ))}
                </div>
            </section>

            {/* Carreras */}
            <section className="mx-auto bg-[var(--color-card)] px-4 py-12 md:max-w-7xl">
                <h3 className="mb-6 text-center text-2xl font-semibold text-[var(--color-primary)]">
                    Carreras del Nivel Terciario
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {[
                        {
                            title: 'Tecnicatura en Programación',
                            description: 'Formate en desarrollo de software con alta demanda laboral.',
                            imageUrl: '/img_carreras/programacion.jpg',
                            link: '/carreras/tecnicatura-programacion',
                        },
                        {
                            title: 'Diseño Gráfico',
                            description: 'Aprendé a crear piezas visuales efectivas y atractivas.',
                            imageUrl: '/img_carreras/diseno.jpg',
                            link: '/carreras/diseno-grafico',
                        },
                        {
                            title: 'Marketing Digital',
                            description: 'Estrategias online para posicionar marcas y negocios.',
                            imageUrl: '/img_carreras/marketing.jpg',
                            link: '/carreras/marketing-digital',
                        },
                    ].map((carrera, i) => (
                        <InfoCard key={i} {...carrera} />
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-12 border-t" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}>
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 text-[var(--color-foreground)] md:grid-cols-4">
                    <div>
                        <h5 className="mb-2 font-bold">Instituto</h5>
                        <p>Formamos docentes comprometidos con el futuro.</p>
                    </div>
                    <div>
                        <h5 className="mb-2 font-bold">Contacto</h5>
                        <p>Email: contacto@acadesys.edu.ar</p>
                        <p>Tel: (0370) 123-456</p>
                    </div>
                    <div>
                        <h5 className="mb-2 font-bold">Ubicación</h5>
                        <p>Av. Educación 123, Formosa, Argentina</p>
                    </div>
                    <div>
                        <h5 className="mb-2 font-bold">Redes Sociales</h5>
                        <p>Facebook, Instagram, Twitter</p>
                    </div>
                </div>
                <div className="border-t py-4 text-center text-sm" style={{ borderColor: 'var(--color-border)' }}>
                    © {new Date().getFullYear()} ACADESYS. Todos los derechos reservados.
                </div>
            </footer>
        </div>
    );
}
