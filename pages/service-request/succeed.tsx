import type { NextPage } from 'next';
import { useEffect, useContext, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import AppContext from '../../context/app';
import Image from 'next/image';
import Link from 'next/link';
import { put } from '../../functions/fetch';
import { gsap } from 'gsap';

const Succeed: NextPage = () => {

  const context = useContext(AppContext);
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<boolean>(true);
  const counter = useRef<HTMLSpanElement>(null);

  const statusUpdate = async () => {
    try {
      context?.loading.dispatch({type: 'ON'});
      await put(`/jobs/${router.query.order_id}/payment-status`, { status_id: parseInt(router.query.status_id as string) });
      context?.loading.dispatch({type: 'OFF'});
      gsap.to(counter.current, { innerText: 0, ease: 'none', snap: 'innerText', duration: 10, onComplete() {
        router.push('/');
      }});
    } catch (err: any) {
      if (err.status === 403) {
        setPaymentStatus(false);
      }
      context?.loading.dispatch({type: 'OFF'});
    }
  }

  useEffect(() => {
    if (router.isReady) {
      statusUpdate();
    }
  }, [router.isReady]);

  return (
    <main className="container flex flex-col items-center justify-center h-screen">
      <Image src={paymentStatus ? '/succeed.svg' : '/failed.svg'} alt="status" width={100} height={100}/>
      <p className="mt-2">{paymentStatus ? 'Payment succeed & service request submitted succeesfully' : 'Payment failed, service request unsuccessful'}</p>
      <Link className="w-[60%] mt-2" href="/">
        <button className="button">Back to main in <span ref={counter}>10</span></button>
      </Link>
    </main>
  );
}

export default Succeed;