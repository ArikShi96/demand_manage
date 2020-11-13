import React, { Component } from 'react';
import classnames from 'classnames'
import PropTypes from 'prop-types';
import './index.css';
//import UserLogin from "../../UserLogin";
const origin = window.location.origin;

class Header extends Component {

  static defaultProps = {
    homeHref: origin,
    portalName: '', //左侧logo区域显示文字
    portalLogo: 'cl cl-yybs', //左侧logo
    logoType: 'icon', //logo类型 icon/image
    navUser: true,
    userMenus: [],
    fixed: true
  }

  static propTypes = {
    homeHref: PropTypes.string,
    portalName: PropTypes.string,
    portalLogo: PropTypes.string,
    logoType: PropTypes.oneOf(['icon', 'image']),
    navUser: PropTypes.bool
  }

  getLogo = () => {
    let { portalLogo, logoType } = this.props;
    let logoNode = null;
    switch (logoType) {
      case 'icon':
        logoNode = (
          <i className={'portal-logo logo-icon ' + portalLogo} />
        );
        break;
      case 'image':
        logoNode = (
          <img className="portal-logo logo-img" src={portalLogo} alt="" />
        );
        break;
    }
    return logoNode
  }

  render() {
    let {
      children, className, navUser, fixed,
      homeHref, portalName, logoClick,
      userMenus, onUserMenuSelect
    } = this.props;
    return (
      <header className={classnames('mix-portal-header', className, {
        'mix-portal-fixed': fixed
      })}>
        <div className="portal-header-logo">
          <a href={homeHref} onClick={logoClick}>
            {this.getLogo()}
            {portalName ? (
              <span className={"portal-name"}>{portalName}</span>
            ) : null}
          </a>
        </div>
        {/*<div className="portal-header-content">
          <UserLogin
            className="user-info-container"
            navUser={navUser}
            menus={userMenus}
            onMenuSelect={onUserMenuSelect}
          />
          {children}
            </div>*/}
      </header>
    )
  }
}

export default Header;