import React from "react";
import styled from 'styled-components';
import { Button, Tabs } from 'tinper-bee';
import Header from "../common/Header";
import Content from '../common/Content';
import "bee-button/build/Button.css";
import { FormControl, Table, Pagination } from "tinper-bee";
import "bee-form-control/build/FormControl.css";
import "bee-datepicker/build/DatePicker.css";
import "bee-button/build/Button.css";
import "bee-select/build/Select.css";
import "bee-table/build/Table.css";
import "bee-pagination/build/Pagination.css";
import "bee-tabs/build/Tabs.css";
import makeAjaxRequest from '../../util/request';
import { message } from 'antd';
const TabPane = Tabs.TabPane;
class SettingCom extends React.Component {
  state = {
    activeTabKey: '0',
    comment_set: '',
    dataSource: {
      content: [],
      total: 0, // 总数量
      items: 0, // 总页数
      activePage: 1, // 当前页面
      size: 10, // 每页多少
    },
  };

  columns = [
    {
      title: "敏感词名称",
      dataIndex: "name",
      width: "50%",
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      width: "30%",
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: "20%",
      render: (value, item) => {
        return (
          <div className="actions">
            <a className='action' onClick={this.handleTableAction.bind(null, item, 'edit')}>编辑</a>
            <a className='action' onClick={this.handleTableAction.bind(null, item, 'delete')}>删除</a>
          </div>
        );
      },
    },
  ];

  componentDidMount() {
    this.fetchDetail();
  }

  fetchDetail = async () => {
    try {
      const res = await makeAjaxRequest('/newcomment/editQCS', 'POST');
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

  handleTabChange = (key) => {
    this.setState({ activeTabKey: key });
  }

  // 分页
  handleSelect = (activePage) => { // page, pageSize
    this.setState({ dataSource: { ...this.state.dataSource, activePage } }, () => {
      this.searchList();
    });
  };

  dataNumSelect = (index, value) => {
    this.setState({ dataSource: { ...this.state.dataSource, size: value, activePage: 1 } }, () => {
      this.searchList();
    });
  }; v

  render() {
    const { className } = this.props;
    const { comment_set, dataSource } = this.state;
    const { content, activePage, total, items } = dataSource;
    return (
      <div className={className}>
        <Header title="评价设置" />
        <Content style={{ width: '100%', overflowX: 'auto' }}>
          <Tabs
            ref="tabs"
            activeKey={this.state.activeTabKey}
            onChange={this.handleTabChange}
            tabBarStyle="upborder"
          >
            <TabPane tab="基本设置" key="0">
              <div className='detail-wrap'>
                <div className='label'>
                  <span>晒单/评价有效期</span>
                </div>
                <div className='content'>
                  <FormControl className="search-item"
                    value={comment_set}
                    onChange={this.handleChange.bind(null, "comment_set")}
                  />
                </div>
              </div>
              <div className='action-wrap'>
                <Button colors="primary" onClick={this.submit}>提交</Button>
              </div>
            </TabPane>
            <TabPane tab="敏感词" key="1">
              <Table rowKey="order" columns={this.columns} data={content} />
              <Pagination
                first
                last
                prev
                next
                maxButtons={5}
                dataNumSelect={["10"]}
                dataNum={0}
                boundaryLinks
                showJump={true}
                noBorder={true}
                activePage={activePage}
                onSelect={this.handleSelect}
                onDataNumSelect={this.dataNumSelect}
                total={total}
                items={items}
              />
            </TabPane>
          </Tabs>
        </Content>

      </div>
    );
  }
}

export default styled(SettingCom)`
.mix-ma-page-header {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 0;
}
.content-con-wrap{
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
  margin-top: 40px;
}
.u-table .u-table-thead th {
  text-align: center;
}
.u-table .u-table-tbody td {
  text-align: center;
}
.u-table .u-table-tbody .actions .action{
  margin: 0 10px;
}
.pagination-wrap {
  margin-top:40px;
  text-align: center;
}
`;
