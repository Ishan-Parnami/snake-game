import PropTypes from 'prop-types';

export const BaseGamePropTypes = {
  level: PropTypes.number.isRequired,
  difficulty: PropTypes.string.isRequired,
  onGameOver: PropTypes.func.isRequired,
  wallCollision: PropTypes.bool,
  obstacles: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    })
  )
};

export const StartMenuPropTypes = {
  onStart: PropTypes.func.isRequired
};

export const BoardxPropTypes = {
  difficulty: PropTypes.string.isRequired,
  onGameOver: PropTypes.func.isRequired
};