import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
}

function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card/50 px-6 py-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
                <Icon className="size-6" />
            </span>
            <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}

export default EmptyState;
