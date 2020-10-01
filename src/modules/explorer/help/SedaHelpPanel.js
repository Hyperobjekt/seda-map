import React from 'react'
import {
  Typography,
  makeStyles,
  IconButton
} from '@material-ui/core'
import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody,
  ExpansionPanel
} from '../../../shared'
import { getLang } from '../selectors/lang'
import { CloseIcon } from '../../icons'
import useHelpVisibility from './useHelpVisibility'

const useStyles = makeStyles(theme => ({
  root: {},
  title: theme.typography.panelHeading
}))

const topics = new Array(12)
  .fill()
  .map((n, i) => `HELP_HOW_Q${i + 1}`)

const SedaHelpPanel = props => {
  const classes = useStyles()
  const [, toggleHelp] = useHelpVisibility()
  return (
    <SidePanel {...props}>
      <SidePanelHeader sticky>
        <Typography className={classes.title}>
          Help Panel
        </Typography>
        <IconButton onClick={toggleHelp}>
          <CloseIcon />
        </IconButton>
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

export default SedaHelpPanel
