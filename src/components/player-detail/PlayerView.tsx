import React, { useContext, useMemo, useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownButton,
  Spinner,
  Toast,
  ToastContainer,
} from 'react-bootstrap';
import { useIsFetching } from 'react-query';
import { AppContext } from '@contexts/AppContext';
import usePlayersSetQuery from '@hooks/query/usePlayersSetQuery';
import useTournamentsQuery from '@hooks/query/useTournamentsQuery';
import useReportMatchMutation from '@hooks/mutation/useReportMatchMutation';

interface DetailLine {
  tournamentName: string;
  tournamentId: string | number;
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

  const [show, setShow] = useState(false);

  // using players set cached query, get entities[playerIdView] to retrieve tournament ids
  const { data } = usePlayersSetQuery({
    apiKey,
    subdomain,
    tournamentIds: selectedTournaments,
  });
  const { entities, playerDict = {} } = data ?? {};
  const playerEntity = useMemo(
    () => (entities && playerIdView ? entities[playerIdView] : []),
    [entities, playerIdView]
  );

  // given this entity's pId/tId, query each tournament w players and matches by tId.
  const tRes: any[] = useTournamentsQuery({
    apiKey,
    subdomain,
    tournamentIds: playerEntity.map((p) => p.tournamentId),
  });

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
        tournamentId: tRes[i].data.tournament.id,
        gameName: tRes[i].data.tournament.game_name,
        matches: [],
      };
      const tpMatches = tRes[i].data.tournament.matches?.filter(
        (node: any) =>
          `${node.match?.player1_id}` === tp.playerId ||
          `${node.match?.player2_id}` === tp.playerId
      );
      detailLine.matches = tpMatches.map(
        (tpm: any): MatchDetail => ({
          tId: tpm.tournament_id,
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

  const {
    mutate: reportMatch,
    isLoading: reportMatchLoading,
    isSuccess: reportMatchSuccess,
  } = useReportMatchMutation();
  const handleClickReportMatch = async (
    matchId: number | string,
    tournamentId: string | number,
    winnerId: number | string,
    scoreCsv?: string
  ) => {
    if (!matchId) return;
    const args = {
      apiKey,
      subdomain,
      matchId,
      tournamentId,
      winnerId,
      scoreCsv,
    };
    await reportMatch(args, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          setShow(true);
          // dispatch({ type: 'CHANGE_VIEW', payload: { view: 'HOME' } });
        }
      },
    });
  };

  const globalIsFetching = useIsFetching();

  return (
    <>
      <div
        className="d-flex justify-content-center mb-3 bg-dark"
        style={{ position: 'sticky', top: 0 }}
      >
        <div
          className="d-flex w-100 m-3 align-items-center"
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
          <div
            style={{ flex: 0, display: 'inline-flex', alignItems: 'center' }}
          >
            {globalIsFetching > 0 || reportMatchLoading ? (
              <Spinner animation="grow" variant="primary" className="mx-4" />
            ) : null}
            <Button
              variant="outline-light"
              size="lg"
              className="px-4"
              onClick={() =>
                dispatch({ type: 'CHANGE_VIEW', payload: { view: 'HOME' } })
              }
            >
              BACK
            </Button>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center mt-0">
        <div style={{ width: '85%', maxWidth: 1000 }}>
          {playerDetailViewData.map((tourney) => (
            <div key={tourney.tournamentName}>
              <div
                className="text-uppercase"
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
                    className="border border-light p-2 d-flex align-items-center"
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
                      <span className="text-muted small px-2">vs</span>
                      <span style={{ fontSize: '1.2em' }} className="mx-2">
                        {match.p1.isOpponent
                          ? match.p1.name ?? (
                              <span className="small fst-italic text-muted">
                                [ tbd ]
                              </span>
                            )
                          : null}
                        {match.p2.isOpponent
                          ? match.p2.name ?? (
                              <span className="small fst-italic text-muted">
                                [ tbd ]
                              </span>
                            )
                          : null}
                      </span>
                    </div>
                    {match.isWinner === null ? (
                      <fieldset
                        disabled={
                          match.p2.id === null ||
                          match.p1.id === null ||
                          reportMatchLoading ||
                          Boolean(globalIsFetching)
                        }
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
                          <DropdownButton
                            title="WIN"
                            size="lg"
                            menuVariant="dark"
                          >
                            <Dropdown.Item
                              className="fs-2"
                              onClick={() =>
                                handleClickReportMatch(
                                  match.mId,
                                  tourney.tournamentId,
                                  match.p1.isOpponent
                                    ? match.p2.id
                                    : match.p1.id,
                                  match.p1.isOpponent ? '0-2' : '2-0'
                                )
                              }
                            >
                              2-0
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="fs-2"
                              onClick={() =>
                                handleClickReportMatch(
                                  match.mId,
                                  tourney.tournamentId,
                                  match.p1.isOpponent
                                    ? match.p2.id
                                    : match.p1.id,
                                  match.p1.isOpponent ? '1-2' : '2-1'
                                )
                              }
                            >
                              2-1
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              className="fs-3"
                              onClick={() =>
                                handleClickReportMatch(
                                  match.mId,
                                  tourney.tournamentId,
                                  match.p1.isOpponent
                                    ? match.p2.id
                                    : match.p1.id,
                                  match.p1.isOpponent ? '0-3' : '3-0'
                                )
                              }
                            >
                              3-0
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="fs-3"
                              onClick={() =>
                                handleClickReportMatch(
                                  match.mId,
                                  tourney.tournamentId,
                                  match.p1.isOpponent
                                    ? match.p2.id
                                    : match.p1.id,
                                  match.p1.isOpponent ? '1-3' : '3-1'
                                )
                              }
                            >
                              3-1
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="fs-3"
                              onClick={() =>
                                handleClickReportMatch(
                                  match.mId,
                                  tourney.tournamentId,
                                  match.p1.isOpponent
                                    ? match.p2.id
                                    : match.p1.id,
                                  match.p1.isOpponent ? '2-3' : '3-2'
                                )
                              }
                            >
                              3-2
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={() =>
                                handleClickReportMatch(
                                  match.mId,
                                  tourney.tournamentId,
                                  match.p1.isOpponent
                                    ? match.p2.id
                                    : match.p1.id,
                                  '0-0'
                                )
                              }
                            >
                              NO SCORE
                            </Dropdown.Item>
                          </DropdownButton>
                          <DropdownButton
                            title="LOSS"
                            size="lg"
                            menuVariant="dark"
                            variant="danger"
                          >
                            <Dropdown.Item
                              className="fs-2"
                              onClick={() =>
                                handleClickReportMatch(
                                  match.mId,
                                  tourney.tournamentId,
                                  !match.p1.isOpponent
                                    ? match.p2.id
                                    : match.p1.id,
                                  !match.p1.isOpponent ? '0-2' : '2-0'
                                )
                              }
                            >
                              0-2
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="fs-2"
                              onClick={() =>
                                handleClickReportMatch(
                                  match.mId,
                                  tourney.tournamentId,
                                  !match.p1.isOpponent
                                    ? match.p2.id
                                    : match.p1.id,
                                  !match.p1.isOpponent ? '1-2' : '2-1'
                                )
                              }
                            >
                              1-2
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              className="fs-3"
                              onClick={() =>
                                handleClickReportMatch(
                                  match.mId,
                                  tourney.tournamentId,
                                  !match.p1.isOpponent
                                    ? match.p2.id
                                    : match.p1.id,
                                  !match.p1.isOpponent ? '0-3' : '3-0'
                                )
                              }
                            >
                              0-3
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="fs-3"
                              onClick={() =>
                                handleClickReportMatch(
                                  match.mId,
                                  tourney.tournamentId,
                                  !match.p1.isOpponent
                                    ? match.p2.id
                                    : match.p1.id,
                                  !match.p1.isOpponent ? '1-3' : '3-1'
                                )
                              }
                            >
                              1-3
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="fs-3"
                              onClick={() =>
                                handleClickReportMatch(
                                  match.mId,
                                  tourney.tournamentId,
                                  !match.p1.isOpponent
                                    ? match.p2.id
                                    : match.p1.id,
                                  !match.p1.isOpponent ? '2-3' : '3-2'
                                )
                              }
                            >
                              2-3
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={() =>
                                handleClickReportMatch(
                                  match.mId,
                                  tourney.tournamentId,
                                  !match.p1.isOpponent
                                    ? match.p2.id
                                    : match.p1.id,
                                  '0-0'
                                )
                              }
                            >
                              NO SCORE
                            </Dropdown.Item>
                          </DropdownButton>
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
      </div>
      <ToastContainer position="top-center">
        <Toast
          onClose={() => {
            setShow(false);
            dispatch({ type: 'CHANGE_VIEW', payload: { view: 'HOME' } });
          }}
          show={show}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Match Reported</strong>
          </Toast.Header>
          <Toast.Body className="text-black">Successfully updated.</Toast.Body>
        </Toast>
      </ToastContainer>
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
