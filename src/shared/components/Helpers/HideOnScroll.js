import React from "react";
import PropTypes from "prop-types";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";

/**
 * Helper component that hides children on scroll
 */
export default function HideOnScroll({
  children,
  enabled = false,
  target = window,
  ...props
}) {
  const trigger = useScrollTrigger({ target });
  return (
    <Slide appear={false} direction="down" in={!trigger && !enabled} {...props}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  enabled: PropTypes.bool,
  target: PropTypes.instanceOf(Element)
};
