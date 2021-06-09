import React from 'react'
import useLocationFlags from '../../app/hooks/useLocationFlags'
import {
  ListItem,
  Typography,
  withStyles
} from '@material-ui/core'
import { getPrefixLang } from '../../app/selectors/lang'
import {
  getRegionFromLocationId,
  getSingularRegion
} from '../../app/selectors'

const styles = theme => ({
  listItem: {
    padding: theme.spacing(2, 1.5, 0, 1.5),
    fontSize: theme.typography.pxToRem(12),
    lineHeight: 1.3333,
    borderRadius: theme.shape.borderRadius
  },
  text: {
    background: `rgba(255,0,62,0.06)`,
    color: '#860000',
    padding: theme.spacing(1, 1.5),
    fontSize: theme.typography.pxToRem(12),
    [theme.breakpoints.up('lg')]: {
      fontSize: theme.typography.pxToRem(14)
    }
  }
})

const SedaLocationFlags = ({ locationId, classes }) => {
  const flags = useLocationFlags()
  const locationFlags = [
    'sped',
    'lep',
    'gifted',
    'missing'
  ].filter(
    (flagType, i) =>
      flags[i] && flags[i].indexOf(locationId) > -1
  )
  const regionType = getRegionFromLocationId(locationId)
  return (
    <>
      {locationFlags.map(flag => (
        <ListItem key={flag} className={classes.listItem}>
          <Typography
            className={classes.text}
            dangerouslySetInnerHTML={{
              __html: getPrefixLang(flag, 'FLAG', {
                region: getSingularRegion(regionType)
              })
            }}
          />
        </ListItem>
      ))}
    </>
  )
}

SedaLocationFlags.propTypes = {}

export default withStyles(styles)(SedaLocationFlags)
