import { withStyles } from '@material-ui/core'
import { List } from '@material-ui/core'

export default withStyles(theme => ({
  root: {
    paddingTop: 4,
    paddingBottom: 4,

    '& .MuiListItem-button': {
      paddingLeft: 44,
      textTransform: 'capitalize'
    },
    '& .MuiListItem-button.MuiListItem--active': {
      background: theme.palette.primary.highlight,
      color: theme.palette.primary.main,
      borderRadius: theme.shape.borderRadius,
      boxShadow: `inset 0 0 0 1px ${theme.palette.primary.light}`,
      '&:before': {
        position: 'absolute',
        content: '""',
        width: theme.spacing(0.5),
        top: theme.spacing(2),
        bottom: theme.spacing(2),
        display: 'block',
        background: theme.palette.primary.main,
        left: theme.spacing(2.5),
        borderRadius: theme.shape.borderRadius,

      }
    }
  }
}))(List)
