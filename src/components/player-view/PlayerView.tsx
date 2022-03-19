import React, { useContext, useMemo } from 'react';
import { Badge, Row, Col, Placeholder } from 'react-bootstrap';
import { AppContext } from '@contexts/AppContext';
import usePlayersSetQuery from '@hooks/query/usePlayersSetQuery';
import useTournamentsQuery from '@hooks/query/useTournamentsQuery';

interface DetailLine {
  tournamentName: string;
  matches: {
    mId: string;
    p1: { name: string; id: string };
    p2: { name: string; id: string };
    score: string;
  }[];
}

export default function PlayerView(): JSX.Element {
  const { state, dispatch } = useContext(AppContext);
  const { apiKey, subdomain, selectedTournaments, playerIdView } = state;

  // using players set cached query, get entities[playerIdView] to retrieve tournament ids
  const { data } = usePlayersSetQuery({
    apiKey,
    subdomain,
    tournamentIds: selectedTournaments,
  });
  const { entities } = data ?? {};
  const playerEntity = useMemo(
    () => (entities && playerIdView ? entities[playerIdView] : []),
    [entities, playerIdView]
  );

  // using selected playerEntity...
  console.log('selected playerEntity:', JSON.stringify(playerEntity, null, 2));

  // given this entity's pId/tId, query each tournament w players and matches by tId.
  const tRes: any = useTournamentsQuery({
    apiKey,
    subdomain,
    tournamentIds: playerEntity.map((p) => p.tournamentId),
  });
  // console.log('tournamentsQuery', tRes);

  // iterate over each playerEntity
  // find matches involving pId (pId is match.player1_id or match.player2_id)
  // iterate over each match
  // find playerName by id within playerList

  const playerDetailViewData = useMemo<DetailLine[]>(() => {
    const tpLines: DetailLine[] = [];
    playerEntity.forEach((tp, i) => {
      if (!tRes[i].data) return;
      const detailLine: DetailLine = {
        tournamentName: tRes[i].data.tournament.name,
        matches: [],
      };
      const tpMatches = tRes[i].data.tournament.matches?.filter(
        (node: any) =>
          `${node.match?.player1_id}` === tp.playerId ||
          `${node.match?.player2_id}` === tp.playerId
      );
      console.log('filtered matches', tpMatches);
      detailLine.matches = tpMatches.map((tpm: any) => ({
        mId: tpm.match.id,
        p1: tpm.match.player1_id,
        p2: tpm.match.player2_id,
        score: tpm.match.scores_csv,
      }));
      tpLines.push(detailLine);
    });
    return tpLines;
  }, [playerEntity, tRes]);

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
      <div className='d-flex justify-content-center mt-3'>
        <div style={{ width: '75%', fontSize: '1.2rem', fontWeight: 'bold' }}>
          VIEWING PLAYER: {playerIdView}
        </div>
      </div>
      <div className='d-flex justify-content-center mt-0'>
        <div
          className='bg-dark border border-light p-3'
          style={{ width: '75%' }}
        >
          <Row>
            <pre>{JSON.stringify(playerDetailViewData, null, 2)}</pre>
          </Row>
        </div>
      </div>
    </>
  );
}
