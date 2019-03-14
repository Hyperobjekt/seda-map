import React from 'react';
import PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

class Hint extends React.Component {
  state = {
    anchorEl: null,
  };

  handlePopoverOpen = event => {
    document.body.style.cursor = this.props.cursor ? 
      this.props.cursor : "help";
    this.setState({ anchorEl: event.currentTarget });
  };

  handlePopoverClose = () => {
    document.body.style.cursor = "default";
    this.setState({ anchorEl: null });
  };

  render() {
    const { children, text, cursor, ...other } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <span
        className="hint__text"
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={this.handlePopoverOpen}
        onMouseLeave={this.handlePopoverClose}
        {...other}
      >
        {children}
        <Popover
          id="mouse-over-popover"
          className="hint"
          classes={{
            paper: 'hint__container',
          }}
          open={Boolean(text) && open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClose={this.handlePopoverClose}
          disableRestoreFocus
        >
          <Typography>{text}</Typography>
        </Popover>
      </span>
    );
  }
}

Hint.propTypes = {
  text: PropTypes.string,
  cursor: PropTypes.string,
};

export default Hint;