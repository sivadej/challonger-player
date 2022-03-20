import React, { useContext, useMemo } from 'react';
import { Badge, Row, Col, Placeholder, Button } from 'react-bootstrap';
import { AppContext } from '@contexts/AppContext';
import usePlayersSetQuery from '@hooks/query/usePlayersSetQuery';
import useTournamentsQuery from '@hooks/query/useTournamentsQuery';

interface DetailLine {
  tournamentName: string;
  gameName: string;
  matches: MatchDetail[];
}

interface MatchDetail {
  tId: number | string;
  mId: number | string;
  p1: { name: string; id: string; isOpponent?: boolean };
  p2: { name: string; id: string; isOpponent?: boolean };
  score: string;
  round: number;
  isWinner: boolean | null;
}

export default function PlayerView(): JSX.Element {
  const { state, dispatch } = useContext(AppContext);
  const { apiKey, subdomain, selectedTournaments, playerIdView } = state;

  // using players set cached query, get entities[playerIdView] to retrieve tournament ids
  const { data, isFetching: playersSetFetching } = usePlayersSetQuery({
    apiKey,
    subdomain,
    tournamentIds: selectedTournaments,
  });
  const { entities, playerDict = {} } = data ?? {};
  const playerEntity = useMemo(
    () => (entities && playerIdView ? entities[playerIdView] : []),
    [entities, playerIdView]
  );
  console.log('lookup table', playerDict);

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
        gameName: tRes[i].data.tournament.game_name,
        matches: [],
      };
      const tpMatches = tRes[i].data.tournament.matches?.filter(
        (node: any) =>
          `${node.match?.player1_id}` === tp.playerId ||
          `${node.match?.player2_id}` === tp.playerId
      );
      console.log('filtered matches', tpMatches);
      detailLine.matches = tpMatches.map(
        (tpm: any): MatchDetail => ({
          tId: tpm.id,
          mId: tpm.match.id,
          round: tpm.match.round,
          isWinner: tpm.match.winner_id
            ? tpm.match.winner_id.toString() === tp.playerId
            : null,
          p1: {
            id: tpm.match.player1_id,
            name: playerDict[tpm.match.player1_id],
            isOpponent: tpm.match.player1_id?.toString() !== tp.playerId,
          },
          p2: {
            id: tpm.match.player2_id,
            name: playerDict[tpm.match.player2_id],
            isOpponent: tpm.match.player2_id?.toString() !== tp.playerId,
          },
          score: tpm.match.scores_csv,
        })
      );
      tpLines.push(detailLine);
    });
    return tpLines;
  }, [playerEntity, tRes, playerDict]);

  const handleClickReportMatch = async (matchId: number | string) => {
    if (!matchId) return;
    console.log('report matchid', matchId);
    // TODO: implement mutation for match report
    // report match api: PUT /match
    // params:
    // api_key,
    // match_id,
    // scores_csv,
    // subdomain,
    // tournament_id,
    // winner_id,
  };

  return (
    <>
      <div className='d-flex justify-content-center my-3'>
        <div
          className='d-flex w-100 m-3 align-items-center'
          style={{ justifyContent: 'space-between' }}
        >
          <div
            style={{
              flex: 1,
              fontSize: '2rem',
              fontWeight: 'normal',
              textTransform: 'uppercase',
            }}
          >
            VIEWING PLAYER:
            <span style={{ fontWeight: 700 }}> {playerIdView}</span>
          </div>
          <div style={{ flex: 0 }}>
            <Button
              variant='outline-light'
              size='lg'
              className='px-4'
              onClick={() =>
                dispatch({ type: 'CHANGE_VIEW', payload: { view: 'HOME' } })
              }
            >
              BACK
            </Button>
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-center mt-0'>
        <div style={{ width: '85%', maxWidth: 1000 }}>
          {playerDetailViewData.map((tourney) => (
            <div key={tourney.tournamentName}>
              <div
                className='text-uppercase'
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: '#808080',
                  marginBottom: 2,
                  marginTop: 30,
                  lineHeight: '1.8rem',
                }}
              >
                {tourney.gameName}
              </div>
              <div style={{ fontSize: '2rem', textTransform: 'uppercase' }}>
                {tourney.matches?.map((match) => (
                  <div
                    className='border border-light p-2 d-flex align-items-center'
                    key={match.mId}
                    style={getBgStyle(match.isWinner)}
                  >
                    <div
                      style={{
                        width: '8%',
                        textAlign: 'center',
                        color: '#baddff',
                        fontSize: '1.2rem',
                      }}
                    >
                      {getRoundLbl(match.round)}
                    </div>
                    <div
                      style={{
                        flexGrow: 1,
                        paddingLeft: 8,
                      }}
                    >
                      <span className='text-muted small px-2'>vs</span>
                      <span style={{ fontSize: '1.2em' }} className='mx-2'>
                        {match.p1.isOpponent
                          ? match.p1.name ?? <em>upcoming</em>
                          : null}
                        {match.p2.isOpponent
                          ? match.p2.name ?? (
                              <span className='small fst-italic text-muted'>
                                [ tbd ]
                              </span>
                            )
                          : null}
                      </span>
                    </div>
                    {match.isWinner === null ? (
                      <fieldset
                        disabled={match.p2.id === null || match.p1.id === null}
                      >
                        <div
                          style={{
                            textAlign: 'right',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          <div style={{ fontSize: '1rem', fontWeight: 500 }}>
                            REPORT
                          </div>
                          <Button variant='primary' style={{ width: '5rem' }}>
                            WIN
                          </Button>
                          <Button variant='danger' style={{ width: '5rem' }}>
                            LOSS
                          </Button>
                        </div>
                      </fieldset>
                    ) : (
                      <div
                        style={{
                          fontSize: '1.5rem',
                          fontWeight: 200,
                          marginRight: 10,
                        }}
                      >
                        {match.isWinner ? 'W' : 'L'} {match.score}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* <pre>{JSON.stringify(playerDetailViewData, null, 2)}</pre> */}
      </div>
    </>
  );
}

const getBgStyle = (win: boolean | null): { backgroundColor?: string } => {
  const style: { backgroundColor?: string } = { backgroundColor: '#000' };
  if (win === true) style.backgroundColor = '#00084d';
  if (win === false) style.backgroundColor = '#540600';
  return style;
};

const getRoundLbl = (r: number | null): string => {
  if (!r) return '--';
  if (r === 1) return 'R1';
  if (r < 0) return `L${Math.abs(r)}`;
  if (r > 1) return `W${r}`;
  return '';
};
