import PropTypes from 'prop-types';
import BaseGame from '../BaseGame/index';
// import styles from './Board2.module.scss'; 

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

Board2.propTypes = {
  difficulty: PropTypes.string.isRequired,
  onGameOver: PropTypes.func.isRequired,
};

export default Board2;