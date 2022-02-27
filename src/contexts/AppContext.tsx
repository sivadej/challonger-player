import React, { createContext, useEffect, useReducer } from 'react';
import { AppReducerActions, ChallongerLocalStorage } from 'interfaces';

const initialState: ChallongerLocalStorage = {
  tourney: {
    domain: '',
    tourneyName: '',
  },
  config: {
    challongeKey: '',
  },
  INIT: false,
}

const AppContext = createContext<{
  state: ChallongerLocalStorage;
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => null,
});

const reducer = (
  state: ChallongerLocalStorage,
  action: { type: AppReducerActions; payload?: any },
): ChallongerLocalStorage => {
  const newState: ChallongerLocalStorage = { ...state };
  switch(action.type) {

    case 'INIT_SETTINGS':
      console.log('INIT_SETTINGS');
      newState.INIT = true;
      newState.config = action.payload.config;
      newState.tourney = action.payload.tourney;
      setLocalStorage(newState);
      return newState;
    
    case 'SELECT_TOURNAMENT':
      console.log('SELECT_TOURNAMENT');
      newState.tourney.domain = action.payload.domain;
      newState.tourney.tourneyName = action.payload.tourneyName;
      setLocalStorage(newState);
      return newState;
    
    case 'CHANGE_TOURNEY_NAME':
      console.log('CHANGE_TOURNEY_NAME');
      newState.tourney = { ...state.tourney, tourneyName: action.payload.tourneyName };
      setLocalStorage(newState);
      return newState;
    
    case 'CHANGE_DOMAIN':
      console.log('CHANGE_DOMAIN');
      newState.tourney = { ...state.tourney, domain: action.payload.domain };
      setLocalStorage(newState);
      return newState;
    
    case 'CHANGE_API_KEY':
      console.log('CHANGE_API_KEY');
      newState.config.challongeKey = action.payload.challongeKey;
      setLocalStorage(newState);
      return newState;
    
    default:
      return state;
  }
}

function setLocalStorage(state: ChallongerLocalStorage) {
  window.localStorage.setItem(
    'challongerPlayerSettings',
    JSON.stringify(state),
  );
}

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    function initLocalStorage(state: ChallongerLocalStorage) {
      const savedState = window.localStorage.getItem('challongerPlayerSettings');
      dispatch({
        type: 'INIT_SETTINGS',
        payload: savedState ? JSON.parse(savedState) : state,
      })
    }
    if (!state.INIT) initLocalStorage(state);
  }, [state]);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
};

export { AppContext, AppProvider };