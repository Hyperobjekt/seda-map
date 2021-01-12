import { ButtonBase, withStyles } from '@material-ui/core'

export default withStyles(theme => ({
  root: {
    display: 'inline-block',
    cursor: 'pointer',
    padding: 0,
    margin: '0 auto',
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    border: 0,
    background: 'none',
    '&:focus': {
      outline: 'none',
      textDecorationColor: theme.palette.secondary.main
    }
  }
}))(ButtonBase)
