import React, { useContext } from 'react';
import { AppContext } from '@contexts/AppContext';
import Players from '@components/player-select';
import PlayerView from '@components/player-view';

export default function Container(): JSX.Element {
  const {
    state: { currentView },
  } = useContext(AppContext);

  return (
    <>
      {currentView}
      {currentView === 'HOME' ? <Players /> : null}
      {currentView === 'PLAYER' ? <PlayerView /> : null}
      {currentView === 'MATCH' ? null : null}
    </>
  );
}
