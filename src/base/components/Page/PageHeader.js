import React from "react"
import PropTypes from "prop-types"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import HideOnScroll from "../Helpers/HideOnScroll"
import { makeStyles } from "@material-ui/core"
import clsx from "clsx"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {},
  title: {
    flexGrow: 1,
  },
  actions: {},
  toolbar: {
    display: "flex",
    width: "100%",
    maxWidth: props => props.contentWidth || "100%",
  },
}))

/**
 * Header for the page with logo, title, and page actions
 */
export default function PageHeader({
  LogoComponent,
  ActionsComponent,
  children,
  hideOnScroll,
  classes: overrides = {},
  transitionProps = {},
  toolbarProps = {},
  contentWidth,
  ...props
}) {
  const classes = useStyles({ contentWidth })

  return (
    <HideOnScroll enabled={hideOnScroll} {...transitionProps}>
      <AppBar
        classes={{
          root: clsx(
            "page__header",
            "header",
            classes.root,
            overrides.root
          ),
        }}
        {...props}
      >
        <Toolbar
          {...toolbarProps}
          className={clsx(classes.toolbar, overrides.toolbar)}
        >
          {LogoComponent && (
            <div
              className={clsx(
                "header__logo",
                classes.logo,
                overrides.logo
              )}
            >
              {LogoComponent}
            </div>
          )}
          <div
            className={clsx(
              "header__title",
              classes.title,
              overrides.title
            )}
          >
            {children}
          </div>
          {ActionsComponent && (
            <div
              className={clsx(
                "header__actions",
                classes.actions,
                overrides.actions
              )}
            >
              {ActionsComponent}
            </div>
          )}
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  )
}

PageHeader.propTypes = {
  /** React component that displays site logo */
  LogoComponent: PropTypes.element,
  /** React component for header actions (e.g. site menu) */
  ActionComponent: PropTypes.element,
  /** Determines if the header hides on scroll */
  hideOnScroll: PropTypes.bool,
  /** Classes object for styling the component */
  classes: PropTypes.object,
  /** Props passed to the `react-transition-group` when animating header */
  transitionProps: PropTypes.object,
  /** Props passed to the toolbar component */
  toolbarProps: PropTypes.object,
  /** The maximum width for page content */
  conentWidth: PropTypes.string,
}
PageHeader.defaultProps = {
  hideOnScroll: false,
  contentWidth: "100%",
  classes: {},
  transitionProps: {},
  toolbarProps: {},
}
