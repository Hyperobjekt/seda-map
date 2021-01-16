import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core'
import { useActiveView } from '../../hooks'
import { SedaHelpButton } from '../../../help'
import { SedaMenuButton } from '../../../menu'
import { SedaSearch } from '../../../search'
import SedaViewControls from './SedaViewControls'
import useIsMobile from '../../hooks/useIsMobile'

const styles = (theme) => ({
  root: {
    display: 'flex',
    alignItems:  'center',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'unset',
      flexDirection: 'row-reverse',
      
    },
    [theme.breakpoints.down('sm')]: {
      '& .react-autosuggest__container': {
        borderLeft: '1px solid #E5E5E5',
        position: 'absolute',
        right:0,
        left: 168,
        transition: theme.transitions.create(['left']),
        background: '#fff',
        zIndex: 10
      },
      '& .react-autosuggest__container:focus-within': {
        left: -1
      }
    }
  },
  searchRoot: {
    width: 180,
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginRight: 0,

    },
    '& fieldset': {
      [theme.breakpoints.down('sm')]: {
        border: 0,
      },
    }
  },
  viewControls: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      height: theme.spacing(5)
    }
  },
  helpButton: {
    marginRight: theme.spacing(2)
  }
})

const SedaHeaderActions = ({ classes, ...props }) => {
  const [, , isEmbed] = useActiveView()
  const isMobile = useIsMobile()
  return (!isEmbed &&
    <div className={classes.root} {...props}>
      <SedaSearch
        TextFieldProps={{
          classes: { root: classes.searchRoot }
        }}
        placeholder="find a place"
      />
      <SedaViewControls className={classes.viewControls} />
      {
        !isMobile && (
          <SedaHelpButton classes={{ root: classes.helpButton }} />
        )
      }
      <SedaMenuButton />
    </div>
  )
}

export default withStyles(styles)(SedaHeaderActions)
