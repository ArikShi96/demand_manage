import React from "react";
import styled from 'styled-components';
import { Button } from 'tinper-bee';
import Header from "../common/Header";
import "bee-button/build/Button.css";
import { message, Card, Progress, Tag } from 'antd';
import makeAjaxRequest from '../../util/request';

class QuestionDetail extends React.Component {
  state = {
    status: '',
    index_activity_id: ""
  };

  componentDidMount() {
    debugger
    this.fetchDetail();
  }

  fetchDetail = async () => {
    try {
      const res = await makeAjaxRequest('/index/activity/getOperateStore', 'get', { isv_id: this.props.match.params.id });
      this.setState({
        ...res,
        status: (new URLSearchParams(this.props.location.search)).get('status') || '',
        index_activity_id: (new URLSearchParams(this.props.location.search)).get('index_activity_id') || ''
      });
    } catch (err) {
      message.error(err.message);
    }
  }

  navigateBack = () => {
    this.props.history.push(`/RecommendHome`);
  }

  submit = async () => {
    try {
      await makeAjaxRequest('/index/activity/operatePass', 'get', { index_activity_id: this.state.index_activity_id, status: 2 });
      message.success('操作成功');
      this.fetchDetail();
    } catch (err) {
      message.error(err.message);
    }
  }

  reject = async () => {
    try {
      await makeAjaxRequest('/index/activity/operatePass', 'get', { index_activity_id: this.state.index_activity_id, status: 3 });
      message.success('操作成功');
    } catch (err) {
      message.error(err.message);
    }
  }

  render() {
    const { data, data_other, status } = this.state;
    const { className } = this.props;
    return (
      <div className={className}>
        <Header title="首页活动推荐" />
        {data && <div className='card-wrap'>
          <Card style={{ width: '48%' }}>
            <div className='info-row'>
              <div className="label">商家名称:</div>
              <div className="content">{data.name}</div>
            </div>
            <div className='info-row'>
              <div className="label">入驻时长:</div>
              <div className="content">{data.createnyr}</div>
            </div>
            <div className='info-row'>
              <div className="label">店铺评分:</div>
              <div className="content">
                {`交付速度 ${data.speedScore} 交付质量 ${data.qualityScore} 商家服务 ${data.attitudeScore}`}
              </div>
            </div>
            <div className='info-row'>
              <div className="label">服务商等级:</div>
              <div className="content">
                <img src={data.grade_icon} className='grade-icon' alt="" />
                <span>{data.grade_name}</span>
                <Progress percent={(parseInt(data.points_start) / parseInt(data.points_end).toFixed(2) * 100)} />
              </div>
            </div>
            <div className='info-row'>
              <div className="label">店铺标签:</div>
              <div className="content">
                {(data.label || "").split(",").map(la => (
                  <Tag color="blue">{la}</Tag>
                ))}
              </div>
            </div>
            <div className='info-row'>
              <div className="label">店铺简介:</div>
              <div className="content">{data.brief}</div>
            </div>
            <div className='info-row'>
              <div className="label">客服在线时间:</div>
              <div className="content">{data.onlineTime}</div>
            </div>
            <div className='info-row'>
              <div className="label">400电话:</div>
              <div className="content">{data.tele_400}</div>
            </div>
            <div className='info-row'>
              <div className="label">客服邮箱</div>
              <div className="content">{data.email}</div>
            </div>
            <div className='info-row'>
              <div className="label">联系电话</div>
              <div className="content">{data.hotline}</div>
            </div>
          </Card>
          <Card style={{ width: '48%' }}>
            <div className='info-row right'>
              <div className="label">订单量</div>
              <div className="content">{data_other.count_order}</div>
              <div className="label">近30日新增</div>
              <div className="content">{data_other.count_yesterday_order}</div>
            </div>
            <div className='info-row right'>
              <div className="label">访问量</div>
              <div className="content">{data_other.count_visit}</div>
              <div className="label">昨日新增</div>
              <div className="content">{data_other.count_yesterday_visit}</div>
            </div>
            <div className='info-row right'>
              <div className="label">收藏量</div>
              <div className="content">{data_other.count_collection}</div>
              <div className="label">昨日新增</div>
              <div className="content">{data_other.count_yesterday_collection}</div>
            </div>
          </Card>
        </div>
        }
        <div className='action-wrap'>
          <Button colors="primary" onClick={this.navigateBack}>返回</Button>
          <Button colors="primary" onClick={this.submit}>审核通过</Button>
          <Button colors="primary" onClick={this.reject}>审核拒绝</Button>
          {/* {status === '1' && <Button colors="primary" onClick={this.submit}>审核通过</Button>}
          {status === '1' && <Button colors="primary" onClick={this.reject}>审核拒绝</Button>} */}
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
.card-wrap {
  display: flex;
  justify-content: space-around;
  .info-row {
    margin: 20px 0;
    display: flex;
    align-items: flex-start;
    .label {
      width: 120px;
      flex-shrink: 0;
      margin-right: 10px;
    }
    .content {
      .grade-icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
      .ant-progress {
        display: inline-block;
        width: 200px;
        margin-left: 10px;
      }
    }
    &.right {
      margin-bottom: 40px;
      .content {
        margin-right: 40px;
      }
    }
  }
}
.action-wrap {
  text-align: center;
  margin: 40px auto;
  .u-button {
    margin: 0 20px;
  }
}
`;
