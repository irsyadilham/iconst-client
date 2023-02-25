import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useRef, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import Back from '../../components/back';
import type { ServiceRequest } from '../../types/request-service';

const ServiceRequest: NextPage = () => {
  const router = useRouter();
  const title = useRef<HTMLInputElement>(null);
  const duration = useRef<HTMLSelectElement>(null);
  const description = useRef<HTMLTextAreaElement>(null);

  const proceed = async (e: FormEvent) => {
    e.preventDefault();
    if (duration.current?.value === '') {
      alert('Please select duration');
      return;
    }
    const serviceReq = localStorage.getItem('service_request');
    const data: ServiceRequest = {
      service: {
        id: parseInt(router.query.id as string),
        name: router.query.name as string
      },
      title: title.current!.value,
      duration: parseInt(duration.current!.value),
      description: description.current!.value
    };
    let body;
    if (!serviceReq) {
      body = data;
    } else {
      const serviceRequest: ServiceRequest = JSON.parse(serviceReq);
      serviceRequest.title = title.current!.value;
      serviceRequest.duration = parseInt(duration.current!.value);
      serviceRequest.description = description.current!.value;
      body = serviceRequest;
    }
    localStorage.setItem('service_request', JSON.stringify(body));
    router.push('/service-request/location');
  }

  useEffect(() => {
    const serviceReq = localStorage.getItem('service_request');
    if (serviceReq) {
      const data: ServiceRequest = JSON.parse(serviceReq);
      title.current!.value = data.title;
      duration.current!.value = data.duration.toString();
      description.current!.value = data.description;
    }
  }, []);
  
  return (
    <main className="container mt-3 px-2 pb-2">
      <Back text="Services"/>

      <h1 className="text-2xl mt-2">Service request</h1>

      <div className="flex items-center mt-1">
        <Image src="/service.svg" alt="service" width={18} height={16}/>
        <h4 className="text-gray font-semibold ml-[.5em]">{router.query.name}</h4>
      </div>
      
      <p className="mt-1 text-sm">Fill form below to make a request</p>

      <form onSubmit={proceed} className="mt-1">

        <div>
          <label className="label">Title</label>
          <input required ref={title} type="text" className="input" />
        </div>

        <div className="mt-[1.5em]">
          <label className="label">Duration</label>
          <select ref={duration} defaultValue="" className="select">
            <option value="" disabled>Select duration</option>
            <option value="7">7 days</option>
            <option value="21">21 days</option>
          </select>
        </div>

        <div className="mt-[1.5em]">
          <label className="label">Description</label>
          <textarea required ref={description} className="input" rows={5}/>
        </div>

        <button className="button mt-[1.5em]">Proceed</button>

      </form>

    </main>
  );
}

export default ServiceRequest;