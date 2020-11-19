import React from "react";
import styled from 'styled-components';
import { Button } from 'tinper-bee';
import Header from "../common/Header";
import "bee-button/build/Button.css";
import makeAjaxRequest from '../../util/request';
import { message } from 'antd';
class ProductComDetail extends React.Component {
  state = {
    detail: {}
  };

  componentDidMount() {
    this.fetchDetail();
  }

  fetchDetail = async () => {
    try {
      const res = await makeAjaxRequest('/newcomment/findOne', 'get', { id: this.props.match.params.id });
      this.setState({
        detail: res.data
      });
    } catch (err) {
      message.error(err.message);
    }
  }
  navigateBack = () => {
    this.props.history.push(`/ProductCom`);
  }

  render() {
    const { detail } = this.state;
    const { className } = this.props;
    return (
      <div className={className}>
        <Header title="商品评价" />
        {detail.id && <div className='detail-wrap'>
          <div className='comment-info'>
            {`${detail.userName}于${new Date(detail.createTime).toLocaleString()}对${detail.productName}发表评论`}
          </div>
          <div className='origin'>{`来源：订单 ${detail.orderId || ''}`}</div>
          <div className='divider'></div>
          <div className='comment-content'>{detail.comment}</div>
          <div className='divider'></div>
          <div className='reply-info'>{`${detail.operatorName || ''} 于 2020-04-26 17:43:11 回复`}</div>
          <div className='comment-content'>{`回复内容: ${detail.reply || ''}`}</div>
        </div>
        }
        <div className='action-wrap'>
          <Button colors="primary" onClick={this.navigateBack}>返回</Button>
        </div>
      </div>
    );
  }
}

export default styled(ProductComDetail)`
.mix-ma-page-header {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  margin-bottom: 40px;
  padding: 0;
}
.detail-wrap {
  position: relative;
  padding: 20px;
  background-color: #ffffff;
  & > div {
    margin: 20px 0;
  }
  .divider {
    height: 1px;
    background-color: #cccccc;
  }
}
.action-wrap {
  text-align: center;
  margin: 40px auto;
}
`;
