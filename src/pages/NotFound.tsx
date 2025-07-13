import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-50 py-16 text-center dark:bg-gray-900">
        <div className="relative z-10 mx-auto max-w-md">
            <div className="flex flex-col items-center">
                <h1 className="bg-gradient-to-br from-blue-600 to-blue-400 bg-clip-text text-8xl font-extrabold text-transparent">
                    404
                </h1>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    Page Not Found
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    Sorry, we couldn’t find the page you’re looking for.
                </p>
                <Button asChild className="mt-8">
                    <Link to="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go back home
                    </Link>
                </Button>
            </div>
        </div>
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-zinc-950">
            <div className="absolute left-0 right-0 top-0 -z-10 h-32 bg-gradient-to-b from-white to-transparent dark:from-zinc-950"></div>
        </div>
    </div>
  );
};

export default NotFound;
