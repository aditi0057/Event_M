import Image from "next/image";
import Link from "next/link";

const platformLinks = [
  ["Events", "/Events"],
  ["Calendar", "/Calendar"],
  ["Polls", "/Poll"],
  ["Gallery", "/Gallery"],
];

const accountLinks = [
  ["My Profile", "/UserDashboard"],
  ["Settings", "/settings"],
  ["Notifications", "/notifications"],
];

const Footer = () => {
  return (
    <footer className="bg-[#0A0A14] text-[13px] text-white/55">
      <div className="mx-auto w-full max-w-[var(--content-width)] px-[clamp(16px,4vw,48px)]">
        <div className="flex flex-col gap-8 py-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center">
              <Image src="/assets/images/logo.png" alt="EventM logo" width={104} height={34} className="eventm-logo eventm-logo-on-dark h-auto w-[104px]" />
            </Link>
            <p className="mt-4 leading-6">Bringing teams together, one moment at a time.</p>
          </div>
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h3 className="font-semibold text-white/85">Platform</h3>
              <div className="mt-3 grid gap-2">
                {platformLinks.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-white/85">{label}</Link>)}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white/85">Account</h3>
              <div className="mt-3 grid gap-2">
                {accountLinks.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-white/85">{label}</Link>)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-white/[0.08] py-4 md:flex-row md:items-center md:justify-between">
          <p>© 2025 EventM. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="transition hover:text-white/85">Privacy Policy</Link>
            <Link href="#" className="transition hover:text-white/85">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
