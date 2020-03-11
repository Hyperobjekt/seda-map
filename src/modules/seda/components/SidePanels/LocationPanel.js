import React from "react"
import PropTypes from "prop-types"
import {
  Typography,
  makeStyles,
  Button,
} from "@material-ui/core"
import { ExpansionPanel } from "../../../../base/components/Panels"

import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody,
} from "../../../../base/components/Panels/SidePanel"
import LANG from "../../lang/en"
import useUiStore from "../../hooks/useUiStore"

const useStyles = makeStyles(theme => ({
  root: {},
  title: theme.typography.panelHeading,
}))

const LocationPanel = props => {
  const classes = useStyles()
  const activeLocation = useUiStore(
    state => state.activeLocation
  )
  const setActiveLocation = useUiStore(
    state => state.setActiveLocation
  )
  return (
    <SidePanel {...props}>
      <SidePanelHeader sticky>
        <Typography className={classes.title}>
          Control Panel
        </Typography>
        <Button onClick={setActiveLocation(null)}>Hide</Button>
      </SidePanelHeader>
      <SidePanelBody>
        <ExpansionPanel title="Subgroups and Gaps">
          <div>Placeholder</div>
        </ExpansionPanel>
        <ExpansionPanel title="Location Comparison">
          <div>Placeholder</div>
        </ExpansionPanel>
      </SidePanelBody>
    </SidePanel>
  )
}

LocationPanel.propTypes = {}

export default LocationPanel
