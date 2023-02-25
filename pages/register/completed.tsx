import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { gsap } from 'gsap';

export default function Completed() {
  const counter = useRef<HTMLSpanElement>(null);
  const router = useRouter();

  useEffect(() => {
    gsap.to(counter.current, { innerText: 0, snap: 'innerText', duration: 10, ease: 'none', onComplete() {
      router.push('/login');
    }});
  }, []);

  return (
    <main className="flex items-center justify-center h-screen">

      <section className="text-center w-11/12">
        <h1 className="text-2xl text-primary">Registration completed</h1>

        <p className="mt-1">An email will be send to you once your application approved</p>

        <Link href="/login">
          <button className="button-fitted mt-1">To login in <span ref={counter}>10</span> seconds</button>
        </Link>
      </section>

    </main>
  );
}