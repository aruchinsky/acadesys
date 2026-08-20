import { InfoCard } from '@/components/info-card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SharedData, User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, Clock, Facebook, Instagram, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/* ==============================================
   ⚙️ CONFIGURACIÓN DE ANIMACIONES
   ============================================== */
const ANIMATION = {
    duration: 0.8,
    delayStep: 0.15,
    yOffset: 20,
    opacityStart: 0,
    opacityEnd: 1,
};

const fadeUp: Variants = {
    hidden: { opacity: ANIMATION.opacityStart, y: ANIMATION.yOffset },
    visible: (i: number = 0) => ({
        opacity: ANIMATION.opacityEnd,
        y: 0,
        transition: {
            type: 'tween',
            duration: ANIMATION.duration,
            delay: i * ANIMATION.delayStep,
        },
    }),
};

/* ==============================================
   🧩 COMPONENTE PRINCIPAL
   ============================================== */
export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const user: User | null = auth.user ?? null;

    const heroImages = ['/hero/dashboard.png', '/hero/institucion.png', '/hero/equipo.png'];

    const [currentIndex, setCurrentIndex] = useState(0);
    const goToPrevious = () => setCurrentIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
    const goToNext = () => setCurrentIndex((prev) => (prev + 1) % heroImages.length);

    useEffect(() => {
        const interval = setInterval(() => setCurrentIndex((previous) => (previous + 1) % heroImages.length), 6000);
        return () => clearInterval(interval);
    }, [heroImages.length]);

    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors">
            {/* ============================
          🔝 HEADER
      ============================ */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: ANIMATION.duration }}
                className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/70 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--color-background)]/50"
            >
                <div className="mx-auto flex h-16 items-center justify-between px-4 md:max-w-7xl">
                    <div className="flex items-center space-x-2">
                        <img src="/acadesys_logo.png" alt="AcadeSys Logo" className="h-9 w-auto" />
                        <span className="text-lg font-semibold tracking-tight">by AIR Sistemas</span>
                    </div>

                    {/* Navegación */}
                    <nav className="hidden gap-6 text-sm font-medium lg:flex">
                        {['Características', 'Instituciones', 'Preguntas Frecuentes', 'Contacto'].map((item, i) => {
                            const hrefs = ['#features', '#instituciones', '#faq', '#contacto'];
                            return (
                                <motion.div key={item} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
                                    <Link href={hrefs[i]} className="transition hover:text-primary">
                                        {item}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </nav>

                    {/* Botones visibles solo en desktop */}
                    <div className="relative hidden items-center gap-2 lg:flex">
                        {user ? (
                            <Button asChild variant="default">
                                <Link href={route('dashboard')}>Ir al Panel</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant="outline">
                                    <Link href={route('login')}>Acceder</Link>
                                </Button>

                                {/* Botón Registrarse deshabilitado con tooltip */}
                                <div
                                    className="relative"
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                    onClick={() => setShowTooltip(true)}
                                >
                                    <Button variant="default" className="cursor-not-allowed opacity-60 select-none">
                                        Registrarse
                                    </Button>
                                    <AnimatePresence>
                                        {showTooltip && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                transition={{ duration: 0.3 }}
                                                className="absolute bottom-[-45px] left-1/2 z-50 -translate-x-1/2 rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-xs whitespace-nowrap shadow-md"
                                            >
                                                <Clock className="mr-1 inline-block h-3.5 w-3.5 text-primary" />
                                                Próximamente disponible
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Menú móvil */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>

                            <SheetContent side="right" className="space-y-4 p-6">
                                {[
                                    { label: 'Características', href: '#features' },
                                    { label: 'Instituciones', href: '#instituciones' },
                                    { label: 'Preguntas Frecuentes', href: '#faq' },
                                    { label: 'Contacto', href: '#contacto' },
                                ].map((link) => (
                                    <Link key={link.href} href={link.href} className="block text-base font-medium hover:text-primary">
                                        {link.label}
                                    </Link>
                                ))}

                                <div className="space-y-2 border-t border-[var(--color-border)] pt-4">
                                    {user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="block rounded bg-primary px-4 py-2 text-center text-primary-foreground"
                                        >
                                            Ir al Panel
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('login')}
                                                className="block rounded border px-4 py-2 text-center transition hover:bg-muted"
                                            >
                                                Acceder
                                            </Link>

                                            {/* Botón desactivado (móvil) con toast Sonner */}
                                            <button
                                                className="mt-2 block w-full cursor-not-allowed rounded bg-primary px-4 py-2 text-primary-foreground opacity-60 select-none"
                                                onClick={() =>
                                                    toast('Los registros se habilitarán próximamente.', {
                                                        description: 'Gracias por tu interés en AcadeSys.',
                                                        duration: 3000,
                                                        icon: <Clock className="h-4 w-4 text-primary" />,
                                                    })
                                                }
                                            >
                                                Registrarse
                                            </button>
                                        </>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </motion.header>

            {/* ============================
          🌆 HERO SECTION
      ============================ */}
            <HeroSection heroImages={heroImages} currentIndex={currentIndex} goToNext={goToNext} goToPrevious={goToPrevious} />

            {/* ============================
          ⚙️ FEATURES
      ============================ */}
            <FeaturesSection />

            {/* ============================
          🏫 INSTITUCIONES
      ============================ */}
            <InstitutionsSection />

            {/* ============================
          ❓ FAQ
      ============================ */}
            <ModernFAQ />

            {/* ============================
          FOOTER
      ============================ */}
            <AppFooter />
        </div>
    );
}

/* ==============================================
   🌆 HERO SECTION
   ============================================== */
function HeroSection({
    heroImages,
    currentIndex,
    goToNext,
    goToPrevious,
}: {
    heroImages: string[];
    currentIndex: number;
    goToNext: () => void;
    goToPrevious: () => void;
}) {
    return (
        <section className="relative h-[360px] overflow-hidden md:h-[500px]">
            <AnimatePresence>
                <motion.div
                    key={heroImages[currentIndex]}
                    className="absolute inset-0 bg-cover bg-fixed bg-center"
                    style={{ backgroundImage: `url('${heroImages[currentIndex]}')` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                />
            </AnimatePresence>

            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-4 text-center text-white backdrop-blur-[1px]">
                <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="mb-3 text-3xl font-bold md:text-5xl">
                    Simplificá la gestión académica de tu institución
                </motion.h1>
                <motion.p custom={1} initial="hidden" animate="visible" variants={fadeUp} className="mb-6 max-w-2xl text-sm text-white/90 md:text-lg">
                    AcadeSys centraliza inscripciones, cursos, pagos y asistencias en una interfaz moderna e intuitiva.
                </motion.p>
                <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} className="flex gap-3">
                    <Button asChild variant="default">
                        <Link href={route('login')}>Comenzar Ahora</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="#features">Ver más</Link>
                    </Button>
                </motion.div>
            </div>

            <button onClick={goToPrevious} className="absolute top-1/2 left-4 -translate-y-1/2 text-white opacity-70 transition hover:opacity-100">
                <ChevronLeft size={32} />
            </button>
            <button onClick={goToNext} className="absolute top-1/2 right-4 -translate-y-1/2 text-white opacity-70 transition hover:opacity-100">
                <ChevronRight size={32} />
            </button>
        </section>
    );
}

/* ==============================================
   ⚙️ FEATURES SECTION
   ============================================== */
function FeaturesSection() {
    return (
        <motion.section
            id="features"
            className="mx-auto px-6 py-16 text-center md:max-w-7xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
        >
            <h2 className="mb-10 text-3xl font-semibold text-primary">Todo lo que tu academia necesita</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                    title="Cursos y Horarios"
                    description="Gestioná fácilmente cursos, horarios y docentes desde un solo lugar."
                    imageUrl="/img_features/cursos_digitales.png"
                />
                <InfoCard
                    title="Control de Asistencias"
                    description="Marcá presencia de alumnos y generá reportes automáticos por fecha."
                    imageUrl="/img_features/asistencia_digital.png"
                />
                <InfoCard
                    title="Pagos y Finanzas"
                    description="Controlá los pagos de cada alumno y mantené tus finanzas al día."
                    imageUrl="/img_features/pagos_digitales.png"
                />
            </div>
        </motion.section>
    );
}

/* ==============================================
   🏫 INSTITUTIONS SECTION
   ============================================== */
function InstitutionsSection() {
    return (
        <motion.section
            id="instituciones"
            className="mx-auto rounded-xl bg-[var(--color-card)] px-6 py-16 text-center shadow-sm md:max-w-7xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
        >
            <h2 className="mb-6 text-3xl font-semibold text-primary">Adaptado a todo tipo de institución</h2>
            <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
                Desde academias privadas hasta institutos tecnológicos, AcadeSys se adapta a tus necesidades.
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                    title="Academias privadas"
                    description="Ideal para cursos libres o capacitaciones intensivas."
                    imageUrl="/img_features/academia_privada.png"
                />
                <InfoCard
                    title="Centros de idiomas"
                    description="Organizá grupos, profesores y alumnos en múltiples sedes."
                    imageUrl="/img_features/centro_idioma.png"
                />
                <InfoCard
                    title="Institutos técnicos"
                    description="Seguimiento completo de carreras, módulos y prácticas."
                    imageUrl="/img_features/instituto_tecnico.png"
                />
            </div>
        </motion.section>
    );
}

/* ==============================================
   💬 FAQ MODERNO
   ============================================== */
function ModernFAQ() {
    const faqs = [
        {
            question: '¿AcadeSys es gratuito?',
            answer: 'Sí. Incluye una versión gratuita con todas las funciones esenciales. El plan Premium agrega reportes avanzados, soporte prioritario y herramientas estadísticas avanzadas.',
        },
        {
            question: '¿Puedo gestionar varias sedes o filiales?',
            answer: 'Claro. AcadeSys permite administrar múltiples sedes desde una sola cuenta, asignando roles y permisos diferentes por ubicación o división.',
        },
        {
            question: '¿Mis datos están seguros?',
            answer: 'La seguridad es prioridad: todas las contraseñas se almacenan encriptadas, las conexiones están protegidas por SSL y los respaldos automáticos garantizan la integridad de la información.',
        },
        {
            question: '¿Necesito conocimientos técnicos para usarlo?',
            answer: 'No. La interfaz fue diseñada para ser intuitiva, con paneles claros y accesos directos. Cualquier persona puede operar AcadeSys tras unos minutos de uso.',
        },
    ];

    return (
        <motion.section
            id="faq"
            className="mx-auto px-6 py-20 text-center md:max-w-5xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
        >
            <h2 className="mb-10 text-3xl font-semibold text-primary md:text-4xl">Preguntas Frecuentes</h2>

            <div className="space-y-4">
                {faqs.map((item, index) => (
                    <motion.div
                        key={index}
                        className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]/60 backdrop-blur-sm"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <AccordionItem item={item} />
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}

function AccordionItem({ item }: { item: { question: string; answer: string } }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="text-left">
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between px-6 py-4 text-base font-medium text-foreground transition-colors hover:text-primary md:text-lg"
            >
                <span>{item.question}</span>
                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </motion.div>
            </button>

            <motion.div
                initial={false}
                animate={{
                    height: open ? 'auto' : 0,
                    opacity: open ? 1 : 0,
                    marginBottom: open ? 12 : 0,
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="overflow-hidden px-6"
            >
                <p className="pb-4 text-sm text-muted-foreground md:text-base">{item.answer}</p>
            </motion.div>
        </div>
    );
}

/* ==============================================
   ⚓ FOOTER
   ============================================== */
function AppFooter() {
    return (
        <motion.footer
            id="contacto"
            className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-card)]/70 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--color-card)]/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
        >
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 text-sm md:grid-cols-4">
                <div>
                    <h5 className="mb-2 font-semibold">AcadeSys</h5>
                    <p>Plataforma de gestión académica integral para institutos modernos.</p>
                </div>
                <div>
                    <h5 className="mb-2 font-semibold">Contacto</h5>
                    <p>Email: ruchinskyivanandres@gmail.com</p>
                    <p>Tel: (0370) 512 4611</p>
                </div>
                <div>
                    <h5 className="mb-2 font-semibold">Ubicación</h5>
                    <p>Formosa, Argentina</p>
                </div>
                <div className="space-y-2">
                    <a
                        href="https://www.facebook.com/ruchinsky.ivan/"
                        target="_blank"
                        className="inline-flex items-center gap-2 font-medium text-foreground transition-colors hover:text-primary"
                    >
                        <Facebook className="h-4 w-4" />
                        <span>Ivan Ruchinsky</span>
                    </a>
                    <a
                        href="https://www.instagram.com/ivanruchinsky/"
                        target="_blank"
                        className="inline-flex items-center gap-2 font-medium text-foreground transition-colors hover:text-primary"
                    >
                        <Instagram className="h-4 w-4" />
                        <span>@ivanruchinsky</span>
                    </a>
                </div>
            </div>
            <div className="border-t border-[var(--color-border)] py-4 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} AcadeSys by AIR Sistemas — Todos los derechos reservados.
            </div>
        </motion.footer>
    );
}
