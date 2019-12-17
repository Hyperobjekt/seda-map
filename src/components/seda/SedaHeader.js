

import { withRouter } from 'react-router-dom';
import React from 'react'
import classNames from 'classnames';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MenuIcon from '@material-ui/icons/Menu';
import PlaceIcon from '@material-ui/icons/Place';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import * as _debounce from 'lodash.debounce';
import { useTheme } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// constants
import { HEADER } from '../../constants/site';

// modules
import { HighlightedStateControl, RegionControl, DemographicAndGapControl } from './SedaSelectControls';

// components
import Header from '../organisms/Header';
import Logo from '../atoms/Logo';
import ToggleButtons from '../molecules/ToggleButtons';
import HeaderTab from '../molecules/HeaderTab';
import SedaMenu from './SedaMenu';
import SedaSearch from './SedaSearch';
import { getLang } from '../../modules/lang';
import DataOptionsDialog from '../organisms/DataOptions';
import MenuButton from '../atoms/MenuButton';
import HelpButton from '../molecules/HelpButton';
import SelectButton from '../organisms/DataOptions/SelectButton';
import MoreFiltersButton from '../organisms/DataOptions/MoreFiltersButton';
import { toggleHelp, onMetricChange, onViewChange } from '../../actions';
import { isGapDemographic } from '../../modules/config';
import { getStatePropByAbbr } from '../../constants/statesFips';

/** Returns the subtitle for the provided vars */
const getSubline = (demographic, region, highlightedState) => {
  const state = getStatePropByAbbr(highlightedState, 'full') || 'U.S.';
  const isGap = isGapDemographic(demographic);
  return getLang('MOBILE_SUBLINE', {
    place: state,
    region: region,
    demographic: isGap ?
      getLang('LABEL_SHORT_' + demographic) + ' students' :
      getLang('LABEL_' + demographic)  + ' students'
  })
}

const HeaderPrimary = ({metric = 'avg', region, demographic, highlightedState, onMetricChange, view}) => {
  const theme = useTheme();
  const isAboveSmall = useMediaQuery(theme.breakpoints.up('sm'));
  return <div className='header-tabs'>
    {
      isAboveSmall ? (
        <Tabs
          value={metric}
          onChange={(e, metricId) => { onMetricChange(metricId) }}
          classes={{ root: 'tabs__root', indicator: 'tab__indicator' }}
          scrollButtons='off'
          variant="scrollable"
        >
        {
          HEADER.tabs.map((t,i) =>
            <Tab
              key={'tab'+i}
              value={t.id}
              label={
                <HeaderTab { ...HEADER.tabs[i] } />
              }
              classes={{
                root: 'tab',
                selected: 'tab--selected',
                wrapper: 'tab__wrapper'
              }} 
            />
          )
        }
        </Tabs>
      ) : (
        <DataOptionsDialog
          view={view}
          dialogTrigger={
            <SelectButton
              text={getLang('TAB_CONCEPT_'+ metric)}
              subtext={getSubline(demographic, region, highlightedState)}
            />
          }
        />
      )
    }
  </div>
}

HeaderPrimary.propTypes = {
  metric: PropTypes.string,
  onMetricChange: PropTypes.func,
  width: PropTypes.string,
  view: PropTypes.string,
  region: PropTypes.string,
  demographic: PropTypes.string,
  highlightedState: PropTypes.string
}

/**
 * Gets the controls for the map section
 * @param {string} metric 
 * @param {string} demographic 
 * @param {string} region 
 * @param {string} highlightedState 
 */
export const HeaderSecondaryControls = ({ region, metric, view }) => {
  return (
    region === 'schools' ?
      <div className="menu-sentence">
        Showing data by 
        <RegionControl /> 
        { (view === 'chart'  || view === 'split') ?
          <DataOptionsDialog
            dialogTrigger={
              <MoreFiltersButton text='More Filters' />
            }
          /> :
          <span>for <HighlightedStateControl /></span>
        }
      </div> :
      <div className="menu-sentence">
        Showing 
        <DemographicAndGapControl />
        by
        <RegionControl />
        { (view === 'chart'  || view === 'split') ?
          <DataOptionsDialog
            dialogTrigger={
              <MoreFiltersButton text='More Filters' />
            }
          /> :
          <span>in <HighlightedStateControl /></span>
        }
      </div>
  )
}

