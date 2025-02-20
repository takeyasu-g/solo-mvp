import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCouchForm from '../components/GameCouchForm';
import GameSearch from '../components/GameSearch';
import GameCard from '../components/GameCard';
import { GameCouchFormData, GameSearchFilters, Game } from '../vite-env';
import {
  handleChange,
  handleFilterChange,
  handleSearchQueryChange,
  handleSubmit,
  handleSearch,
  handleSelectGame,
} from '../handlers/createGameCouchHandlers';

const CreateGameCouch: React.FC = () => {
  const [formData, setFormData] = useState<GameCouchFormData>({
    gameName: '',
    gameImage: '',
    maxSeats: 0,
    eventTime: '',
    location: '',
    title: '',
    description: '',
  });
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [filters, setFilters] = useState<GameSearchFilters>({
    new: false,
    topRating: false,
    maxPlayers: '',
    genre: '',
    platform: '',
    keywords: 'nudity',
  });
  const navigate = useNavigate();

  return (
    <div className="create-game-couch-container">
      <h1 className="page-title">Game Couch</h1>
      <div className="form-search-container">
        <GameCouchForm
          formData={formData}
          error={error}
          handleChange={(e) => handleChange(e, setFormData)}
          handleSubmit={(e) => handleSubmit(e, formData, setError, navigate)}
        />
        <GameSearch
          searchQuery={searchQuery}
          filters={filters}
          handleSearchQueryChange={(e) =>
            handleSearchQueryChange(e, setSearchQuery)
          }
          handleFilterChange={(e) => handleFilterChange(e, setFilters)}
          handleSearch={(e) =>
            handleSearch(e, searchQuery, filters, setError, setSearchResults)
          }
        />
      </div>
      <div className="game-cards">
        {searchResults.length > 0 ? (
          searchResults.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              handleSelectGame={(game) => handleSelectGame(game, setFormData)}
            />
          ))
        ) : (
          <p>No games found. Please try a different search.</p>
        )}
      </div>
    </div>
  );
};

export default CreateGameCouch;
