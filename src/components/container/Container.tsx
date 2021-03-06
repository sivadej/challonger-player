import React, { useContext } from 'react';
import { AppContext } from '@contexts/AppContext';
import Players from '@components/player-list';
import PlayerView from '@components/player-detail';
import Admin from '@components/admin';

export default function Container(): JSX.Element {
  const {
    state: { currentView },
  } = useContext(AppContext);

  return (
    <>
      {currentView === 'HOME' ? <Players /> : null}
      {currentView === 'PLAYER' ? <PlayerView /> : null}
      {currentView === 'MATCH' ? null : null}
      <Admin />
    </>
  );
}
