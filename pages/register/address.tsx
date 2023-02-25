import type { NextPage } from 'next';
import { FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Back from '../../components/back';
import type { Register } from '../../types/register';
import type { Address } from '../../types/personal';
import { getNoToken } from '../../functions/fetch';

const Address: NextPage = () => {
  const router = useRouter();
  const line1 = useRef<HTMLInputElement>(null);
  const line2 = useRef<HTMLInputElement>(null);
  const postcode = useRef<HTMLInputElement>(null);
  const city = useRef<HTMLInputElement>(null);
  const district = useRef<HTMLInputElement>(null);
  const state = useRef<HTMLSelectElement>(null);

  const proceed = (e: FormEvent) => {
    e.preventDefault();
    if (state.current?.value === '') {
      alert('Please select state');
      return;
    }
    const register: Register = JSON.parse(localStorage.getItem('register')!);
    register.address = {
      line_1: line1.current!.value,
      line_2: line2.current!.value,
      postcode: parseInt(postcode.current!.value),
      city: city.current!.value,
      district: district.current!.value,
      state: state.current!.value
    };
    localStorage.setItem('register', JSON.stringify(register));
    router.push('/register/password');
  }

  useEffect(() => {
    const register: Register = JSON.parse(localStorage.getItem('register')!);
    if (register.address) {
      const address = register.address;
      line1.current!.value = address.line_1;
      line2.current!.value = address.line_2!;
      postcode.current!.value = address.postcode.toString();
      city.current!.value = address.city;
      district.current!.value = address.district;
      state.current!.value = address.state;
    }
  }, []);

  const getPostcode = async () => {
    try {
      const address: Address = await getNoToken(`/postcode?p=${postcode.current?.value}`);
      district.current!.value = address.district;
      state.current!.value = address.state;
    } catch (err: any) {
      
    }
  }

  return (
    <main className="container pt-3 pb-2 px-2">

      <Back text="Personal details"/>

      <h1 className="text-2xl mt-3">Register account</h1>

      <form onSubmit={proceed} className="mt-1">

        <h2 className="mt-2">Address</h2>

        <div className="mt-1">
          <label className="label">Line 1</label>
          <input required className="input" ref={line1} type="text"/>
        </div>

        <div className="mt-1">
          <label className="label">Line 2</label>
          <input className="input" ref={line2} type="text"/>
        </div>

        <div className="mt-1">
          <label className="label">Postcode</label>
          <input onBlur={getPostcode} required className="input" ref={postcode} type="number"/>
        </div>

        <div className="mt-1">
          <label className="label">City</label>
          <input className="input" ref={city} type="text"/>
        </div>

        <div className="mt-1">
          <label className="label">District</label>
          <input required className="input" ref={district} type="text"/>
        </div>

        <div className="mt-1">
          <label className="label">State</label>
          <select className="select" ref={state}>
            <option value="">Select state</option>
            <option value="JHR">Johor</option>
            <option value="KDH">Kedah</option>
            <option value="KTN">Kelantan</option>
            <option value="KUL">Kuala Lumpur</option>
            <option value="LBN">Labuan</option>
            <option value="MLK">Melaka</option>
            <option value="NSN">Negeri Sembilan</option>
            <option value="PHG">Pahang</option>
            <option value="PJY">Putrajaya</option>
            <option value="PLS">Perlis</option>
            <option value="PNG">Pulau Pinang</option>
            <option value="PRK">Perak</option>
            <option value="SBH">Sabah</option>
            <option value="SGR">Selangor</option>
            <option value="SRW">Sarawak</option>
            <option value="TRG">Terengganu</option>
          </select>
        </div>

        <button className="button !mt-2" type="submit">Proceed</button>

      </form>

    </main>
  );
}

export default Address;