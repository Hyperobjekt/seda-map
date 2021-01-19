import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { default as MuiExpansionPanel } from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { genId } from '../../../../shared/utils'

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightRegular,
    lineHeight: 1
  },
  content: {
    position: 'relative',
    zIndex: 1,
    '& .MuiSvgIcon-root:first-child': {
      fontSize: theme.spacing(2),
      marginRight: theme.spacing(1.5)
    },
    '& .icon': {
      fontSize: theme.spacing(2),
      marginRight: theme.spacing(1.5)
    }
  },
  details: {
    padding: `0 ${theme.spacing(3)}px`,
    flexDirection: 'column',
    '& > .MuiList-root': {
      width: 'calc(100% + 32px)',
      marginLeft: -16,
      marginRight: -16
    },
    '& > .MuiList-root .MuiButtonBase-root': {
      paddingLeft: 44
    }
  },
  root: {
    boxShadow: 'none',
    '&.Mui-expanded': {
      margin: 0,
      '& .MuiExpansionPanelSummary-root': {
        minHeight: theme.spacing(6)
      },
      '& .MuiExpansionPanelSummary-content': {
        margin: '12px 0'
      }
    },
    '&.MuiExpansionPanel-root.MuiPaper-root::before': {
      content: '""',
      display: 'block',
      backgroundColor: 'transparent',
      opacity: 0
    }
  },
  summary: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    '& .MuiExpansionPanelSummary-expandIcon': {
      zIndex: 1,
      position: 'relative'
    },
    '&:after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      background: theme.palette.grey[200],
      left: 8,
      right: 8,
      top: 4,
      bottom: 4,
      zIndex: 0,
      borderRadius: 3
    },
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      background: theme.palette.background.paper,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      borderRadius: 0,
      zIndex: 0
    }
  }
})

/**
 * Panel with expand / collapse functionality.
 * Props passed to React Material ExpansionPanel.
 */
const ExpansionPanel = ({
  id,
  children,
  title,
  startIcon,
  expandIcon,
  defaultExpanded,
  classes,
  ...props
}) => {
  return (
    <MuiExpansionPanel
      square
      classes={{
        root: classes.root,
        expanded: classes.expanded
      }}
      {...props}>
      <ExpansionPanelSummary
        classes={{
          root: classes.summary,
          content: classes.content
        }}
        expandIcon={expandIcon}
        aria-controls={`${id}-content`}
        id={`${id}-header`}>
        {startIcon}
        <Typography className={classes.heading}>
          {title}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails
        classes={{
          root: classes.details
        }}>
        {children}
      </ExpansionPanelDetails>
    </MuiExpansionPanel>
  )
}

ExpansionPanel.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  classes: PropTypes.object
}
ExpansionPanel.defaultProps = {
  id: genId(),
  expandIcon: <ExpandMoreIcon />,
  classes: {}
}

export default withStyles(styles)(ExpansionPanel)
