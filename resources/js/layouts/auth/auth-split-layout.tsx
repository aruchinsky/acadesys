import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Panel izquierdo */}
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />

                {/* Logo real de AcadeSys */}
                <Link href={route('home')} className="relative z-20 flex items-center text-lg font-medium">
                    <img
                        src="/acadesys_logo.png"
                        alt="AcadeSys"
                        className="mr-2 h-10 w-auto"
                    />
                    By AIR Sistemas
                </Link>

                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;La educación necesita sistemas que acompañen, organicen y potencien.
                            AcadeSys nace para modernizar la experiencia académica y llevarla al siguiente nivel.&rdquo;
                        </p>
                        <footer className="text-sm text-neutral-300">Iván Ruchinsky / Gomez Damian</footer>
                    </blockquote>
                </div>

            </div>

            {/* Panel derecho */}
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">

                    {/* Logo centrado en mobile */}
                    <Link href={route('home')} className="relative z-20 flex items-center justify-center lg:hidden">
                        <img
                            src="/acadesys_logo.png"
                            alt="AcadeSys"
                            className="h-10 w-auto sm:h-12"
                        />
                    </Link>

                    {/* Encabezado */}
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">{description}</p>
                    </div>

                    {/* Contenido del login */}
                    {children}

                </div>
            </div>
        </div>
    );
}
