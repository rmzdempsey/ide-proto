import {State} from '../reducers/login-reducer';

export const selectLoginState = (state: State) => state.loggedIn;