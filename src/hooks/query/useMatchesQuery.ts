// THIS MAY NOT BE NECESSARY IF
// TOURNAMENT QUERY CAN ALSO RETURN MATCHES
// BY TOURNAMENT ID

import { useQuery, UseQueryResult } from 'react-query';
import { API_BASE_URL } from '@config/api';
import axios from 'axios';
import { Match, GetMatchesQueryParams } from 'interfaces';

const getMatches = async ({
  apiKey,
  subdomain,
  tournamentId,
}: GetMatchesQueryParams) => {
  const url = `${API_BASE_URL}/matches`;
  const params = {
    api_key: apiKey,
    subdomain,
    tournament_id: tournamentId,
  };
  const { data } = await axios.get<Match[] | null>(url, { params });
  return data ?? [];
};

export default function useMatchesQuery(
  args: GetMatchesQueryParams
): UseQueryResult<Match[]> {
  return useQuery([args.tournamentId, 'matches'], () => getMatches(args));
}
