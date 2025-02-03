import { BoardxPropTypes } from '../../utils/propTypes';
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

Board1.propTypes = BoardxPropTypes;

export default Board1;