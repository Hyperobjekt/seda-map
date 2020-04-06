import React from 'react'
import PropTypes from 'prop-types'
import Footer from '../../../base/components/Footer'
import { Button, makeStyles } from '@material-ui/core'
import { getLang } from '../../../shared/selectors/lang'
import {
  FacebookIcon,
  TwitterIcon,
  EmbedIcon,
  LinkIcon
} from '../../icons'
import StanfordLogo from './StanfordLogo'
import Tooltip from '@material-ui/core/Tooltip'
import { onTwitterShare, onFacebookShare } from './share'
import clsx from 'clsx'
import {
  useLinkDialogVisibility,
  useEmbedDialogVisibility
} from '../hooks'

const links = {
  id: 'share',
  label: getLang('FOOTER_SHARE_LABEL'),
  items: [
    {
      id: 'facebook',
      label: getLang('FOOTER_SHARE_FACEBOOK'),
      icon: <FacebookIcon />
    },
    {
      id: 'twitter',
      label: getLang('FOOTER_SHARE_TWITTER'),
      icon: <TwitterIcon />
    },
    {
      id: 'link',
      label: getLang('FOOTER_SHARE_LINK'),
      icon: <LinkIcon />
    },
    {
      id: 'embed',
      label: getLang('FOOTER_EMBED_LINK'),
      icon: <EmbedIcon />
    }
  ]
}

const copyright = getLang('FOOTER_COPYRIGHT')

const FooterLinks = ({
  label,
  links,
  onClick,
  classes = {},
  ...props
}) => (
  <div
    className={clsx(
      'footer__link-collection',
      classes.linkCollection
    )}
    {...props}>
    <span className="footer__link-label">{label}</span>
    {Boolean(links.length) &&
      links.map((item, i) => (
        <Tooltip
          key={'footer-link-' + i}
          title={item.label}
          placement="top">
          <Button
            className="footer__button"
            onClick={() => onClick(item)}
            aria-label={item.icon && item.label}>
            {item.icon ? item.icon : item.label}
          </Button>
        </Tooltip>
      ))}
  </div>
)

FooterLinks.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequied,
      icon: PropTypes.node
    })
  ),
  onClick: PropTypes.func
}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    zIndex: 1000,
    borderTop: `1px solid`,
    borderTopColor: theme.palette.divider,
    height: theme.spacing(5),
    color: theme.palette.text.secondary,
    fill: theme.palette.text.secondary,
    '& .footer__button': {
      minWidth: theme.spacing(5),
      height: theme.spacing(5),
      borderRadius: 0
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.text.secondary
    }
  }
}))

const SedaFooter = () => {
  const shareUrl = window.location.href

  const [, toggleLinkDialog] = useLinkDialogVisibility()
  const [, toggleEmbedDialog] = useEmbedDialogVisibility()
  const classes = useStyles()

  const handleClick = item => {
    switch (item.id) {
      case 'link':
        return toggleLinkDialog()
      case 'embed':
        return toggleEmbedDialog()
      case 'twitter':
        return onTwitterShare(shareUrl, getLang('SHARE_TWITTER'))
      case 'facebook':
        return onFacebookShare(shareUrl)
      default:
        return null
    }
  }
  return (
    <Footer
      classes={classes}
      branding={
        <StanfordLogo style={{ height: 16, width: 76 }} />
      }
      copyright={copyright}
      links={
        <FooterLinks
          label={links.label}
          links={links.items}
          onClick={handleClick}
        />
      }
    />
  )
}

SedaFooter.propTypes = {
  copyright: PropTypes.string,
  branding: PropTypes.node,
  exportItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string
    })
  ),
  shareItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string
    })
  ),
  onShare: PropTypes.func,
  onExport: PropTypes.func
}

export default SedaFooter
