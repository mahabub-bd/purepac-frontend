import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUserRound, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AuthBtn() {
  const [isLogin, setIsLogin] = useState(false); // Replace with actual authentication logic
  const router = useRouter();

  const handleSignOut = () => {
    toast.success("Signed out successfully");
    setIsLogin(false);
    router.push("/");
  };

  return (
    <>
      {isLogin ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center space-x-2 text-white w-full sm:w-auto px-4 py-2">
              <CircleUserRound className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                User
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <span className="text-red-600">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full p-2 hover:bg-gray-100 transition-colors"
          aria-label="Account"
          onClick={() => router.push("/auth")}
        >
          <User className="size-6 text-gray-700" />
        </Button>
      )}
    </>
  );
}
