import React, { useState, useRef } from 'react'
import {
  Typography,
  makeStyles,
  IconButton,
  List,
  useTheme
} from '@material-ui/core'
import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody,
  SidePanelFooter
} from '../../../../shared'
import clsx from 'clsx'
import { getLang } from '../../app/selectors/lang'
import {
  SidebarCloseIcon,
  SidebarOpenIcon
} from '../../../icons'
import { useActiveView } from '../../app/hooks'
import SedaPreviewChartPanel from './SedaPreviewChartPanel'
import useCondensedPanel from '../hooks/useCondensedPanel'
import usePanelChartVisible from '../hooks/usePanelChartVisible'
import {
  SedaLocationsPanelButton,
  SedaFilterPanelButton,
  SedaMetricPanelButton,
  SedaRegionPanelButton,
  SedaSubgroupPanelButton
} from './buttons'
import { useSpring, animated } from 'react-spring'

const useStyles = makeStyles(theme => ({
  root: {},
  title: {
    ...theme.mixins.boldType,
    whiteSpace: 'nowrap',
    maxWidth: '100%',
    overflow: 'hidden'
  },
  details: { padding: 0 },
  body: {
    padding: '4px 0'
  },
  list: {
    minWidth: theme.app.panelWidth
  },
  headerPanel: {
    minHeight: theme.spacing(7),
    minWidth: theme.spacing(9.5)
  },
  toggleCondensed: {
    position: 'absolute',
    right: 0,
    top: '100%',
    background: '#fff',
    transform: 'translate(50%, -50%)',
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '100%',
    zIndex: 999,
    transition: 'opacity 0.4s ease-in-out',
    '&.MuiIconButton-root': {
      marginRight: 0
    },
    '&:hover': {
      background: theme.palette.primary.main,
      color: '#fff'
    }
  },
  footerPanel: {
    width: theme.app.panelWidth,
    height: 264,
    minWidth: theme.app.panelWidth,
    transformOrigin: 'left bottom'
  },
  footerCondensed: {
    position: 'absolute',
    left: theme.app.condensedPanelWidth + theme.spacing(3),
    bottom: 0
  }
}))

const AnimatedSidePanel = animated(SidePanel)
const AnimatedSidePanelFooter = animated(SidePanelFooter)

/**
 * Expanded version of the control panel
 */
const SedaCollapsePanel = ({
  style: initialStyle,
  ...props
}) => {
  const [hovered, setHovered] = useState(false)
  const classes = useStyles()
  const theme = useTheme()
  const [view] = useActiveView()
  const [condensed, toggleCondensed] = useCondensedPanel()
  const [showChart] = usePanelChartVisible()
  const panelStyle = useSpring({
    width:
      condensed && !hovered
        ? theme.app.condensedPanelWidth
        : theme.app.panelWidth,
    delay: condensed ? 200 : 0
  })
  const verticalOffset = !condensed
    ? 0
    : view !== 'map' || hovered
    ? 264
    : !showChart
    ? 216
    : showChart
    ? -24
    : 0
  const footerStyle = useSpring({
    transform: `translate(0px, ${verticalOffset}px)`,
    height: !condensed && !showChart ? 48 : 264
  })
  const footerRef = useRef(null)
  const handleMouseEnter = e => {
    // ignore if it's the preview chart
    if (
      footerRef.current &&
      footerRef.current.contains(e.target)
    )
      return
    setHovered(true)
  }
  const handleMouseLeave = e => {
    setHovered(false)
  }
  const handleToggleCondensed = e => {
    !condensed && setHovered(false)
    toggleCondensed()
  }

  return (
    <AnimatedSidePanel
      style={{ ...initialStyle, ...panelStyle }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}>
      <SidePanelHeader className={classes.headerPanel} sticky>
        <Typography className={classes.title}>
          Data Options
        </Typography>
        <IconButton
          className={classes.toggleCondensed}
          style={{
            opacity: condensed && !hovered ? 0 : 1
          }}
          onClick={handleToggleCondensed}>
          {condensed ? (
            <SidebarOpenIcon />
          ) : (
            <SidebarCloseIcon />
          )}
        </IconButton>
      </SidePanelHeader>
      <SidePanelBody classes={{ root: classes.body }}>
        <List className={classes.list}>
          <SedaMetricPanelButton />
          <SedaRegionPanelButton />
          <SedaSubgroupPanelButton />
          <SedaFilterPanelButton />
          <SedaLocationsPanelButton />
        </List>
      </SidePanelBody>
      <AnimatedSidePanelFooter
        sticky
        ref={footerRef}
        className={clsx(classes.footerPanel, {
          [classes.footerCondensed]: condensed
        })}
        style={footerStyle}>
        <SedaPreviewChartPanel />
      </AnimatedSidePanelFooter>
    </AnimatedSidePanel>
  )
}

export default SedaCollapsePanel
