import PropTypes from 'prop-types';
import BaseGame from '../BaseGame/index';

const Board3 = ({ difficulty, onGameOver }) => {
  return (
    <BaseGame
      level={1}
      difficulty={difficulty}
      onGameOver={onGameOver}
      wallCollision={true}
    />
  );
};
Board3.propTypes = {
  difficulty: PropTypes.string.isRequired,
  onGameOver: PropTypes.func.isRequired,
};

export default Board3;