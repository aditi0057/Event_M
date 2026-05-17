import Image from "next/image";
import Link from "next/link";
import { headerLinks } from "@/constants";

const Footer = () => {
  return (
    <footer className="border-t border-[#d9dde3] bg-white">
      <div className="wrapper py-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm text-center md:text-left">
            <Link href='/' className="inline-flex items-center">
              <Image
                src="/assets/images/logo.png"
                alt="logo"
                width={104}
                height={34}
              />
            </Link>
            <p className="mt-3 text-sm leading-6 text-[#6b7280]">
              A shared workspace for internal events, planning, participation, and team memories.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 md:items-end">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 md:justify-end">
              {headerLinks.map((link) => (
                <Link
                  key={link.route}
                  href={link.route}
                  className="rounded-md px-3 py-2 text-sm font-medium text-[#6b7280] transition-colors hover:bg-[#f3f6f8] hover:text-[#1f2933]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-xs text-[#6b7280]">2025 EventM. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

