import { FormEvent, useRef, useEffect, useContext, useState } from 'react';
import type { NextPage } from 'next';
import Back from '../../components/back';
import type { Address } from '../../types/personal';
import AppContext from '../../context/app';
import { get, put } from '../../functions/fetch';

type User = {
  address: Address;
}

const AddressComp: NextPage = () => {

  const [id, setId] = useState<number>(0);
  const context = useContext(AppContext);
  const line1 = useRef<HTMLInputElement>(null);
  const line2 = useRef<HTMLInputElement>(null);
  const postcode = useRef<HTMLInputElement>(null);
  const city = useRef<HTMLInputElement>(null);
  const district = useRef<HTMLInputElement>(null);
  const state = useRef<HTMLSelectElement>(null);

  const getUser = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      context?.loading.dispatch({type: 'ON'});
      const user: User = await get(`/users/${userId}`);
      context?.loading.dispatch({type: 'OFF'});
      setId(user.address.id!);
      line1.current!.value = user.address.line_1;
      line2.current!.value = user.address.line_2!;
      postcode.current!.value = user.address.postcode.toString();
      city.current!.value = user.address.city;
      district.current!.value = user.address.district;
      state.current!.value = user.address.state;
    } catch (err) {
      context?.loading.dispatch({type: 'OFF'});
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  const update = async (e: FormEvent) => {
    e.preventDefault();
    const data: Address = {
      line_1: line1.current!.value,
      line_2: line2.current!.value,
      postcode: parseInt(postcode.current!.value),
      city: city.current!.value,
      district: district.current!.value,
      state: state.current!.value
    }
    try {
      context?.loading.dispatch({type: 'ON'});
      await put(`/users/${id}/address`, data);
      context?.loading.dispatch({type: 'OFF'});
    } catch (err) {
      context?.loading.dispatch({type: 'OFF'});
      console.error(err);
    }
  }

  return (
    <main className="mx-2 pt-3 pb-2">
      <Back text="Settings"/>

      <h2 className="mt-2 text-2xl font-bold">Address</h2>

      <form onSubmit={update} className="mt-2">

        <div className="mt-1">
          <label className="label">Line 1</label>
          <input ref={line1} className="input" type="text"/>
        </div>
        <div className="mt-1">
          <label className="label">Line 2</label>
          <input ref={line2} className="input" type="text"/>
        </div>
        <div className="mt-1">
          <label className="label">Postcode</label>
          <input ref={postcode} className="input" type="number"/>
        </div>
        <div className="mt-1">
          <label className="label">City</label>
          <input ref={city} className="input" type="text"/>
        </div>
        <div className="mt-1">
          <label className="label">District</label>
          <input ref={district} className="input" type="text"/>
        </div>
        <div className="mt-1">
          <label className="label">State</label>
          <select defaultValue="" className="select" ref={state}>
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
        <button className="button !mt-2">Update</button>
      </form>
    </main>
  );
}

export default AddressComp;