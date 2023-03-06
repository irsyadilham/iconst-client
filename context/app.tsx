import { createContext } from 'react';
import type { App } from '../types/context';

const AppContext = createContext<App | null>(null);

export default AppContext;