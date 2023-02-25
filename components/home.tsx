import { ReactNode } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Tab from '../components/tab';

type args = {
  children: ReactNode;
  page: string;
}

const Home: NextPage<args> = ({children, page}) => {

  return (
    <main className="mx-2 pt-3">
      <section id="header" className="flex justify-between">

        <Image priority={true} className="w-5" src="/logo.svg" alt="logo" width={188} height={46}/>

        <div id="notification-and-settings" className="flex items-center">
          <Link href="/notifications" className="mr-[.8em]">
            <Image priority={true} className="w-[1.3em]" src="/notification.svg" alt="notification" width={20} height={21}/>
          </Link>
          <Link href="/settings">
            <Image priority={true} className="w-[1.3em]" src="/settings.svg" alt="settings" width={23} height={23}/>
          </Link>
        </div>
        {/* #notification-and-settings */}

      </section>
      {/* #header */}

      <section id="body" className="mt-2">

        <Tab page={page}/>

        {children}

      </section>
      {/* #body */}
    </main>
  );
}

export default Home;