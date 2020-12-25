import { FormControl, Select, Pagination, Table, Modal, Button } from "tinper-bee";
import React, { Fragment } from "react";
import styled from 'styled-components';
import DatePicker from 'bee-datepicker'
import "bee-form-control/build/FormControl.css";
import "bee-datepicker/build/DatePicker.css";
import "bee-button/build/Button.css";
import "bee-select/build/Select.css";
import "bee-table/build/Table.css";
import "bee-pagination/build/Pagination.css";
import "bee-tabs/build/Tabs.css";
import 'bee-modal/build/Modal.css';
import FormList from "../../common/Form";
import SearchPanel from "../../common/SearchPanel";
import { message } from 'antd';
import makeAjaxRequest from '../../../util/request';
const { RangePicker } = DatePicker;
const format = "YYYY-MM-DD";
const Option = Select.Option;
const StatusMap = { "0": "待审核", "1": "审核通过", "2": "审核驳回", "3": "报名截止" };
class SignUpList extends React.Component {
  state = {
    dataSource: {
      content: [],
      total: 0, // 总数量
      items: 0, // 总页数
      activePage: 1, // 当前页面
      pageSize: 10, // 每页多少
    },
    activity_name: '',
    isv_name: '',
    audit_status: '',
    date_start: '',
    date_end: '',
    formData: {
      dataItem: {}
    },
    confirmItem: '',
    confirmAction: '',
    confirmTip: '',
    showConfirmModal: false,
    rejectReason: '',
  };

  columns = [
    // {
    //   title: "编号",
    //   dataIndex: "order",
    //   key: "agreementNum",
    //   width: "5%",
    // },
    {
      title: "活动名称",
      dataIndex: "activityName",
      key: "activityName",
      width: "20%",
    },
    {
      title: "服务商",
      dataIndex: "isvName",
      key: "isvName",
      width: "20%",
    },
    {
      title: "审核状态",
      dataIndex: "auditStatus",
      key: "auditStatus",
      width: "20%",
      render: (value) => {
        return (
          <span>{StatusMap[value]}</span>
        );
      }
    },
    {
      title: "报名时间",
      dataIndex: "activityDateStart",
      key: "activityDateStart",
      width: "20%",
    },
    {
      title: "操作",
      dataIndex: "auditStatus",
      key: "auditStatus",
      width: "20%",
      render: (value, item) => {
        return (
          <div className="actions">
            <a className="action" onClick={this.handleTableAction.bind(this, item, "view")}>查看</a>
            {value === "0" && <a className="action" onClick={this.handleTableAction.bind(this, item, "join")}>通过</a>}
            {value === "0" && <a className="action" onClick={this.handleTableAction.bind(this, item, "reject")}>拒绝</a>}
          </div>
        );
      },
    },
  ];

  componentDidMount() {
    this.searchList();
  }

  changeDate = (moments) => {
    if (moments && moments.length > 0) {
      this.setState({
        date_start: `${moments[0].format('YYYY-MM-DD')} 00:00:00`,
        date_end: `${moments[1].format('YYYY-MM-DD')} 00:00:00`
      });
    } else {
      this.setState({ date_start: '', date_end: '' });
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
    this.setState({
    }, () => {
      this.searchList();
    });
  }

  /* 搜索 */
  searchList = async () => {
    try {
      const {
        dataSource,
        activity_name,
        isv_name,
        audit_status,
        date_start,
        date_end,
      } = this.state;
      const { activePage, pageSize } = dataSource;
      const res = await makeAjaxRequest('/activity/operateJoinList', 'post', {
        pageIndex: activePage - 1,
        pageSize,
        activity_name,
        isv_name,
        audit_status,
        date_start,
        date_end,
      });
      const data = res.data.content || [];
      data.forEach((item, index) => {
        item.order = (index + 1)
      })
      this.setState({
        dataSource: {
          ...this.state.dataSource,
          content: data,
          total: res.data.totalCount || 0,
          items: Math.floor((res.data.totalCount || 0) / this.state.dataSource.pageSize) + 1
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
        this.props.history.push(`/FullReductionDetail/${item.activityId}`);
        break;
      }
      case 'join': {
        this.setState({
          confirmItem: item,
          confirmAction: action,
          confirmTip: '确认此服务商报名信息无误?参加此活动',
          showConfirmModal: true,
          rejectReason: '',
        })
        break;
      }
      case 'reject': {
        this.setState({
          confirmItem: item,
          confirmAction: action,
          confirmTip: '拒绝此服务商的报名',
          showConfirmModal: true,
          rejectReason: '',
        })
        break;
      }
      case 'confirm': {
        try {
          this.hideConfirmModal();
          const { confirmItem, rejectReason, confirmAction } = this.state;
          await makeAjaxRequest('/activity/operateAudit', 'post', {
            activityJoinId: confirmItem.activityJoinId,
            activityId: confirmItem.activityId,
            isvId: confirmItem.isvId,
            type: confirmAction === "join" ? "1" : "2",
            reason: rejectReason || "",
          });
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

  hideConfirmModal = () => {
    this.setState({
      showConfirmModal: false
    })
  }

  confirmAction = async () => {
    this.handleTableAction(this.state.deleteItem, 'confirm')
  }

  render() {
    const {
      dataSource,
      activity_name,
      audit_status,
      confirmAction,
      confirmTip,
      showConfirmModal,
      rejectReason,
    } = this.state;
    const { activePage, content, total, items } = dataSource;
    return (
      <Fragment>
        <SearchPanel
          reset={this.resetSearch.bind(this)}
          search={this.searchList.bind(this, 0, 10)}
        >
          <FormList layoutOpt={{ md: 4, xs: 4 }}>
            <FormList.Item label="活动名称" labelCol={100}>
              <FormControl
                className="search-item"
                value={activity_name}
                onChange={this.handleChange.bind(null, "activity_name")}
              />
            </FormList.Item>
            <FormList.Item label="服务商" labelCol={100}>
              <FormControl
                className="search-item"
                value={activity_name}
                onChange={this.handleChange.bind(null, "isv_name")}
              />
            </FormList.Item>
            <FormList.Item label="状态" labelCol={100}>
              <Select
                className="search-item"
                onChange={this.handleChange.bind(null, "audit_status")}
                value={audit_status}
              >
                {Object.keys(StatusMap).map((key) => (
                  <Option key={key} value={key}>
                    {StatusMap[key]}
                  </Option>
                ))}
              </Select>
            </FormList.Item>
            <FormList.Item
              label="活动时间"
              labelCol={100}
            >
              <RangePicker
                ref="rangePicker"
                className="search-item"
                placeholder={'开始时间 ~ 结束时间'}
                format={format}
                onChange={this.changeDate}
              />
            </FormList.Item>
          </FormList>
        </SearchPanel>
        <Table columns={this.columns} data={content} />
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
        {/* 提示框 */}
        <Modal
          show={showConfirmModal}
          style={{ marginTop: '20vh' }}
          onHide={this.hideConfirmModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>提示</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ marginBottom: '20px' }}>{confirmTip}</div>
            {confirmAction === 'reject' && <FormControl
              placeholder="填写拒绝原因(50字以内)"
              className="search-item"
              value={rejectReason}
              onChange={this.handleChange.bind(null, "rejectReason")}
            />}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideConfirmModal.bind(this)} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.confirmAction.bind(this)} colors="primary">确认</Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}

export default styled(SignUpList)`
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
  padding-right: 48px;
}
.section-title {
  margin-bottom: 10px;
  .ant-tag.ant-tag-has-color {
    color: #666666;
  }
}
`;
