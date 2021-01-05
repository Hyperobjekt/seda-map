import React from 'react'
import useSchoolFlags from '../../app/hooks/useSchoolFlags'
import {
  ListItem,
  Typography,
  withStyles
} from '@material-ui/core'
import { getPrefixLang } from '../../app/selectors/lang'

const styles = theme => ({
  listItem: {
    padding: theme.spacing(2, 1.5, 0, 1.5),
    fontSize: theme.typography.pxToRem(12),
    lineHeight: 1.3333,
    borderRadius: theme.shape.borderRadius
  },
  text: {
    background: `rgba(255,0,62,0.06)`,
    padding: theme.spacing(1, 1.5)
  }
})

const SedaLocationFlags = ({ locationId, classes }) => {
  const flags = useSchoolFlags()
  const locationFlags = ['sped', 'lep', 'gifted'].filter(
    (flagType, i) =>
      flags[i] && flags[i].indexOf(locationId) > -1
  )
  return (
    <>
      {locationFlags.map(flag => (
        <ListItem key={flag} className={classes.listItem}>
          <Typography
            className={classes.text}
            dangerouslySetInnerHTML={{
              __html: getPrefixLang(flag, 'FLAG')
            }}
          />
        </ListItem>
      ))}
    </>
  )
}

SedaLocationFlags.propTypes = {}

export default withStyles(styles)(SedaLocationFlags)
