import type { NextPage } from 'next';
import { useEffect, useState, useRef, useContext } from 'react';
import AppContext from '../../context/app';
import { useRouter } from 'next/router';
import Image from 'next/image';

import Back from '../../components/back';
import type { Job } from '../../types/job';

import { statusColor } from '../../functions/status-color';
import { get, del, put } from '../../functions/fetch';
import { gsap } from 'gsap';

const HireDetails: NextPage = () => {

  const router = useRouter();
  const context = useContext(AppContext);
  const [job, setJob] = useState<Job | null>(null);
  const confirmCancel = useRef<HTMLDivElement>(null);
  const ratingModal = useRef<HTMLDivElement>(null);
  const [rating, setRating] = useState<number>(0);

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

  const clearNotification = async () => {
    if (router.query.notification === 'true') {
      try {
        await put(`/notifications/${router.query.notification_id}/read`, {});
      } catch (err: any) {
        
      }
    }
  }

  useEffect(() => {
    if (router.isReady) {
      getJob();
      clearNotification();
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

  const acceptVendor = async (jobVendorId: number) => {
    try {
      context?.loading.dispatch({type: 'ON'});
      const job: Job = await put(`/jobs/${router.query.id}/accept-vendor`, { job_vendor_id: jobVendorId });
      context?.loading.dispatch({type: 'OFF'});
      setJob(job);
    } catch (err: any) {
      context?.loading.dispatch({type: 'OFF'});
      alert('Failed to accept vendor, please try again later');
    }
  }

  const whatsapp = (phoneNumber: string): string => {
    const phone = phoneNumber.match(/[^0]\d+/)![0];
    return `https://wa.me/${phone}`;
  }

  const completed = () => {
    ratingModal.current?.classList.remove('hidden');
    ratingModal.current?.classList.add('flex');
    gsap.to(ratingModal.current, { opacity: 1, ease: 'power3.out' });
  }

  const cancelRating = () => {
    gsap.to(ratingModal.current, { opacity: 0, ease: 'power3.out', onComplete() {
      ratingModal.current?.classList.remove('flex');
      ratingModal.current?.classList.add('hidden');
      setRating(0);
    }});
  }

  const rateVendor = (index: number) => {
    setRating(index + 1);
  }

  const starStyle = (star: number) => {
    if (star <= rating) {
      return '/star-fill.svg';
    }
    return '/star.svg';
  }

  const submitRating = async () => {
    if (rating === 0) {
      alert('Please rate vendor to submit');
      return;
    }
    try {
      const data = {
        side: 'client',
        rating
      };
      context?.loading.dispatch({type: 'ON'});
      const job: Job = await put(`/jobs/${router.query.id}/job-completion`, data);
      context?.loading.dispatch({type: 'OFF'});
      cancelRating();
      setJob(job);
    } catch (err: any) {
      context?.loading.dispatch({type: 'OFF'});
      alert('Failed to submit rating, please try again later');
    }
  }

  return (
    <main className="container mt-3 px-2 pb-2">
      <Back text="Hires"/>

      <div className="flex items-center justify-between mt-2">
        <p className="text-sm">{job?.date}</p>
        {(() => {
          if (job?.is_expired && job.status.name === 'Request') {
            return <h4 className="status bg-amber-500 text-white">Expired</h4>;
          } else {
            return <h4 style={{background: statusColor(job?.status.name!)}} className="status">{job?.status.name}</h4>;
          }
        })()}
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

      {/* supporting documents */}
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
      {/* supporting documents */}

      {(() => {
        if (job?.status.name === 'Quotation ready') {
          return (
            <div className="mt-2">
              <h4 className="text-gray text-sm mb-1">Quotations</h4>

              <section className="space-y-[1.3em]">
                {job.vendors.filter(val => val.approved).map((val, i) => {
                  return (
                    <div key={i} className="p-[1.3em] bg-white shadow-normal rounded-lg">
                      <div className="flex items-center">
                        <Image src="/worker.svg" alt="vendor" width={19} height={19}/>
                        <h4 className="text-gray ml-[.5em]">Vendor-{val.vendor.id}</h4>
                      </div>

                      {(() => {
                        if (val.vendor.rating === 0) {
                          return <p className="text-sm mt-[.3em]">No rating yet</p>;
                        } else {
                          return (
                            <div id="rating" className="flex space-x-[.4em] mt-[.5em]">
                              {Array(val.vendor.rating).fill('').map((_, i) => {
                                return <Image className="w-[.8em]" key={i} src="/star-fill.svg" alt="star" width={11} height={11}/>
                              })}
                            </div>
                          );
                        }
                      })()}
  
                      <h3 className="text-primary mt-1">RM{parseFloat(val.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
  
                      <div className="flex items-center justify-between mt-[.5em]">
                        <a className="text-sm text-primary font-semibold" href={`${process.env.HOST}/${val.quotation_url}`} target="_blank">View quotation</a>
  
                        <button onClick={() => acceptVendor(val.id)} className="text-sm bg-green-500 px-1 py-[.5em] font-semibold text-white rounded-md">Accept</button>
                      </div>
                    </div>
                  );
                })}
              </section>
            </div>
          );
        } else if (job?.status.name === 'Accepted' && !job?.client_completed) {
          const jobVendor = job?.vendors.find(vendor => vendor.choosen);
          return (
            <div className="mt-2">

              <h4 className="text-gray text-sm mb-1">Vendor</h4>

              <div className="flex justify-between">

                <div id="left">
                  <div className="flex items-center">
                    <Image src="/worker.svg" alt="vendor" width={19} height={19}/>
                    <h4 className="text-gray ml-[.5em]">Vendor-{jobVendor?.vendor.id}</h4>
                  </div>

                  <div className="flex mt-[.5em]">
                    <div className="flex">
                      <Image className="w-1" src="/whatsapp.svg" alt="whatsapp" width={16} height={16}/>
                      <a className="ml-[.5em] font-semibold text-gray text-sm" href={whatsapp(jobVendor!.vendor.user.contact_no)} target="_blank">Whatsapp</a>
                    </div>

                    <div className="flex ml-[1.5em]">
                      <Image className="w-1" src="/phone.svg" alt="phone" width={12} height={12}/>
                      <a className="ml-[.5em] font-semibold text-gray text-sm" href={`tel:${jobVendor?.vendor.user.contact_no}`}>Call</a>
                    </div>
                  </div>
                </div>
                {/* #left */}

                <div id="right">
                  <h3 className="text-primary mt-[.3em]">RM{parseFloat(jobVendor!.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>

                  <a className="text-sm text-gray font-semibold mt-[.5em] block" href={`${process.env.HOST}/${jobVendor?.quotation_url}`} target="_blank">View quotation</a>
                </div>
                {/* #right */}

              </div>

              <button onClick={completed} className="button !bg-green-500 mt-2">Completed</button>

            </div>
          );
        } else if (job?.client_completed) {
          return (
            <div className="mt-[1.5em]">
              <h4 className="text-gray text-sm">Rating</h4>

              {(() => {
                if (job) {
                  const vendor = job?.vendors.find(vendor => {
                    return vendor.choosen;
                  });
                  return (
                    <div className="flex mt-[.7em]">
                      <Image src="/worker.svg" alt="vendor" width={19} height={19}/>
                      <h4 className="font-semibold text-gray ml-[.5em]">Vendor-{vendor?.vendor.id}</h4>
                    </div>
                  )
                }
              })()}

              <div className="flex space-x-[.8em] mt-[.5em]">
                {Array(job?.rating).fill('').map((_, i) => {
                  return <Image key={i} className="w-[1.2em]" src="/star-fill.svg" alt="star" width={15} height={15}/>
                })}
              </div>
            </div>
          );
        }
      })()}

      {(() => {
        if (!job?.client_completed) {
          return <button onClick={cancelRequest} className="button !bg-red-600 mt-[1.5em]">Cancel</button>;
        }
      })()}

      <section ref={confirmCancel} className="fixed left-0 top-0 w-full h-screen bg-black/50 hidden justify-center items-center opacity-0">

        <section className="p-2 bg-white rounded-lg max-w-[70%] flex flex-col items-center">
          <h2 className="text-primary text-xl">Are you sure?</h2>
          <p className="mt-1 text-sm">Cancelling request will results account suspension if <span className="font-bold text-primary">more than 3 times</span></p>
          <button onClick={confirmDelete} className="button mt-[1.4em] !bg-red-600">Confirm cancel</button>
          <button onClick={() => closeConfirmRequest()} className="mt-1 font-semibold text-gray">Cancel</button>
        
        </section>
      </section>

      <section ref={ratingModal} className="fixed left-0 top-0 w-full h-screen bg-black/50 hidden justify-center items-center opacity-0">

        <section className="p-2 bg-white rounded-lg max-w-[70%] flex flex-col items-center">
          <h2 className="text-primary text-xl">Rate the vendor</h2>
          <div className="flex space-x-[.8em] my-1">
            {(() => {
              return Array(5).fill('').map((_, i) => {
                return (
                  <button onClick={() => rateVendor(i)} key={i}>
                    <Image className="w-[1.5em]" src={starStyle(i + 1)} alt="star" width={15} height={15}/>
                  </button>
                );
              });
            })()}
          </div>
          <button onClick={submitRating} className="button mt-[1.4em]">Submit</button>
          <button onClick={cancelRating} className="mt-1 font-semibold text-gray">Cancel</button>
        
        </section>
      </section>

    </main>
  );
}

export default HireDetails;