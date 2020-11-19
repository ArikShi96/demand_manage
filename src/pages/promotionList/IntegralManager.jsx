import React from "react";
import styled from 'styled-components';
import { Button } from 'tinper-bee';
import Header from "../common/Header";
import "bee-button/build/Button.css";
import { FormControl } from "tinper-bee";
import "bee-form-control/build/FormControl.css";
import "bee-button/build/Button.css";
import "bee-select/build/Select.css";
import "bee-table/build/Table.css";
import "bee-pagination/build/Pagination.css";
import "bee-tabs/build/Tabs.css";
import makeAjaxRequest from '../../util/request';
import { message, Radio, Checkbox } from 'antd';
class IntegralManager extends React.Component {
  state = {
    newUserPoints: '',
    isTime: '',
    isTimeStr: '',
    loginPoints: '',
    pointsProportion: '',
    pointsCommentNum: '',
    pointsComment: ''
  };

  componentDidMount() {
    this.fetchDetail();
  }

  fetchDetail = async () => {
    try {
      const res = await makeAjaxRequest('/isvpoints/editQuery', 'get');
      this.setState({
        ...res.data
      });
    } catch (err) {
      message.error(err.message);
    }
  }

  handleChange = (type, e) => {
    this.setState({
      [type]: e,
    });
  };

  handleCheckboxChange = (e) => {
    this.setState({
      isTime: !this.state.isTime
    })
  }

  handleRadioChange = (e) => {
    this.setState({
      radioValue: e.target.value
    })
  }

  submit = async () => {
    try {
      const {
        newUserPoints,
        isTime,
        isTimeStr,
        loginPoints,
        pointsProportion,
        pointsCommentNum,
        pointsComment
      } = this.state;
      await makeAjaxRequest('/isvpoints/editAction', 'post', {}, {
        newUserPoints,
        isTime,
        isTimeStr,
        loginPoints,
        pointsProportion,
        pointsCommentNum,
        pointsComment
      });
    } catch (err) {
      message.error(err.message);
    }
  }

  render() {
    const { className } = this.props;
    const {
      newUserPoints,
      isTime,
      isTimeStr,
      loginPoints,
      pointsProportion,
      pointsCommentNum,
      pointsComment,
      radioValue,
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
            <FormControl className="search-item"
              value={isTimeStr}
              onChange={this.handleChange.bind(null, "isTimeStr")}
            />
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
              value={loginPoints}
              onChange={this.handleChange.bind(null, "loginPoints")}
            />
            <div className='tip'>0或空表示不赠送积分</div>
          </div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>积分比例</div>
          <div className='content'>
            <FormControl className="search-item"
              value={pointsProportion}
              onChange={this.handleChange.bind(null, "pointsProportion")}
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
            <Radio.Group onChange={this.handleRadioChange} value={radioValue}>
              <Radio value={1}>不限</Radio>
              <Radio value={2}>每年</Radio>
              <Radio value={3}>每两年</Radio>
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
