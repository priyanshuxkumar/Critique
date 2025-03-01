import { Star } from "lucide-react";
import { useUser } from "@/context/user.context";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Navbar() {
  const { user } = useUser();
  return (
    <nav className="sticky top-0 z-40 border-b bg-inherit">
      <div className="container flex h-14 items-center justify-between py-4 mx-auto">
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Critique.</span>
        </div>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="uppercase text-black/70 text-xl font-semibold">
              {user?.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
}
