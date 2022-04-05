import { useQuery, UseQueryResult } from 'react-query';
import { API_BASE_URL } from '@config/api';
import axios from 'axios';
import { Tournament, GetRecentTournamentsQueryParams } from 'interfaces';

const getRecentTournaments = async ({
  apiKey,
  subdomain,
  createdAfterDate,
}: GetRecentTournamentsQueryParams) => {
  const url = `${API_BASE_URL}/tournaments`;
  const params = {
    api_key: apiKey,
    subdomain,
    created_after: createdAfterDate,
  };
  const { data } = await axios.get<Tournament | null>(url, { params });
  return data ?? [];
};

export default function useRecentTournamentsQuery(
  args: GetRecentTournamentsQueryParams
): UseQueryResult<Tournament[]> {
  return useQuery([args.createdAfterDate, 'recentTournaments'], () =>
    getRecentTournaments(args),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    }
  );
}
