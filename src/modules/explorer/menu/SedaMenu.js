import React from 'react'
import { makeStyles, Button, Drawer } from '@material-ui/core'
import useMenuVisibility from './useMenuVisibility'
import { useSiteStore } from '../app/hooks'

const useStyles = makeStyles(theme => ({
  root: { width: theme.app.panelWidth },
  panelPaper: {
    padding: theme.spacing(3),
    width: theme.app.panelWidth
  },
  linkRoot: {},
  linkItem: {},
  link: {}
}))

const SedaMenu = ({ ...props }) => {
  const classes = useStyles()
  const links = useSiteStore(state => state.menu)
  const [showMenu, toggleMenu] = useMenuVisibility()
  return (
    <Drawer
      open={showMenu}
      anchor="right"
      classes={{ root: classes.root, paper: classes.panelPaper }}
      {...props}>
      <div className={classes.header}>
        <Button onClick={toggleMenu}>Close</Button>
      </div>
      {/* <LinkCollection
        classes={{
          root: classes.linkRoot,
          item: classes.linkItem,
          link: classes.link
        }}
        links={links}
      /> */}
    </Drawer>
  )
}

export default SedaMenu
