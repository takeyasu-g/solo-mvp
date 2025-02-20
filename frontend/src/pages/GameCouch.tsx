import { useParams } from 'react-router-dom';

const GameCouch = () => {
  const { id } = useParams(); // Get event ID from URL

  return <h1>Game Couch Event ID: {id}</h1>;
};

export default GameCouch;
