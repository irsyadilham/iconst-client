import type { NextPage } from 'next';
import { useRef, FormEvent, useEffect, useState, useContext } from 'react';
import AppContext from '../../context/app';
import Image from 'next/image';
import Back from '../../components/back';
import { postFormData, get } from '../../functions/fetch';
import type { ServiceRequest } from '../../types/request-service';
import { gsap } from 'gsap';

const SupportingDocument: NextPage = () => {
  const context = useContext(AppContext);
  const [serviceName, setServiceName] = useState<string>('');
  const credential = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<any>(null);
  const [totalVendors, setTotalVendors] = useState<number>(0);
  const modal = useRef<HTMLDivElement>(null);

  const checkVendorAvailability = async (e: FormEvent) => {
    e.preventDefault();
    const serviceReq: ServiceRequest = JSON.parse(localStorage.getItem('service_request')!);
    try {
      const res = await get(`/jobs-vendor-availability?service_id=${serviceReq.service.id}&state=${serviceReq.location?.state}`);
      setTotalVendors(res.total_vendors);
      openPrompt();
    } catch (err: any) {
      const d = await err.json();
      console.error(d);
    }
  }

  const openPrompt = () => {
    gsap.to(modal.current, { opacity: 1, ease: 'power3.out', onStart() {
      modal.current?.classList.remove('hidden');
      modal.current?.classList.add('flex');
    }});
  }

  const closePrompt = () => {
    gsap.to(modal.current, { opacity: 0, ease: 'power3.out', onComplete() {
      modal.current?.classList.remove('flex');
      modal.current?.classList.add('hidden');
    }});
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const serviceReq: ServiceRequest = JSON.parse(localStorage.getItem('service_request')!);
    const data = new FormData();
    if (file) {
      data.append('supporting_document', file.file);
    }
    data.append('title', serviceReq.title);
    data.append('duration', serviceReq.duration.toString());
    data.append('description', serviceReq.description);
    data.append('location', JSON.stringify(serviceReq.location));
    data.append('service', JSON.stringify(serviceReq.service));
    try {
      context?.loading.dispatch({type: 'ON'});
      const res = await postFormData('/jobs', data);
      context?.loading.dispatch({type: 'OFF'});
      localStorage.removeItem('service_request');
      window.open(`${process.env.TOYYIBPAY_URL}/${res.billcode}`, '_self');
    } catch (err: any) {
      context?.loading.dispatch({type: 'OFF'});
      alert('Failed to make service request, please try again later');
    }
  }

  const upload = () => {
    if (credential.current!.files!.length > 0) {
      const file = credential.current!.files![0];
      setFile({
        file,
        url: URL.createObjectURL(file)
      });
    }
  }

  const update = () => {
    credential.current?.click();
  }

  useEffect(() => {
    const serviceReq: ServiceRequest = JSON.parse(localStorage.getItem('service_request')!);
    setServiceName(serviceReq.service.name);
  }, []);
  
  return (
    <main className="container mt-3 px-2 pb-2">
      <Back text="Location"/>

      <h1 className="text-2xl mt-2">Service request</h1>

      <div className="flex items-center mt-1">
        <Image src="/service.svg" alt="service" width={18} height={16}/>
        <h4 className="text-gray font-semibold ml-[.5em]">{serviceName}</h4>
      </div>
      
      <form onSubmit={checkVendorAvailability} className="mt-1">

        <div>
          <label className="label">Supporting document (optional)</label>
          <p className="mt-1 text-sm">Map/Plan/Sketches etc</p>
          
          {(() => {
            if (file) {
              return (
                <div className="relative flex flex-col items-center bg-input-bg border-[1px] border-light-gray rounded-md py-3 mt-1">
                  <div className="absolute top-0 left-0 z-10 w-full h-full flex justify-center items-center flex-col">
                    <h4 className="text-gray">{file.file.name}</h4>
                    <button type="button" onClick={update} className="text-gray mt-[.5em] text-sm">Click to change</button>
                    <a href={file.url} target="_blank" className="text-sm mt-[.5em] text-gray font-semibold">View file</a>
                  </div>
                  <input onChange={upload} ref={credential} className="opacity-0" type="file"/>
                </div>
              );
            } else {
              return (
                <div className="relative flex flex-col items-center bg-input-bg border-[1px] border-light-gray rounded-md py-3 mt-1">
                  <Image src="/upload.svg" alt="upload" width={50} height={53}/>
                  <h4 className="text-gray font-semibold mt-1">Click here to upload</h4>
                  <input onChange={upload} ref={credential} className="absolute h-full top-0 opacity-0" type="file"/>
                </div>
              );
            }
          })()}
          
        </div>

        <button className="button !mt-1" type="submit">Check contractor avalability</button>

      </form>
      
      <section ref={modal} className="fixed top-0 left-0 bg-black/50 hidden opacity-0 items-center justify-center h-screen w-full">
        
        <section className="bg-white p-2 rounded-lg max-w-[60%]">
          {(() => {
            if (totalVendors > 0) {
              return (
                <>
                  <h4 className="text-primary text-lg">Total contractors available</h4>
                  <p className="mt-[.5em] text-sm">{totalVendors} contractor{totalVendors > 1 ? 's' : ''} available in the designated area and service</p>
                  <p className="text-xs mt-1">Note: Each request will cost you RM10 as a commitment fee</p>
                  <button onClick={submit} className="button mt-[1.5em]">Pay & submit</button>
                  <button onClick={closePrompt} className="text-center w-full mt-1 text-sm font-semibold text-gray">Cancel</button>
                </>
              )
            } else {
              return (
                <>
                  <h4 className="text-primary text-lg">Sorry contractor unavailable</h4>
                  <p className="mt-[.5em] text-sm">We're so sorry to tell you there's no contractor available in the designated area and service</p>
                  <button onClick={closePrompt} className="button mt-[1.5em]">Okay</button>
                </>
              )
            }
          })()}
        </section>

      </section>
    </main>
  );
}

export default SupportingDocument;