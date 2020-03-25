import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import useDataOptions from '../../hooks/useDataOptions'
import clsx from 'clsx'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { getFilterCount } from '../../../../shared/selectors/data'
import {
  getRegionFromFeatureId,
  getRegionLabel
} from '../../../../shared/selectors'
import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
import { getLang } from '../../../../shared/selectors/lang'
import {
  ListItemSecondaryAction,
  Typography,
  ListSubheader,
  Button,
  IconButton
} from '@material-ui/core'
import useUiStore from '../../hooks/useUiStore'

const listItemStyle = { paddingLeft: 32, paddingRight: 24 }

const SedaActiveFilters = ({ filters = {}, ...props }) => {
  const prefixRegion = filters.prefix
    ? getRegionFromFeatureId(filters.prefix)
    : null
  const region = useDataOptions(state => state.region)
  const setFilter = useDataOptions(state => state.setFilter)
  const getNameForId = useDataOptions(
    state => state.getNameForId
  )
  const setFilterPanel = useUiStore(
    state => state.setFilterPanel
  )

  return (
    <>
      {prefixRegion && (
        <ListItem
          style={listItemStyle}
          button
          onClick={() => setFilterPanel('state')}>
          <ListItemText
            primary={getRegionLabel(
              prefixRegion,
              'FILTER_PREFIX'
            )}
            secondary={getNameForId(filters.prefix)}
          />
          <ListItemSecondaryAction>
            <IconButton
              onClick={() => setFilter('prefix', null)}>
              <CloseIcon style={{ fontSize: 16 }} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      )}
      {filters.largest && (
        <ListItem
          button
          style={listItemStyle}
          onClick={() => setFilterPanel('largest')}>
          <ListItemText
            primary={getLang('FILTER_LARGEST')}
            secondary={getLang('FILTER_LARGEST_SELECTION', {
              num: filters.largest,
              region: getRegionLabel(region.id)
            })}
          />
          <ListItemSecondaryAction>
            <IconButton
              onClick={() => setFilter('largest', null)}>
              <CloseIcon style={{ fontSize: 16 }} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      )}
    </>
  )
}

const useStyles = makeStyles(theme => ({
  root: {},
  listItem: listItemStyle,
  active: theme.mixins.activeListButton
}))

const SedaFilterSelect = ({ onSelect }) => {
  const filters = useDataOptions(state => state.filters)
  const filterCount = getFilterCount(filters)
  const setFilterPanel = useUiStore(
    state => state.setFilterPanel
  )
  const classes = useStyles()

  return (
    <div className={clsx('filter-select', classes.root)}>
      <List
        subheader={
          <ListSubheader disableSticky>
            Active Filters
          </ListSubheader>
        }
        aria-label="list of active filters">
        {filterCount > 0 ? (
          <SedaActiveFilters filters={filters} />
        ) : (
          <Typography
            style={{
              display: 'block',
              padding: `0 24px 0 32px`
            }}
            variant="caption">
            No filters currently applied. Add one of the filters
            below to filter data.
          </Typography>
        )}
      </List>
      <List
        subheader={
          <ListSubheader disableSticky>
            Add A Filter
          </ListSubheader>
        }
        aria-label="list of available filters">
        {!filters.prefix && (
          <ListItem className={classes.listItem}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setFilterPanel('state')}>
              Filter By State
            </Button>
          </ListItem>
        )}
        {!filters.largest && (
          <ListItem className={classes.listItem}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setFilterPanel('largest')}>
              Filter by Size
            </Button>
          </ListItem>
        )}
      </List>
    </div>
  )
}

SedaFilterSelect.propTypes = {}

export default SedaFilterSelect
