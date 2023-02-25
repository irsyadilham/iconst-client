import type { NextPage } from 'next';
import { useEffect, useContext, useState } from 'react';
import AppContext from '../../context/app';
import Link from 'next/link';
import Home from '../../components/home';
import { get } from '../../functions/fetch';
import type { Job } from '../../types/job';

import JobCard from '../../components/job-card';

const Hires: NextPage = () => {

  const context = useContext(AppContext);
  const [userId, setUserId] = useState<number | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  const getJobs = async () => {
    try {
      context?.loading.dispatch({type: 'ON'});
      const jobs: Job[] = await get('/client-jobs');
      setJobs(jobs);
      context?.loading.dispatch({type: 'OFF'});
    } catch (err: any) {
      context?.loading.dispatch({type: 'OFF'});
      const data = await err.json();
      console.log(data.message);
    }
  }

  useEffect(() => {
    getJobs();
    setUserId(parseInt(localStorage.getItem('user_id')!));
  }, []);

  return (
    <main className="container pb-2">
      <Home page="hires">
      {(() => {
        if (userId) {
          return (
            <section className="space-y-1 mt-2">
              {jobs.filter(job => job.paid).map((job, i) => {
                return <JobCard key={i} job={job}/>
              })}
            </section>
          )
        } else {
          return (
            <section className="mt-4 flex flex-col items-center">
              <h2 className="text-gray text-xl font-semibold">You're not logged in</h2>
              <Link href="/login">
                <button className="button-fitted mt-1">Login</button>
              </Link>
            </section>
          )
        }
      })()}
      </Home>
    </main>
  );
}
export default Hires;