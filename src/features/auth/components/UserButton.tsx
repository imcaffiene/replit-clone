import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "../hooks/use-current-user";
import { LogInIcon, User2Icon } from "lucide-react";
import Logout from "./Logout";

export default function UserButton() {

  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className={cn("relative rounded-full")}>
          <Avatar>
            <AvatarImage src={user?.image!} alt={user?.name!} />
            <AvatarFallback className="bg-red-500">
              <User2Icon className="h-full w-full text-white" />
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mr-4">
        <DropdownMenuItem>
          <span> {user?.email} </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <Logout>
          <DropdownMenuItem>
            <LogInIcon className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </Logout>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}