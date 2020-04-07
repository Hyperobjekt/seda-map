import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
    flexDirection: props =>
      props.orientation === "vertical" ? "column" : "row"
  }
}));

/**
 * Displays a collection of links
 */
const LinkCollection = ({ links, classes: overrides, ...props }) => {
  const classes = useStyles(props);
  return (
    <ul className={clsx(classes.root, overrides.root)} {...props}>
      {links.map((l, i) => (
        <li className={clsx(classes.item, overrides.item)} key={`l${i}`}>
          <a
            className={clsx(classes.link, overrides.link)}
            href={l.href}
            target={l.target}
          >
            {l.text}
          </a>
        </li>
      ))}
    </ul>
  );
};

LinkCollection.propTypes = {
  /** Determines the orientation of the links */
  orientation: PropTypes.string,
  /** Links to show in the list */
  links: PropTypes.array,
  /** Class names for the provided elements */
  classes: PropTypes.object
};
LinkCollection.defaultProps = {
  orientation: "vertical",
  links: [],
  classes: {}
};

export default LinkCollection;
