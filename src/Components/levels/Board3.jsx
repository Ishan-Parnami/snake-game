import { BoardxPropTypes } from '../../utils/propTypes';
import BaseGame from '../BaseGame/index';

const Board3 = ({ difficulty, onGameOver }) => {
  return (
    <BaseGame
    level={3}
    difficulty={difficulty}
    onGameOver={onGameOver}
    wallCollision={true}
    />
  );
};

Board3.propTypes = BoardxPropTypes;

export default Board3;