import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import { Separator } from "../ui/separator"
import NavItems from "./NavItems"
import Link from "next/link"

const MobileNav = () => {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger className="flex h-10 w-10 items-center justify-center rounded-md border border-[#d9dde3] bg-white align-middle">
          <Image
            src="/assets/icons/menu.svg"
            alt="menu"
            width={18}
            height={18}
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent className="flex w-[84%] max-w-[320px] flex-col gap-6 bg-white p-6 md:hidden">
          <Link href="/" className="flex items-center justify-center py-2">
            <Image
              src="/assets/images/logo.png"
              alt="logo"
              width={108}
              height={34}
            />
          </Link>
          <Separator className="bg-[#d9dde3]" />
          <NavItems />
        </SheetContent>
      </Sheet>
    </nav>
  )
}

export default MobileNav;
