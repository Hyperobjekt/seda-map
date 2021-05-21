import React from 'react'
import { getDemographics, getGaps } from '../../app/selectors'
import { useCompareStore } from '..'
import shallow from 'zustand/shallow'
import { SedaInlineMenu } from '../../controls'
import { Typography, withStyles } from '@material-ui/core'
import { getLang } from '../../app/selectors/lang'

const gaps = getGaps().map(g => g.id)
const demographics = getDemographics().map(d => d.id)
const options = [...demographics, ...gaps]

const styles = () => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1
  },
  label: {},
  menu: { margin: `0 0 0 4px` }
})

const CompareDemographicSelect = ({ classes, ...props }) => {
  const [demographic, setDemographic] = useCompareStore(
    state => [state.demographic, state.setDemographic],
    shallow
  )

  const handleSelect = val => {
    setDemographic(val)
  }

  return (
    <Typography className={classes.root} {...props}>
      <span className={classes.label}>
        {getLang('LABEL_COMPARE_SUBGROUP')}
      </span>
      <SedaInlineMenu
        ButtonProps={{ className: classes.menu }}
        value={demographic}
        items={options}
        onSelect={handleSelect}
      />
    </Typography>
  )
}

CompareDemographicSelect.propTypes = {}

export default withStyles(styles)(CompareDemographicSelect)
