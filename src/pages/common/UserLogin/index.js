import React, { Component, Fragment } from 'react'
import Cookie from 'js-cookie';
import userIcon from './userIcon.png';
import './index.css'
import { Icon, Dropdown, Menu } from 'tinper-bee';
import 'bee-menus/build/Menu.css';
import 'bee-icon/build/Icon.css'
import 'bee-dropdown/build/Dropdown.css';
import { LOGIN_PATH, LOGOUT_PATH } from 'utils/util'
import * as yhtService from './yht';


const loginHref = LOGIN_PATH + '?referer=' + encodeURIComponent(location.href);

class UserLogin extends Component {
  constructor(props) {
    super(props);
    let cookieUserName = process.env.NODE_ENV === 'development' ? "----" : Cookie.get('userName');
    let userName = decodeURIComponent(cookieUserName || '');
    this.state = {
      showModal: false,
      new_version: [],
      iconDown: true,//图标
      userName: userName
    }
  }

  origin = window.location.origin;

  static defaultProps = {
    menus: []
  }

  getDropDownOverlay = () => {
    let { navUser = false, menus } = this.props;
    return (
      <Menu
        className="mix-user-name-menu"
        onSelect={this.handleMenuSelect}
      >
        {menus.map(menu => {
          let { icon, name, key } = menu;
          return (
            <Menu.Item key={key}>
              {icon ? <i className={icon} /> : null}
              {name}
            </Menu.Item>
          )
        })}
        {navUser ? (
          <Menu.Item key="userInfo">
            <i className='uf uf-home' />个人信息
          </Menu.Item>
        ) : null}
        <Menu.Item key="logout">
          <i className="uf uf-back" />退出
        </Menu.Item>
      </Menu>
    )
  }

  handleMenuSelect = (menuNode) => {
    let { key } = menuNode;
    switch (key) {
      case 'userInfo':
        window.open(yhtService.userInfoHref, '_blank');
        break;
      case 'logout':
        Cookie.remove("pathname");
        Cookie.remove("from_url");
        Cookie.remove("latest_userid");
        location.href = LOGOUT_PATH;
        break;
    }
    let { onMenuSelect } = this.props;
    onMenuSelect && onMenuSelect(menuNode);
  }

  onVisibleChange = (visible) => {
    this.setState({
      iconDown: !visible
    })
  }

  handleDropDownGetDoc = () => {
    let docNodeList = [document.body];
    let portalIframe = document.querySelector(".wg-portal-iframe");
    if (portalIframe) {
      let iframeBody = null;
      try {
        iframeBody = portalIframe.contentWindow.document.body;
      } catch (e) {

      }
      if (iframeBody) {
        docNodeList.push(iframeBody)
      }
    } else {
      docNodeList = document.body
    }
    return docNodeList
  }

  render() {
    let { className = '', showUserLogo = true, children } = this.props;
    let cls = 'mix-user-login ' + className;
    let { iconDown, userName } = this.state;
    return (
      <div className={cls}>
        {
          userName ? (
            <Fragment>
              <Dropdown
                placement="bottomCenter"
                trigger={['click']}
                getDocument={this.handleDropDownGetDoc}
                overlay={this.getDropDownOverlay()}
                onVisibleChange={this.onVisibleChange}
              >
                <div style={{ paddingLeft: '23px' }} className="user-info">
                  {showUserLogo ? <img src={userIcon} alt="" className="user-img" /> : null}
                  <span className="user-name">{userName}</span>
                  {iconDown ?
                    <Icon type="uf-triangle-down" /> :
                    <Icon type="uf-triangle-up" />
                  }
                </div>
              </Dropdown>

              {children}
            </Fragment>
          ) : (
              <Fragment>
                <a href={loginHref}>登录</a>
                <a href={yhtService.registerHref}>注册</a>
              </Fragment>
            )}
      </div>
    );
  }
}

export default UserLogin