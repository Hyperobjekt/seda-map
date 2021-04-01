import React from 'react'
import {
  Typography,
  makeStyles,
  IconButton,
  withStyles
} from '@material-ui/core'
import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody,
  ExpansionPanel
} from '../../../shared'
import { getLang } from '../app/selectors/lang'
import { CloseIcon } from '../../icons'
import useHelpVisibility from './useHelpVisibility'
import { useRegion } from '../app/hooks'

const useStyles = makeStyles(theme => ({
  root: {},
  title: theme.typography.panelHeading
}))

const StyledExpansionPanel = withStyles(theme => ({
  root: {
    '&.MuiExpansionPanel-root.MuiPaper-root::before': {
      backgroundColor: '#ECEFF1',
      opacity: 1,
      zIndex: 101
    },
    '&.Mui-expanded .MuiExpansionPanelSummary-content': {
      margin: 0
    }
  },
  summary: {
    padding: theme.spacing(1, 3),
    '&:after': {
      display: 'none'
    },
    '& .MuiExpansionPanelSummary-expandIcon': {
      padding: theme.spacing(0, 2)
    }
  },
  details: {
    padding: theme.spacing(0, 3, 2),
    color: theme.palette.text.secondary,
    [theme.breakpoints.up('lg')]: {
      fontSize: theme.typography.pxToRem(13)
    }
  },
  content: {},
  heading: {
    ...theme.typography.h6,
    fontSize: theme.typography.pxToRem(12),
    lineHeight: 1.33,
    [theme.breakpoints.up('lg')]: {
      fontSize: theme.typography.pxToRem(13)
    }
  }
}))(ExpansionPanel)

const topics = new Array(12)
  .fill()
  .map((n, i) => `HELP_HOW_Q${i + 1}`)

const additionalTopics = [
  {
    question: 'HELP_AVG',
    answer: 'HELP_AVG_A'
  },
  {
    question: 'HELP_CHART',
    answer: 'HELP_CHART_DOTS'
  },
  {
    question: 'HELP_COH',
    answer: 'HELP_COH_A'
  },
  {
    question: 'HELP_COH_CONCEPT',
    answer: 'HELP_COH_CONCEPT_A'
  },
  {
    question: 'HELP_FLAGGED',
    answer: 'HELP_FLAGGED_A'
  },
  {
    question: 'HELP_FRL',
    answer: 'HELP_FRL_A'
  },
  {
    question: 'HELP_GRD',
    answer: 'HELP_GRD_A'
  },
  {
    question: 'HELP_GRD_CONCEPT',
    answer: 'HELP_GRD_CONCEPT_A'
  },
  {
    question: 'HELP_MAP',
    answer: 'HELP_MAP_AVG_OVERVIEW'
  },
  {
    question: 'HELP_MIN',
    answer: 'HELP_MIN_A'
  },
  {
    question: 'HELP_SEG',
    answer: 'HELP_SEG_A'
  },
  {
    question: 'HELP_SES',
    answer: 'HELP_SES_A'
  }
]

const handleClick = (t, e) => {
  // analytics help item expansion
  window.dataLayer.push({
    event: 'helpTopicExpanded',
    helpTopicSelection: t
  })
}

const SedaHelpPanel = props => {
  const classes = useStyles()
  const [, toggleHelp] = useHelpVisibility()
  const [region] = useRegion()

  return (
    <SidePanel {...props}>
      <SidePanelHeader sticky>
        <Typography className={classes.title}>
          Help Panel
        </Typography>
        <IconButton onClick={toggleHelp} aria-label="close">
          <CloseIcon />
        </IconButton>
      </SidePanelHeader>
      <SidePanelBody>
        {topics.map((t, i) => (
          <StyledExpansionPanel
            key={t}
            title={getLang(t)}
            onClick={e => handleClick(t, e)}>
            <div
              dangerouslySetInnerHTML={{
                __html: getLang(`${t}_A`)
              }}
            />
          </StyledExpansionPanel>
        ))}
        {additionalTopics.map(q => (
          <StyledExpansionPanel
            key={q.question}
            title={getLang(q.question)}>
            <div
              dangerouslySetInnerHTML={{
                __html: getLang(q.answer, { region: region })
              }}
            />
          </StyledExpansionPanel>
        ))}
      </SidePanelBody>
    </SidePanel>
  )
}

export default SedaHelpPanel
