import type { NextPage } from 'next';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { gsap } from 'gsap';

const ThankYou: NextPage = () => {

  const counter = useRef<HTMLSpanElement>(null);
  const router = useRouter();

  useEffect(() => {
    gsap.to(counter.current, { innerText: 0, duration: 10, ease: 'none', snap: 'innerText', onComplete() {
      router.push('/login');
    }});
  }, []);

  return (
    <main className="container flex items-center justify-center flex-col h-screen px-2">
      <Image className="w-[150px]" src="/logo.svg" alt="logo" width={188} height={46}/>

      <h2 className="mt-2 text-2xl text-primary text-center">Your account successfully created</h2>

      <p className="mt-1">You can login now!</p>

      <button onClick={() => router.push('/login')} className="button-fitted mt-1">To login in <span ref={counter}>10</span></button>
    </main>
  );
}
export default ThankYou;