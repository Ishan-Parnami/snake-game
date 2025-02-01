import PropTypes from 'prop-types';
import BaseGame from '../BaseGame/index';

const Board1 = ({ difficulty, onGameOver }) => {
  return (
    <BaseGame
      level={1}
      difficulty={difficulty}
      onGameOver={onGameOver}
    />
  );
};
Board1.propTypes = {
  difficulty: PropTypes.string.isRequired,
  onGameOver: PropTypes.func.isRequired,
};

export default Board1;