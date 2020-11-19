import React from "react";
import styled from 'styled-components';
import { Button } from 'tinper-bee';
import Header from "../common/Header";
import "bee-button/build/Button.css";
import makeAjaxRequest from '../../util/request';
import { message } from 'antd';
class QuestionDetail extends React.Component {
  state = {
    detail: {},
    reply: ""
  };

  componentDidMount() {
    this.fetchDetail();
  }

  fetchDetail = async () => {
    try {
      const res = await makeAjaxRequest('/question/findOperateOne', 'get', { q_manage_id: this.props.match.params.id });
      this.setState({
        detail: res.data,
        reply: res.data2 || ""
      });
    } catch (err) {
      message.error(err.message);
    }
  }

  navigateBack = () => {
    this.props.history.push(`/QuestionList`);
  }

  render() {
    const { detail, reply } = this.state;
    const { className } = this.props;
    return (
      <div className={className}>
        <Header title="问答详情" />
        <div className='detail-wrap'>
          <div className='label'>问答类型</div>
          <div className='content'>{detail.questionType === 0 || detail.questionType === '0' ? '商品问答' : '店铺问答'}</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>相关商品</div>
          <div className='content'>{detail.productName}</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>提问时间</div>
          <div className='content'>{detail.askTime}</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>问题详情</div>
          <div className='content'>{detail.question}</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>回答</div>
          <div className='content'>{reply}</div>
        </div>
        <div className='action-wrap'>
          <Button colors="primary" onClick={this.navigateBack}>返回</Button>
        </div>
      </div>
    );
  }
}

export default styled(QuestionDetail)`
.mix-ma-page-header {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  margin-bottom: 40px;
  padding: 0;
}
.detail-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 0 60px;
  margin-bottom: 40px;
  .label {
    text-align: right;
    min-width: 80px;
    flex-shrink: 0;
    margin-right: 5%;
  }
  .content {
    flex: auto;
  }
}
.action-wrap {
  text-align: center;
  margin: 40px auto;
}
`;
