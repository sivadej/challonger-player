import React, { useContext } from 'react';
import { Badge, Row, Col, Placeholder } from 'react-bootstrap';
import usePlayersSetQuery from '@hooks/query/usePlayersSetQuery';
import { AppContext } from '@contexts/AppContext';
import { PlayersSet } from 'interfaces';

const emptyArr: string[] = [];
const emptyObj: PlayersSet = {};

const getTournamentShortName = (tId: string): string => {
  if (tId === '10838641') return 'ST';
  if (tId === '10838636') return 'BBCF';
  if (tId === '10838634') return 'GGS';
  if (tId === '10838653') return 'MVC3';
  return '???';
};

export default function Players(): JSX.Element {
  const { state, dispatch } = useContext(AppContext);
  const { apiKey, subdomain, selectedTournaments } = state;
  const { data, isLoading } = usePlayersSetQuery({
    apiKey,
    subdomain,
    tournamentIds: selectedTournaments,
  });
  const { names = emptyArr, entities = emptyObj } = data ?? {};

  const handleClick = (name: string) => {
    dispatch({ type: 'SHOW_PLAYER_VIEW', payload: { playerName: name } });
  };

  if (isLoading) {
    return (
      <>
        <Placeholder as='p' animation='glow'>
          <Placeholder xs={12} />
        </Placeholder>
        <Placeholder as='p' animation='glow'>
          <Placeholder xs={12} />
        </Placeholder>
      </>
    );
  }

  return (
    <>
      {JSON.stringify(state, null, 2)}

      <div className='d-flex justify-content-center mt-3'>
        <div
          className='bg-dark border border-light p-3'
          style={{ width: '75%' }}
        >
          <Row>
            {names.map((p) => {
              return (
                  <Col xs={6} sm={4} key={p}>
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
                        {entities[p]?.map((pl) => (
                          <Badge key={pl.tournamentId}>{getTournamentShortName(pl.tournamentId)}</Badge>
                        ))}
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
