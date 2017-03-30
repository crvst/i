import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './index.styl';

const Icon = ({ name, size, height = 16, width = 16, ...other }) => (
  <svg
    height={size || height}
    styleName="root"
    width={size || width}
    {...other}
  >
    <use
      xlinkHref={`#icon-${name}`}
    />
  </svg>
);

Icon.propTypes = {
  height: PropTypes.number,
  name: PropTypes.string,
  size: PropTypes.number,
  width: PropTypes.number,
};

export default CSSModules(Icon, styles, { allowMultiple: true });
