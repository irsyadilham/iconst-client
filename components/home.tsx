import { ReactNode, useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Tab from '../components/tab';
import { get } from '../functions/fetch';

type args = {
  children: ReactNode;
  page: string;
}

const Home: NextPage<args> = ({children, page}) => {

  const [unreadNotifications, setUnreadNotifications] = useState<boolean>(false);

  const getUnreadNotifications = async () => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      try {
        const unread: number = await get('/notifications/client/unread');
        setUnreadNotifications(unread === 1 ? true : false);
      } catch (err: any) {
        
      }
    }
  }

  useEffect(() => {
    getUnreadNotifications();
  }, []);

  return (
    <main className="mx-2 pt-3">
      <section id="header" className="flex justify-between">

        <Image priority={true} className="w-5" src="/logo.svg" alt="logo" width={188} height={46}/>

        <div id="notification-and-settings" className="flex items-center">
          <Link href="/notifications" className="mr-[.8em] relative">
            <Image priority={true} className="w-[1.3em]" src="/notification.svg" alt="notification" width={20} height={21}/>
            {(() => {
              if (unreadNotifications) {
                return <div className="w-[.6em] h-[.6em] rounded-full bg-primary ml-[.3em] absolute top-0 right-0"/>;
              }
            })()}
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