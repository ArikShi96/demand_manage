import React from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'tinper-bee';
import 'bee-menus/build/Menu.css';
import './index.css'
const SubMenu = Menu.SubMenu;

class AsideModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.onCollapse = this.onCollapse.bind(this)
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    return (
      <div className="u-navbar-side-container">
        <Menu
          className="u-menu-max1"
          style={{ width: '100%' }}
          mode="inline"
          defaultSelectedKeys={['3']}
          defaultOpenKeys={['sub1','sub2','sub3']}
        >
          <SubMenu
            key="sub1"
            title={
              <span>
                <i className="iconfont icon-shichang"></i>
                <span>需求管理</span>
              </span>
            }
          >

            <Menu.Item key="3">
              <Link to="/home">
                <i className="iconfont icon-xuqiuliebiao"></i>
                  需求列表
                 </Link>
            </Menu.Item>

            <Menu.Item key="4">
              <Link to="/CateModel">
                <i className="iconfont icon-fenleiguanli-full"></i>
                  需求分类管理
                 </Link>
            </Menu.Item>

            <Menu.Item key="5">
              <Link to="/BlackList">
                <i className="iconfont icon-fenleiguanli-full"></i>
                  服务商黑名单
                </Link>
            </Menu.Item>

            <Menu.Item key="6">
              <Link to="/isv">
                <i className="iconfont icon-xuqiuliebiao"></i>
                  服务商管理
                </Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="sub2"
            title={
              <span>
                <i className="iconfont icon-shichang"></i>
                <span>订单管理</span>
              </span>
            }
          >

            <Menu.Item key="7">
              <Link to="/Order">
                <i className="iconfont icon-xuqiuliebiao"></i>
                  订单管理
               </Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="sub3"
            title={
              <span>
                <i className="iconfont icon-shichang"></i>
                <span>电子合同</span>
              </span>
            }
          >

            <Menu.Item key="9">
              <Link to="/Template">
                <i className="iconfont icon-xuqiuliebiao"></i>
                  模板管理
               </Link>
            </Menu.Item>

            <Menu.Item key="10">
              <Link to="/Contracts">
                <i className="iconfont icon-fenleiguanli-full"></i>
                  合同列表
              </Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub4"
            title={
              <span>
                <i className="iconfont icon-shichang"></i>
                <span>银行维护</span>
              </span>
            }
          >

            <Menu.Item key="11">
              <Link to="/Bank">
                <i className="iconfont icon-xuqiuliebiao"></i>
                畅捷银行维护
              </Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    )
  }
}
export default AsideModel
