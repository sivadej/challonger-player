import React, { useContext } from 'react';
import { Badge, Row, Col, Placeholder } from 'react-bootstrap';
import usePlayersSetQuery from '@hooks/query/usePlayersSetQuery';
import useTournamentsQuery from '@hooks/query/useTournamentsQuery';
import { AppContext } from '@contexts/AppContext';
import { MatchInfo, OpenMatches, PlayersSet, TournamentInfo } from 'interfaces';

const emptyArr: string[] = [];
const emptySet: PlayersSet = {};
const emptyDict: { [k: string]: string } = {};

export default function Players(): JSX.Element {
  const { state, dispatch } = useContext(AppContext);
  const { apiKey, subdomain, selectedTournaments } = state;

  const { data, isLoading } = usePlayersSetQuery({
    apiKey,
    subdomain,
    tournamentIds: selectedTournaments,
  });
  const {
    names = emptyArr,
    entities = emptySet,
    playerDict = emptyDict,
  } = data ?? {};

  const tRes: any[] = useTournamentsQuery({
    apiKey,
    subdomain,
    tournamentIds: selectedTournaments,
  });

  const getOpenMatches = (): OpenMatches[] => {
    const openMatches: OpenMatches[] = [];

    for (const res of tRes) {
      const currentTourney = res?.data?.tournament as
        | TournamentInfo
        | undefined;
      if (currentTourney) {
        openMatches.push({
          tournament_id: currentTourney.id,
          game_name: currentTourney.game_name,
          openMatches:
            currentTourney.matches
              ?.filter(({ match }) => match.state === 'open')
              .map((m) => m.match) ?? [],
        });
      }
    }

    return openMatches;
  };

  const handleClick = (name: string) => {
    dispatch({ type: 'SHOW_PLAYER_VIEW', payload: { playerName: name } });
  };

  if (isLoading) {
    return (
      <>
        <div className='d-flex justify-content-center mt-3'>
          <div
            className='bg-dark border border-light p-3'
            style={{ width: '85%' }}
          >
            <Row>
              <PlaceholderItem />
              <PlaceholderItem />
              <PlaceholderItem />
              <PlaceholderItem />
              <PlaceholderItem />
              <PlaceholderItem />
              <PlaceholderItem />
              <PlaceholderItem />
              <PlaceholderItem />
              <PlaceholderItem />
              <PlaceholderItem />
            </Row>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className='p-3 bg-dark'>
        <h3>OPEN MATCHES</h3>
        {getOpenMatches().map((to) => (
          <div className='p-2 m-2 border border-light' key={to.tournament_id}>
            <div className='text-uppercase'>{to.game_name}</div>
            <Row>
              {to.openMatches.map((om) => (
                <Col xs={12} sm={6} md={4} key={om.id} style={{ fontSize: '1.5rem' }}>
                  <div className="m-1 p-2 bg-success" style={{ textAlign: 'center' }}>
                    <span className='text-uppercase'>
                      <strong>
                        {om.player1_id ? playerDict[om.player1_id] : 'P1'}
                      </strong>
                    </span>
                    <span> vs </span>
                    <span className='text-uppercase'>
                      <strong>
                        {om.player2_id ? playerDict[om.player2_id] : 'P2'}
                      </strong>
                    </span>
                    <span style={{ fontSize: '0.8rem' }}>
                      {' '}
                      [{om.round < 0 ? 'L' : 'W'}
                      {om.round}]{' '}
                    </span>
                  </div>
                </Col>
              ))}
              {to.openMatches?.length === 0 ? (
                <div className='text-muted'>None</div>
              ) : null}
            </Row>
          </div>
        ))}
      </div>
      <div style={{ margin: '1rem 4rem', fontWeight: 400, fontSize: '4rem' }}>
        REPORT MATCH
      </div>
      <div style={{ margin: '0 4rem', fontWeight: 400, fontSize: '1.5rem' }}>
        SELECT YOUR NAME
      </div>
      <div className='d-flex justify-content-center mt-3'>
        <div
          className='bg-dark border border-light p-3'
          style={{ width: '85%' }}
        >
          <Row>
            {names.map((p) => {
              return (
                <Col xs={12} sm={6} md={4} key={p}>
                  <div
                    className='bg-black border border-secondary text-center p-2 m-2'
                    role='button'
                    onClick={() => handleClick(p)}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '1.4rem' }}>
                      {p.toUpperCase()}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        justifyContent: 'center',
                      }}
                    >
                      {/* {entities[p]?.map((pl) => (
                        <Badge key={pl.tournamentId}>
                          {getTournamentShortName(pl.tournamentId)}
                        </Badge>
                      ))} */}
                      {/* <Badge>{entities[p]?.length}</Badge> */}
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </>
  );
}

const PlaceholderItem = () => {
  return (
    <Placeholder as={Col} xs={12} sm={6} md={4} animation='glow'>
      <Placeholder
        as='div'
        className='bg-black border border-secondary text-center p-2 m-2'
        style={{ height: '4rem', width: '90%' }}
      >
        <div style={{ height: '80%' }} />
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'center',
          }}
        >
          <Placeholder as={Badge}>
            <div style={{ width: '2rem' }} />
          </Placeholder>
          <Placeholder as={Badge}>
            <div style={{ width: '2rem' }} />
          </Placeholder>
        </div>
      </Placeholder>
    </Placeholder>
  );
};
