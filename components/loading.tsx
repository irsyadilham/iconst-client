import { useEffect, useRef, useContext } from 'react';
import type { NextPage } from 'next';
import AppContext from '../context/app';
import Image from 'next/image';

const Loading: NextPage = () => {
  const container = useRef<HTMLDivElement>(null);
  const context = useContext(AppContext);

  useEffect(() => {
    const on = context?.loading.state;
    if (on) {
      container.current?.classList.remove('hidden');
      container.current?.classList.add('flex');
    } else {
      container.current?.classList.remove('flex');
      container.current?.classList.add('hidden');
    }
  }, [context?.loading.state]);

  return (
    <main ref={container} className="fixed top-0 left-0 h-screen w-screen flex-col items-center justify-center bg-white z-50 hidden">
      <Image className="w-[70px]" src="/loading-logo.svg" alt="logo" width={79} height={87}/>
      <Image className="w-[60px] mt-[1.5em] animate-spin-fast" src="/loading-icon.svg" alt="loading" width={64} height={64}/>
    </main>
  );
}

export default Loading;