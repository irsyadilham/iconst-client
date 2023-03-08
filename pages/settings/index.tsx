import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Back from '../../components/back';
import Image from 'next/image';
import { get } from '../../functions/fetch';
import { useContext } from 'react';
import AppContext from '../../context/app';

const Settings: NextPage = () => {

  const context = useContext(AppContext);
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);

  const logout = async () => {
    try {
      context?.loading.dispatch({type: 'ON'});
      await get('/logout');
      localStorage.removeItem('user_id');
      localStorage.removeItem('token');
      router.push('/login');
      context?.loading.dispatch({type: 'OFF'});
    } catch (err) {
      context?.loading.dispatch({type: 'OFF'});
    }
  }

  useEffect(() => {
    setUserId(parseInt(localStorage.getItem('user_id')!));
  }, []);

  return (
    <main className="pt-3 pb-2 container">
      <Back text="Back"/>
      <h1 className="font-bold text-2xl mt-2">Settings</h1>

      {(() => {
        if (userId) {
          return (
            <section id="list-items" className="space-y-[1.3em] mt-2">
              
              <Link href="/settings/profile" className="flex items-center shadow-normal rounded-md px-[1.5rem] py-[1.2rem]">
                <Image src="/settings/profile.svg" alt="profile" width={21} height={22}/>
                <p className="ml-[.9rem]">Profile</p>
              </Link>

              <Link href="/settings/address" className="flex items-center shadow-normal rounded-md px-[1.5rem] py-[1.2rem]">
                <Image src="/settings/address.svg" alt="address" width={18} height={21}/>
                <p className="ml-[.9rem]">Address</p>
              </Link>

              <Link href="/settings/change-password" className="flex items-center shadow-normal rounded-md px-[1.5rem] py-[1.2rem]">
                <Image src="/settings/padlock.svg" alt="password" width={21} height={21}/>
                <p className="ml-[.9rem]">Change password</p>
              </Link>

              <Link href="/settings/support" className="flex items-center shadow-normal rounded-md px-[1.5rem] py-[1.2rem]">
                <Image src="/settings/support.svg" alt="password" width={21} height={21}/>
                <p className="ml-[.9rem]">Support</p>
              </Link>

              {/* <Link href="/settings/change-language" className="flex items-center shadow-normal rounded-md px-[1.5rem] py-[1.2rem]">
                <Image src="/settings/language.svg" alt="language" width={18} height={18}/>
                <p className="ml-[.9rem]">Change language</p>
              </Link> */}

              <button onClick={logout} className="flex w-full items-center shadow-normal rounded-md px-[1.5rem] py-[1.2rem]">
                <Image src="/settings/logout.svg" alt="logout" width={21} height={21}/>
                <p className="ml-[.9rem] text-[#F90000]">Logout</p>
              </button>

            </section>
          );
        } else {
          return (
            <section className="mt-4 flex flex-col items-center">
              <h2 className="text-gray text-xl font-semibold">You're not logged in</h2>
              <Link href="/login">
                <button className="button-fitted mt-1">Login</button>
              </Link>
            </section>
          )
        }
      })()}
    </main>
  );
}

export default Settings;