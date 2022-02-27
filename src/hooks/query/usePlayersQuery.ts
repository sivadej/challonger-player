import { useQuery, UseQueryResult } from 'react-query';
import { API_BASE_URL } from '@config/api';
import axios from 'axios';
import { Participant, PlayerMap, ChallongerLocalStorage, ParticipantInfo } from 'interfaces';

const transformToPlayerMap = (data: Participant[]): PlayerMap => {
  const playerMap: PlayerMap = new Map<number, ParticipantInfo>();
  if (!data) return playerMap;
  for (const p of data) {
    const { participant: pInfo } = p;
    playerMap.set(pInfo.id, pInfo);
  }
  return playerMap;
};

const getPlayers = async (settings: ChallongerLocalStorage) => {
  const {
    config: { challongeKey },
    tourney: { domain, tourneyName },
  } = settings;
  const url = `${API_BASE_URL}/players`;
  const params = {
    subdomain: domain,
    name: tourneyName,
    api_key: challongeKey,
  };
  if (!domain || !tourneyName || !challongeKey) return transformToPlayerMap([]);
  const { data } = await axios.get<Participant[] | null>(url, { params });
  return transformToPlayerMap(data ?? []);
};

export default function usePlayersQuery(
  settings: ChallongerLocalStorage
): UseQueryResult<PlayerMap> {
  const { tourney } = settings || {};
  const { domain, tourneyName } = tourney || {};
  return useQuery([`${domain}-${tourneyName}`, 'players'], () =>
    getPlayers(settings)
  );
}
