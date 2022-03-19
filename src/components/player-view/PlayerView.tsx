import React, { useContext } from 'react';
import { Badge, Row, Col, Placeholder } from 'react-bootstrap';
import { AppContext } from '@contexts/AppContext';

export default function PlayerView(): JSX.Element {
  const {
    state: { playerIdView },
    dispatch,
  } = useContext(AppContext);

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
