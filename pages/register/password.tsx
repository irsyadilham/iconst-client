import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useRef } from 'react';
import Back from '../../components/back';
import { postNoToken } from '../../functions/fetch';
import type { Register } from '../../types/register';

const Password: NextPage = () => {
  const router = useRouter();
  const password = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.current?.value !== confirmPassword.current?.value) {
      alert('Password not matching, try again');
      return;
    }
    try {
      const register: Register = JSON.parse(localStorage.getItem('register')!);
      await postNoToken('/clients', { ...register, password: password.current?.value });
      localStorage.removeItem('register');
      router.push('/register/thank-you');
    } catch (err: any) {
      alert('Failed to create profile, please try again later');
    }
  }

  return (
    <main className="container pt-3 px-2 pb-2">

      <Back text="Address"/>

      <h1 className="text-2xl mt-3">Register account</h1>

      <form onSubmit={submit} className="mt-2 space-y-2">

        <div>
          <label className="label">Password</label>
          <input required className="input" ref={password} type="password"/>
        </div>

        <div>
          <label className="label">Confirm password</label>
          <input required className="input" ref={confirmPassword} type="password"/>
        </div>

        <button className="button !mt-3" type="submit">Proceed</button>

      </form>

    </main>
  );
}

export default Password;