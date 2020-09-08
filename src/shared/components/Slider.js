import { withStyles, Slider } from '@material-ui/core'

export default withStyles({
  root: {
    height: 2,
    padding: '16px 0'
  },
  thumb: {
    height: 16,
    width: 16,
    marginTop: -8,
    marginLeft: -8
  },
  active: {},
  valueLabel: {
    left: 'calc(-50%)',
    top: 22,
    '& *': {
      background: 'transparent',
      color: '#000'
    }
  },
  track: {
    height: 2
  },
  rail: {
    height: 2,
    opacity: 0.5
  },
  mark: {
    height: 8,
    width: 1,
    marginTop: -3
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor'
  }
})(Slider)
