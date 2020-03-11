import React from 'react'
import PropTypes from 'prop-types'
import { Typography, makeStyles, Button } from '@material-ui/core'
import { ExpansionPanel } from '../../../../base/components/Panels'

import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody
} from '../../../../base/components/Panels/SidePanel'
import useUiStore from '../../hooks/useUiStore'
import { getLang } from '../../../../shared/selectors/lang'

const useStyles = makeStyles(theme => ({
  root: {},
  title: theme.typography.panelHeading
}))

const topics = new Array(12).fill().map((n, i) => `HELP_HOW_Q${i + 1}`)

const HelpPanel = props => {
  const classes = useStyles()
  const toggleHelp = useUiStore(state => state.toggleHelp)
  return (
    <SidePanel {...props}>
      <SidePanelHeader sticky>
        <Typography className={classes.title}>Help Panel</Typography>
        <Button onClick={toggleHelp}>Hide</Button>
      </SidePanelHeader>
      <SidePanelBody>
        {topics.map((t, i) => (
          <ExpansionPanel key={t} title={getLang(t)}>
            <div
              dangerouslySetInnerHTML={{
                __html: getLang(`${t}_A`)
              }}
            />
          </ExpansionPanel>
        ))}
      </SidePanelBody>
    </SidePanel>
  )
}

HelpPanel.propTypes = {}

export default HelpPanel
