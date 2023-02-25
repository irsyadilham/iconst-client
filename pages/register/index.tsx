import type { NextPage } from 'next';
import { FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Back from '../../components/back';
import type { Personal } from '../../types/personal';
import type { Register } from '../../types/register';

const Register: NextPage = () => {
  const router = useRouter();
  const name = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const contactNo = useRef<HTMLInputElement>(null);

  //proceed button
  const proceed = (e:FormEvent) => {
    e.preventDefault();
    const register = localStorage.getItem('register');
    const value: Personal = {
      name: name.current!.value,
      email: email.current!.value,
      contact_no: contactNo.current!.value
    }
    let valToSave: any;
    if (register) {
      const parsedData: Register = JSON.parse(register);
      parsedData.personalDetails = value;
      valToSave = parsedData;
    } else {
      valToSave = { personalDetails: value };
    }
    localStorage.setItem('register', JSON.stringify(valToSave));
    router.push('/register/address');
  }

  useEffect(() => {
    const register = localStorage.getItem('register');
    if (register) {
      const parsedData: Register = JSON.parse(register);
      name.current!.value = parsedData.personalDetails!.name;
      email.current!.value = parsedData.personalDetails!.email;
      contactNo.current!.value = parsedData.personalDetails!.contact_no;
    }
  }, []);

  return (
    <main className="container pt-3 px-2 pb-2">

      <Back text="Login"/>

      <h1 className="text-2xl mt-3">Register account</h1>

      <h2 className="mt-2">Personal details</h2>

      <form onSubmit={proceed} className="mt-1 space-y-2">

        <div>
          <label className="label">Name</label>
          <input className="input" ref={name} type="text" required/>
        </div>

        <div>
          <label className="label">Email</label>
          <input className="input" ref={email} type="email" required/>
        </div>

        <div>
          <label className="label">Contact no</label>
          <input className="input" ref={contactNo} type="number" inputMode="tel" required/>
        </div>

        <button className="button !mt-3" type="submit">Proceed</button>

      </form>

    </main>
  );
}

export default Register;