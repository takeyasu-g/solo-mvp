import React, { ChangeEvent, FormEvent } from 'react';
import { GameCouchFormData } from '../vite-env';

interface GameCouchFormProps {
  formData: GameCouchFormData;
  error: string;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: FormEvent) => void;
}

const GameCouchForm: React.FC<GameCouchFormProps> = ({
  formData,
  error,
  handleChange,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="gameName"
        placeholder="Game Name"
        value={formData.gameName}
        onChange={handleChange}
        readOnly
      />
      {formData.gameImage && (
        <img src={formData.gameImage} alt={formData.gameName} />
      )}
      <input
        type="number"
        name="maxSeats"
        placeholder="Max Seats"
        value={formData.maxSeats}
        onChange={handleChange}
      />
      <input
        type="datetime-local"
        name="eventTime"
        placeholder="Event Time"
        value={formData.eventTime}
        onChange={handleChange}
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
      />
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      {error && <p className="error-message">{error}</p>}
      <button type="submit">Create Event</button>
    </form>
  );
};

export default GameCouchForm;
