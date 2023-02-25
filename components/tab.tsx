import type { NextPage } from 'next';
import Link from 'next/link';
import Hammer from '../public/hammer';
import Clipboard from '../public/clipboard';

type args = {
  page: string;
}

const Tab: NextPage<args> = ({page}) => {

  return (
    <main className="flex justify-between w-full">
      <Link href="/services" className={`flex items-center ${page === 'services' ? 'bg-primary' : 'bg-white'} shadow-normal w-[47%] box-border px-1 py-[.8em] justify-center rounded-md`}>
        <Hammer active={page === 'services' ? true : false}/>
        <p className={`ml-[.4em] ${page === 'services' ? 'text-white' : 'text-gray'} text-sm`}>Services</p>
      </Link>
      <Link href="/hires" className={`flex items-center shadow-normal w-[47%] box-border px-1 py-[.8em] justify-center rounded-md ${page === 'hires' ? 'bg-primary' : 'bg-white'}`}>
        <Clipboard active={page === 'hires' ? true : false}/>
        <p className={`ml-[.4em] ${page === 'hires' ? 'text-white' : 'text-gray'} text-sm`}>Hires</p>
      </Link>
    </main>
  );
}

export default Tab;