import React from "react";
import PropTypes from "prop-types";
import useUiStore from "../hooks/useUiStore";
import useSiteStore from "../hooks/useSiteStore";
import { makeStyles, Button, useTheme, Drawer } from "@material-ui/core";
import LinkCollection from "../../../base/components/LinkCollection";

const useStyles = makeStyles(theme => ({
  root: { width: theme.app.panelWidth },
  panelPaper: {
    padding: theme.spacing(3),
    width: theme.app.panelWidth
  },
  linkRoot: {},
  linkItem: {},
  link: {}
}));

const SedaMenu = ({ ...props }) => {
  const classes = useStyles();
  const links = useSiteStore(state => state.menu);
  const showMenu = useUiStore(state => state.showMenu);
  const toggleMenu = useUiStore(state => state.toggleMenu);
  return (
    <Drawer
      open={showMenu}
      anchor="right"
      classes={{ root: classes.root, paper: classes.panelPaper }}
      {...props}
    >
      <div className={classes.header}>
        <Button onClick={toggleMenu}>Close</Button>
      </div>
      <LinkCollection
        classes={{
          root: classes.linkRoot,
          item: classes.linkItem,
          link: classes.link
        }}
        links={links}
      />
    </Drawer>
  );
};

SedaMenu.propTypes = {};

export default SedaMenu;
