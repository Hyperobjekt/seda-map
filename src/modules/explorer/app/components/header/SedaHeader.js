import React from 'react'
import SedaLogo from './SedaLogo'
import {
  makeStyles,
} from '@material-ui/core'
import SedaViewControls from './SedaViewControls'

import {
  PageHeader
} from '../../../../../shared'
import { useActiveView } from '../../hooks'
import { SedaHelpButton } from '../../../help'
import { SedaMenuButton } from '../../../menu'
import { SedaSearch } from '../../../search'
import SedaHeaderTitle from './SedaHeaderTitle'

const useLogoStyles = makeStyles(theme => ({
  root: {
    display: 'block',
    width: theme.spacing(4),
    height: theme.spacing(4),
    overflow: 'hidden'
  },
  logo: {
    width: 'auto',
    height: theme.spacing(4)
  }
}))

const HeaderLogo = props => {
  const classes = useLogoStyles()
  return (
    <a className={classes.root} href="/">
      <SedaLogo className={classes.logo} />
    </a>
  )
}

const useActionStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  searchRoot: {
    width: 180,
    marginRight: theme.spacing(2)
  },
  viewControls: {
    marginRight: theme.spacing(2)
  },
  helpButton: {
    marginRight: theme.spacing(2)
  }
}))

const HeaderActions = ({ ...props }) => {
  const classes = useActionStyles()
  const [, , isEmbed] = useActiveView()
  return (!isEmbed &&
    <div className={classes.root} {...props}>
      <SedaSearch
        TextFieldProps={{
          classes: { root: classes.searchRoot }
        }}
        placeholder="find a place"
      />
      <SedaViewControls className={classes.viewControls} />
      <SedaHelpButton classes={{ root: classes.helpButton }} />
      <SedaMenuButton />
    </div>
  )
}

const useHeaderStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.background.paper,
    color: theme.palette.text.primary
  },
  logo: {
    marginRight: theme.spacing(3)
  },
  
  subheading: {
    color: theme.palette.text.secondary
  },
  toolbar: {
    paddingLeft: theme.spacing(3)
  }
}))

const SedaHeader = props => {
  const classes = useHeaderStyles()
  return (
    <PageHeader
      classes={classes}
      LogoComponent={<HeaderLogo />}
      ActionsComponent={<HeaderActions />}
      {...props}>
        <SedaHeaderTitle />
    </PageHeader>
  )
}

export default SedaHeader
