import React, { ChangeEvent, FormEvent } from 'react';
import { GameSearchFilters } from '../vite-env';

interface GameSearchProps {
  searchQuery: string;
  filters: GameSearchFilters;
  handleSearchQueryChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSearch: (e: FormEvent) => void;
}

const GameSearch: React.FC<GameSearchProps> = ({
  searchQuery,
  filters,
  handleSearchQueryChange,
  handleFilterChange,
  handleSearch,
}) => {
  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search for games"
        value={searchQuery}
        onChange={handleSearchQueryChange}
      />
      <label>
        <input
          type="checkbox"
          name="new"
          checked={filters.new}
          onChange={handleFilterChange}
        />
        New
      </label>
      <label>
        <input
          type="checkbox"
          name="topRating"
          checked={filters.topRating}
          onChange={handleFilterChange}
        />
        Top Rating
      </label>
      <input
        type="number"
        name="maxPlayers"
        placeholder="Max Players"
        value={filters.maxPlayers}
        onChange={handleFilterChange}
      />
      <select name="genre" value={filters.genre} onChange={handleFilterChange}>
        <option value="">Select Genre</option>
        <option value="Fighting">Fighting</option>
        <option value="Shooter">Shooter</option>
        <option value="Racing">Racing</option>
        <option value="RPG">RPG</option>
        <option value="Sport">Sport</option>
        <option value="Strategy">Strategy</option>
        <option value="Adventure">Adventure</option>
        <option value="Indie">Indie</option>
      </select>
      <select
        name="platform"
        value={filters.platform}
        onChange={handleFilterChange}
      >
        <option value="">Select Platform</option>
        <option value="6">PC</option>
        <option value="48">PlayStation 4</option>
        <option value="49">Xbox One</option>
        <option value="130">Nintendo Switch</option>
      </select>
      <button type="submit">Search</button>
    </form>
  );
};

export default GameSearch;
