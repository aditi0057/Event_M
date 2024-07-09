
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import Calendar from '@/components/shared/Calendar'; 
import Poll from '@/components/shared/Poll';

export default function Home() {
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h2-bold">Collaborate, Create, and Celebrate<br></br>All in One Place!</h1>
            <p className="p-regular-20 md:p-regular-20">Effortlessly design and organize events, collaborate and make decisions as a team, track progress, and ensure a smooth event day</p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="#events">
                Explore Now
              </Link>
            </Button>
          </div>

          <Image 
            src="/assets/images/hero.png"
            alt="hero"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>

      <section id="events" className="py-10">
        <div className="wrapper">
          <h2 className="h3-bold mb-8">My Calendar</h2>
          <Calendar />
        </div>
      </section>

      <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Active Polls </h1>
      <Poll />
    </div>
    </>
  );
}
