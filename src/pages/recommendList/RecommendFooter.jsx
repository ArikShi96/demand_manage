import { FormControl, Button } from "tinper-bee";
import React, { Fragment } from "react";
import styled from 'styled-components';
import "bee-form-control/build/FormControl.css";
import "bee-button/build/Button.css";
import "bee-select/build/Select.css";
import "bee-table/build/Table.css";
import "bee-pagination/build/Pagination.css";
import "bee-tabs/build/Tabs.css";
import Header from "../common/Header";
import Content from "../common/Content";
import makeAjaxRequest from '../../util/request';
import { message } from 'antd';
class RecommendFooter extends React.Component {
  state = {
    footId: '',
    copyright: '',
    company: '',
    beianhao: '',
    anbei: ''
  };

  componentDidMount() {
    this.fetchDetail();
  }

  handleChange = (type, e) => {
    this.setState({
      [type]: e,
    });
  };

  /* 搜索 */
  fetchDetail = async () => {
    try {
      const res = await makeAjaxRequest('/foot/getOne', 'get', {
      });
      this.setState({
        ...res.data
      })
    } catch (err) {
      message.error(err.message);
    }
  };

  submit = async () => {
    const { footId, copyright, company, beianhao, anbei } = this.state;
    try {
      await makeAjaxRequest('/foot/save', 'post', {
        footId, copyright, company, beianhao, anbei
      });
      message.success('操作成功');
      this.fetchDetail();
    } catch (err) {
      message.error(err.message);
    }
  }

  render() {
    const { copyright, company, beianhao, anbei } = this.state;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="底部信息管理" />
        <Content className={this.props.className} style={{ width: "100%", overflowX: "auto" }}>
          <div className='footer-wrap'>
            <div className='label'>底部信息</div>
            <FormControl
              className="input-item"
              value={copyright}
              onChange={this.handleChange.bind(null, "copyright")}
            />
            <FormControl
              className="input-item"
              value={company}
              onChange={this.handleChange.bind(null, "company")}
            />
            <FormControl
              className="input-item"
              value={beianhao}
              onChange={this.handleChange.bind(null, "beianhao")}
            />
            <img className='image' src="/market/market/dist/images/footer/beianhao.png" alt="" />
            <FormControl
              className="input-item"
              value={anbei}
              onChange={this.handleChange.bind(null, "anbei")}
            />
          </div>
          <div className='action-wrap'>
            <Button colors="primary" onClick={this.submit}>保存</Button>
          </div>
        </Content>
      </Fragment>
    );
  }
}

export default styled(RecommendFooter)`
.footer-wrap {
  display: flex;
  align-items: center;
  padding: 20px 40px;
  .label {
    flex-shrink: 0;
  }
  .image {
    height: 26px;
    width: 26px;
    flex-shrink: 0;
  }
  .input-item {
    margin: 0 20px;
  }
}
.action-wrap {
  text-align: center;
  padding: 20px;
}
`;
