import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "tinper-bee";
import "bee-menus/build/Menu.css";
import "./index.css";
const SubMenu = Menu.SubMenu;

class AsideModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onCollapse = this.onCollapse.bind(this);
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  render() {
    return (
      <div className="u-navbar-side-container">
        <Menu
          className="u-menu-max1"
          style={{ width: "100%" }}
          mode="inline"
          // defaultSelectedKeys={["3"]}
          defaultOpenKeys={["sub1", "sub2", "sub3"]}
        >
          {/* 需求管理 */}
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

            <Menu.Item key="12">
              <Link to="/IsvLevel">
                <i className="iconfont icon-xuqiuliebiao"></i>
                服务商等级
              </Link>
            </Menu.Item>
          </SubMenu>
          {/* 订单管理 */}
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
          {/* 电子合同 */}
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
          {/* 银行维护 */}
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
          {/* 标签管理 */}
          <SubMenu
            key="sub5"
            title={
              <span>
                <i className="iconfont icon-shichang"></i>
                <span>标签管理</span>
              </span>
            }
          >
            <Menu.Item key="13">
              <Link to="/TagList">
                <i className="iconfont icon-xuqiuliebiao"></i>
                标签管理
              </Link>
            </Menu.Item>
          </SubMenu>
          {/* 直播管理 */}
          <SubMenu
            key="sub6"
            title={
              <span>
                <i className="iconfont icon-shichang"></i>
                <span>直播管理</span>
              </span>
            }
          >
            <Menu.Item key="14">
              <Link to="/LiveList">
                <i className="iconfont icon-xuqiuliebiao"></i>
                直播管理
              </Link>
            </Menu.Item>
          </SubMenu>
          {/* 推荐管理 */}
          <SubMenu
            key="sub7"
            title={
              <span>
                <i className="iconfont icon-shichang"></i>
                <span>推荐管理</span>
              </span>
            }
          >
            <Menu.Item key="31">
              <Link to="/RecommendHeader">
                <i className="iconfont icon-xuqiuliebiao"></i>
                首页顶部导航管理
              </Link>
            </Menu.Item>
            <Menu.Item key="32">
              <Link to="/RecommendFooter">
                <i className="iconfont icon-xuqiuliebiao"></i>
                底部信息管理
              </Link>
            </Menu.Item>
            <Menu.Item key="15">
              <Link to="/RecommendLink">
                <i className="iconfont icon-xuqiuliebiao"></i>
                友情链接管理
              </Link>
            </Menu.Item>
            <Menu.Item key="16">
              <Link to="/RecommendProduct">
                <i className="iconfont icon-xuqiuliebiao"></i>
                热销商品管理
              </Link>
            </Menu.Item>
            <Menu.Item key="17">
              <Link to="/RecommendDiscount">
                <i className="iconfont icon-xuqiuliebiao"></i>
                特惠产品设置
              </Link>
            </Menu.Item>
            <Menu.Item key="18">
              <Link to="/RecommendApp">
                <i className="iconfont icon-xuqiuliebiao"></i>
                企业应用云产品推荐
              </Link>
            </Menu.Item>
            <Menu.Item key="19">
              <Link to="/RecommendCloud">
                <i className="iconfont icon-xuqiuliebiao"></i>
                云平台产品推荐
              </Link>
            </Menu.Item>
            <Menu.Item key="30">
              <Link to="/RecommendMicro">
                <i className="iconfont icon-xuqiuliebiao"></i>
                小微企业云产品推荐
              </Link>
            </Menu.Item>
            <Menu.Item key="20">
              <Link to="/RecommendMerchant">
                <i className="iconfont icon-xuqiuliebiao"></i>
                优质商家推荐
              </Link>
            </Menu.Item>
            <Menu.Item key="29">
              <Link to="/RecommendHome">
                <i className="iconfont icon-xuqiuliebiao"></i>
                首页活动推荐
              </Link>
            </Menu.Item>
            <Menu.Item key="33">
              <Link to="/RecommendKeyword">
                <i className="iconfont icon-xuqiuliebiao"></i>
                关键词策略
              </Link>
            </Menu.Item>
          </SubMenu>
          {/* 评价管理 */}
          <SubMenu
            key="sub8"
            title={
              <span>
                <i className="iconfont icon-shichang"></i>
                <span>评价管理</span>
              </span>
            }
          >
            <Menu.Item key="21">
              <Link to="/ProductCom">
                <i className="iconfont icon-xuqiuliebiao"></i>
                商品评价
              </Link>
            </Menu.Item>
            <Menu.Item key="22">
              <Link to="/OrderCom">
                <i className="iconfont icon-xuqiuliebiao"></i>
                订单评价
              </Link>
            </Menu.Item>
            <Menu.Item key="23">
              <Link to="/SettingCom">
                <i className="iconfont icon-xuqiuliebiao"></i>
                评价设置
              </Link>
            </Menu.Item>
          </SubMenu>
          {/* 促销管理 */}
          <SubMenu
            key="sub9"
            title={
              <span>
                <i className="iconfont icon-shichang"></i>
                <span>促销管理</span>
              </span>
            }
          >
            <Menu.Item key="24">
              <Link to="/Newcomer">
                <i className="iconfont icon-xuqiuliebiao"></i>
                新人专享
              </Link>
            </Menu.Item>
            <Menu.Item key="25">
              <Link to="/FullReduction">
                <i className="iconfont icon-xuqiuliebiao"></i>
                活动管理
              </Link>
            </Menu.Item>
            <Menu.Item key="26">
              <Link to="/IntegralManager">
                <i className="iconfont icon-xuqiuliebiao"></i>
                积分管理
              </Link>
            </Menu.Item>
          </SubMenu>
          {/* 文章管理 */}
          <SubMenu
            key="sub10"
            title={
              <span>
                <i className="iconfont icon-shichang"></i>
                <span>文章管理</span>
              </span>
            }
          >
            <Menu.Item key="27">
              <Link to="/ArticleList">
                <i className="iconfont icon-xuqiuliebiao"></i>
                文章管理
              </Link>
            </Menu.Item>
          </SubMenu>
          {/* 问答管理 */}
          <SubMenu
            key="sub11"
            title={
              <span>
                <i className="iconfont icon-shichang"></i>
                <span>问答管理</span>
              </span>
            }
          >
            <Menu.Item key="28">
              <Link to="/QuestionList">
                <i className="iconfont icon-xuqiuliebiao"></i>
                问答管理
              </Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    );
  }
}
export default AsideModel;
