import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { statusColor } from '../functions/status-color';
import type { Job } from '../types/job';

type args = {
  job: Job;
}

const JobCard: NextPage<args> = ({job}) => {

  return (
    <section className="bg-white p-[1.5em] shadow-normal rounded-xl">

      <div className="flex justify-between items-center">
        <p className="text-[.8rem]">{job.date}</p>
        <h4 style={{backgroundColor: statusColor(job.status.name)}} className="status">{job.status.name}</h4>
      </div>

      <h3 className="mt-[.3em] text-primary">{job.title}</h3>

      <div className="flex mt-[.5em]">
        <Image className="w-1" src="/service.svg" alt="service" width={18} height={16}/>
        <p className="ml-[.5em] text-sm">{job.service.name}</p>
      </div>

      {(() => {
        if (job.status.name === 'Quotation ready') {
          return (
            <div className="mt-1">
              <h3 className="text-primary text-lg">{job.vendors.length}</h3>
              <p className="text-xs">Total quotations</p>
            </div>
          );
        }
      })()}

      {(() => {
        if (job?.status.name !== 'Cancelled') {
          return (
            <div id="wrapper" className="flex justify-between items-end mt-1">

              <div className={job.status.name !== 'Request' ? 'opacity-0' : ''}>
                <h3 className="text-lg text-primary">{job.expires_in} days</h3>
                <p className="text-xs">Request expires in</p>
              </div>

              <Link href={`/hires/${job.id}`}>
                <button className="bg-primary text-sm font-semibold rounded-md text-white px-1 py-[.7em]">View details</button>
              </Link>

            </div>
          )
        }
      })()}

    </section>
  );
}

export default JobCard;