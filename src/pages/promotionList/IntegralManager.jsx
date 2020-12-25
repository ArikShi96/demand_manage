import React from "react";
import styled from 'styled-components';
import { Button } from 'tinper-bee';
import Header from "../common/Header";
import "bee-button/build/Button.css";
import { FormControl } from "tinper-bee";
import DatePicker from 'bee-datepicker'
import "bee-form-control/build/FormControl.css";
import "bee-button/build/Button.css";
import "bee-select/build/Select.css";
import "bee-table/build/Table.css";
import "bee-pagination/build/Pagination.css";
import "bee-tabs/build/Tabs.css";
import makeAjaxRequest from '../../util/request';
import { message, Radio, Checkbox } from 'antd';
import moment from "moment";
const { RangePicker } = DatePicker;
const format = "YYYY-MM-DD";
class IntegralManager extends React.Component {
  state = {
    gradeRuleId: "",
    newUserPoints: '',
    isTime: '',
    isTimeStrLeft: '',
    isTimeStrRight: '',
    loginPoints: '',
    pointsProportionLeft: '',
    pointsProportionRight: '',
    pointsCommentNum: '',
    pointsComment: '',
    clearRules: '',
    sharePoints: '',
    flag: false
  };

  componentDidMount() {
    this.fetchDetail();
  }

  fetchDetail = async () => {
    try {
      const res = await makeAjaxRequest('/isvpoints/editQuery', 'get');
      this.setState({
        ...res.data,
        flag: true,
        isTime: res.data.isTime !== 0 && res.data.isTime !== '0',
        isTimeStrLeft: (res.data.isTimeStr || "").split("~")[0] || "",
        isTimeStrRight: (res.data.isTimeStr || "").split("~")[1] || "",
        pointsProportionLeft: (res.data.pointsProportion || "").split("=")[0] || "",
        pointsProportionRight: (res.data.pointsProportion || "").split("=")[1] || ""
      });
    } catch (err) {
      message.error(err.message);
    }
  }

  changeDate = (moments) => {
    if (moments && moments.length > 0) {
      this.setState({
        isTimeStrLeft: `${moments[0].format('YYYY-MM-DD')} 00:00:00`,
        isTimeStrRight: `${moments[1].format('YYYY-MM-DD')} 00:00:00`
      });
    } else {
      this.setState({ isTimeStrLeft: '', isTimeStrRight: '' });
    }
  };

  handleChange = (type, e) => {
    this.setState({
      [type]: e,
    });
  };

  handleCheckboxChange = () => {
    this.setState({
      isTime: !this.state.isTime
    })
  }

  handleRadioChange = (e) => {
    this.setState({
      clearRules: e.target.value
    })
  }

  submit = async () => {
    try {
      const {
        gradeRuleId,
        newUserPoints,
        isTime,
        isTimeStrLeft,
        isTimeStrRight,
        loginPoints,
        pointsProportionLeft,
        pointsProportionRight,
        pointsCommentNum,
        pointsComment,
        clearRules,
        sharePoints,
      } = this.state;
      await makeAjaxRequest('/isvpoints/editAction', 'post', {
        gradeRuleId,
        newUserPoints,
        isTime: isTime ? '1' : '0',
        isTimeStr: isTimeStrLeft ? `${isTimeStrLeft}~${isTimeStrRight}` : '',
        loginPoints,
        pointsProportion: `${pointsProportionLeft}=${pointsProportionRight}`,
        pointsCommentNum,
        pointsComment,
        clearRules,
        share_points: sharePoints,
      });
      this.fetchDetail();
      message.success('操作成功');
    } catch (err) {
      message.error(err.message);
    }
  }

  render() {
    const { className } = this.props;
    const {
      newUserPoints,
      isTime,
      isTimeStrLeft,
      isTimeStrRight,
      loginPoints,
      pointsProportionLeft,
      pointsProportionRight,
      pointsCommentNum,
      pointsComment,
      clearRules,
      sharePoints,
      flag,
    } = this.state;
    return (
      <div className={className}>
        <Header title="积分设置" />
        <div className='detail-wrap'>
          <div className='label'>新用户注册赠送积分</div>
          <div className='content'>
            <FormControl className="search-item"
              value={newUserPoints}
              onChange={this.handleChange.bind(null, "newUserPoints")}
            />
          </div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>
            <Checkbox onChange={this.handleCheckboxChange} checked={isTime} />
            <span>固定时间注册赠送积分</span>
          </div>
          <div className='content'>
            {flag && <RangePicker
              ref="rangePicker"
              className="search-item"
              placeholder={'开始时间 ~ 结束时间'}
              format={format}
              onChange={this.changeDate}
              style={{ width: 400 }}
              defaultValue={isTimeStrLeft && isTimeStrRight ? [new moment(isTimeStrLeft), new moment(isTimeStrRight)] : []}
            />}
          </div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>登录获得积分</div>
          <div className='content'>
            <FormControl className="search-item"
              value={loginPoints}
              onChange={this.handleChange.bind(null, "loginPoints")}
            />
            <div className='tip'>0或空表示不赠送积分</div>
          </div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>分享获得积分</div>
          <div className='content'>
            <FormControl className="search-item"
              value={sharePoints}
              onChange={this.handleChange.bind(null, "sharePoints")}
            />
            <div className='tip'>0或空表示不赠送积分</div>
          </div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>积分比例</div>
          <div className='content'>
            <FormControl className="search-item"
              value={pointsProportionLeft}
              onChange={this.handleChange.bind(null, "pointsProportionLeft")}
              style={{ width: 200 }}
            />
            <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: 20, height: 32 }}>
              元 =
            </span>
            <FormControl className="search-item"
              value={pointsProportionRight}
              onChange={this.handleChange.bind(null, "pointsProportionRight")}
              style={{ width: 200 }}
            />
          </div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>评价字数大于多少可获得积分</div>
          <div className='content'>
            <FormControl className="search-item"
              value={pointsCommentNum}
              onChange={this.handleChange.bind(null, "pointsCommentNum")}
            />
            <div className='tip'>设置评价字数大于多少可获得积分</div>
          </div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>评价获得积分数</div>
          <div className='content'>
            <FormControl className="search-item"
              value={pointsComment}
              onChange={this.handleChange.bind(null, "pointsComment")}
            />
            <div className='tip'>0或空表示不赠送积分</div>
          </div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>积分清零时间</div>
          <div className='content'>
            <Radio.Group onChange={this.handleRadioChange} value={clearRules}>
              <Radio value={0}>不限</Radio>
              <Radio value={1}>每年</Radio>
              <Radio value={2}>每两年</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className='action-wrap'>
          <Button colors="primary" onClick={this.submit}>提交</Button>
        </div>
      </div>
    );
  }
}

export default styled(IntegralManager)`
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
  align-items: center;
  padding: 0 300px 0 60px;
  margin-bottom: 40px;
  .label {
    text-align: right;
    min-width: 200px;
    flex-shrink: 0;
    margin-right: 5%;
  }
  .content {
    flex: auto;
    position: relative;
    .search-item {
      margin-bottom: 0;
    }
    .tip {
      position: absolute;
      font-size: 14px;
      color: #cccccc;
    }
  }
}
.action-wrap {
  text-align: center;
  margin: 40px auto;
}
`;
