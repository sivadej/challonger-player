import { useQuery } from 'react-query';
import { API_BASE_URL } from '@config/api';
import axios from 'axios';
import {
  ChallongerLocalStorage,
  Tournament,
  TournamentInfo,
} from 'interfaces';

const getTournament = async (
  settings: ChallongerLocalStorage
): Promise<TournamentInfo | null> => {
  const {
    config: { challongeKey },
    tourney: { domain, tourneyName },
  } = settings;
  const url = `${API_BASE_URL}/tournament`;
  const params = {
    subdomain: domain,
    name: tourneyName,
    api_key: challongeKey,
  };
  if (!domain || !tourneyName || !challongeKey) {
    return null;
  }
  const { data } = await axios.get<Tournament | null>(url, { params });
  const { tournament } = data ?? {};
  return tournament ?? null;
};

export default function useTournamentQuery(settings: ChallongerLocalStorage) {
  const { tourney } = settings;
  const { domain, tourneyName } = tourney;
  return useQuery<TournamentInfo | null>(
    [`${domain}-${tourneyName}`, 'tournament'],
    () => getTournament(settings),
    {
      staleTime: Infinity,
    }
  );
}
