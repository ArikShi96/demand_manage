import React, { Component, Fragment } from 'react';
import { PortalHeader } from '../common/Portal'
import iuap from './iuap-logo.svg';
import './index.css';
export default class HeaderBar extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount = () => {
  }

  portalHeaderProps = {
    portalLogo: iuap,
    logoType: 'image',
    logoClick: undefined,
    portalName: '云市场',
    navUser: true,
    onUserMenuSelect: undefined,
    homeHref: undefined,
    userMenus: []
  }

  render() {
    return (
      <PortalHeader
        {...this.portalHeaderProps}
      >
      </PortalHeader>
    )
  }
}
