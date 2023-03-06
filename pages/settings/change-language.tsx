import { useRef } from 'react';
import Back from '../../components/back';

export default function ChangePassword() {
  const language = useRef<HTMLSelectElement>(null);

  return (
    <main className="container pt-3 pb-2">
      <Back text="Settings"/>
      <h2 className="mt-2 text-2xl font-bold">Change language</h2>

      <form className="space-y-[1.5em] mt-2">
        <div>
          <label className="label">Language</label>
          <select className="select" ref={language}>
            <option value="english">English</option>
            <option value="bahasa">Bahasa Melayu</option>
          </select>
        </div>
        <button className="button !mt-2">Update</button>
      </form>
    </main>
  );
}