import PropTypes from 'prop-types';
import BaseGame from '../BaseGame/index';

const Board2 = ({ difficulty, onGameOver }) => {
  const obstacles = [
    { x: 5, y: 5 },
    { x: 5, y: 6 },
    { x: 5, y: 7 },
    { x: 5, y: 8 },
    { x: 5, y: 9 },
    
    { x: 19, y: 5 },
    { x: 19, y: 6 },
    { x: 19, y: 7 },
    { x: 19, y: 8 },
    { x: 19, y: 9 },
    
    { x: 13, y: 17 },
    { x: 12, y: 17 },
    { x: 11, y: 17 },
  ];

  return (
    <BaseGame
      level={4}
      difficulty={difficulty}
      onGameOver={onGameOver}
      obstacles={obstacles} 
    />
  );
};

Board2.propTypes = {
  difficulty: PropTypes.string.isRequired,
  onGameOver: PropTypes.func.isRequired,
};

export default Board2;