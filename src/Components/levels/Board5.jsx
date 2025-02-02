import PropTypes from 'prop-types';
import BaseGame from '../BaseGame/index';

const Board5 = ({ difficulty, onGameOver }) => {
  const obstacles = [
    { x: 5, y: 5 },
    { x: 10, y: 10 },
  ];

  return (
    <BaseGame
      level={2}
      difficulty={difficulty}
      onGameOver={onGameOver}
      obstacles={obstacles} 
      wallCollision={true}
    />
  );
};

Board5.propTypes = {
  difficulty: PropTypes.string.isRequired,
  onGameOver: PropTypes.func.isRequired,
};

export default Board5;