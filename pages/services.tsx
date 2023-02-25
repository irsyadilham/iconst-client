import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useContext, useState, useRef } from 'react';
import Home from '../components/home';
import AppContext from '../context/app';
import { getNoToken, get } from '../functions/fetch';
import { gsap } from 'gsap';

import type { Service } from '../types/service';

const Services: NextPage = () => {
  const router = useRouter();
  const modal = useRef<HTMLDivElement>(null);
  const context = useContext(AppContext);
  const [services, setServices] = useState<Service[]>([]);

  const getServices = async () => {
    try {
      context?.loading.dispatch({type: 'ON'});
      const services: Service[] = await getNoToken('/service-types');
      context?.loading.dispatch({type: 'OFF'});
      setServices(services);
    } catch (err: any) {
      context?.loading.dispatch({type: 'OFF'});
      alert('failed to retrieve services, please refresh page');
    }
  }

  const requestService = async (service: Service) => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      modal.current?.classList.remove('hidden');
      modal.current?.classList.add('flex');
      gsap.to(modal.current, { opacity: 1, ease: 'power3.out' });
      return;
    }

    try {
      context?.loading.dispatch({type: 'ON'});
      await get('/client-check-suspension');
      context?.loading.dispatch({type: 'OFF'});
      router.push({
        pathname: '/service-request',
        query: {
          id: service.id,
          name: service.name
        }
      });
    } catch (err: any) {
      context?.loading.dispatch({type: 'OFF'});
      if (err.status === 403) {
        const errData = await err.json();
        alert(errData.message);
        return;
      }
      alert('Failed to make request, please try again later');
    }
  }

  const closeModal = () => {
    gsap.to(modal.current, { opacity: 0, ease: 'power3.out', onComplete() {
      modal.current?.classList.remove('flex');
      modal.current?.classList.add('hidden');
    }});
  }

  useEffect(() => {
    getServices();
  }, []);

  return (
    <main className="container pb-2">
      <Home page="services">

        <p className="mt-2 text-sm">To make a service request, choose service below</p>
        
        <ul className="space-y-1 mt-2">
          {services.map((service, i) => {
            return <li onClick={() => requestService(service)} className="py-[1.3em] px-1 shadow-normal bg-white rounded-md cursor-pointer text-gray font-semibold" key={i}>{service.name}</li>;
          })}
        </ul>

      </Home>

      <section ref={modal} className="fixed top-0 left-0 h-screen w-full bg-black/50 hidden opacity-0 items-center justify-center">

        <section className="bg-white rounded-xl flex flex-col items-center max-w-[80%] box-border p-2">
          <h3 className="text-primary text-xl">Login required</h3>
          <p className="text-sm mt-1 text-center">To make a request, it's require you to login</p>
          <Link className="w-full" href="/login">
            <button className="button mt-1">Login</button>
          </Link>
          <button onClick={closeModal} className="mt-1 font-semibold text-gray text-sm">Cancel</button>
        </section>

      </section>
    </main>
  );
}

export default Services;