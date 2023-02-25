export interface Action {
  type: string;
}

export default (state: boolean, action: Action): boolean => {
  switch(action.type) {
    case 'ON':
      return true;
    case 'OFF':
      return false;
    default:
      return state;
  }
}