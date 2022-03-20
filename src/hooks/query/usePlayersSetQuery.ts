import { useQuery, UseQueryResult } from 'react-query';
import { API_BASE_URL } from '@config/api';
import axios from 'axios';
import { PlayersSet, GetPlayersSetQueryParams } from 'interfaces';

type PlayersSetRes = {
  entities: PlayersSet;
  names: string[];
  playerDict: { [pid: number]: string };
};

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
  const { data } = await axios.get<PlayersSetRes>(url, { params });
  return data;
};

// minimize this query refetching because we can safely assume
// that player names and tournaments entered will not change much
// once things get started...
export default function usePlayersSetQuery(
  args: GetPlayersSetQueryParams
): UseQueryResult<PlayersSetRes> {
  return useQuery(
    ['playerset', args.tournamentIds.join(',')],
    () => getPlayersSet(args),
    {
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: twentyFourHoursInMs,
      enabled: args.tournamentIds.length > 0,
    }
  );
}

const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
