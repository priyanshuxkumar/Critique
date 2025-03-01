import { Star } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Header () {
    return(
        <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4 mx-auto">
          <div className="flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Critique.</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/signin" className="text-sm font-medium hover:text-primary">
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-medium hover:text-primary">
                <Button >Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
    )
}