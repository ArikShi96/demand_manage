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
import { message, Popover, Input, Checkbox } from 'antd';
import multiSelect from "bee-table/build/lib/multiSelect.js"
const { RangePicker } = DatePicker;
const format = "YYYY-MM-DD HH:mm:ss";
const Option = Select.Option;
class LiveList extends React.Component {
  state = {
    selectedRows: [],
    dataSource: {
      content: [],
      total: 0, // 总数量
      items: 0, // 总页数
      activePage: 1, // 当前页面
      pageSize: 10, // 每页多少
    },
    isvList: [],
    isvMap: {},
    liveName: '',
    liveStatus: '',
    auditStatus: '',
    isvId: '',
    liveStarttime: '',
    liveEndtime: '',
    formData: {
      dataItem: {}
    },
    showDeleteModal: false,
    deleteItem: '',
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
      width: "10%"
    },
    {
      title: "开始时间",
      dataIndex: "liveStarttime",
      width: "15%",
      render: (value) => {
        return value;
      }
    },
    {
      title: "结束时间",
      dataIndex: "liveEndtime",
      width: "15%",
      render: (value) => {
        return value;
      }
    },
    {
      title: "直播状态", dataIndex: "liveStatus", width: "10%",
      render: (value) => {
        if (value === 2 || value === '2') {
          return <span>直播中</span>
        } else if (value === 1 || value === '1') {
          return <span>未开始</span>
        } else {
          return <span>已结束</span>
        }
      }
    },
    {
      title: "审核状态", dataIndex: "auditStatus", width: "10%",
      render: (value) => {
        if (value === 0 || value === '0') {
          return <span>待审核</span>
        } else if (value === 1 || value === '1') {
          return <span>已通过</span>
        } else {
          return <span>已拒绝</span>
        }
      }
    },
    {
      title: "显示状态",
      dataIndex: "displayFlag",
      width: "10%",
      render: (value, item) => {
        if (value === 0 || value === '0') {
          return <a onClick={this.handleTableAction.bind(this, item, 'toggleHide')}>显示</a>
        } else {
          return <a onClick={this.handleTableAction.bind(this, item, 'toggleHide')}>隐藏</a>
        }
      }
    },
    {
      title: "推荐",
      dataIndex: "topop",
      width: "8%",
      render: (value, item) => {
        if (value === 0 || value === '0') {
          return <a onClick={this.handleTableAction.bind(this, item, 'toggleRecommend')}>推荐</a>
        } else {
          return <a onClick={this.handleTableAction.bind(this, item, 'toggleRecommend')}>取消推荐</a>
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
            {/* {item.auditStatus === "0" && <Popover
              content={
                <div>
                  <a className='action' onClick={this.handleTableAction.bind(null, item, 'reviewApprove')} style={{ marginRight: '20px' }}>通过</a>
                  <a className='action' onClick={this.handleTableAction.bind(null, item, 'reviewReject')}>拒绝</a>
                </div>
              }
              visible={item.popoverVisible}
              onVisibleChange={this.handleVisibleChange}
            >
            </Popover>} */}
            {item.auditStatus === "0"
              &&
              <a className='action' onClick={this.handleTableAction.bind(null, item, 'review')}>审核</a>
            }
            {item.liveStatus === "2" && <a className='action' onClick={this.handleTableAction.bind(null, item, 'redirect')}>直播间</a>}
            <a className='action' onClick={this.handleTableAction.bind(null, item, 'delete')}>删除</a>
          </div>
        );
      },
    },
  ];

  async componentDidMount() {
    await this.searchIsvList();
    this.searchList();
  }

  changeDate = (moments) => {
    if (moments && moments.length > 0) {
      this.setState({
        liveStarttime: `${moments[0].format('YYYY-MM-DD HH:mm:ss')}`,
        liveEndtime: `${moments[1].format('YYYY-MM-DD HH:mm:ss')}`
      });
    } else {
      this.setState({ liveStarttime: '', liveEndtime: '' });
    }
  };

  handleChange = (type, e) => {
    this.setState({
      [type]: e,
    });
  };

  getSelectedDataFunc = (rows) => {
    const rowIds = rows.map(row => {
      return row.liveTelecastId
    })
    this.state.dataSource.content.forEach(item => {
      item._checked = rowIds.includes(item.liveTelecastId);
    })
    this.setState({
      selectedRows: rows
    })
  }

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
      liveName: '',
      liveStatus: '',
      auditStatus: '',
      isvId: '',
      liveStarttime: '',
      liveEndtime: '',
    }, () => {
      this.searchList();
    });
  }

  /* 搜索 */
  searchList = async () => {
    try {
      const {
        dataSource,
        liveName, liveStatus, auditStatus, isvId, liveStarttime, liveEndtime,
      } = this.state;
      const { activePage, pageSize } = dataSource;
      const res = await makeAjaxRequest('/live/list', 'get', {
        pageIndex: activePage - 1,
        pageSize,
        queryType: 2,
        liveName,
        liveStatus,
        auditStatus,
        isvId,
        liveStarttime,
        liveEndtime,
      });
      (res.data.content || []).forEach((item, index) => {
        item.order = (index + 1)
      })
      this.setState({
        selectedRows: [],
        dataSource: {
          ...this.state.dataSource,
          content: res.data.content || [],
          total: res.data.totalCount || 0,
          items: Math.floor((res.data.totalCount || 0) / this.state.dataSource.pageSize) + 1
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

  /* 服务商下拉 */
  searchIsvList = async () => {
    try {
      const res = await makeAjaxRequest('/live/isv/select', 'get', {});
      const isvMap = {};
      (res.data || []).forEach(isv => {
        isvMap[isv.value] = isv.label
      });
      this.setState({
        isvList: res.data || [],
        isvMap
      });
    } catch (err) {
      message.error(err.message);
    }
  };

  /* 新增/编辑/删除 */
  handleTableAction = async (item, action, event) => {
    if (event && event.stopPropagation) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (action === 'mulReviewApprove' || action === 'mulReviewReject') {
      const find = this.state.selectedRows.find(row => {
        return row.auditStatus !== "0"
      });
      if (find) {
        message.error("只能操作审核状态为待审核的数据")
        return;
      }
    }
    switch (action) {
      // 查看
      case 'view': {
        this.props.history.push(`/LiveDetail/${item.liveTelecastId}`);
        break;
      }
      // 隐藏
      case 'toggleHide': {
        try {
          await makeAjaxRequest(`/live/display`, 'post', {
            liveTelecastId: item.liveTelecastId,
            type: item.displayFlag === '0' ? '1' : '0'
          });
          message.success('操作成功');
          this.searchList();
        } catch (err) {
          message.error(err.message);
        }
        break;
      }
      // 推荐
      case 'toggleRecommend': {
        try {
          await makeAjaxRequest(`/live/topop`, 'post', {
            liveTelecastId: item.liveTelecastId,
            type: item.topop === '0' ? '1' : "0"
          });
          message.success('操作成功');
          this.searchList();
        } catch (err) {
          message.error(err.message);
        }
        break;
      }
      // 审查
      case 'review': {
        this.setState({
          popoverVisible: true,
          deleteItem: item
        })
        break;
      }
      // 审查通过
      case 'reviewApprove': {
        this.setState({
          popoverVisible: false
        })
        try {
          await makeAjaxRequest(`/live/audit`, 'post', {
            liveTelecastId: item.liveTelecastId,
            type: '1',
            reason: "通过"
          });
          message.success('操作成功');
          this.searchList();
        } catch (err) {
          message.error(err.message);
        }
        break;
      }
      // 审查拒绝
      case 'reviewReject': {
        this.setState({
          popoverVisible: false
        });
        this.showReject(item);
        break;
      }
      // 确认审查拒绝
      case 'confirmReject': {
        this.hideRejectModal();
        try {
          await makeAjaxRequest(`/live/audit`, 'post', {
            liveTelecastId: item.liveTelecastId,
            type: '2',
            reason: this.state.formData.dataItem.reason
          });
          message.success('操作成功');
          this.searchList();
        } catch (err) {
          message.error(err.message);
        }
        break;
      }
      // 批量审查通过
      case 'mulReviewApprove': {
        try {
          await Promise.all(this.state.selectedRows.map(row => {
            return makeAjaxRequest(`/live/audit`, 'post', {
              liveTelecastId: row.liveTelecastId,
              type: '1',
              reason: '通过'
            });
          }));
          message.success('操作成功');
          this.searchList();
        } catch (err) {
          message.error(err.message);
        }
        break;
      }
      // 批量审查拒绝
      case 'mulReviewReject': {
        try {
          await Promise.all(this.state.selectedRows.map(row => {
            return makeAjaxRequest(`/live/audit`, 'post', {
              liveTelecastId: row.liveTelecastId,
              type: '2',
              reason: '不符合直播标准'
            });
          }));
          message.success('操作成功');
          this.searchList();
        } catch (err) {
          message.error(err.message);
        }
        break;
      }
      // 删除
      case 'delete': {
        this.setState({
          showDeleteModal: true,
          deleteItem: item
        })
        break;
      }
      // 确认删除
      case 'confirmDelete': {
        try {
          this.hideDeleteModal();
          await makeAjaxRequest(`/live/remove`, 'post', { liveTelecastId: item.liveTelecastId });
          message.success('删除成功');
          this.searchList();
        } catch (err) {
          message.error(err.message);
        }
        break;
      }
      // 跳转到直播间
      case 'redirect': {
        window.open(item.liveUrl);
        break;
      }
      default: {
        break;
      }
    }
  }

  hidePopoverModal = () => {
    this.setState({
      popoverVisible: false
    });
  }

  showReject = (item) => {
    this.setState({
      formData: {
        ...this.state.formData,
        showRejectModal: true,
        dataItem: item || {}
      }
    })
  }

  handleFormDataChange = (type, e) => {
    this.setState({
      formData: {
        ...this.state.formData,
        dataItem: {
          ...this.state.formData.dataItem,
          [type]: e.target ? e.target.value : "",
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
    this.handleTableAction(this.state.formData.dataItem, 'confirmReject')
  }

  hideDeleteModal = () => {
    this.setState({
      showDeleteModal: false
    })
  }

  confirmDelete = () => {
    this.handleTableAction(this.state.deleteItem, 'confirmDelete')
  }

  render() {
    const {
      liveName,
      liveStatus,
      auditStatus,
      isvId,
      dataSource,
      formData,
      showDeleteModal,
      isvList,
      selectedRows,
      popoverVisible,
    } = this.state;
    const MultiSelectTable = multiSelect(Table, Checkbox)
    const { showRejectModal, dataItem } = formData;
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
                  value={liveName}
                  onChange={this.handleChange.bind(null, "liveName")}
                />
              </FormList.Item>
              <FormList.Item label="直播状态" labelCol={100}>
                <Select
                  // placeholder="直播状态"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "liveStatus")}
                  value={liveStatus}
                >
                  {[
                    { id: "", stat: "全部" },
                    { id: "1", stat: "未开始" },
                    { id: "2", stat: "直播中" },
                    { id: "3", stat: "已结束" }].map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.stat}
                      </Option>
                    ))}
                </Select>
              </FormList.Item>
              <FormList.Item label="审核状态" labelCol={100}>
                <Select
                  // placeholder="审核状态"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "auditStatus")}
                  value={auditStatus}
                >
                  {[
                    { id: "", stat: "全部" },
                    { id: "0", stat: "待审核" },
                    { id: "1", stat: "已通过" },
                    { id: "2", stat: "已拒绝" }].map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.stat}
                      </Option>
                    ))}
                </Select>
              </FormList.Item>
              <FormList.Item label="服务商" labelCol={100}>
                <Select
                  // placeholder="服务商"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "isvId")}
                  value={isvId}
                >
                  {[{ isvId: "", isvName: "全部" }, ...isvList].map((item) => (
                    <Option key={item.isvId} value={item.isvId}>
                      {item.isvName}
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
            <Button colors="primary" onClick={this.handleTableAction.bind(this, null, 'mulReviewApprove')} disabled={!selectedRows.length}>批量通过</Button>
            <Button colors="primary" onClick={this.handleTableAction.bind(this, null, 'mulReviewReject')} disabled={!selectedRows.length}>批量拒绝</Button>
          </div>
          <MultiSelectTable
            getSelectedDataFunc={this.getSelectedDataFunc}
            rowKey="order"
            columns={this.columns}
            data={content} />
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
          onHide={this.hideRejectModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>拒绝原因</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input.TextArea value={dataItem.reason} rows={4} onChange={this.handleFormDataChange.bind(this, 'reason')} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideRejectModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.submitReject} colors="primary" disabled={!dataItem.reason}>确认</Button>
          </Modal.Footer>
        </Modal>
        {/* 提示框 - 删除 */}
        <Modal
          show={showDeleteModal}
          style={{ marginTop: '20vh' }}
          onHide={this.hideDeleteModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>删除提示</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            删除后,此直播信息将不再在前端显示.
            确认删除此直播信息?
            </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideDeleteModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.confirmDelete} colors="primary">确认</Button>
          </Modal.Footer>
        </Modal>
        {/* 审核选择 */}
        <Modal
          show={popoverVisible}
          style={{ marginTop: '20vh' }}
          onHide={this.hidePopoverModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>审核</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            请选择需要执行的操作
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleTableAction.bind(null, this.state.deleteItem, 'reviewApprove')} colors="primary" style={{ marginRight: 8 }}>通过</Button>
            <Button onClick={this.handleTableAction.bind(null, this.state.deleteItem, 'reviewReject')} colors="primary">拒绝</Button>
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
  .ant-checkbox-input {
    pointer-events: none;
  }
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
