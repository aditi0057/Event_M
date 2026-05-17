import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Images, Vote } from 'lucide-react';

export default function Home() {
  return (
    <div className="page-shell">
      <section className="relative min-h-[calc(100vh-144px)] overflow-hidden bg-[#1f2933]">
        <Image
          src="/assets/images/hero.avif"
          alt="Corporate event gathering"
          fill
          priority
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,25,31,0.88),rgba(20,25,31,0.58),rgba(20,25,31,0.18))]" />

        <div className="wrapper relative flex min-h-[calc(100vh-144px)] flex-col justify-center pb-16 pt-12 text-white sm:pb-20 sm:pt-16">
          <div className="max-w-3xl">
            <p className="eyebrow text-[#c8d7d0]">EventM corporate portal</p>
            <h1 className="mt-4 text-[34px] font-semibold leading-[40px] sm:text-[42px] sm:leading-[50px] md:text-[58px] md:leading-[66px]">
              Plan polished internal events with less operational noise.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/82 md:text-lg">
              Manage event planning, team polls, approvals, gallery moments, and celebration calendars in one refined workspace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-[#1f2933] hover:bg-[#eef1f4]">
                <Link href="/Events">View Events</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
                <Link href="/Calendar">Open Calendar</Link>
              </Button>
            </div>
          </div>

          <div className="mt-12 grid max-w-4xl grid-cols-1 border border-white/22 bg-black/10 backdrop-blur sm:grid-cols-3">
            {[
              { icon: CalendarDays, label: 'Events', value: 'Plan and publish' },
              { icon: Vote, label: 'Polls', value: 'Decide together' },
              { icon: Images, label: 'Gallery', value: 'Curate memories' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 border-b border-white/18 px-5 py-4 last:border-b-0 sm:border-b-0 sm:border-r last:sm:border-r-0">
                <item.icon className="h-5 w-5 text-[#c8d7d0]" />
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-white/70">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
