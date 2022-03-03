import React, { useContext } from 'react';
import usePlayersQuery from '@hooks/query/usePlayersQuery';
import { AppContext } from '@contexts/AppContext';
import { PlayerSetContext } from '@contexts/PlayerSetContext';

export default function Players(): JSX.Element {
  const { state } = useContext(AppContext);
  const { state: { playerSet } } = useContext(PlayerSetContext);
  const { apiKey, subdomain } = state;
  const { data } = usePlayersQuery({ apiKey, subdomain, tournamentId: '10838641' });
  console.log(data);
  console.log(playerSet);

  return <>players</>;
}
