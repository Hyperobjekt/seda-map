import React from "react";
import PropTypes from "prop-types";

const Image = ({ src, ...props }) => {
  return <img src={src} {...props} />;
};

Image.propTypes = {
  /** Image source */
  src: PropTypes.string
};

export default Image;
