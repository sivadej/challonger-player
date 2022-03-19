import { useQuery, UseQueryResult } from 'react-query';
import { API_BASE_URL } from '@config/api';
import axios from 'axios';
import { PlayersSet, GetPlayersSetQueryParams } from 'interfaces';

type PlayersSetRes = { entities: PlayersSet, names: string[] };

const getPlayersSet = async ({
  apiKey,
  subdomain,
  tournamentIds,
}: GetPlayersSetQueryParams) => {
  const url = `${API_BASE_URL}/players-set`;
  const params = new URLSearchParams({
    api_key: apiKey,
    subdomain,
    tournament_ids: tournamentIds.join(','),
  });
  const { data } = await axios.get<PlayersSetRes | null>(url, { params });
  return data;
};

export default function usePlayersSetQuery(
  args: GetPlayersSetQueryParams
): UseQueryResult<PlayersSetRes> {
  return useQuery(['playerset'], () => getPlayersSet(args));
}
