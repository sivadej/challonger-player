import { API_BASE_URL } from '@config/api';
import { useQuery } from 'react-query';
import axios from 'axios';
import {
  ChallongerLocalStorage,
  Tournament,
  TournamentInfo,
  TournamentEntities,
} from 'interfaces';

const buildEntities = (data: Tournament[] | null): TournamentEntities => {
  const ids: number[] = [];
  const entities: { [key: number]: TournamentInfo } = {};
  data?.forEach(t => {
    const { tournament } = t;
    ids.push(tournament.id);
    entities[tournament.id] = tournament;
  })
  return {
    ids,
    entities,
  };
}

const getTournamentList = async (
  settings: ChallongerLocalStorage
): Promise<TournamentEntities> => {
  const {
    config: { challongeKey },
    tourney: { domain },
  } = settings;
  const url = `${API_BASE_URL}/tournaments`;
  const params = {
    subdomain: domain,
    created_after: '2022-01-01',
    api_key: challongeKey,
  };
  if (!challongeKey || !domain) {
    return buildEntities(null);
  }
  const { data } = await axios.get<Tournament[] | null>(url, { params });
  return buildEntities(data);
};

export default function useTournamentListQuery(
  settings: ChallongerLocalStorage
) {
  return useQuery<TournamentEntities>(
    ['tournamentList', settings.tourney.domain],
    () => getTournamentList(settings),
    {
      staleTime: Infinity,
    }
  );
}
