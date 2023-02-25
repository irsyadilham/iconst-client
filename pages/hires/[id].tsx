import type { NextPage } from 'next';
import { useEffect, useState, useRef, useContext } from 'react';
import AppContext from '../../context/app';
import { useRouter } from 'next/router';
import Image from 'next/image';

import Back from '../../components/back';
import type { Job } from '../../types/job';

import { statusColor } from '../../functions/status-color';
import { get, del } from '../../functions/fetch';
import { gsap } from 'gsap';

const HireDetails: NextPage = () => {

  const router = useRouter();
  const context = useContext(AppContext);
  const [job, setJob] = useState<Job | null>(null);
  const confirmCancel = useRef<HTMLDivElement>(null);

  const getJob = async () => {
    try {
      context?.loading.dispatch({type: 'ON'});
      const job: Job = await get(`/jobs/${router.query.id}`);
      context?.loading.dispatch({type: 'OFF'});
      setJob(job);
    } catch (err: any) {
      context?.loading.dispatch({type: 'OFF'});
      alert('Failed to get job details, please try again later');
    }
  }

  useEffect(() => {
    if (router.isReady) {
      getJob();
    }
  }, [router.isReady]);

  const cancelRequest = () => {
    confirmCancel.current?.classList.remove('hidden');
    confirmCancel.current?.classList.add('flex');
    gsap.to(confirmCancel.current, { opacity: 1, ease: 'power3.out' });
  }

  const closeConfirmRequest = (cancel: boolean = false) => {
    gsap.to(confirmCancel.current, { opacity: 0, ease: 'power3.out', onComplete() {
      confirmCancel.current?.classList.remove('flex');
      confirmCancel.current?.classList.add('hidden');
      if (cancel) {
        router.push('/hires');
      }
    }});
  }

  const confirmDelete = async () => {
    try {
      context?.loading.dispatch({type: 'ON'});
      await del(`/jobs/${router.query.id}/cancel`);
      context?.loading.dispatch({type: 'OFF'});
      closeConfirmRequest(true);
    } catch (err: any) {
      context?.loading.dispatch({type: 'OFF'});
      if (err.status === 403) {
        const errData = await err.json();
        alert(errData.message);
        closeConfirmRequest(true);
        return;
      }
      alert('Failed to cancel request, please try again later');
    }
  }

  const fileType = () => {
    const fileUrl = job?.supporting_documents[0].file_url;
    const regex = /(pdf|jpe?g|png)$/i;
    const match = fileUrl?.match(regex);
    if (match) {
      const fileExt = match![0].toLowerCase();
      switch(fileExt) {
        case 'pdf':
          return '/file_icons/pdf.svg';
        case 'jpg':
        case 'jpeg':
          return '/file_icons/jpg.svg';
        case 'png':
          return '/file_icons/png.svg';
      }
    }
  }

  return (
    <main className="container mt-3 px-2 pb-2">
      <Back text="Hires"/>

      <div className="flex items-center justify-between mt-2">
        <p className="text-sm">{job?.date}</p>
        <h4 style={{background: statusColor(job?.status.name!)}} className="status">{job?.status.name}</h4>
      </div>

      <h1 className="text-xl text-primary mt-1">{job?.title}</h1>

      <div className="flex mt-[.7em]">
        <Image src="/service.svg" alt="service" width={18} height={16}/>
        <h4 className="font-semibold text-gray ml-[.5em]">{job?.service.name}</h4>
      </div>

      <p className="mt-[.6em]">{job?.description}</p>

      <div id="location" className="mt-[1.5em]">
        <h4 className="text-sm text-gray">Location</h4>
        <p className="mt-[.5em]">{job?.location?.line_1}, {job?.location?.postcode}{job?.location?.city ? `, ${job.location.city}` : ''}, {job?.location?.district}, {job?.location?.state}</p>
      </div>
      {/* #location */}

      {(() => {
        if (job?.supporting_documents.length! > 0) {
          return (
            <div id="supporting-documents" className="mt-[1.5em] inline-block">
              <h4 className="text-gray text-sm">Supporting document</h4>
              <a href={`${process.env.HOST}/${job?.supporting_documents[0].file_url}`} target="_blank" className="mt-1 border-2 p-2 border-neutral-100 flex flex-col items-center justify-center rounded-lg">
                <Image className="w-3" src={fileType()!} alt="file" width={100} height={100}/>
                <p className="text-sm font-semibold mt-[.5em] text-gray">Click here to view</p>
                <p></p>
              </a>
            </div>
          );
        }
      })()}

      <button onClick={cancelRequest} className="button !bg-red-600 mt-2">Cancel</button>

      <section ref={confirmCancel} className="fixed left-0 top-0 w-full h-screen bg-black/50 hidden justify-center items-center opacity-0">

        <section className="p-2 bg-white rounded-lg max-w-[70%] flex flex-col items-center">
          <h2 className="text-primary text-xl">Are you sure?</h2>
          <p className="mt-1 text-sm">Cancelling request will results account suspension if <span className="font-bold text-primary">more than 3 times</span></p>
          <button onClick={confirmDelete} className="button mt-[1.4em] !bg-red-600">Confirm cancel</button>
          <button onClick={() => closeConfirmRequest()} className="mt-1 font-semibold text-gray">Cancel</button>
        
        </section>
      </section>

    </main>
  );
}

export default HireDetails;