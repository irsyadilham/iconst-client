import type { NextPage } from 'next';
import Image from 'next/image';
import Back from '../../components/back';

const Support: NextPage = () => {
  return (
    <main className="container mt-4">
      <Back text="Settings"/>

      <h1 className="mt-2 text-2xl">Support</h1>

      <p className="mt-1">For any assistance, please contact no below. Out team will be happy to help you</p>

      <a href="https://wa.me/601112364814" target="_blank" className="flex items-center mt-1">
        <Image className="w-[1.5em]" src="/whatsapp.svg" alt="whatsapp" width={16} height={16}/>
        <p className="ml-[.5em]">Press here</p>
      </a>

      <a href="tel:01112364814" target="_blank" className="flex items-center mt-[1.2em]">
        <Image className="w-[1.3em]" src="/phone.svg" alt="phone" width={12} height={12}/>
        <p className="ml-[.5em]">011 1236 4814</p>
      </a>
    </main>
  );
}

export default Support;