
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function NotFoundPage() {
    return (
        <div className="mx-auto max-w-md py-16 text-center">
            <p className="text-7xl font-bold tracking-tight text-primary">404</p>
            <h1 className="mt-4 text-2xl font-bold text-foreground">Page not found</h1>
            <p className="mt-2 text-muted-foreground">
                The page you are looking for does not exist or was moved.
            </p>
            <Link to="/" className={cn(buttonVariants(), "mt-6 h-10 px-4")}>
                <ArrowLeft />
                Back to the Dashboard
            </Link>
        </div>
    );
}

export default NotFoundPage;
