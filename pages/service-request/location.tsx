import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useRef, FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import Back from '../../components/back';
import { getNoToken } from '../../functions/fetch';
import type { Address } from '../../types/personal';
import type { ServiceRequest } from '../../types/request-service';

const Location: NextPage = () => {
  const [serviceName, setServiceName] = useState<string>('');
  const router = useRouter();
  const line1 = useRef<HTMLInputElement>(null);
  const postcode = useRef<HTMLInputElement>(null);
  const city = useRef<HTMLInputElement>(null);
  const district = useRef<HTMLInputElement>(null);
  const state = useRef<HTMLSelectElement>(null);

  const proceed = async (e: FormEvent) => {
    e.preventDefault();
    const data: Address = {
      line_1: line1.current!.value,
      postcode: parseInt(postcode.current!.value),
      city: city.current!.value,
      district: district.current!.value,
      state: state.current!.value
    }
    const serviceReq: ServiceRequest = JSON.parse(localStorage.getItem('service_request')!);
    serviceReq.location = data;
    localStorage.setItem('service_request', JSON.stringify(serviceReq));
    router.push('/service-request/supporting-document');
  }

  const getPostcode = async () => {
    try {
      const address: Address = await getNoToken(`/postcode?p=${postcode.current?.value}`);
      district.current!.value = address.district;
      state.current!.value = address.state;
    } catch (err: any) {
      
    }
  }

  useEffect(() => {
    const serviceReq: ServiceRequest = JSON.parse(localStorage.getItem('service_request')!);
    setServiceName(serviceReq.service.name);
    if (serviceReq.location) {
      line1.current!.value = serviceReq.location.line_1;
      postcode.current!.value = serviceReq.location.postcode.toString();
      city.current!.value = serviceReq.location.city;
      district.current!.value = serviceReq.location.district;
      state.current!.value = serviceReq.location.state;
    }
  }, []);
  
  return (
    <main className="container mt-3 px-2 pb-2">
      <Back text="Service details"/>

      <h1 className="text-2xl mt-2">Service request</h1>

      <div className="flex items-center mt-1">
        <Image src="/service.svg" alt="service" width={18} height={16}/>
        <h4 className="text-gray font-semibold ml-[.5em]">{serviceName}</h4>
      </div>
      
      <p className="mt-2 font-semibold">Location</p>

      <form onSubmit={proceed} className="mt-1 space-y-[1.5em]">

        <div>
          <label className="label">Line 1</label>
          <input required ref={line1} type="text" className="input" />
        </div>

        <div>
          <label className="label">Postcode</label>
          <input required onBlur={getPostcode} ref={postcode} type="number" className="input" />
        </div>

        <div>
          <label className="label">City</label>
          <input ref={city} type="text" className="input" />
        </div>

        <div>
          <label className="label">District</label>
          <input required ref={district} type="text" className="input" />
        </div>

        <div>
          <label className="label">State</label>
          <select required defaultValue="" className="select" ref={state}>
            <option disabled value="">Select state</option>
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

        <button className="button mt-[1.5em]">Proceed</button>

      </form>

    </main>
  );
}

export default Location;