import client from '@client';
import { useMutation } from 'react-query';
import { API_BASE_URL } from '@config/api';
import axios from 'axios';
import { ReportMatchMutationParams } from 'interfaces';

const reportMatch = async ({
  apiKey,
  subdomain,
  matchId,
  tournamentId,
  winnerId,
  scoreCsv = '',
}: ReportMatchMutationParams) => {
  const url = `${API_BASE_URL}/match`;
  const body = {
    api_key: apiKey,
    match_id: matchId,
    scores_csv: scoreCsv,
    subdomain,
    tournament_id: tournamentId,
    winner_id: winnerId,
  };
  const res = await axios.put(url, body);
  client.invalidateQueries([`${tournamentId}`, 'tournament']);
  return res;
};

export default function useReportMatchMutation() {
  return useMutation(reportMatch);
}
