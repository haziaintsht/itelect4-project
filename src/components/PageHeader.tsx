interface PageHeaderProps {
    eyebrow: string;
    title: string;
    description?: string;
}

function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {eyebrow}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                {title}
            </h1>
            {description && (
                <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
            )}
        </div>
    );
}

export default PageHeader;
