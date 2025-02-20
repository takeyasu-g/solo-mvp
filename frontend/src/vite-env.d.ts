/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export interface User {
  id: string;
  email: string;
  username: string;
  // Add other user properties as needed
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface SignUpFormData {
  email: string;
  password: string;
  username: string;
}

export interface GameCouchEvent {
  id: string;
  host_id: string;
  host_username: string;
  game_name: string;
  game_image?: string;
  max_seats: number;
  event_time: string;
  location: string;
  title: string;
  description?: string;
  created_at: string;
}

export interface Player {
  id: string;
  game_couch_id: string;
  player_name: string;
  player_uid?: string;
  joined_at: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  error?: string;
}

export interface GameCouchFormData {
  gameName: string;
  gameImage: string;
  maxSeats: number;
  eventTime: string;
  location: string;
  title: string;
  description: string;
}

export interface GameSearchFilters {
  new: boolean;
  topRating: boolean;
  maxPlayers: string;
  genre: string;
  platform: string;
  keywords: string;
}

export interface Game {
  id: number;
  name: string;
  cover: { image_id: string };
  multiplayer_modes?: { onlinemax: number }[];
  total_rating?: number;
  genres?: { name: string }[];
}
