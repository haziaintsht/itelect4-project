import type { StudyLevel } from "../types/index";
import { cn } from "@/lib/utils";

const LEVEL_STYLES: Record<StudyLevel, string> = {
    beginner:
        "bg-emerald-500/10 text-emerald-700 ring-emerald-500/25 dark:text-emerald-400",
    intermediate:
        "bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-400",
    advanced: "bg-red-500/10 text-red-700 ring-red-500/25 dark:text-red-400",
};

function LevelBadge({ level }: { level: StudyLevel }) {
    return (
        <span
            className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
                LEVEL_STYLES[level]
            )}
        >
            <span className="size-1.5 rounded-full bg-current" />
            {level}
        </span>
    );
}

export default LevelBadge;
