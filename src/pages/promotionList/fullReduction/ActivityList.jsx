import moment from "moment";
import { FormControl, Select, Pagination, Table, Modal, Button, Message } from "tinper-bee";
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
import { message, Radio, Checkbox, Tooltip } from 'antd';
import makeAjaxRequest from '../../../util/request';
const { RangePicker } = DatePicker;
const format = "YYYY-MM-DD";
const Option = Select.Option;
const IsStopMap = { "0": "未开始", "1": "报名中", "2": "报名结束", "3": "进行中", "4": "已暂停", "5": "已结束" };
class ActivityList extends React.Component {
  state = {
    dataSource: {
      content: [],
      total: 0, // 总数量
      items: 0, // 总页数
      activePage: 1, // 当前页面
      pageSize: 10, // 每页多少
    },
    activity_name: '',
    is_stop: '',
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
      width: "15%",
    },
    {
      title: "活动描述",
      dataIndex: "remarks",
      key: "remarks",
      width: "20%",
    },
    {
      title: "报名时间",
      dataIndex: "activityJoinStart",
      key: "activityJoinStart",
      width: "20%",
      render: (value, item) => {
        return (
          <Tooltip title={`${item.activityJoinStart} - ${item.activityJoinEnd}`}>
            <span>{item.activityJoinStart} - {item.activityJoinEnd}</span>
          </Tooltip>
        )
      }
    },
    {
      title: "活动时间",
      dataIndex: "activityDateStart",
      key: "activityDateStart",
      width: "20%",
      render: (value, item) => {
        return (
          <Tooltip title={`${item.activityDateStart} - ${item.activityDateEnd}`}>
            <span>{item.activityDateStart} - {item.activityDateEnd}</span>
          </Tooltip>
        )
      }
    },
    {
      title: "活动状态", dataIndex: "isStop", key: "isStop", width: "10%",
      render: (value) => {
        return (
          <span>{IsStopMap[value]}</span>
        )
      }
    },
    {
      title: "操作",
      dataIndex: "isStop",
      key: "action",
      width: "15%",
      render: (value, item) => {
        return (
          <div className="actions">
            <a className="action" onClick={this.handleTableAction.bind(this, item, "view")}>查看</a>
            {value === "1" && <a className="action" onClick={this.handleTableAction.bind(this, item, "edit")}>编辑</a>}
            {value === "3" && <a className="action" onClick={this.handleTableAction.bind(this, item, "stop")}>停止</a>}
            {value === "4" && <a className="action" onClick={this.handleTableAction.bind(this, item, "open")}>开启</a>}
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
    this.refs.rangePicker.clear();
    this.setState({
      activity_name: "",
      is_stop: "",
      date_start: '',
      date_end: '',
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
        is_stop,
        date_start,
        date_end,
      } = this.state;
      const { activePage, pageSize } = dataSource;
      const res = await makeAjaxRequest('/activity/operateActivityList', 'post', {
        pageIndex: activePage - 1,
        pageSize,
        activity_name,
        is_stop,
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
      case 'edit': {
        this.showAdd(true, item);
        break;
      }
      case 'add': {
        this.showAdd(false);
        break;
      }
      case 'view': {
        this.props.history.push(`/FullReductionDetail/${item.activityId}`);
        break;
      }
      case 'open': {
        this.setState({
          confirmItem: item,
          confirmAction: action,
          confirmTip: '确认开启此活动? 前台用户将可继续参加该活动',
          showConfirmModal: true,
          rejectReason: '',
        })
        break;
      }
      case 'stop': {
        this.setState({
          confirmItem: item,
          confirmAction: action,
          confirmTip: '确认停止此活动? 前台用户将无法参加此活动',
          showConfirmModal: true,
          rejectReason: '',
        })
        break;
      }
      case 'confirm': {
        try {
          this.hideConfirmModal();
          const { confirmItem, confirmAction } = this.state;
          await makeAjaxRequest('/activity/editOperateActivityStatus', 'get', {
            activity_id: confirmItem.activityId,
            status: confirmAction === "open" ? "3" : "4",
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

  showAdd = async (isEdit, item) => {
    let editItem = ""
    if (isEdit) {
      const res = await makeAjaxRequest('/activity/getOperateActivityinfo', 'get', { activity_id: item.activityId });
      editItem = res.data.activityDto;
      editItem.couponRuleList = res.data.couponDtoList;
    }
    this.setState({
      formData: {
        ...this.state.formData,
        showAddModal: true,
        title: isEdit ? '编辑活动' : '新增活动',
        dataItem: editItem || item || {}
      }
    });
  }

  hideAddModal = () => {
    this.setState({
      formData: {
        ...this.state.formData,
        showAddModal: false,
      }
    })
  }

  handleFormDataChange = (type, e) => {
    if (type === 'activityDates') {
      this.state.formData.dataItem.activityDateStart = e[0] ? `${e[0].format('YYYY-MM-DD')} 00:00:00` : '';
      this.state.formData.dataItem.activityDateEnd = e[1] ? `${e[1].format('YYYY-MM-DD')} 00:00:00` : '';
    } else if (type === 'activityJoins') {
      this.state.formData.dataItem.activityJoinStart = e[0] ? `${e[0].format('YYYY-MM-DD')} 00:00:00` : '';
      this.state.formData.dataItem.activityJoinEnd = e[1] ? `${e[1].format('YYYY-MM-DD')} 00:00:00` : '';
    }
    else {
      this.setState({
        formData: {
          ...this.state.formData,
          dataItem: {
            ...this.state.formData.dataItem,
            [type]: e.target ? e.target.value : e,
          }
        }
      })
    }
  }

  handleListDataChange = (type, index, e) => {
    this.state.formData.dataItem.couponRuleList[index][type] = e.target ? e.target.value : e;
    this.forceUpdate();
  }

  addListData = () => {
    if (!this.state.formData.dataItem.couponRuleList) {
      this.state.formData.dataItem.couponRuleList = []
    }
    this.state.formData.dataItem.couponRuleList.push({});
    this.forceUpdate();
  }

  removeListData = (index) => {
    this.state.formData.dataItem.couponRuleList.splice(index, 1);
    this.forceUpdate();
  }

  onFormCheckBoxChange = (e) => {
    this.state.formData.dataItem.checks = e;
  }

  calculatePercentage = (a, b) => {
    if (!a || !b) {
      return ""
    }
    try {
      const result = a / b;
      if (Number.isNaN(result)) {
        return ""
      } else {
        return (result * 100).toFixed(0)
      }
    } catch (err) {
      return ""
    }
  }

  checkValidations = () => {
    let message = "";
    const { dataItem } = this.state.formData;
    const {
      activityName,
      activityDateStart,
      activityDateEnd,
      activityJoinStart,
      activityJoinEnd,
      couponRuleList
    } = dataItem;
    // 逆序
    const reg = /^\d+(?=\.{0,1}\d+$|$)/;
    (couponRuleList || []).some(rule => {
      if (!reg.test(rule.couponMoney) || !reg.test(rule.limitMoney)) {
        message = "满减条件的金额输入不合法"
        return true
      }
    });
    if (!couponRuleList || !couponRuleList.length) {
      message = '请添加满减条件'
    }
    if (!activityJoinStart || !activityJoinEnd) {
      message = "请选择报名时间"
    }
    if (!activityDateStart || !activityDateEnd) {
      message = "请选择活动时间"
    }
    if (!activityName || !activityName.trim()) {
      message = "请输入活动名称"
    }
    if (message) {
      Message.create({ content: message, color: "danger" });
      return false;
    } else {
      return true;
    }
  }

  submit = async () => {
    const { dataItem } = this.state.formData;
    const { activityId,
      activityName,
      activityDateStart,
      activityDateEnd,
      activityJoinStart,
      activityJoinEnd,
      remarks,
      productScope,
      couponRuleList
    } = dataItem;
    if (!this.checkValidations()) {
      return;
    }
    try {
      this.hideAddModal();
      if (activityId) {
        await makeAjaxRequest('/activity/editOperate', 'post', {}, {
          activityId,
          busType: "3",
          favType: "1",
          productIds: "",
          favProductIds: "",
          categoryStr: "",
          //
          activityName: activityName ? activityName.trim() : "",
          activityDateStart,
          activityDateEnd,
          activityJoinStart,
          activityJoinEnd,
          remarks: remarks ? remarks.trim() : "",
          productScope: "0",
          couponRuleList: (couponRuleList || []).map(rule => {
            return {
              type: "1",
              couponMoney: rule.couponMoney,
              limitMoney: rule.limitMoney
            }
          })
        });
      } else {
        await makeAjaxRequest('/activity/addOperate', 'post', {}, {
          busType: "3",
          favType: "1",
          productIds: "",
          favProductIds: "",
          categoryStr: "",
          //
          activityName: activityName ? activityName.trim() : "",
          activityDateStart,
          activityDateEnd,
          activityJoinStart,
          activityJoinEnd,
          remarks: remarks ? remarks.trim() : "",
          productScope: "0",
          couponRuleList: (couponRuleList || []).map(rule => {
            return {
              type: "1",
              couponMoney: rule.couponMoney,
              limitMoney: rule.limitMoney
            }
          })
        });
      }
      message.success('操作成功');
      this.searchList();
    } catch (err) {
      message.error(err.message);
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
      is_stop,
      formData,
      confirmAction,
      confirmTip,
      showConfirmModal,
      rejectReason,
    } = this.state;
    const { activePage, content, total, items } = dataSource;
    const { dataItem, showAddModal } = formData;
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
            <FormList.Item label="状态" labelCol={100}>
              <Select
                className="search-item"
                onChange={this.handleChange.bind(null, "is_stop")}
                value={is_stop}
              >
                {Object.keys(IsStopMap).map((key) => (
                  <Option key={key} value={key}>
                    {IsStopMap[key]}
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
        <div className='action-wrap'>
          <Button colors="primary" onClick={this.handleTableAction.bind(this, null, 'add')}>新建</Button>
        </div>
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
        {/* 提示框 - 新增 */}
        <Modal
          show={showAddModal}
          style={{ marginTop: '10vh', width: '750px' }}
          onHide={this.hideAddModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>{formData.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='section-title'>
              {/* <Tag color="default">活动信息</Tag> */}
                活动信息
              </div>
            <FormList.Item label="活动名称" labelCol={100}>
              <FormControl
                className="search-item"
                value={dataItem.activityName}
                onChange={this.handleFormDataChange.bind(null, "activityName")}
                style={{ width: 250 }}
              />
            </FormList.Item>
            <FormList.Item label="活动时间" labelCol={100}>
              <RangePicker
                className="search-item w-100"
                placeholder={'开始时间 ~ 结束时间'}
                format={format}
                onChange={this.handleFormDataChange.bind(null, "activityDates")}
                style={{ width: 250 }}
                defaultValue={dataItem.activityDateStart && dataItem.activityDateEnd ?
                  [new moment(dataItem.activityDateStart), new moment(dataItem.activityDateEnd)] :
                  []}
              />
            </FormList.Item>
            <FormList.Item label="报名时间" labelCol={100}>
              <RangePicker
                className="search-item w-100"
                placeholder={'开始时间 ~ 结束时间'}
                format={format}
                onChange={this.handleFormDataChange.bind(null, "activityJoins")}
                style={{ width: 250 }}
                defaultValue={dataItem.activityJoinStart && dataItem.activityJoinEnd ?
                  [new moment(dataItem.activityJoinStart), new moment(dataItem.activityJoinEnd)] :
                  []}
              />
            </FormList.Item>
            <FormList.Item label="活动说明" labelCol={100}>
              <FormControl
                className="search-item"
                value={dataItem.remarks}
                onChange={this.handleFormDataChange.bind(null, "remarks")}
                style={{ width: 250 }}
              />
            </FormList.Item>
            <FormList.Item label="活动范围" labelCol={100}>
              <Radio.Group
                // value={dataItem.productScope}
                value="0"
                onChange={this.handleFormDataChange.bind(null, "productScope")}
              >
                <Radio value='0'>全品类</Radio>
                {/* <Radio value='1'>部分品类</Radio> */}
              </Radio.Group>
            </FormList.Item>
            {dataItem.productScope === "1" && <FormList.Item label="请选择品类" labelCol={100}>
              <Checkbox.Group onChange={this.onFormCheckBoxChange}>
                <Checkbox value="0">1</Checkbox>
                <Checkbox value="1">2</Checkbox>
              </Checkbox.Group>
            </FormList.Item>}
            <div className='section-title'>
              {/* <Tag color="default">活动规则</Tag> */}
                活动规则
              </div>
            <FormList.Item label="活动类型" labelCol={100}>
              <Radio.Group
                value="0"
              >
                <Radio value='0'>满减</Radio>
              </Radio.Group>
            </FormList.Item>
            <FormList.Item label="满减条件" labelCol={100}>
              {/* <Radio.Group
                value={dataItem.fff}
                onChange={this.handleFormDataChange.bind(null, "fff")}
              > */}
              {(dataItem.couponRuleList || []).map((item, index) => (
                // <Radio value={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <span>满</span>
                  <FormControl
                    className="search-item"
                    value={item.limitMoney}
                    onChange={this.handleListDataChange.bind(null, "limitMoney", index)}
                    style={{ width: 80, margin: "0 20px" }}
                  />
                  <span>元, </span>
                  <span>减</span>
                  <FormControl
                    className="search-item"
                    value={item.couponMoney}
                    onChange={this.handleListDataChange.bind(null, "couponMoney", index)}
                    style={{ width: 80, margin: "0 20px" }}
                  />
                  <span>元, </span>
                  <span>平台分摊</span>
                  <FormControl
                    className="search-item"
                    value={this.calculatePercentage(item.couponMoney, item.limitMoney)}
                    disabled={true}
                    style={{ width: 60, margin: "0 20px" }}
                  />
                  <span>%</span>
                  <a style={{ marginLeft: "10px" }} onClick={this.removeListData.bind(this, index)}>删除</a>
                </div>
                // </Radio>
              ))}
              {/* </Radio.Group> */}
            </FormList.Item>
            <div className="add-item" style={{ marginTop: 20, paddingLeft: 50 }}>
              <a onClick={this.addListData}>添加</a>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideAddModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.submit} colors="primary">确认</Button>
          </Modal.Footer>
        </Modal>
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
            <div>{confirmTip}</div>
            {confirmAction === 'reject' && <FormControl
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

export default styled(ActivityList)`
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
