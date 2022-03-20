/* eslint-disable jsx-a11y/role-has-required-aria-props */
import React, { useContext, useMemo, useState } from 'react';
import { Form, Field, useFormik, FormikProvider } from 'formik';
import { format as formatDate, subDays } from 'date-fns';
import { Button, Modal } from 'react-bootstrap';
import useRecentTournamentsQuery from '@hooks/query/useRecentTournamentsQuery';
import { AppContext } from '@contexts/AppContext';

const oneWeekAgo = formatDate(subDays(new Date(), 7), 'yyyy-MM-dd');

export default function AdminControl(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button size="sm" variant="outline-light" style={{ position: 'fixed', bottom: 10, right: 10, opacity: 0.5 }} onClick={() => setOpen(true)}>Config</Button>
      <AdminModal show={open} onHide={() => setOpen(false)} />
    </>
  );
}

function AdminModal({ show, onHide }: any): JSX.Element {
  const { state, dispatch } = useContext(AppContext);
  const { apiKey, subdomain, selectedTournaments } = state;

  const formik = useFormik({
    initialValues: {
      createdAfterDate: oneWeekAgo,
      selected: selectedTournaments ?? [],
    },
    onSubmit: (v) => console.log(v),
    enableReinitialize: true,
  });

  const toggleSelection = (tId: string) => {
    const newSelected = [...formik.values.selected];
    const target = newSelected.indexOf(tId);
    if (target === -1) newSelected.push(tId);
    else newSelected.splice(target, 1);
    formik.setFieldValue('selected', newSelected);
  };

  const updateTournamentList = () => {
    dispatch({
      type: 'SET_TOURNAMENTS_LIST',
      payload: { tournamentIds: formik.values.selected },
    });
    onHide();
  };

  const clearTournamentList = () => {
    dispatch({
      type: 'SET_TOURNAMENTS_LIST',
      payload: { tournamentIds: [] },
    });
  };

  const { data } = useRecentTournamentsQuery({
    apiKey,
    subdomain,
    createdAfterDate: formik.values.createdAfterDate,
  });

  const tournamentOptions = useMemo<
    {
      id: string;
      name: string;
      url: string;
      participantsCount: number;
      gameName: string;
      state: string;
    }[]
  >(() => {
    const options: {
      id: string;
      name: string;
      url: string;
      participantsCount: number;
      gameName: string;
      state: string;
    }[] = [];
    if (data?.length) {
      for (const tournament of data) {
        const { tournament: t } = tournament ?? {};
        options.push({
          id: `${t.id}`,
          gameName: t.game_name,
          name: t.name,
          participantsCount: t.participants_count,
          state: t.state,
          url: t.url,
        });
      }
    }
    return options;
  }, [data]);

  return (
    <Modal
      show={show}
      onHide={updateTournamentList}
    >
      <Modal.Body>
        <FormikProvider value={formik}>
          <Form>
            <span className='text-dark'>Tournaments Created After </span>
            <Field name='createdAfterDate' type='date' className="form-control" />
            {tournamentOptions?.length ? (
              tournamentOptions.map((t) => {
                const active = formik.values.selected.includes(t.id);
                return (
                  <div
                    className={`border border-dark m-1 p-1 ${
                      active ? 'bg-success' : 'bg-secondary'
                    }`}
                    style={{ cursor: 'pointer' }}
                    role='button'
                    onClick={() => toggleSelection(t.id)}
                  >
                    ({t.url}) {t.name} - {t.participantsCount} players - Status:{' '}
                    {t.state}
                  </div>
                );
              })
            ) : (
              <div className='border border-dark m-1 p-3 bg-secondary'>
                Nothing found. Try expanding your search range.
              </div>
            )}
          </Form>
        </FormikProvider>
        <div className='text-dark'>
          Currently Selected: {formik.values.selected.length}
        </div>
        <div className='d-flex justify-content-between mt-2'>
          <Button type='button' onClick={updateTournamentList}>
            Save
          </Button>
          <Button
            type='button'
            variant='outline-danger'
            onClick={clearTournamentList}
          >
            Clear Selected
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
