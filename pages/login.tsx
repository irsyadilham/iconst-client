import React, { useRef, useState, useEffect, useContext } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import AppContext from '../context/app';
import Image from 'next/image';
import Link from 'next/link';
import { getNoToken } from '../functions/fetch';

type response = {
  user_id: number;
  token: string;
}

const Login: NextPage = () => {
  const context = useContext(AppContext);
  const emailContactNo = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('user_id')) {
      router.push('/');
    }
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      context!.loading.dispatch({type: 'ON'});
      const res: response = await getNoToken(`/login?ec=${emailContactNo.current?.value}&p=${password.current?.value}`);
      context!.loading.dispatch({type: 'OFF'});
      if (rememberMe) {
        localStorage.setItem('user_id', res.user_id.toString());
      }
      localStorage.setItem('token', res.token);
      router.push('/services');
    }catch(err: any) {
      context!.loading.dispatch({type: 'OFF'});
      const res = await err.json();
      alert(res.message);
    }
  }

  return (
    <main className="container">
      
      <section className="flex flex-col items-center justify-center h-screen">

        <Image className="w-2/6" src="/logo.svg" alt="logo" width={188} height={46}/>

        <h1 className="text-2xl mt-2">Login</h1>

        <form onSubmit={login} className="mt-2 w-10/12 space-y-2">

          <div>
            <label className="label">Email or Contact no</label>
            <input className="input" ref={emailContactNo} type="text"/>
          </div>

          <div>
            <label className="label">Password</label>
            <input className="input" ref={password} type="password"/>
          </div>

          <button className="button" type="submit">Login</button>

        </form>

        <section className="w-10/12">
          
          <section id="remember-me" className="flex items-center justify-start mt-[1.5em]">
            <div className={`relative h-[1.2em] w-[1.2em] ${rememberMe ? "bg-primary" : 'border-gray border-[1px]'} rounded-[5px] flex items-center justify-center`}>
              <input checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="absolute w-full h-full opacity-0" type="checkbox"/>
              <Image src="/tick.svg" alt="tick" width={11} height={8}/>
            </div>
            <label className="ml-[.6em] text-sm text-gray">Remember me</label>
          </section>
          {/* #remember-me */}

          <div className="mt-1">
            <Link className="text-sm underline text-gray" href="/forgot-password">Forgot password</Link>
          </div>

          <div className="flex mt-[.7em]">
            <p className="text-sm">Don't have account yet?</p>
            <Link className="text-sm ml-[.7em] font-bold text-primary" href="/register">Create account</Link>
          </div>

        </section>


      </section>
    </main>
  );
}

export default Login;