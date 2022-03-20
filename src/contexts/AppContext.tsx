import React, { createContext, useEffect, useReducer } from 'react';
import {
  AppReducerActions,
  ChallongerLocalStorageV2,
  AppState,
} from 'interfaces';

const initialState: AppState = {
  apiKey: 'PLACEHOLDER',
  selectedTournaments: [],
  subdomain: 'PLACEHOLDER',
  initializedFromStorage: false,
  currentView: 'HOME',
  playerIdView: null,
  matchIdView: null,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppReducerActions>;
}>({
  state: initialState,
  dispatch: () => null,
});

const reducer = (state: AppState, action: AppReducerActions): AppState => {
  const newState: AppState = { ...state };
  switch (action.type) {
    case 'INIT_STATE_FROM_STORAGE':
      console.log('INIT_STATE_FROM_STORAGE');
      newState.initializedFromStorage = true;
      newState.apiKey = action.payload.apiKey;
      newState.subdomain = action.payload.subdomain;
      newState.selectedTournaments = action.payload.selectedTournaments;
      setLocalStorage(newState);
      return newState;

    case 'SET_TOURNAMENTS_LIST':
      console.log('SET_TOURNAMENTS_LIST');
      newState.selectedTournaments = action.payload.tournamentIds;
      setLocalStorage(newState);
      return newState;

    case 'CHANGE_SUBDOMAIN':
      console.log('CHANGE_SUBDOMAIN');
      newState.subdomain = action.payload.subdomain;
      setLocalStorage(newState);
      return newState;

    case 'CHANGE_API_KEY':
      console.log('CHANGE_API_KEY');
      newState.apiKey = action.payload.apiKey;
      setLocalStorage(newState);
      return newState;

    case 'CHANGE_VIEW':
      newState.currentView = action.payload.view;
      return newState;

    case 'SHOW_PLAYER_VIEW':
      newState.currentView = 'PLAYER';
      newState.playerIdView = action.payload.playerName;
      return newState;

    default:
      return state;
  }
};

function setLocalStorage(state: ChallongerLocalStorageV2) {
  window.localStorage.setItem(
    'challongerPlayerSettings',
    JSON.stringify(state)
  );
}

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    function initLocalStorage(state: ChallongerLocalStorageV2) {
      const savedState = window.localStorage.getItem(
        'challongerPlayerSettings'
      );
      dispatch({
        type: 'INIT_STATE_FROM_STORAGE',
        payload: savedState ? JSON.parse(savedState) : state,
      });
    }
    if (!state.initializedFromStorage) initLocalStorage(state);
  }, [state]);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
