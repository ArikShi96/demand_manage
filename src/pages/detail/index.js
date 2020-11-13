import React, { Fragment } from 'react'
import myapi from '../../api'
import _get from 'lodash/get'
import { Button, Message } from 'tinper-bee';
import 'bee-button/build/Button.css';
import 'bee-message/build/Message.css';
import { withRouter } from 'react-router-dom';
import Header from '../common/Header';
import Content from '../common/Content'
import ProductImg from './product.svg';
import BasicImg from './basic.png';
import DateImg from './date.svg'
import './index.css'
let basicInfo = [{
  title: "订单编号",
  value: "data.agreementNum"
}, {
  title: "订单创建时间",
  value: "data.commitTime"
}, {
  title: "支付方式",
  value: "data.payMode"
}, {
  title: "支付状态",
  value: "data.orderStatusDesc"
},{
  title: "订单支付时间",
  value: "data.payDate"
}, {
  title: "支付金额（元）",
  value: "data.busiAmount"
}, {
  title: "服务商名称",
  value: "data.isvName"
}, {
  title: "订单原价（元）",
  value: "data.originalPrice"
}, {
  title: "采购人姓名",
  value: "buyerInfo.userName"
}, {
  title: "采购人联系电话",
  value: "buyerInfo.userMobile"
}, {
  title: "采购人邮箱",
  value: "buyerInfo.userEmail"
}]
let productInfo = [{
  title: "商品名称",
  value: "product.productName"
}, {
  title: "商品版本",
  value: "product.versionNum"
}, {
  title: "购买规格",
  value: "data.specificationsName"
}, {
  title: "服务期限",
  value: "data.endDate"
}, {
  title: "开通状态",
  value: "data.openStatusDesc"
}]

class OrderDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allValue: {
        buyerInfo: {
          userName: null,//采购人姓名
          userEmail: null,//采购人邮箱
          userMobile: null//采购人联系电话
        },
        data: {
          payMode:null,//支付方式
          agreementNum: null,//订单编号
          commitTime: null,//订单创建时间
          isvName: null,
          busiAmount: null,//订单金额
          orderStatusDesc: null,//支付状态
          originalPrice: null,//订单原价
          payDate: null,//支付时间
          specificationsName: null,//购买规格
          endDate: null,//服务期限
          openStatusDesc: null,//开通状态
          openMsg: null,//开通信息
          serveStatus: null//服务状态   0-未确认 1，2-已确认
        },
        product: {
          productName: null,//商品名称
          versionNum: null,//商品版本
        }
      },//所有数据
      lineyu: "",
      visible: false,
      verifyMsg: "",
      agreementNum: ""
    }
  }

  componentDidMount() {
    var vals = this.props.match.params
    var id = vals.id
    this.setState({
      agreementNum: id
    })
    fetch(myapi.BASE_URL + `/market/yonyoucloud/operationOne?agreementNum=${id}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        // 'Access-Control-Allow-Credentials': 'true',
        // 'Access-Control-Allow-Headers': 'X-Requested-With',
        // 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        // 'Access-Control-Allow-Origin': '*',
      },
      credentials: "include"
    })
      .then(res => res.json())
      .then((response) => {
        var allCarouse = {
          buyerInfo: response.buyerInfo,
          data: response.data,
          product: response.product
        };
        console.log(allCarouse)
        this.setState({
          allValue: allCarouse,
        })
      })
  }

  renderMsg = (openMsg) => {
    let node = [];
    if (openMsg) {
      let data = openMsg.split(/[\n]/)
      data.map((item) => {
        node.push(
          <div className="isv-detail-zone-date block">
            <div className="isv-detail-zone-item-value">
              {item}
            </div>
          </div>
        )
      })
      return node
    }
  }

  renderPayMode = (allValue,value) => {
    var _val = _get(allValue, value);
    if(value == 'data.payMode') {
      switch (_val) {
        case 'offline':
          _val = '公司转账';
          break;
        case 'bas':
          _val = '用友融联  ';
          break;
        case 'chanpay-new':
          _val = '新畅捷支付 ';
          break;
        case 'chanpay':
          _val = '畅捷支付 ';
          break;
      }
    }
      return _val;
  }

  render() {
    let { allValue } = this.state;
    let { openMsg, serveStatus,payMode } = allValue.data;
    return (
      <Fragment>
        <Header style={{ background: '#fff', padding: 0 }} title="订单详情" back/>
        <Content>
          <div className="isv-detail">
            <div className="isv-detail-zone">
              <div className="isv-detail-zone-row">
                <img className="isv-detail-zone-icon" src={BasicImg} />
                <div className="isv-detail-zone-header">订单基本信息</div>
              </div>
              {
                basicInfo.map((item) => {
                  return (
                    <div className="isv-detail-zone-item">
                      <div className="isv-detail-zone-item-title">{item.title}</div>
                      {
                        item.value == 'data.orderStatusDesc' && payMode == 'offline'?
                          <div className="isv-detail-zone-item-value">
                            <span>{_get(allValue, item.value)}</span>
                            <Button colors="primary" className="confirm-btn" onClick={this.payConfirm}>支付确认</Button>
                          </div>:
                          <div className="isv-detail-zone-item-value">{this.renderPayMode(allValue,item.value)}</div>
                      }

                    </div>
                  )
                })
              }
            </div>


            <div className="isv-detail-zone">
              <div className="isv-detail-zone-row">
                <img className="isv-detail-zone-svg" src={ProductImg} />
                <div className="isv-detail-zone-header">商品信息</div>
              </div>
              {
                productInfo.map((item) => {
                  return (
                    <div className="isv-detail-zone-item">
                      <div className="isv-detail-zone-item-title">{item.title}</div>
                      <div className="isv-detail-zone-item-value">{_get(allValue, item.value)}</div>
                    </div>
                  )
                })
              }
              <div className="isv-detail-zone-item">
                <div className="isv-detail-zone-item-title">服务状态</div>
                <div className="isv-detail-zone-item-value">
                  <span>{serveStatus === 0 ? "未确认" : "已确认"}</span>
                  <Button colors="primary" className="confirm-btn" onClick={this.onClick}>服务确认</Button></div>
              </div>
            </div>


            <div className="isv-detail-zone">
              <div className="isv-detail-zone-row">
                <img className="isv-detail-zone-svg" src={DateImg} />
                <div className="isv-detail-zone-header">开通日志</div>
              </div>
              {this.renderMsg(openMsg)}
            </div>
          </div>
        </Content>
      </Fragment>
    )
  }

  /** 服务确认 */
  onClick = () => {
    let { agreementNum } = this.state;
    fetch(myapi.BASE_URL + `/market/yonyoucloud/operator/confirm/${agreementNum}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        // 'Access-Control-Allow-Credentials': 'true',
        // 'Access-Control-Allow-Headers': 'X-Requested-With',
        // 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        // 'Access-Control-Allow-Origin': '*',
      },
      credentials: "include"
    })
      .then(res => res.json())
      .then((response) => {
        if (response.status === 1) {
          Message.create({ content: '服务确认成功', color: 'success' });
          this.componentDidMount()
        } else {
          Message.create({ content: response.msg, color: 'danger' });
        }
      })
  }
  /** 支付确认 */
  payConfirm = () => {
    let { agreementNum } = this.state;
    fetch(myapi.BASE_URL + `/market/yonyoucloud/confirmPayment/${agreementNum}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        // 'Access-Control-Allow-Credentials': 'true',
        // 'Access-Control-Allow-Headers': 'X-Requested-With',
        // 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        // 'Access-Control-Allow-Origin': '*',
      },
      credentials: "include"
    })
      .then(res => res.json())
      .then((response) => {
        if (response.status === 1) {
          Message.create({ content: '支付确认成功', color: 'success' });
          this.componentDidMount()
        } else {
          Message.create({ content: response.msg, color: 'danger' });
        }
      })
  }
}
export default withRouter(OrderDetail)
