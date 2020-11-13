import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './assets/iconfont/iconfont.css'
import './App.css';
import SearchModel from './pages/demlist/index'
import OrderModel from './pages/order/index'
import BankList from './pages/bankList/index'
import IsvModel from './pages/isvList/index'
import OrderDetail from './pages/detail/index'
import IsvDetail from './pages/isvDetail/index'
import Addentlist from './pages/addemlist/index'
import AsideModel from './pages/aside/index'
import Template from './pages/template/index'
import Contracts from './pages/contract/index'
import CateModel from './pages/cateManage/index'
import Addcate from './pages/addCate/index'
import Querydata from './pages/cateManage/query'
import BlackList from './pages/blackList/index'
import { Layout, Breadcrumb } from 'antd';
import Header from './pages/header'
// import Aside from './pages/aside/index'
class App extends Component {
  consthuctor(props) {

  }


  render() {
    return (
      <div className="app">
        <Layout style={{ minHeight: '100vh' }}>
          <AsideModel />

          <Layout>
            <Header/>

            <Switch>
              <div id="content">
                <Route exact path="/" component={SearchModel}></Route>
                <Route exact path="/home" component={SearchModel}></Route>
                <Route exact path="/Order" component={OrderModel}></Route>
                <Route exact path="/Bank" component={BankList}></Route>
                <Route exact path="/OrderDetail/:id" component={OrderDetail}></Route>
                <Route exact path="/isv" component={IsvModel}></Route>
                <Route exact path="/isv-detail/:id" component={IsvDetail}></Route>
                <Route exact path="/Template" component={Template}></Route>
                <Route exact path="/Contracts" component={Contracts}></Route>
                <Route exact path="/Add/:id/:stats" component={Addentlist}></Route>
                <Route exact path="/CateModel" component={CateModel}></Route>
                <Route exact path="/Addcate" component={Addcate}></Route>
                <Route exact path="/Querydata/:id" component={Querydata}></Route>
                <Route exact path="/BlackList" component={BlackList}></Route>
              </div>
            </Switch>
          </Layout>
        </Layout>
      </div>

    );
  }
}

export default App;
