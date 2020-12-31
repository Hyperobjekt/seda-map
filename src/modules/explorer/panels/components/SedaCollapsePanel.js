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
import useActivePanel from '../hooks/useActivePanel'

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
    padding: '4px 0',
    overflowX: 'hidden',
    overflowY: 'auto'
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
    },
    '&:focus': {
      opacity: '1!important'
    }
  },
  footerPanel: {
    width: theme.app.panelWidth,
    height: 264,
    minWidth: theme.app.panelWidth,
    transformOrigin: 'left bottom',

  },
  footerCondensed: {
    position: 'absolute',
    left: theme.app.condensedPanelWidth + theme.spacing(3),
    bottom: 0,
  },
  footerShowChart: {

  },
  footerNoChart: {
    position: 'absolute',
    bottom:0
  },
}))

const AnimatedSidePanel = animated(SidePanel)
const AnimatedSidePanelFooter = animated(SidePanelFooter)

/**
 * Gets the offset to transform the panel footer containing the preview chart based on the current UI context
 * @param {*} param0
 */
const getFooterStyleProps = ({
  condensed,
  view,
  hovered,
  showChart,
  activePanel
}) => {
  // get vertical offset for preview chart
  const verticalOffset =
    !condensed && view === 'map'
      ? 0
      : view !== 'map' || hovered || activePanel
      ? 264
      : !showChart
      ? 216
      : showChart
      ? -24
      : 0
  return {
    transform: `translate(0px, ${verticalOffset}px)`,
    height: !condensed && !showChart ? 48 : 264,
  }
}

/**
 * Expanded version of the control panel
 */
const SedaCollapsePanel = ({
  style: initialStyle,
  ...props
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const condenseButtonRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [view] = useActiveView()
  const [activePanel] = useActivePanel()
  const [condensed, toggleCondensed] = useCondensedPanel()
  const [showChart] = usePanelChartVisible()
  const panelStyle = useSpring({
    width:
      condensed && !hovered && !activePanel
        ? theme.app.condensedPanelWidth
        : theme.app.panelWidth,
    delay: condensed ? 200 : 0
  })

  const footerStyleProps = getFooterStyleProps({
    condensed,
    view,
    hovered,
    showChart,
    activePanel
  })
  const footerStyle = useSpring(footerStyleProps)
  const footerRef = useRef(null)

  // trigger panel expand on mouse enter
  const handleMouseEnter = e => {
    // ignore if it's the preview chart
    if (
      footerRef.current &&
      footerRef.current.contains(e.target)
    )
      return
    setHovered(true)
  }
  // trigger panel collapse on mouse leave
  const handleMouseLeave = e => {
    setHovered(false)
  }
  // toggle between condensed / expanded mode
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
          ref={condenseButtonRef}
          className={classes.toggleCondensed}
          style={{
            opacity: !condensed && !hovered ? 0 : 1
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
          [classes.footerCondensed]: condensed,
          [classes.footerShowChart]: showChart,
          [classes.footerNoChart]: view !== 'map'
        })}
        style={footerStyle}>
        <SedaPreviewChartPanel />
      </AnimatedSidePanelFooter>
    </AnimatedSidePanel>
  )
}

export default SedaCollapsePanel
