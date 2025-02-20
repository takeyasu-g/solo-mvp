import { useParams } from 'react-router-dom';
import React from 'react';

const GameCouch: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get event ID from URL

  return <h1>Game Couch Event ID: {id}</h1>;
};

export default GameCouch;
