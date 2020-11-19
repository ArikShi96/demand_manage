import { FormControl, Select, Button } from "tinper-bee";
import React, { Fragment } from "react";
import styled from 'styled-components';
import "bee-form-control/build/FormControl.css";
import "bee-datepicker/build/DatePicker.css";
import "bee-button/build/Button.css";
import "bee-select/build/Select.css";
import "bee-table/build/Table.css";
import "bee-pagination/build/Pagination.css";
import "bee-tabs/build/Tabs.css";
import Header from "../common/Header";
import Content from "../common/Content";

class RecommendFooter extends React.Component {
  state = {
  };

  columns = [
    {
      title: "编号",
      dataIndex: "order",
      key: "agreementNum",
      width: "5%",
    },
    {
      title: "问题描述",
      dataIndex: "productName",
      key: "productName",
      width: "20%",
    },
    {
      title: "类型",
      dataIndex: "isvName",
      key: "isvName",
      width: "8%",
    },
    {
      title: "服务商",
      dataIndex: "operatorName",
      key: "operatorName",
      width: "8%",
    },
    {
      title: "商品名称",
      dataIndex: "originalPrice",
      key: "originalPrice",
      width: "8%",
    },
    { title: "提问时间", dataIndex: "discount", key: "discount", width: "15%" },
    { title: "问题状态", dataIndex: "payMode", key: "payMode", width: "8%" },
    {
      title: "展示状态",
      dataIndex: "busiAmount",
      key: "busiAmount",
      width: "8%",
    },
    {
      title: "操作",
      dataIndex: "commitTime",
      key: "commitTime",
      width: "20%",
      render: (value) => {
        return value ? (
          <div>
            <a>查看</a>
            <a>隐藏</a>
            <a>删除</a>
          </div>
        ) : null;
      },
    },
  ];

  componentDidMount() {
    this.fetchDetail();
  }

  handleChange = (type, e) => {
    this.setState({
      [type]: e,
    });
  };

  /* 搜索 */
  fetchDetail = () => { };

  render() {
    const { aaa, bbb, ccc, ddd } = this.state;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="底部信息管理" />
        <Content className={this.props.className} style={{ width: "100%", overflowX: "auto" }}>
          <div className='footer-wrap'>
            <div className='label'>底部信息</div>
            <FormControl
              className="input-item"
              value={aaa}
              onChange={this.handleChange.bind(null, "aaa")}
            />
            <FormControl
              className="input-item"
              value={bbb}
              onChange={this.handleChange.bind(null, "bbb")}
            />
            <FormControl
              className="input-item"
              value={ccc}
              onChange={this.handleChange.bind(null, "ccc")}
            />
            <img className='image' src="https://d1icd6shlvmxi6.cloudfront.net/gsc/CZA62A/18/84/7e/18847e0fb47244b881430a4c08bc7e42/images/底部信息管理/u3672.png?token=340f0ded576ab2181dc98746b0eb01c048b40079dcbbdb1beaa9235f5e7e25fb" alt="" />
            <FormControl
              className="input-item"
              value={ddd}
              onChange={this.handleChange.bind(null, "ddd")}
            />
          </div>
          <div className='action-wrap'>
            <Button colors="primary" onClick={this.showAdd}>保存</Button>
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
