import React from "react";
import styled from 'styled-components';
import { Button } from 'tinper-bee';
import Header from "../common/Header";
import "bee-button/build/Button.css";
import { message, Tag, Card } from 'antd';
import makeAjaxRequest from '../../util/request';
class QuestionDetail extends React.Component {
  state = {
    detail: {}
  };

  componentDidMount() {
    this.fetchDetail();
  }

  fetchDetail = () => { }

  navigateBack = () => {
    this.props.history.push(`/FullReduction`);
  }

  submit = async () => {
    try {
      await makeAjaxRequest('/index/activity/operatePass', 'get', { index_activity_id: this.props.match.params.id });
      message.success('操作成功');
      this.fetchDetail();
    } catch (err) {
      message.error(err.message);
    }
  }

  reject = async () => {
    try {
      await makeAjaxRequest('/index/activity/operateReject', 'get', { index_activity_id: this.props.match.params.id });
      message.success('操作成功');
    } catch (err) {
      message.error(err.message);
    }
  }

  render() {
    const { detail } = this.state;
    const { className } = this.props;
    return (
      <div className={className}>
        <Header title="详情" />
        {/* 活动信息 */}
        <div className="section-title">
          <Tag color="red">活动信息</Tag>
        </div>
        <div className='detail-wrap'>
          <div className='label'>问答类型</div>
          <div className='content'>123</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>问答类型</div>
          <div className='content'>123</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>相关商品</div>
          <div className='content'>123</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>提问时间</div>
          <div className='content'>123</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>问题详情</div>
          <div className='content'>123</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>回答</div>
          <div className='content'>123</div>
        </div>
        {/* 活动信息 */}
        <div className="section-title">
          <Tag color="red">活动信息</Tag>
        </div>
        <div className='detail-wrap'>
          <div className='label'>问题详情</div>
          <div className='content'>123</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>回答</div>
          <div className='content'>123</div>
        </div>
        {/* 商品信息 */}
        <div className="section-title">
          <Tag color="red">商品信息</Tag>
        </div>
        <div className='card-wrap'>
          <Card
            style={{ width: 240 }}
            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
          >
            <div className='card-title'>商品名名称</div>
            <div className='card-price'>0.00</div>
          </Card>
          <Card
            style={{ width: 240 }}
            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
          >
            <div className='card-title'>商品名名称</div>
            <div className='card-price'>0.00</div>
          </Card>
        </div>
        <div className='action-wrap'>
          <Button colors="primary" onClick={this.navigateBack}>返回</Button>
          <Button colors="primary" onClick={this.submit} style={{ margin: "0 40px" }}>通过</Button>
          <Button colors="primary" onClick={this.reject}>拒绝</Button>
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
  margin-bottom: 20px;
  padding: 0;
}
.section-title {
  padding: 0 60px;
  margin: 20px 0;
}
.detail-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 0 60px;
  margin-bottom: 20px;
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
.card-wrap {
  display: flex;
  align-items: center;
  padding: 0 60px;
  flex-wrap: wrap;
  .ant-card{
    margin: 0 20px 20px;
  }
}
`;
