import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { auth } from "@/firebase/firebaseConfig";
import { Button } from "./ui/button";
import Link from "next/link";
import { Separator } from "@radix-ui/react-separator";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PiUserBold } from "react-icons/pi";

interface UserSidebarProps {
  onSignOut: () => void;
}

export default function UserSidebar({ onSignOut }: UserSidebarProps) {
  const [open, setopen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setopen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setopen}>
      <SheetTrigger onClick={() => setopen(true)}>
        <div className="flex items-center gap-1">
          <PiUserBold />
          <div className="hidden md:block font-semibold">Account</div>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Account</SheetTitle>
          <SheetDescription>
            Hi {auth.currentUser?.displayName}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 text-center w-full">
          <Separator className="border-t border-gray-200" />
          <Link href="/orders">Orders</Link>
          <Separator className="border-t border-gray-200" />
          <Link href="/profile">Profile</Link>

          <Button onClick={onSignOut}>log out</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
