import React from 'react'
import PropTypes from 'prop-types'
import { Button, makeStyles } from '@material-ui/core'
import { getLang } from '../../selectors/lang'
import {
  FacebookIcon,
  TwitterIcon,
  EmbedIcon,
  LinkIcon
} from '../../../../icons'
import StanfordLogo from './StanfordLogo'
import Tooltip from '@material-ui/core/Tooltip'
import clsx from 'clsx'

import { PageFooter } from '../../../../../shared'
import {
  onTwitterShare,
  onFacebookShare
} from '../../../sharing/actions'
import {
  useLinkDialogVisibility,
  useEmbedDialogVisibility
} from '../../../sharing'
import { useActiveView } from '../../hooks'
import { EmbedDialog } from '../../../sharing/components/EmbedDialog'
import { ShareLinkDialog } from '../../../sharing/components/ShareLinkDialog'
import { SedaHelpButton } from '../../../help'
import useMobileFooter from '../../hooks/useMobileFooter'

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
  isMobile,
  ...props
}) => (
  <div
    className={clsx(
      'footer__link-collection',
      classes.linkCollection
    )}
    {...props}>
    {!isMobile && (
      <span className="footer__link-label">{label}</span>
    )}
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'stretch',
    padding: theme.spacing(0, 3),
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
    },
    '& .button--help': {
      marginLeft: theme.spacing(2),
      height: theme.spacing(3.5)
    },
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-between',
      padding: theme.spacing(0, 2)
    },
    // help removed from footer and moved to header at larger resolutions
    [theme.breakpoints.up('lg')]: {
      '& .button--help': {
        display: 'none'
      }
    }
  },

  branding: {
    display: 'flex',
    alignItems: 'center'
  },
  copyright: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down('xs')]: { display: 'none' }
  },
  links: {
    display: 'flex',
    alignItems: 'center'
  }
}))

const SedaFooter = () => {
  const shareUrl = window.location.href

  const [, toggleLinkDialog] = useLinkDialogVisibility()
  const [, toggleEmbedDialog] = useEmbedDialogVisibility()
  const [, , isEmbed] = useActiveView()
  const classes = useStyles()
  const isMobile = useMobileFooter()

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
    !isEmbed && (
      <PageFooter className={classes.root}>
        <div
          className={clsx('footer__branding', classes.branding)}>
          <StanfordLogo style={{ height: 16, width: 76 }} />
        </div>
        <div
          className={clsx(
            'footer__copyright',
            classes.copyright
          )}>
          {copyright}
        </div>
        <div className={clsx('footer__links', classes.links)}>
          <FooterLinks
            label={links.label}
            isMobile={isMobile}
            links={
              !isMobile
                ? links.items
                : links.items.slice(0, links.items.length - 1)
            }
            onClick={handleClick}
          />
        </div>
        <SedaHelpButton />
        {!isMobile && <EmbedDialog />}
        <ShareLinkDialog />
      </PageFooter>
    )
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
