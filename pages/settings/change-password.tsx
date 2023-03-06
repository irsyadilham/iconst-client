import { FormEvent, useRef, useContext } from 'react';
import type { NextPage } from 'next';
import Back from '../../components/back';
import AppContext from '../../context/app';
import { put } from '../../functions/fetch';

const ChangePassword: NextPage = () => {
  const context = useContext(AppContext);
  const password = useRef<HTMLInputElement>(null);
  const newPassword = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);

  const changePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword.current?.value !== confirmPassword.current?.value) {
      alert('New password does not match with confirm password');
      return;
    }
    try {
      const data = {
        password: password.current?.value,
        newPassword: newPassword.current?.value
      };
      context?.loading.dispatch({type: 'ON'});
      const res = await put('/change-password', data);
      context?.loading.dispatch({type: 'OFF'});
      if (res.message === 'Password not match') {
        alert('Incorrect password, please try again');
        return;
      }
      password.current!.value = '';
      newPassword.current!.value = '';
      confirmPassword.current!.value = '';
      alert('successfully change password');
    } catch (err) {
      context?.loading.dispatch({type: 'OFF'});
    }
  }

  return (
    <main className="container pt-3 pb-2">
      <Back text="Settings"/>
      <h2 className="mt-2 text-2xl font-bold">Change password</h2>

      <form onSubmit={changePassword} className="space-y-[1.5em] mt-2">
        <div>
          <label className="label">Password</label>
          <input ref={password} className="input" type="password"/>
        </div>
        <div>
          <label className="label">New password</label>
          <input ref={newPassword} className="input" type="password"/>
        </div>
        <div>
          <label className="label">Confirm password</label>
          <input ref={confirmPassword} className="input" type="password"/>
        </div>
        <button className="button !mt-2">Update</button>
      </form>
    </main>
  );
}

export default ChangePassword;