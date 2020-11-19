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
import { message } from 'antd';
import { Checkbox } from 'antd';
class IntegralManager extends React.Component {
  state = {
    home_title: '',
    home_keywords: '',
    home_description: '',
    first_title: '',
    first_keywords: '',
    first_description: '',
    second_title: '',
    second_keywords: '',
    second_description: ''
  };

  componentDidMount() {
    this.fetchDetail();
  }

  fetchDetail = async () => {
    try {
      const res = await makeAjaxRequest('/index/kw/getall', 'post');
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

  submit = async () => {
    try {
      const {
        home_title,
        home_keywords,
        home_description,
        first_title,
        first_keywords,
        first_description,
        second_title,
        second_keywords,
        second_description
      } = this.state;
      await makeAjaxRequest('/index/kw/save', 'post', {
        home_title,
        home_keywords,
        home_description,
        first_title,
        first_keywords,
        first_description,
        second_title,
        second_keywords,
        second_description
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
      home_title,
      home_keywords,
      home_description,
      first_title,
      first_keywords,
      first_description,
      second_title,
      second_keywords,
      second_description
    } = this.state;
    return (
      <div className={className}>
        <Header title="关键词策略" />
        {/* 云市场首页关键词策略 */}
        <div className='detail-title'>云市场首页关键词策略</div>
        <div className='detail-wrap'>
          <div className='label'>title</div>
          <div className='content'>
            <FormControl className="search-item"
              value={home_title}
              onChange={this.handleChange.bind(null, "home_title")}
            />
          </div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>
            <span>keywords</span>
          </div>
          <div className='content'>
            <FormControl className="search-item"
              value={home_keywords}
              onChange={this.handleChange.bind(null, "home_keywords")}
            />
          </div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>description</div>
          <div className='content'>
            <FormControl className="search-item"
              value={home_description}
              onChange={this.handleChange.bind(null, "home_description")}
            />
          </div>
        </div>
        {/* 一级栏目页关键词策略 */}
        <div className='detail-title'>一级栏目页关键词策略</div>
        <div className='detail-wrap'>
          <div className='label'>title</div>
          <div className='content'>
            <FormControl className="search-item"
              value={first_title}
              onChange={this.handleChange.bind(null, "first_title")}
            />
          </div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>
            <span>keywords</span>
          </div>
          <div className='content'>
            <FormControl className="search-item"
              value={first_keywords}
              onChange={this.handleChange.bind(null, "first_keywords")}
            />
          </div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>description</div>
          <div className='content'>
            <FormControl className="search-item"
              value={first_description}
              onChange={this.handleChange.bind(null, "first_description")}
            />
          </div>
        </div>
        {/* 二级栏目页关键词策略 */}
        <div className='detail-title'>二级栏目页关键词策略</div>
        <div className='detail-wrap'>
          <div className='label'>title</div>
          <div className='content'>
            <FormControl className="search-item"
              value={second_title}
              onChange={this.handleChange.bind(null, "second_title")}
            />
          </div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>
            <span>keywords</span>
          </div>
          <div className='content'>
            <FormControl className="search-item"
              value={second_keywords}
              onChange={this.handleChange.bind(null, "second_keywords")}
            />
          </div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>description</div>
          <div className='content'>
            <FormControl className="search-item"
              value={second_description}
              onChange={this.handleChange.bind(null, "second_description")}
            />
          </div>
        </div>
        <div className='action-wrap'>
          <Button colors="primary" onClick={this.submit}>保存</Button>
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
.detail-title {
  color: #000;
  font-weight: bold;
  padding: 0 40px 40px;
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
