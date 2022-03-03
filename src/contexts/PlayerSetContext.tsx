import React, { createContext, useReducer } from 'react';

type PlayerSetState = {
  playerSet: {
    [k: string]: string[];
  };
}

const initialState: PlayerSetState = {
  playerSet: {},
};

const PlayerSetContext = createContext<{
  state: PlayerSetState;
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => null,
});

const reducer = (
  state: PlayerSetState,
  action: { type: 'UPSERT'; payload: { playerId: string; tournamentId: string } },
): PlayerSetState => {
  switch(action.type) {
    case 'UPSERT':
      console.log('UPSERT');
      return state;
    default:
      return state;
  }
}

const PlayerSetProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <PlayerSetContext.Provider value={{ state, dispatch }}>
      {children}
    </PlayerSetContext.Provider>
  )
};

export { PlayerSetContext, PlayerSetProvider };