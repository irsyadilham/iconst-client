type ValueMapper = {
  state: any;
  dispatch: any;
}

export default (state: any, dispatch: any): ValueMapper => {
  return { state, dispatch }
}