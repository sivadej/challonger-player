import React, { useContext, useMemo } from "react";
import { Badge, Row, Col, Placeholder } from "react-bootstrap";
import { AppContext } from "@contexts/AppContext";
import usePlayersSetQuery from "@hooks/query/usePlayersSetQuery";
import useTournamentsQuery from "@hooks/query/useTournamentsQuery";

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
  console.log("lookup table", playerDict);

  // using selected playerEntity...
  console.log("selected playerEntity:", JSON.stringify(playerEntity, null, 2));

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
      console.log("filtered matches", tpMatches);
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
  }

  return (
    <>
      <div>
        VIEWING PLAYER: {playerIdView}
        <hr />
        <button
          onClick={() =>
            dispatch({ type: "CHANGE_VIEW", payload: { view: "HOME" } })
          }
        >
          back
        </button>
      </div>
      <div className="d-flex justify-content-center mt-3">
        <div style={{ width: "75%", fontSize: "1.2rem", fontWeight: "bold" }}>
          VIEWING PLAYER: {playerIdView}
        </div>
      </div>
      <div className="d-flex justify-content-center mt-0">
        <div
          className="bg-dark border border-light p-3"
          style={{ width: "75%" }}
        >
          {playerDetailViewData.map((tourney) => (
            <Row className="m-2" key={tourney.tournamentName}>
              <strong>{tourney.tournamentName}</strong>
              {tourney.matches?.map((match) => (
                <div className="border border-info m-2" key={match.mId} style={getBgStyle(match.isWinner)}>
                  <div>round {match.round}</div>
                  {match.isWinner !== null ? (
                    <div>{match.isWinner ? "win" : "loss"}</div>
                  ) : (
                    "not reported"
                  )}
                  <div>p1 {match.p1.name}</div>
                  <div>p2 {match.p2.name}</div>
                  <div>score {match.score}</div>
                  <button disabled={match.isWinner !== null} onClick={() => handleClickReportMatch(match.mId)}>
                    report {match.mId}
                  </button>
                </div>
              ))}
            </Row>
          ))}
        </div>
        {/* <pre>{JSON.stringify(playerDetailViewData, null, 2)}</pre> */}
      </div>
    </>
  );
}

const getBgStyle = (win: boolean | null): { backgroundColor?: string } => {
  const style: { backgroundColor?: string } = {};
  if (win === true) style.backgroundColor = 'navy';
  if (win === false) style.backgroundColor = '#660000';
  return style;
}