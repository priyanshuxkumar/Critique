import { Star } from "lucide-react";
import { useUser } from "@/context/user.context";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import axios, { AxiosError } from "axios";
import { useCallback } from "react";
import { toast } from "sonner";


export default function Navbar() {
  const router = useRouter();
  const { user } = useUser();

  const logout = useCallback(async() => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/auth/logout',{},{withCredentials:true})
      if(response.status == 200){
        toast(response.data.message);
        router.push('/signin');
      }
    } catch (error) {
      if(error instanceof AxiosError){
        toast(error?.response?.data.message);
      }else {
        toast('Something went wrong!');
      }
    }
  },[router]);
  return (
    <nav className="w-full sticky top-0 z-40 border-b bg-inherit">
      <div className="w-full flex h-14 items-center justify-between py-4 px-4 lg:px-20">
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 text-primary" />
          <span
            onClick={() => router.push("/")}
            className="text-xl font-bold cursor-pointer"
          >
            Critique.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
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
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
