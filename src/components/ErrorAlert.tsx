import { CircleAlert } from "lucide-react";

function ErrorAlert({ message }: { message: string }) {
    return (
        <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
        >
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            <span>{message}</span>
        </div>
    );
}

export default ErrorAlert;
