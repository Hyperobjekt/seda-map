import { makeStyles } from '@material-ui/core'

const useIconStyles = makeStyles(theme => ({
  root: {
    width: '1em',
    height: '1em',
    fill: 'currentColor',
    '& .filled': {
      opacity: 0
    }
  }
}))

export default useIconStyles
