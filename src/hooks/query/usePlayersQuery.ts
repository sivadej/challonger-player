import { useQuery, UseQueryResult } from 'react-query';
import { API_BASE_URL } from '@config/api';
import axios from 'axios';
import { Participant, GetPlayersQueryParams } from 'interfaces';

const getPlayers = async ({
  apiKey,
  subdomain,
  tournamentId,
}: GetPlayersQueryParams) => {
  const url = `${API_BASE_URL}/players`;
  const params = {
    api_key: apiKey,
    subdomain,
    tournament_id: tournamentId,
  };
  const { data } = await axios.get<Participant[] | null>(url, { params });
  return data ?? [];
};

export default function usePlayersQuery(
  args: GetPlayersQueryParams
): UseQueryResult<Participant[]> {
  return useQuery([args.tournamentId, 'players'], () => getPlayers(args));
}
