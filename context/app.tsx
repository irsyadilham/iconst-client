import { createContext } from 'react';
import App from '../types/context';

const AppContext = createContext<App | null>(null);

export default AppContext;