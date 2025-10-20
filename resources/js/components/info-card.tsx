import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface InfoCardProps {
    title: string;
    description: string;
    imageUrl: string;
    link?: string;
}

export function InfoCard({ title, description, imageUrl, link }: InfoCardProps) {
    return (
        <div className="flex flex-col overflow-hidden rounded-lg bg-[var(--color-card)] shadow-md">
            <div
                className="h-40 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <div className="flex flex-1 flex-col p-4 text-[var(--color-card-foreground)]">
                <h4 className="mb-2 text-lg font-bold">{title}</h4>
                <p className="mb-4 text-sm">{description}</p>
                {link && (
                    <Button asChild variant="outline" className="mt-auto">
                        <Link href={link}>Ver más</Link>
                    </Button>
                )}
            </div>
        </div>
    );
}
