import { ChangeEvent, FormEvent } from 'react';
import { GameCouchFormData, GameSearchFilters, Game } from '../vite-env';

// Handle changes to form inputs and update the formData state
export const handleChange = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setFormData: React.Dispatch<React.SetStateAction<GameCouchFormData>>
) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

// Handle changes to filter inputs and update the filters state
export const handleFilterChange = (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  setFilters: React.Dispatch<React.SetStateAction<GameSearchFilters>>
) => {
  const { name, value, type, checked } = e.target;
  setFilters((prevFilters) => ({
    ...prevFilters,
    [name]: type === 'checkbox' ? checked : value,
  }));
};

// Handle changes to the search query input and update the searchQuery state
export const handleSearchQueryChange = (
  e: ChangeEvent<HTMLInputElement>,
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
) => {
  setSearchQuery(e.target.value);
};

// Handle form submission for creating a game couch event
export const handleSubmit = async (
  e: FormEvent,
  formData: GameCouchFormData,
  setError: React.Dispatch<React.SetStateAction<string>>,
  navigate: (path: string) => void
) => {
  e.preventDefault();
  setError('');

  const {
    gameName,
    maxSeats,
    eventTime,
    location,
    title,
    description,
    gameImage,
  } = formData;

  // Validate required fields
  if (!gameName || !maxSeats || !eventTime || !location) {
    setError('All fields are required.');
    return;
  }

  const eventData = {
    game_name: gameName,
    game_image: gameImage,
    max_seats: maxSeats,
    event_time: eventTime,
    location,
    title,
    description,
  };

  try {
    console.log('Creating event with data:', eventData); // Log event data

    // Send a POST request to create a new game couch event
    const response = await fetch('/api/game-couch/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${document.cookie.split('token=')[1]}`, // Include session token
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Event creation failed:', errorText); // Log error response
      throw new Error(errorText);
    }

    const data = await response.json();
    console.log('Event created:', data);
    navigate('/my-game-couches');
  } catch (error) {
    console.error('Failed to create event:', error.message); // Log error
    setError('Failed to create event. Please try again.');
  }
};

// Handle form submission for searching games on IGDB
export const handleSearch = async (
  e: FormEvent,
  searchQuery: string,
  filters: GameSearchFilters,
  setError: React.Dispatch<React.SetStateAction<string>>,
  setSearchResults: React.Dispatch<React.SetStateAction<Game[]>>
) => {
  e.preventDefault();
  setError('');

  // Construct query parameters for the IGDB API request
  const queryParams = new URLSearchParams({
    search: searchQuery,
    offset: '0',
    new: filters.new.toString(),
    topRating: filters.topRating.toString(),
    maxPlayers: filters.maxPlayers,
    genre: filters.genre,
    platform: filters.platform,
    keywords: filters.keywords,
  });

  console.log('Query Params:', queryParams.toString());

  try {
    // Send a GET request to fetch games from IGDB
    const response = await fetch(`/api/igdb/games?${queryParams.toString()}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    console.log('Search results:', data); // Log search results
    setSearchResults(data);
  } catch (error) {
    console.error('Search error:', error.message); // Log search error
    setError('Failed to fetch games. Please try again.');
  }
};

// Handle selecting a game from the search results and update the formData state
export const handleSelectGame = (
  game: Game,
  setFormData: React.Dispatch<React.SetStateAction<GameCouchFormData>>
) => {
  setFormData((prevData) => ({
    ...prevData,
    gameName: game.name,
    gameImage: `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`,
  }));
};
