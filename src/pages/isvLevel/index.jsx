import { Table, Button } from "tinper-bee";
import styled from 'styled-components';
import React, { Fragment } from "react";
import "bee-form-control/build/FormControl.css";
import "bee-datepicker/build/DatePicker.css";
import "bee-button/build/Button.css";
import "bee-select/build/Select.css";
import "bee-table/build/Table.css";
import "bee-pagination/build/Pagination.css";
import "bee-tabs/build/Tabs.css";
import { Input } from 'antd';
import Header from "../common/Header";
import Content from "../common/Content";
import makeAjaxRequest from '../../util/request';
import { message } from 'antd';
class IsvLevel extends React.Component {
  state = {
    dataSource: {
      content: [{}],
      total: 0, // 总数量
      items: 0, // 总页数
      activePage: 1, // 当前页面
      pageSize: 10, // 每页多少
    },
    formData: {}
  };

  columns = [
    {
      title: "等级",
      dataIndex: "aa",
      width: "10%",
    },
    {
      title: "等级名称",
      dataIndex: "bb",
      width: "30%",
    },
    {
      title: "图标",
      dataIndex: "cc",
      width: "20%",
    },
    {
      title: "等级分范围",
      dataIndex: "range",
      width: "20%",
      render: (value, item) => {
        return (
          <div className='range-wrap'>
            <Input value={item['dd']} /> <span className='divider'></span> <Input value={item['ee']} />
          </div>
        );
      }
    },
  ];

  componentDidMount() {
    this.searchList();
  }

  handleChange = (type, e) => {
    this.setState({
      [type]: e,
    });
  };

  // 分页
  handleSelect = (activePage) => { // page, pageSize
    this.setState({ dataSource: { ...this.state.dataSource, activePage } }, () => {
      this.searchList();
    });
  };

  dataNumSelect = (index, value) => {
    this.setState({ dataSource: { ...this.state.dataSource, pageSize: value, activePage: 1 } }, () => {
      this.searchList();
    });
  };

  /* 搜索 */
  searchList = async () => {
    try {
      const {
        dataSource
      } = this.state;
      const { activePage } = dataSource;
      const res = await makeAjaxRequest('/index/recommendisv/List', 'get', {
        page_num: activePage,
      });
      this.setState({
        dataSource: {
          ...this.state.dataSource,
          content: res.data,
          total: res.sum || 0,
          items: Math.floor((res.sum || 0) / this.state.dataSource.pageSize) + 1
        }
      });
    } catch (err) {
      message.error(err.message);
    }
  };

  submit = async () => {
    try {
      await makeAjaxRequest('/', 'get', {});
    } catch (err) {
      message.error(err.message);
    }
  }

  render() {
    const {
      dataSource,
    } = this.state;
    const { content } = dataSource;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="等级管理" />
        <Content className={this.props.className} style={{ width: "100%", overflowX: "auto", padding: "40px 80px" }}>
          <div className='action-wrap'>
            <Button colors="primary" onClick={this.submit}>保存</Button>
          </div>
          <div className='content-wrap'>
            <Table rowKey="order" columns={this.columns} data={content} />
          </div>
          <div className='tip-wrap'>
            积分规则说明：
            <br />
            1、店铺的每个销量+1分；每次退货—2分；
            <br />
            2、店铺销售产品的每个好评+2分；中评+1分；差评—2分；
            <br />
            3、每个月有3场直播以上+5分；
          </div>
        </Content>
      </Fragment>
    );
  }
}

export default styled(IsvLevel)`
.u-table .u-table-thead th {
  text-align: center;
}
.u-table .u-table-tbody td {
  text-align: center;
}
.u-table .u-table-tbody .actions .action{
  margin: 0 10px;
}
.action-wrap {
  text-align: right;
  padding: 20px;
}
.content-wrap {
  padding: 20px;
}
.tip-wrap {
  padding: 20px;
}
.pagination-wrap {
  margin-top: 40px;
  text-align: center;
}
.time-select {
  display: flex;
}
.range-wrap{
  display: flex;
  align-items: center;
  .ant-input {
    width: 30%;
    margin: 0 8%;
  }
  .divider {
    width: 5%;
    height: 1px;
    background-color: #ccc;
  }
}
`;
