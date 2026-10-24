


import type { User } from "../types/index";
import Avatar from "./Avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserCardProps {
    user: User;
    onSelect?: (user: User) => void;
    isSelected?: boolean;
}

function UserCard({ user, onSelect, isSelected = false }: UserCardProps) {
    return (
        <div
            className={cn(
                "flex h-full flex-col rounded-2xl border bg-card p-5 shadow-sm transition-colors",
                isSelected && "border-primary ring-3 ring-ring"
            )}
        >
            <div className="flex items-center gap-3">
                <Avatar name={user.name} size="lg" />
                <div className="min-w-0">
                    <h3 className="truncate font-semibold text-foreground">{user.name}</h3>
                    <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                </div>
                <span className="ml-auto shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium capitalize text-primary">
                    {user.role}
                </span>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
                {user.bio || "Peer tutor on the platform."}
            </p>

            {user.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {user.skills.map((skill) => (
                        <span
                            key={skill}
                            className="rounded-md bg-muted px-2 py-0.5 text-xs text-foreground"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            )}

            {onSelect && (
                <div className="mt-auto pt-4">
                    <Button
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => onSelect(user)}
                    >
                        {isSelected ? "Selected" : "View tutor"}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default UserCard;
