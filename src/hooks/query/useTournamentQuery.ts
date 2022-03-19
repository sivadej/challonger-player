import { useQuery, UseQueryResult } from 'react-query';
import { API_BASE_URL } from '@config/api';
import axios from 'axios';
import { Tournament, GetTournamentQueryParams } from 'interfaces';

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
  const { data } = await axios.get<Tournament[] | null>(url, { params });
  return data ?? [];
};

export default function useTournamentQuery(
  args: GetTournamentQueryParams
): UseQueryResult<Tournament[]> {
  return useQuery([args.tournamentId, 'tournament'], () => getTournament(args));
}
