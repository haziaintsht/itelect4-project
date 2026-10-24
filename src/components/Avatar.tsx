


import { cn, initials } from "@/lib/utils";

const SIZES = {
    sm: "size-7 text-[11px]",
    md: "size-9 text-xs",
    lg: "size-11 text-sm",
};

interface AvatarProps {
    name: string;
    size?: keyof typeof SIZES;
}

function Avatar({ name, size = "md" }: AvatarProps) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-primary ring-1 ring-primary/20",
                SIZES[size]
            )}
        >
            {initials(name)}
        </span>
    );
}

export default Avatar;
