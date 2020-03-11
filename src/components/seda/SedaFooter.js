import React from 'react'
import PropTypes from 'prop-types'
import Footer from '../organisms/Footer'
import { Button } from '@material-ui/core'
import { getLang } from '../../shared/selectors/lang'
import FacebookIcon from '../atoms/FacebookIcon'
import TwitterIcon from '../atoms/TwitterIcon'
import LinkIcon from '@material-ui/icons/Link'
import CodeIcon from '@material-ui/icons/Code'
import StanfordLogo from '../atoms/StanfordLogo'
import Tooltip from '@material-ui/core/Tooltip'

import { connect } from 'react-redux'
import { toggleEmbedDialog } from '../../actions'
import {
  onTwitterShare,
  onFacebookShare,
  toggleLinkShareDialog
} from '../organisms/Share'
import { onShare } from '../organisms/Share/actions'

const links = [
  {
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
        icon: <CodeIcon />
      }
    ]
  }
]

const copyright = getLang('FOOTER_COPYRIGHT')

const FooterLinks = ({ id, label, links, onClick }) => (
  <div className="site-footer__link-collection">
    <span className="site-footer__link-label">{label}</span>
    {Boolean(links.length) &&
      links.map((item, i) => (
        <Tooltip key={'footer-link-' + i} title={item.label} placement="top">
          <Button
            className="site-footer__button"
            onClick={() => onClick(id, item)}
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

const SedaFooter = ({
  onLinkShare,
  onEmbed,
  onFacebookLinkShare,
  onTwitterLinkShare
}) => {
  const shareUrl = window.location.href

  const handleClick = (id, item) => {
    switch (item.id) {
      case 'link':
        return onLinkShare()
      case 'embed':
        return onEmbed()
      case 'twitter':
        return onTwitterLinkShare(shareUrl, getLang('SHARE_TWITTER'))
      case 'facebook':
        return onFacebookLinkShare(shareUrl)
      default:
        return null
    }
  }
  return (
    <Footer
      branding={
        <div className="site-footer__branding-link">
          <StanfordLogo />
        </div>
      }
      copyright={copyright}
      links={
        <div className="site-footer__actions">
          {links &&
            links.map((collection, i) => (
              <FooterLinks
                id={collection.id}
                key={'links-' + i}
                label={collection.label}
                links={collection.items}
                onClick={handleClick}
              />
            ))}
        </div>
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

const mapDispatchToProps = dispatch => ({
  onEmbed: () => {
    dispatch(toggleEmbedDialog(true))
  },
  onLinkShare: () => {
    dispatch(toggleLinkShareDialog(true))
  },
  onTwitterLinkShare: (url, text) => {
    onTwitterShare(url, text)
    dispatch(onShare(url, 'twitter'))
  },
  onFacebookLinkShare: url => {
    onFacebookShare(url)
    dispatch(onShare(url, 'facebook'))
  }
})

export default connect(
  null,
  mapDispatchToProps
)(SedaFooter)
