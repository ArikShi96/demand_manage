import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./assets/iconfont/iconfont.css";
import "./App.css";
import { Layout, Breadcrumb } from "antd";
import Header from "./pages/header";
// import Aside from './pages/aside/index'
import SearchModel from "./pages/demlist/index";
import OrderModel from "./pages/order/index";
import BankList from "./pages/bankList/index";
import IsvModel from "./pages/isvList/index";
import OrderDetail from "./pages/detail/index";
import IsvDetail from "./pages/isvDetail/index";
import Addentlist from "./pages/addemlist/index";
import AsideModel from "./pages/aside/index";
import Template from "./pages/template/index";
import Contracts from "./pages/contract/index";
import CateModel from "./pages/cateManage/index";
import Addcate from "./pages/addCate/index";
import Querydata from "./pages/cateManage/query";
import BlackList from "./pages/blackList/index";
// 迭代2
import IsvLevel from "./pages/isvLevel/index"; // 服务商等级
import TagList from "./pages/tagList/index"; // 标签管理
import LiveList from "./pages/liveList/index"; // 直播管理
import LiveDetail from "./pages/liveList/Detail.jsx";
import RecommendProduct from "./pages/recommendList/RecommendProduct"; // 推荐管理
import RecommendKind from "./pages/recommendList/RecommendKind";
import RecommendDiscount from "./pages/recommendList/RecommendDiscount";
import RecommendApp from "./pages/recommendList/RecommendApp";
import RecommendCloud from "./pages/recommendList/RecommendCloud";
import RecommendMerchant from "./pages/recommendList/RecommendMerchant";
import RecommendMerchantDetail from "./pages/recommendList/RecommendMerchantDetail.jsx";
import ProductCom from "./pages/commentList/ProductCom"; // 评价管理
import ProductComDetail from "./pages/commentList/ProductComDetail.jsx";
import OrderCom from "./pages/commentList/OrderCom";
import SettingCom from "./pages/commentList/SettingCom";
import Newcomer from "./pages/promotionList/Newcomer"; // 促销
import FullReduction from "./pages/promotionList/FullReduction";
import FullReductionDetail from "./pages/promotionList/FullReductionDetail.jsx";
import IntegralManager from "./pages/promotionList/IntegralManager";
import ArticleList from "./pages/articleList/index"; // 文章
import ArticleDetail from "./pages/articleList/Detail.jsx";
import QuestionList from "./pages/questionList/index"; // 问答
import QuestionDetail from "./pages/questionList/Detail.jsx";
class App extends Component {
  render() {
    return (
      <div className="app">
        <Layout style={{ minHeight: "100vh" }}>
          <AsideModel />

          <Layout>
            <Header />

            <Switch>
              <div id="content">
                <Route exact path="/" component={SearchModel}></Route>
                <Route exact path="/home" component={SearchModel}></Route>
                <Route exact path="/Order" component={OrderModel}></Route>
                <Route exact path="/Bank" component={BankList}></Route>
                <Route
                  exact
                  path="/OrderDetail/:id"
                  component={OrderDetail}
                ></Route>
                <Route exact path="/isv" component={IsvModel}></Route>
                <Route
                  exact
                  path="/isv-detail/:id"
                  component={IsvDetail}
                ></Route>
                <Route exact path="/Template" component={Template}></Route>
                <Route exact path="/Contracts" component={Contracts}></Route>
                <Route
                  exact
                  path="/Add/:id/:stats"
                  component={Addentlist}
                ></Route>
                <Route exact path="/CateModel" component={CateModel}></Route>
                <Route exact path="/Addcate" component={Addcate}></Route>
                <Route
                  exact
                  path="/Querydata/:id"
                  component={Querydata}
                ></Route>
                <Route exact path="/BlackList" component={BlackList}></Route>
                {/* 迭代2 */}
                <Route exact path="/IsvLevel" component={IsvLevel}></Route>
                <Route exact path="/TagList" component={TagList}></Route>
                <Route exact path="/LiveList" component={LiveList}></Route>
                <Route
                  exact
                  path="/LiveDetail:id"
                  component={LiveDetail}
                ></Route>
                <Route
                  exact
                  path="/RecommendProduct"
                  component={RecommendProduct}
                ></Route>
                <Route
                  exact
                  path="/RecommendKind"
                  component={RecommendKind}
                ></Route>
                <Route
                  exact
                  path="/RecommendDiscount"
                  component={RecommendDiscount}
                ></Route>
                <Route
                  exact
                  path="/RecommendApp"
                  component={RecommendApp}
                ></Route>
                <Route
                  exact
                  path="/RecommendCloud"
                  component={RecommendCloud}
                ></Route>
                <Route
                  exact
                  path="/RecommendMerchant"
                  component={RecommendMerchant}
                ></Route>
                <Route
                  exact
                  path="/RecommendMerchantDetai/:id"
                  component={RecommendMerchantDetail}
                ></Route>
                <Route exact path="/ProductCom" component={ProductCom}></Route>
                <Route
                  exact
                  path="/ProductComDetail/:id"
                  component={ProductComDetail}
                ></Route>
                <Route exact path="/OrderCom" component={OrderCom}></Route>
                <Route exact path="/SettingCom" component={SettingCom}></Route>
                <Route exact path="/Newcomer" component={Newcomer}></Route>
                <Route
                  exact
                  path="/FullReduction"
                  component={FullReduction}
                ></Route>
                <Route
                  exact
                  path="/FullReductionDetail/:id"
                  component={FullReductionDetail}
                ></Route>
                <Route
                  exact
                  path="/IntegralManager"
                  component={IntegralManager}
                ></Route>
                <Route
                  exact
                  path="/ArticleList"
                  component={ArticleList}
                ></Route>
                <Route
                  exact
                  path="/ArticleDetail/:id"
                  component={ArticleDetail}
                ></Route>
                <Route
                  exact
                  path="/QuestionList"
                  component={QuestionList}
                ></Route>
                <Route
                  exact
                  path="/QuestionDetail/:id"
                  component={QuestionDetail}
                ></Route>
              </div>
            </Switch>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default App;
