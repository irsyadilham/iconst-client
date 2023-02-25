import { useReducer } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

import AppContext from '../context/app';
import LoadingReducer from '../reducers/loading';
import ContextValueMapper from '../functions/context-value-mapper';

import Loading from '../components/loading';

function MyApp({ Component, pageProps }: AppProps) {

  const [loadingState, loadingDispatch] = useReducer(LoadingReducer, false)
  
  const contextValue = {
    loading: ContextValueMapper(loadingState, loadingDispatch)
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Head>
        <title>iconst: client</title>
      </Head>
      <Component {...pageProps} />
      <Loading/>
    </AppContext.Provider>
  )
}

export default MyApp;
