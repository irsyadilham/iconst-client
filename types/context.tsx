import { Action as LoadingAction } from '../reducers/loading';

type LoadingDispatch = {
  (args: LoadingAction): void;
}

type Loading = {
  state: boolean;
  dispatch: LoadingDispatch;
}

type App = {
  loading: Loading;
}

export default App;