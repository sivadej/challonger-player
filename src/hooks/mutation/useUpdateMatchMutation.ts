import { API_BASE_URL } from '@config/api';
import { ChallongerLocalStorage } from 'interfaces';
import { useMutation } from 'react-query';
import axios from 'axios';

export const putUpdateMatch = async ({
  matchId,
  playerId,
  settings,
  score = '',
}: {
  matchId: number;
  playerId: number;
  score?: string;
  settings: ChallongerLocalStorage;
}) => {
  const {
    config: { challongeKey },
    tourney: { domain, tourneyName },
  } = settings;
  const url = `${API_BASE_URL}/match`;
  const body = {
    subdomain: domain,
    name: tourneyName,
    api_key: challongeKey,
    match_id: matchId,
    winner_id: playerId,
    scores_csv: score,
  };
  const res = await axios.put(url, body);
  console.log(res);
  return res;
};

export default function useUpdateMatchMutation() {
  return useMutation(putUpdateMatch);
}
