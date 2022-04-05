import { useQueries } from 'react-query';
import { API_BASE_URL } from '@config/api';
import axios from 'axios';
import {
  Tournament,
  GetTournamentQueryParams,
  GetTournamentsQueryParams,
} from 'interfaces';

const getTournament = async ({
  apiKey,
  subdomain,
  tournamentId,
}: GetTournamentQueryParams) => {
  const url = `${API_BASE_URL}/tournament`;
  const params = {
    api_key: apiKey,
    subdomain,
    tournament_id: tournamentId,
  };
  const { data } = await axios.get<Tournament | null>(url, { params });
  return data ?? [];
};

export default function useTournamentsQuery(
  args: GetTournamentsQueryParams
) {
  return useQueries(
    args.tournamentIds.map((tId) => ({
      queryKey: [tId, 'tournament'],
      queryFn: () => getTournament({
        apiKey: args.apiKey,
        subdomain: args.subdomain,
        tournamentId: tId,
      }),
      refetchInterval: 10000,
      refetchOnMount: true,
    }))
  );
}
