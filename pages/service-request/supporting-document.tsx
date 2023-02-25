import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useRef, FormEvent, useEffect, useState, useContext } from 'react';
import AppContext from '../../context/app';
import Image from 'next/image';
import Back from '../../components/back';
import { postFormData } from '../../functions/fetch';
import type { ServiceRequest } from '../../types/request-service';

const SupportingDocument: NextPage = () => {
  const context = useContext(AppContext);
  const [serviceName, setServiceName] = useState<string>('');
  const router = useRouter();
  const credential = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<any>(null);

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
      
      <form onSubmit={submit} className="mt-1">

        <div>
          <label className="label">Supporting document (optional)</label>
          <p className="mt-1 text-sm">Map/Plan/Sketches etc</p>
          
          {(() => {
            if (file) {
              return (
                <div className="relative flex flex-col items-center bg-input-bg border-[1px] border-light-gray rounded-md py-3 mt-1">
                  <div className="absolute top-0 left-0 z-10 w-full h-full flex justify-center items-center flex-col">
                    <h4 className="text-gray">{file.file.name}</h4>
                    <button onClick={update} className="text-gray mt-[.5em] text-sm">Click to change</button>
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

        <p className="text-sm mt-2">To make a request the fee is RM10 as a commitment</p>
        <button className="button !mt-1" type="submit">Pay RM10 & submit</button>

      </form>

    </main>
  );
}

export default SupportingDocument;