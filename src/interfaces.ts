export type ChallongerLocalStorage = {
  tourney: TourneyPath;
  config: Config;
  INIT?: boolean;
};

export interface Config {
  challongeKey: string | null;
}

export interface TourneyPath {
  domain: string;
  tourneyName: string;
}

export interface Match {
  match: MatchInfo;
}

export interface MatchInfo {
  attachment_count?: string | null;
  created_at: string;
  completed_at?: string | null;
  group_id?: string | null;
  has_attachment: boolean;
  id: number;
  identifier: string;
  location?: string | null;
  loser_id?: number | null;
  player1_id: number | null;
  player1_is_prereq_match_loser: boolean;
  player1_prereq_match_id?: number | null;
  player1_votes?: string | null;
  player2_id: number | null;
  player2_is_prereq_match_loser: boolean;
  player2_prereq_match_id?: number | null;
  player2_votes?: string | null;
  round: number;
  scheduled_time?: string | null;
  started_at?: string | null;
  state: string;
  tournament_id: number;
  underway_at?: string | null;
  updated_at: string;
  winner_id?: number | null;
  prerequisite_match_ids_csv: string;
  scores_csv: string;
}

export interface Participant {
  participant: ParticipantInfo;
}

export interface ParticipantInfo {
  active: boolean;
  checked_in_at?: string | null;
  created_at: string;
  final_rank?: string | null;
  group_id?: string | null;
  icon?: string | null;
  id: number;
  invitation_id?: string | null;
  invite_email?: string | null;
  misc?: string | null;
  name: string;
  on_waiting_list: boolean;
  seed: number;
  tournament_id: number;
  updated_at: string;
  challonge_username?: string | null;
  challonge_email_address_verified?: string | null;
  removable: boolean;
  participatable_or_invitation_attached: boolean;
  confirm_remove: boolean;
  invitation_pending: boolean;
  display_name_with_invitation_email_address: string;
  email_hash?: string | null;
  username?: string | null;
  attached_participatable_portrait_url?: string | null;
  can_check_in: boolean;
  checked_in: boolean;
  reactivatable: boolean;
}

export type PlayerMap = Map<number, ParticipantInfo>;

export type TournamentMap = Map<number, TournamentInfo>;
export type TournamentEntities = {
  ids: number[];
  entities: { [key: number]: TournamentInfo };
};

export interface Tournament {
  tournament: TournamentInfo;
}
export interface TournamentInfo {
  accept_attachments: boolean;
  allow_participant_match_reporting: boolean;
  anonymous_voting: boolean;
  category?: null;
  check_in_duration?: null;
  completed_at?: null;
  created_at: string;
  created_by_api: boolean;
  credit_capped: boolean;
  description: string;
  game_id: number;
  group_stages_enabled: boolean;
  hide_forum: boolean;
  hide_seeds: boolean;
  hold_third_place_match: boolean;
  id: number;
  max_predictions_per_user: number;
  name: string;
  notify_users_when_matches_open: boolean;
  notify_users_when_the_tournament_ends: boolean;
  open_signup: boolean;
  participants_count: number;
  prediction_method: number;
  predictions_opened_at?: null;
  private: boolean;
  progress_meter: number;
  pts_for_bye: string;
  pts_for_game_tie: string;
  pts_for_game_win: string;
  pts_for_match_tie: string;
  pts_for_match_win: string;
  quick_advance: boolean;
  ranked_by: string;
  require_score_agreement: boolean;
  rr_pts_for_game_tie: string;
  rr_pts_for_game_win: string;
  rr_pts_for_match_tie: string;
  rr_pts_for_match_win: string;
  sequential_pairings: boolean;
  show_rounds: boolean;
  signup_cap?: null;
  start_at?: null;
  started_at: string;
  started_checking_in_at?: null;
  state: string;
  swiss_rounds: number;
  teams: boolean;
  tie_breaks?: string[] | null;
  tournament_type: string;
  updated_at: string;
  url: string;
  description_source: string;
  subdomain?: null;
  full_challonge_url: string;
  live_image_url: string;
  sign_up_url?: null;
  review_before_finalizing: boolean;
  accepting_predictions: boolean;
  participants_locked: boolean;
  game_name: string;
  participants_swappable: boolean;
  team_convertable: boolean;
  group_stages_were_started: boolean;
}

export type AppReducerActions =
  | 'INIT_SETTINGS'
  | 'SELECT_TOURNAMENT'
  | 'CHANGE_TOURNEY_NAME'
  | 'CHANGE_DOMAIN'
  | 'CHANGE_API_KEY';
