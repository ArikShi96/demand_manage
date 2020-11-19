import { FormControl, Select, Table, Pagination, Button, Modal } from "tinper-bee";
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
import { message, Popover, Input } from 'antd';
const { RangePicker } = DatePicker;
const format = "YYYY-MM-DD";
const Option = Select.Option;
class LiveList extends React.Component {
  state = {
    dataSource: {
      content: [{}],
      total: 0, // 总数量
      items: 0, // 总页数
      activePage: 1, // 当前页面
      pageSize: 10, // 每页多少
    },
    aaa: '',
    bbb: '',
    ccc: '',
    ddd: '',
    start_time: '',
    end_time: '',
    formData: {
      dataItem: {}
    },
    popoverVisible: false,
  };

  columns = [
    {
      title: "直播间ID",
      dataIndex: "liveRoomId",
      width: "10%",
    },
    {
      title: "直播名称",
      dataIndex: "liveName",
      width: "10%",
    },
    {
      title: "服务商",
      dataIndex: "isvName",
      width: "10%",
    },
    {
      title: "开始时间",
      dataIndex: "liveStarttime",
      width: "15%",
    },
    {
      title: "结束时间",
      dataIndex: "liveEndtime",
      width: "15%",
    },
    {
      title: "直播状态", dataIndex: "ip_address", width: "10%",
      render: (value, item) => {
        if (value === 0 || value === '0') {
          return <span></span>
        } else {
          return <span></span>
        }
      }
    },
    {
      title: "审核状态", dataIndex: "create_time", width: "10%",
      render: (value, item) => {
        if (value === 0 || value === '0') {
          return <span></span>
        } else {
          return <span></span>
        }
      }
    },
    {
      title: "显示状态",
      dataIndex: "show_status",
      width: "10%",
      render: (value, item) => {
        if (value === 0 || value === '0') {
          return <a onClick={this.handleTableAction.bind(this, item, 'toggleHide')}>隐藏</a>
        } else {
          return <a onClick={this.handleTableAction.bind(this, item, 'toggleHide')}>显示</a>
        }
      }
    },
    {
      title: "推荐",
      dataIndex: "show_status1",
      width: "8%",
      render: (value, item) => {
        if (value === 0 || value === '0') {
          return <a onClick={this.handleTableAction.bind(this, item, 'recommend')}>隐藏</a>
        } else {
          return <a onClick={this.handleTableAction.bind(this, item, 'recommend')}>显示</a>
        }
      }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: "20%",
      render: (value, item) => {
        return (
          <div className="actions">
            <a className='action' onClick={this.handleTableAction.bind(null, item, 'view')}>查看</a>
            <Popover
              content={
                <div>
                  <a className='action' onClick={this.handleTableAction.bind(null, item, 'confirm')} style={{ marginRight: '20px' }}>通过</a>
                  <a className='action' onClick={this.handleTableAction.bind(null, item, 'reject')}>拒绝</a>
                </div>
              }
              trigger="click"
              visible={this.state.popoverVisible}
              onVisibleChange={this.handleVisibleChange}
            >
              <a className='action' onClick={this.handleTableAction.bind(null, item, 'review')}>审核</a>
            </Popover>
            <a className='action' onClick={this.handleTableAction.bind(null, item, 'redirect')}>直播间</a>
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
    } else if (d.length === 0) {
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
      aaa: '',
      bbb: '',
      ccc: '',
      ddd: '',
      start_time: '',
      end_time: '',
    }, () => {
      this.searchList();
    });
  }

  /* 搜索 */
  searchList = async () => {
    try {
      const {
        dataSource
      } = this.state;
      const { activePage, pageSize } = dataSource;
      const res = await makeAjaxRequest('/live/list', 'get', {
        pageIndex: activePage - 1,
        pageSize,
        queryType: 2
      });
      (res.data.content || []).forEach((item, index) => {
        item.order = (index + 1)
      })
      this.setState({
        dataSource: {
          ...this.state.dataSource,
          content: res.data.content || [],
          total: res.sum || 0,
          items: Math.floor((res.sum || 0) / this.state.dataSource.pageSize) + 1
        }
      });
    } catch (err) {
      message.error(err.message);
    }
  };

  /* 新增/编辑/删除 */
  handleTableAction = async (item, action) => {
    switch (action) {
      case 'view': {
        this.props.history.push(`/ProductComDetail/${item.id}`);
        break;
      }
      case 'toggleHide': {
        try {
          await makeAjaxRequest('/newcomment/hide', 'get', { q_manage_id: item.qManageId });
        } catch (err) {
          message.error(err.message);
        }
        break;
      }
      case 'review': {
        this.setState({
          popoverVisible: true
        });
        break;
      }
      case 'confirm': {
        this.setState({
          popoverVisible: false
        });
        break;
      }
      case 'reject': {
        this.setState({
          popoverVisible: false,
          ...this.state.formData,
          formData: {
            showRejectModal: true
          }
        });
        break;
      }
      case 'delete': {
        try {
          await makeAjaxRequest('/live/list', 'get', { q_manage_id: item.qManageId });
        } catch (err) {
          message.error(err.message);
        }
        break;
      }
    }
  }

  showReject = (item) => {
    this.setState({
      formData: {
        ...this.state.formData,
        showRejectModal: true,
        data: item || {}
      }
    })
  }

  handleFormDataChange = (type, e) => {
    this.setState({
      formData: {
        ...this.state.formData,
        dataItem: {
          ...this.state.formData.dataItem,
          [type]: e,
        }
      }
    })
  }

  hideRejectModal = () => {
    this.setState({
      formData: {
        ...this.state.formData,
        showRejectModal: false,
      }
    })
  }

  submitReject = async () => {

  }

  render() {
    const {
      aaa,
      bbb,
      ccc,
      ddd,
      dataSource,
      formData
    } = this.state;
    const { showRejectModal, reason } = formData;
    const { activePage, content, total, items } = dataSource;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="直播管理" />
        <Content className={this.props.className} style={{ width: "100%", overflowX: "auto" }}>
          <SearchPanel
            reset={this.resetSearch.bind(this)}
            search={this.searchList.bind(this)}
          >
            <FormList layoutOpt={{ md: 4, xs: 4 }}>
              {/* 直播名称 */}
              <FormList.Item label="直播名称" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={aaa}
                  onChange={this.handleChange.bind(null, "aaa")}
                />
              </FormList.Item>
              <FormList.Item label="直播状态" labelCol={100}>
                <Select
                  placeholder="直播状态"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "bbb")}
                  value={bbb}
                >
                  {[
                    { id: "1", stat: "直播中" },
                    { id: "2", stat: "未开始" },
                    { id: "3", stat: "已结束" }].map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.stat}
                      </Option>
                    ))}
                </Select>
              </FormList.Item>
              <FormList.Item label="审核状态" labelCol={100}>
                <Select
                  placeholder="审核状态"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "ccc")}
                  value={ccc}
                >
                  {[
                    { id: "1", stat: "已通过" },
                    { id: "2", stat: "待审核" },
                    { id: "3", stat: "已拒绝" }].map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.stat}
                      </Option>
                    ))}
                </Select>
              </FormList.Item>
              <FormList.Item label="服务商" labelCol={100}>
                <Select
                  placeholder="服务商"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "ddd")}
                  value={ddd}
                >
                  {[
                    { id: "1", stat: "直播中" },
                    { id: "2", stat: "未开始" },
                    { id: "3", stat: "已结束" }].map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.stat}
                      </Option>
                    ))}
                </Select>
              </FormList.Item>
              <FormList.Item label="直播时间" labelCol={100}>
                <RangePicker
                  ref="rangePicker"
                  showClear={true}
                  className="search-item"
                  placeholder={'开始时间 ~ 结束时间'}
                  format={format}
                  onChange={this.changeDate}
                />
              </FormList.Item>
            </FormList>
          </SearchPanel>
          <div className='action-wrap'>
            <Button colors="primary" onClick={this.batchConfirm}>批量通过</Button>
            <Button colors="primary" onClick={this.batchRefuse}>批量拒绝</Button>
          </div>
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
        {/* 提示框 - 拒绝 */}
        <Modal
          show={showRejectModal}
          style={{ marginTop: '20vh' }}
        >
          <Modal.Header closeButton>
            <Modal.Title>拒绝原因</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input.TextArea value={reason} rows={4} onChange={this.handleFormDataChange.bind(this, reason)} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideRejectModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.submitReject} colors="primary">确认</Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}

export default styled(LiveList)`
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
.action-wrap {
  text-align: right;
  padding: 20px;
  padding-right: 48px;
  .u-button{
    margin-left: 20px;
  }
}
`;
