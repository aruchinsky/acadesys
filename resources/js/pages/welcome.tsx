import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Link, usePage } from "@inertiajs/react"
import { SharedData, User } from "@/types"
import { Menu, ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { InfoCard } from "@/components/info-card"

export default function Welcome() {
  const { auth } = usePage<SharedData>().props
  const user: User | null = auth.user ?? null

  // ============================
  // 🎞 HERO IMAGES
  // ============================
  const heroImages = [
    "/hero/acadesys_dashboard.webp",
    "/hero/acadesys_instituto.webp",
    "/hero/acadesys_team.webp",
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const goToPrevious = () =>
    setCurrentIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1))
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % heroImages.length)

  useEffect(() => {
    const interval = setInterval(goToNext, 6000)
    return () => clearInterval(interval)
  }, [])

  // ============================
  // ✨ ANIMATION VARIANTS
  // ============================
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors">
      {/* ============================
          🔝 HEADER
      ============================ */}
      <header className="sticky top-0 z-40 border-b bg-[var(--color-background)]/90 backdrop-blur-md border-[var(--color-border)]">
        <div className="mx-auto flex h-16 items-center justify-between px-4 md:max-w-7xl">
          <div className="flex items-center space-x-2">
            <img src="/acadesys_logo.png" alt="AcadeSys Logo" className="h-9 w-auto" />
          </div>

          <nav className="hidden lg:flex gap-6 text-sm font-medium">
            <Link href="#features" className="hover:text-primary transition">
              Características
            </Link>
            <Link href="#instituciones" className="hover:text-primary transition">
              Instituciones
            </Link>
            <Link href="#faq" className="hover:text-primary transition">
              Preguntas Frecuentes
            </Link>
            <Link href="#contacto" className="hover:text-primary transition">
              Contacto
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild variant="default">
                <Link href={route("dashboard")}>Ir al Panel</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href={route("login")}>Acceder</Link>
                </Button>
                <Button asChild variant="default">
                  <Link href={route("register")}>Registrarse</Link>
                </Button>
              </>
            )}
          </div>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-6 space-y-4">
                <Link href="#features" className="block text-base font-medium">
                  Características
                </Link>
                <Link href="#instituciones" className="block text-base font-medium">
                  Instituciones
                </Link>
                <Link href="#faq" className="block text-base font-medium">
                  Preguntas Frecuentes
                </Link>
                <Link href="#contacto" className="block text-base font-medium">
                  Contacto
                </Link>
                <div className="pt-4 border-t border-[var(--color-border)]">
                  {user ? (
                    <Link
                      href={route("dashboard")}
                      className="block bg-primary text-primary-foreground text-center rounded px-4 py-2 mt-2"
                    >
                      Ir al Panel
                    </Link>
                  ) : (
                    <>
                      <Link
                        href={route("login")}
                        className="block border rounded px-4 py-2 text-center hover:bg-muted"
                      >
                        Acceder
                      </Link>
                      <Link
                        href={route("register")}
                        className="block bg-primary text-primary-foreground rounded px-4 py-2 text-center mt-2 hover:opacity-90"
                      >
                        Registrarse
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ============================
          🌆 HERO SECTION
      ============================ */}
      <section className="relative h-[360px] md:h-[500px] overflow-hidden">
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

        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4 text-white">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold mb-3"
          >
            Simplificá la gestión académica de tu institución
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="max-w-2xl text-sm md:text-lg mb-6 text-white/90"
          >
            AcadeSys centraliza inscripciones, cursos, pagos y asistencias en una interfaz moderna e intuitiva.
          </motion.p>
          <div className="flex gap-3">
            <Button asChild variant="default">
              <Link href={route("register")}>Comenzar Ahora</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#features">Ver más</Link>
            </Button>
          </div>
        </div>

        <button onClick={goToPrevious} className="absolute top-1/2 left-4 -translate-y-1/2 text-white">
          <ChevronLeft size={32} />
        </button>
        <button onClick={goToNext} className="absolute top-1/2 right-4 -translate-y-1/2 text-white">
          <ChevronRight size={32} />
        </button>
      </section>

      {/* ============================
          ⚙️ FEATURES SECTION
      ============================ */}
      <section id="features" className="px-6 py-16 mx-auto md:max-w-7xl text-center">
        <h2 className="text-3xl font-semibold text-primary mb-10">
          Todo lo que tu academia necesita
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoCard
            title="Cursos y Horarios"
            description="Gestioná fácilmente cursos, horarios y docentes desde un solo lugar."
            imageUrl="/img_features/cursos.webp"
          />
          <InfoCard
            title="Control de Asistencias"
            description="Marcá presencia de alumnos y generá reportes automáticos por fecha."
            imageUrl="/img_features/asistencias.webp"
          />
          <InfoCard
            title="Pagos y Finanzas"
            description="Controlá los pagos de cada alumno y mantené tus finanzas al día."
            imageUrl="/img_features/pagos.webp"
          />
        </div>
      </section>

      {/* ============================
          🏫 INSTITUTIONS
      ============================ */}
      <section
        id="instituciones"
        className="bg-[var(--color-card)] px-6 py-16 md:max-w-7xl mx-auto text-center rounded-xl shadow-sm"
      >
        <h2 className="text-3xl font-semibold text-primary mb-6">
          Adaptado a todo tipo de institución
        </h2>
        <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
          Desde academias privadas hasta institutos tecnológicos, AcadeSys se adapta a tus necesidades.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoCard
            title="Academias privadas"
            description="Ideal para cursos libres o capacitaciones intensivas."
            imageUrl="/img_instituciones/academia.webp"
          />
          <InfoCard
            title="Centros de idiomas"
            description="Organizá grupos, profesores y alumnos en múltiples sedes."
            imageUrl="/img_instituciones/idiomas.webp"
          />
          <InfoCard
            title="Institutos técnicos"
            description="Seguimiento completo de carreras, módulos y prácticas."
            imageUrl="/img_instituciones/tecnicos.webp"
          />
        </div>
      </section>

      {/* ============================
          ❓ FAQ
      ============================ */}
      <section id="faq" className="mx-auto px-6 py-16 md:max-w-5xl">
        <h2 className="text-3xl font-semibold text-center text-primary mb-8">Preguntas Frecuentes</h2>
        <div className="space-y-6">
          <details className="border rounded-lg p-4">
            <summary className="cursor-pointer font-medium">¿AcadeSys es gratuito?</summary>
            <p className="mt-2 text-sm text-muted-foreground">
              Sí. Incluye una versión gratuita con todas las funciones esenciales. El plan Premium agrega reportes avanzados y soporte prioritario.
            </p>
          </details>
          <details className="border rounded-lg p-4">
            <summary className="cursor-pointer font-medium">¿Puedo gestionar varias sedes?</summary>
            <p className="mt-2 text-sm text-muted-foreground">
              Por supuesto. AcadeSys permite administrar varias sedes o divisiones desde una sola cuenta de administrador.
            </p>
          </details>
          <details className="border rounded-lg p-4">
            <summary className="cursor-pointer font-medium">¿Puedo exportar datos?</summary>
            <p className="mt-2 text-sm text-muted-foreground">
              Sí, se pueden descargar registros de alumnos, pagos y asistencias en formatos Excel o PDF.
            </p>
          </details>
        </div>
      </section>

      {/* ============================
          📞 FOOTER
      ============================ */}
      <footer
        id="contacto"
        className="border-t border-[var(--color-border)] bg-[var(--color-card)] mt-auto"
      >
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8 px-6 py-10 text-sm">
          <div>
            <h5 className="font-semibold mb-2">AcadeSys</h5>
            <p>Plataforma de gestión académica integral para institutos modernos.</p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Contacto</h5>
            <p>Email: contacto@acadesys.com</p>
            <p>Tel: (0370) 123-456</p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Ubicación</h5>
            <p>Formosa, Argentina</p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Redes</h5>
            <p>Facebook · Instagram · LinkedIn</p>
          </div>
        </div>
        <div className="border-t border-[var(--color-border)] py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} AcadeSys — Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
