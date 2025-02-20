import React from 'react';
import { Game } from '../vite-env';

interface GameCardProps {
  game: Game;
  handleSelectGame: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, handleSelectGame }) => {
  return (
    <div className="game-card">
      <img
        src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`}
        alt={game.name}
      />
      <h3>{game.name}</h3>
      <p>Max Players: {game.multiplayer_modes?.[0]?.onlinemax || 'N/A'}</p>
      <p>Rating: {game.total_rating || 'N/A'}</p>
      <p>
        Genre: {game.genres?.map((genre) => genre.name).join(', ') || 'N/A'}
      </p>
      <button onClick={() => handleSelectGame(game)}>Select Game</button>
    </div>
  );
};

export default GameCard;
