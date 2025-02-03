import { BoardxPropTypes } from '../../utils/propTypes';
import BaseGame from '../BaseGame/index';

const Board2 = ({ difficulty, onGameOver }) => {
  // Define obstacles for Level 2
  const obstacles = [
    { x: 5, y: 5 },
    { x: 10, y: 10 },
    // Add more obstacles as needed
  ];

  return (
    <BaseGame
      level={2}
      difficulty={difficulty}
      onGameOver={onGameOver}
      obstacles={obstacles} 
    />
  );
};

Board2.propTypes = BoardxPropTypes;

export default Board2;