import React from "react";
import styled from 'styled-components';
import { Button } from 'tinper-bee';
import Header from "../common/Header";
import "bee-button/build/Button.css";
import { message, Tag, Card } from 'antd';
import makeAjaxRequest from '../../util/request';
class QuestionDetail extends React.Component {
  state = {
    detail: {
      activityDto: {}
    }
  };

  componentDidMount() {
    this.fetchDetail();
  }

  fetchDetail = async () => {
    const res = await makeAjaxRequest('/activity/getOperateActivityinfo', 'get', { activity_id: this.props.match.params.id });
    this.setState({ detail: res.data });
  }

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

  getRuleList = () => {
    if (this.state.detail.couponDtoList) {
      return this.state.detail.couponDtoList.map(rule => {
        return `满${rule.limitMoney}减${rule.couponMoney}`
      }).join(",")
    } else {
      return ""
    }
  }

  render() {
    const { detail } = this.state;
    const { activityDto } = detail;
    const { className } = this.props;
    return (
      <div div className={className} >
        <Header title="详情" />
        {/* 活动信息 */}
        <div className="section-title">
          <Tag color="red">活动信息</Tag>
        </div>
        <div className='detail-wrap'>
          <div className='label'>活动名称</div>
          <div className='content'>{activityDto.activityName}</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>活动描述</div>
          <div className='content'>{activityDto.remarks}</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>报名时间</div>
          <div className='content'>{`${activityDto.activityJoinStart} 至 ${activityDto.activityJoinEnd}`}</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>活动时间</div>
          <div className='content'>{`${activityDto.activityDateStart} 至 ${activityDto.activityDateEnd}`}</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>活动范围</div>
          {/* TODO 暂时全品类 */}
          <div className='content'>全品类</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>活动规则</div>
          <div className='content'>{this.getRuleList()}</div>
        </div>
        {/* 店铺信息 */}
        <div className="section-title">
          <Tag color="red">店铺信息</Tag>
        </div>
        <div className='detail-wrap'>
          <div className='label'>店铺名称</div>
          <div className='content'></div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>报名时间</div>
          <div className='content'></div>
        </div>
        {/* 商品信息 */}
        <div className="section-title">
          <Tag color="red">商品信息</Tag>
        </div>
        <div className='card-wrap'>
          <Card
            style={{ width: 240 }}
          // cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
          >
            <div className='card-title'>商品名称</div>
            <div className='card-price'>0.00</div>
          </Card>
          <Card
            style={{ width: 240 }}
          // cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
          >
            <div className='card-title'>商品名称</div>
            <div className='card-price'>0.00</div>
          </Card>
        </div>
        <div className='action-wrap'>
          <Button colors="primary" onClick={this.navigateBack}>返回</Button>
          {/* <Button colors="primary" onClick={this.submit} style={{ margin: "0 40px" }}>通过</Button>
          <Button colors="primary" onClick={this.reject}>拒绝</Button> */}
        </div>
      </div >
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
