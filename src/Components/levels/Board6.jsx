import { BoardxPropTypes } from '../../utils/propTypes';
import BaseGame from '../BaseGame/index';

const Board6 = ({ difficulty, onGameOver }) => {
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

    { x: 10, y: 10 },

    { x: 10, y: 5 },
    { x: 10, y: 6 },
    { x: 10, y: 7 },
  ];

  return (
    <BaseGame
      level={6}
      difficulty={difficulty}
      onGameOver={onGameOver}
      obstacles={obstacles}
      wallCollision={true}
    />
  );
};

Board6.propTypes = BoardxPropTypes;

export default Board6;
