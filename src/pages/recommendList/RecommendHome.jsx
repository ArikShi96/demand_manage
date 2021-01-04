import { FormControl, Select, Table, Pagination, Modal, Button } from "tinper-bee";
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
import { message, Radio } from 'antd';
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
      pageSize: 10, // 每页多少
    },
    select_time: '',
    start_time: '',
    end_time: '',
    isv_name: '',
    status: '',
    formData: {
      dataItem: {},
      allList: []
    }
  };

  columns = [
    {
      title: "序号",
      dataIndex: "order",
      width: "10%",
    },
    {
      title: "商家名称",
      dataIndex: "isvName",
      width: "15%",
    },
    {
      title: "申请时间",
      dataIndex: "applyTime",
      width: "15%",
    },
    {
      title: "状态",
      dataIndex: "status",
      width: "10%",
      render: (value) => {
        return (
          <span>{{ 1: '审核中', 2: '已通过', 3: '已拒绝', 0: '已移除' }[value]}</span>
        )
      }
    },
    {
      title: "推荐时间",
      dataIndex: "recommendTime",
      width: "15%",
    },
    { title: "移除时间", dataIndex: "moveTime", width: "15%" },
    {
      title: "操作",
      dataIndex: "operation",
      width: "20%",
      render: (value, item) => {
        return (
          <div className="actions">
            {
              item.status === 2
              &&
              <a className='action' onClick={this.handleTableAction.bind(null, item, 'delete')}>移除推荐</a>
            }
            <a className='action' onClick={this.handleTableAction.bind(null, item, 'view')}>查看企业信息</a>
            {
              item.status === 2
              &&
              <a className='action' onClick={this.handleTableAction.bind(null, item, 'home')}>推荐到首页</a>
            }
          </div>
        );
      },
    },
  ];

  componentDidMount() {
    this.searchList();
    this.fetchListFour();
  }

  changeDate = (moments) => {
    if (moments && moments.length > 0) {
      this.setState({
        start_time: `${moments[0].format('YYYY-MM-DD')} 00:00:00`,
        end_time: `${moments[1].format('YYYY-MM-DD')} 00:00:00`
      });
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
    this.setState({ dataSource: { ...this.state.dataSource, pageSize: value, activePage: 1 } }, () => {
      this.searchList();
    });
  };

  /* 重置 */
  resetSearch() {
    this.refs.rangePicker.clear();
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
      const { activePage } = dataSource;
      const res = await makeAjaxRequest('/index/activity/getListOperates', 'get', {
        page_num: activePage,
        select_time,
        start_time,
        end_time,
        isv_name,
        status,
      });
      (res.data || []).forEach((item, index) => {
        item.order = (index + 1)
      })
      this.setState({
        dataSource: {
          ...this.state.dataSource,
          content: res.data || [],
          total: res.sum || 0,
          items: Math.floor((res.sum || 0) / this.state.dataSource.pageSize) + 1
        }
      });
    } catch (err) {
      this.setState({
        dataSource: {
          ...this.state.dataSource,
          content: [],
          total: 0,
          items: 0
        }
      });
      message.error(err.message);
    }
  };

  /* 查看/隐藏/删除 */
  handleTableAction = async (item, action) => {
    switch (action) {
      case 'view': {
        this.props.history.push(`/RecommendHomeDetail/${item.isvId}?status=${item.status}&index_activity_id=${item.indexActivityId}`);
        break;
      }
      case 'home': {
        this.setState({
          formData: {
            ...this.state.formData,
            showChangeModal: true,
            dataItem: item
          }
        })
        break;
      }
      case 'delete': {
        try {
          await makeAjaxRequest('/index/activity/operateMove', 'get', { index_activity_id: item.indexActivityId });
          message.success('操作成功');
          this.searchList();
        } catch (err) {
          message.error(err.message);
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  hideChangeModal = () => {
    this.setState({
      formData: {
        ...this.state.formData,
        currentPosition: undefined,
        showChangeModal: false
      }
    })
  }

  fetchListFour = async () => {
    try {
      const res = await makeAjaxRequest('/index/activity/getListFour', 'get', {});
      const list = res.data || [];
      const allList = [];
      [1, 2, 3, 4].forEach(po => {
        const currentItem = list.find(item => {
          return item.position === po;
        });
        if (currentItem) {
          allList.push(currentItem);
        } else {
          allList.push({ position: po })
        }
      })
      this.setState({
        formData: {
          ...this.state.formData,
          allList
        }
      })
    } catch (err) {
      message.error(err.message);
    }
  }

  onRadioChange = (e) => {
    this.state.formData.currentPosition = e.target.value;
    this.forceUpdate();
  }

  confirmChange = async () => {
    const { dataItem, currentPosition } = this.state.formData;
    const selected = this.state.formData.allList[currentPosition];
    try {
      this.hideChangeModal();
      await makeAjaxRequest('/index/activity/operateRec', 'post', {
        new_indexActivityId: dataItem.indexActivityId,
        old_indexActivityId: selected.index_activity_id || "",
        position: selected.position || currentPosition + 1
      });
      message.success('操作成功');
      this.searchList();
      this.fetchListFour();
    } catch (err) {
      message.error(err.message);
    }
  }

  render() {
    const {
      select_time,
      isv_name,
      status,
      dataSource,
      formData
    } = this.state;
    const { activePage, content, total, items } = dataSource;
    const { allList, showChangeModal, currentPosition } = formData;
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
                    // placeholder="选择时间类型"
                    className="search-item"
                    onChange={this.handleChange.bind(null, "select_time")}
                    value={select_time}
                  >
                    {[
                      { id: "", stat: "全部" },
                      { id: "1", stat: "申请时间" },
                      { id: "2", stat: "推荐时间" },
                      { id: "3", stat: "移除时间" }].map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.stat}
                        </Option>
                      ))}
                  </Select>
                  <RangePicker
                    ref="rangePicker"
                    showClear={true}
                    className="search-item"
                    placeholder={'开始时间 ~ 结束时间'}
                    format={format}
                    onChange={this.changeDate}
                    style={{ width: 250 }}
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
              <FormList.Item label="状态" labelCol={100}>
                <Select
                  // placeholder="请选择审核状态"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "status")}
                  value={status}
                >
                  {[
                    { id: "", stat: "全部" },
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
        {/* 提示框 - 替换 */}
        <Modal
          show={showChangeModal}
          style={{ marginTop: '20vh' }}
          onHide={this.hideChangeModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>推荐到首页</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Radio.Group onChange={this.onRadioChange} value={currentPosition}>
              {allList.map((item, index) => {
                return (
                  <Radio value={index} style={{ display: 'block', marginBottom: 10 }}>
                    <span style={{ marginRight: "40px" }}>推荐位{index + 1}</span>{item.isv_name || "空"}
                  </Radio>
                );
              })}
            </Radio.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideChangeModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.confirmChange} colors="primary" disabled={currentPosition === undefined}>确认并替换</Button>
          </Modal.Footer>
        </Modal>
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
  .calendar-picker {
    width: 220px !important;
  }
}
`;