const HeaderSecondary = ({
  view,
  metric,
  helpOpen,
  region,
  onHelpClick,
  onViewChange,
}) => {
  return <div className="header__inner-content">
    <HelpButton
      className={classNames({ 'button--help-on': helpOpen})}
      onClick={onHelpClick}
    />
    <HeaderSecondaryControls metric={metric} region={region} view={view} />
    <ToggleButtons
      items={[
        {
          id: 'map',
          label: getLang('UI_MAP_BUTTON'),
          ariaLabel: getLang('UI_MAP_BUTTON_SR'),
          icon: <PlaceIcon />
        },
        {
          id: 'chart',
          label: getLang('UI_CHART_BUTTON'),
          ariaLabel: getLang('UI_CHART_BUTTON_SR'),
          icon: <BubbleChartIcon />
        }, 
        {
          id: 'split',
          label: getLang('UI_SPLIT_BUTTON'),
          ariaLabel: getLang('UI_SPLIT_BUTTON_SR'),
          icon: <VerticalSplitIcon />
        }
      ]}
      activeItemId={view}
      setActiveItem={onViewChange}
    />
    <SedaSearch inputProps={{
      placeholder: getLang('SEARCH_PLACEHOLDER')
    }} />
  </div>
}


HeaderSecondary.propTypes = {
  region: PropTypes.string,
  view: PropTypes.string,
  helpOpen: PropTypes.bool,
  onOptionChange: PropTypes.func,
  onViewChange: PropTypes.func,
  onHelpClick: PropTypes.func,
}

const SedaHeader = ({
  metric,
  view,
  region,
  demographic,
  highlightedState,
  helpOpen,
  onMetricChange,
  onOptionChange,
  onViewChange,
  onMenuClick,
  onHelpClick,
  ...rest
}) => 
  <Header
    branding={
      <Logo />
    }
    primaryContent={
      <HeaderPrimary {...{metric, onMetricChange, view, region, demographic, highlightedState}} />
    }
    secondaryContent={
      <HeaderSecondary {...{metric, region, view, helpOpen, onViewChange, onHelpClick}} />
    }
    actionContent={
      <>
        <MenuButton onClick={onMenuClick}>
          <MenuIcon />
        </MenuButton>
        <SedaMenu />
      </>
    }
    {...rest}
  >
  </Header>

SedaHeader.propTypes = {
  metric: PropTypes.string,
  view: PropTypes.string,
  text: PropTypes.string,
  region: PropTypes.string,
  demographic: PropTypes.string,
  highlightedState: PropTypes.string,
  controls: PropTypes.array,
  width: PropTypes.string,
  helpOpen: PropTypes.bool,
  onMetricChange: PropTypes.func,
  onOptionChange: PropTypes.func,
  onViewChange: PropTypes.func,
  onMenuClick: PropTypes.func,
  onHelpClick: PropTypes.func,
}

const mapStateToProps = (
  { ui: { helpOpen } },
  ownProps
) => ({
  helpOpen: helpOpen,
  view: ownProps.match.params.view,
  metric: ownProps.match.params.metric,
  region: ownProps.match.params.region,
  demographic: ownProps.match.params.demographic,
  highlightedState: ownProps.match.params.highlightedState
})

const mapDispatchToProps = (dispatch) => ({
  onHelpClick: () => dispatch(toggleHelp()),
  onMenuClick: () => dispatch({
    type: 'TOGGLE_MENU',
    open: true
  }),
  onMetricChange: _debounce((metricId) => {
    dispatch(onMetricChange(metricId));
  }, 400),
  onViewChange: (view) => {
    const updatedView = view && view.id ? view.id : view
    dispatch(onViewChange(updatedView));
  }
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(SedaHeader)