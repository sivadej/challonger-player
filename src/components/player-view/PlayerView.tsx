import React, { useContext } from 'react';
import { Badge, Row, Col, Placeholder } from 'react-bootstrap';
import { AppContext } from '@contexts/AppContext';
import usePlayersSetQuery from '@hooks/query/usePlayersSetQuery';
import useMatchesQuery from '@hooks/query/useMatchesQuery';

export default function PlayerView(): JSX.Element {
  const { state, dispatch } = useContext(AppContext);
  const { apiKey, subdomain, selectedTournaments, playerIdView } = state;

  // using players set cached query, get entities[playerIdView] to retrieve tournament ids
  const { data } = usePlayersSetQuery({
    apiKey,
    subdomain,
    tournamentIds: selectedTournaments,
  });
  console.log(data);
  const { entities } = data ?? {};
  const player = (entities && playerIdView) ? entities[playerIdView] : null;
  console.log(player);

  const { data: matchData } = useMatchesQuery({
    apiKey,
    subdomain,
    tournamentId: '',
  });
  console.log(matchData);


  return (
    <>
      <div>
        VIEWING PLAYER: {playerIdView}
        <hr />
        <button
          onClick={() =>
            dispatch({ type: 'CHANGE_VIEW', payload: { view: 'HOME' } })
          }
        >
          back
        </button>
      </div>
      {JSON.stringify(player, null, 2)}
      <div className='d-flex justify-content-center mt-3'>
        <div
          style={{ width: '75%', fontSize: '1.2rem', fontWeight: 'bold' }}
        >
          VIEWING PLAYER: {playerIdView}
        </div>
      </div>
      <div className='d-flex justify-content-center mt-0'>
        <div
          className='bg-dark border border-light p-3'
          style={{ width: '75%' }}
        >
          <Row></Row>
        </div>
      </div>
    </>
  );
}
