import { useQuery } from 'react-query';
import { API_BASE_URL } from '@config/api';
import axios from 'axios';
import { Match, ChallongerLocalStorage } from 'interfaces';

const getMatches = async (settings: ChallongerLocalStorage) => {
  const {
    config: { challongeKey },
    tourney: { domain, tourneyName },
  } = settings;
  const url = `${API_BASE_URL}/matches`;
  const params = {
    subdomain: domain,
    name: tourneyName,
    api_key: challongeKey,
  };
  if (!domain || !tourneyName || !challongeKey) return [];
  const { data } = await axios.get<Match[] | null>(url, { params });
  return data ?? [];
};

export default function useMatchesQuery(settings: ChallongerLocalStorage) {
  const { tourney } = settings || {};
  const { domain, tourneyName } = tourney || {};
  return useQuery<Match[]>(
    [`${domain}-${tourneyName}`, 'matches'],
    () => getMatches(settings),
    {
      refetchInterval: 20000,
    }
  );
}
