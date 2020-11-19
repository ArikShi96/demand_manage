import { FormControl, Select, Table, Pagination } from "tinper-bee";
import DatePicker from 'bee-datepicker'
import styled from 'styled-components';
import React, { Fragment } from "react";
import "bee-form-control/build/FormControl.css";
import "bee-datepicker/build/DatePicker.css";
import "bee-button/build/Button.css";
import "bee-select/build/Select.css";
import "bee-table/build/Table.css";
import "bee-pagination/build/Pagination.css";
import "bee-tabs/build/Tabs.css";
import Header from "../common/Header";
import Content from "../common/Content";
import FormList from "../common/Form";
import SearchPanel from "../common/SearchPanel";
import makeAjaxRequest from '../../util/request';
import { message } from 'antd';
const { RangePicker } = DatePicker;
const format = "YYYY-MM-DD";
const Option = Select.Option;
class RecommendHome extends React.Component {
  state = {
    dataSource: {
      content: [],
      total: 0, // 总数量
      items: 0, // 总页数
      activePage: 1, // 当前页面
      size: 10, // 每页多少
    },
    select_time: '',
    start_time: '',
    end_time: '',
    isv_name: '',
    status: '',
  };

  columns = [
    {
      title: "序号",
      dataIndex: "order",
      width: "10%",
    },
    {
      title: "商家名称",
      dataIndex: "user_name",
      width: "15%",
    },
    {
      title: "申请时间",
      dataIndex: "ProductName",
      width: "15%",
    },
    {
      title: "状态",
      dataIndex: "comment",
      width: "10%",
    },
    {
      title: "推荐时间",
      dataIndex: "product_score",
      width: "15%",
    },
    { title: "移除时间", dataIndex: "ip_address", width: "15%" },
    {
      title: "操作",
      dataIndex: "operation",
      width: "20%",
      render: (value, item) => {
        return (
          <div className="actions">
            <a className='action' onClick={this.handleTableAction.bind(null, item, 'view')}>查看</a>
            <a className='action' onClick={this.handleTableAction.bind(null, item, 'view')}>查看</a>
            <a className='action' onClick={this.handleTableAction.bind(null, item, 'delete')}>删除</a>
          </div>
        );
      },
    },
  ];

  componentDidMount() {
    this.searchList();
  }

  changeDate = (d, dataString) => {
    if (dataString && dataString.length > 0) {
      let data = dataString.split('"');
      this.setState({ start_time: data[1], end_time: data[3] });
    } else {
      this.setState({ start_time: '', end_time: '' });
    }
  };

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
    this.setState({ dataSource: { ...this.state.dataSource, size: value, activePage: 1 } }, () => {
      this.searchList();
    });
  };

  /* 重置 */
  resetSearch() {
    this.setState({
      select_time: '',
      start_time: '',
      end_time: '',
      isv_name: '',
      status: '',
    }, () => {
      this.searchList();
    });
  }

  /* 搜索 */
  searchList = async () => {
    try {
      const {
        select_time,
        start_time,
        end_time,
        isv_name,
        status,
        dataSource
      } = this.state;
      const { activePage, size } = dataSource;
      const res = await makeAjaxRequest('/index/activity/getListOperates', 'get', {
        page_num: activePage,
        select_time,
        start_time,
        end_time,
        isv_name,
        status,
      });
      res.data.forEach((item, index) => {
        item.order = (index + 1)
      })
      this.setState({
        dataSource: {
          ...this.state.dataSource,
          content: res.data,
          total: res.sum || 0,
          items: Math.floor((res.sum || 0) / this.state.dataSource.size) + 1
        }
      });
    } catch (err) {
      message.error(err.message);
    }
  };

  /* 查看/隐藏/删除 */
  handleTableAction = async (item, action) => {
    switch (action) {
      case 'view': {
        this.props.history.push(`/RecommendHomeDetail/${item.id}`);
      }
      case 'toggle': {
        try {
          await makeAjaxRequest('/newcomment/hide', 'get', { q_manage_id: item.qManageId });
        } catch (err) {
          message.error(err.message);
        }
      }
      case 'delete': {
        try {
          await makeAjaxRequest('/newcomment/dele', 'get', { q_manage_id: item.qManageId });
        } catch (err) {
          message.error(err.message);
        }
      }
    }
  }

  render() {
    const {
      select_time,
      start_time,
      end_time,
      isv_name,
      status,
      dataSource,
    } = this.state;
    const { activePage, size, content, total, items } = dataSource;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="首页活动推荐" />
        <Content className={this.props.className} style={{ width: "100%", overflowX: "auto" }}>
          <SearchPanel
            reset={this.resetSearch.bind(this)}
            search={this.searchList.bind(this)}
          >
            <FormList layoutOpt={{ md: 4, xs: 4 }}>
              <FormList.Item className='time-select-wrap' label="" labelCol={0}>
                <div className='time-select'>
                  <Select
                    placeholder=""
                    className="search-item"
                    onChange={this.handleChange.bind(null, "select_time")}
                    value={select_time}
                  >
                    {[
                      { id: "1", stat: "申请时间" },
                      { id: "2", stat: "推荐时间" },
                      { id: "3", stat: "移除时间" }].map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.stat}
                        </Option>
                      ))}
                  </Select>
                  <RangePicker
                    showClear={true}
                    className="search-item"
                    placeholder={'开始时间 ~ 结束时间'}
                    format={format}
                    onChange={this.changeDate}
                  />
                </div>
              </FormList.Item>
              <FormList.Item label="商家名称" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={isv_name}
                  onChange={this.handleChange.bind(null, "isv_name")}
                />
              </FormList.Item>
              <FormList.Item label="" labelCol={100}>
                <Select
                  placeholder="请选择审核状态"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "status")}
                  value={status}
                >
                  {[
                    { id: "1", stat: "待审核" },
                    { id: "2", stat: "已通过" },
                    { id: "3", stat: "已拒绝" },
                    { id: "0", stat: "已移除" }].map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.stat}
                      </Option>
                    ))}
                </Select>
              </FormList.Item>
            </FormList>
          </SearchPanel>
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
        </Content>
      </Fragment>
    );
  }
}

export default styled(RecommendHome)`
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
.time-select {
  display: flex;
}
`;
