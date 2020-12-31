import { FormControl, Select, Pagination, Table, Modal, Button, Radio, Message } from "tinper-bee";
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
import Header from "../common/Header";
import Content from "../common/Content";
import FormList from "../common/Form";
import SearchPanel from "../common/SearchPanel";
import makeAjaxRequest from '../../util/request';
import { message } from 'antd';
import moment from "moment";

const { RangePicker } = DatePicker;
const format = "YYYY-MM-DD";
const Option = Select.Option;
const IsStopMap = { "0": "未开始", "1": "报名中", "2": "报名结束", "3": "发放中", "4": "已暂停", "5": "已结束" };

class Newcomer extends React.Component {
  state = {
    dataSource: {
      content: [],
      total: 0, // 总数量
      items: 0, // 总页数
      activePage: 1, // 当前页面
      pageSize: 10, // 每页多少
    },
    date_start: '',
    date_end: '',
    name: '',
    is_stop: '',
    formData: {
      dataItem: {}
    },
    deleteItem: '',
    showDeleteModal: false,
  };

  columns = [
    // {
    //   title: "编号",
    //   dataIndex: "order",
    //   key: "agreementNum",
    //   width: "5%",
    // },
    {
      title: "优惠券名称",
      dataIndex: "couponActivityName",
      key: "couponActivityName",
      width: "20%",
    },
    {
      title: "已使用/已发放",
      dataIndex: "getNum",
      key: "getNum",
      width: "10%",
      render: (value, item) => {
        return (
          <span>{item.usedNum}/{value}</span>
        )
      }
    },
    {
      title: "开始时间",
      dataIndex: "dateStart",
      key: "dateStart",
      width: "20%",
    },
    {
      title: "结束时间",
      dataIndex: "dateEnd",
      key: "dateEnd",
      width: "20%",
    },
    {
      title: "发放状态",
      dataIndex: "isStop",
      key: "isStop",
      width: "10%",
      render: (value) => {
        return (
          <span>{IsStopMap[value] || ""}</span>
        )
      }
    },
    {
      title: "操作",
      dataIndex: "isStop",
      key: "action",
      width: "20%",
      render: (value, item) => {
        return (
          <div className="actions">
            <a className="action" onClick={this.handleTableAction.bind(this, item, 'view')}>查看</a>
            {value === "0" && <a className="action" onClick={this.handleTableAction.bind(this, item, 'edit')}>编辑</a>}
            {value === "3" && <a className="action" onClick={this.handleTableAction.bind(this, item, 'delete')}>停止发放</a>}
            {value === "4" && <a className="action" onClick={this.handleTableAction.bind(this, item, 'confirmDelete')}>发放</a>}
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
      couponActivityName: '',
      date_start: '',
      date_end: '',
      is_stop: '',
    }, () => {
      this.searchList();
    });
  }

  /* 搜索 */
  searchList = async () => {
    try {
      const {
        dataSource,
        date_start,
        date_end,
        is_stop,
        couponActivityName
      } = this.state;
      const { activePage, pageSize } = dataSource;
      const res = await makeAjaxRequest('/activity/operateNewUserCAList', 'post', {
        // scope: "1",
        pageIndex: activePage - 1,
        pageSize,
        activity_name: couponActivityName,
        is_stop,
        date_start,
        date_end
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
      case 'add': {
        this.showAdd(false);
        break;
      }
      case 'view': {
        this.showAdd(true, item, true);
        break;
      }
      case 'edit': {
        this.showAdd(true, item);
        break;
      }
      case 'delete': {
        this.setState({
          showDeleteModal: true,
          deleteItem: item
        })
        break;
      }
      case 'confirmDelete': {
        try {
          this.hideDeleteModal();
          await makeAjaxRequest('/coupon/editNUStop', 'post', {
            activity_id: item.couponActivityId,
            is_stop: item.isStop === "3" ? "4" : "3"
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

  showAdd = async (isEdit, item, isViewMode) => {
    let editItem = "";
    if (isEdit) {
      const res = await makeAjaxRequest('/coupon/getNUCouponInfo', 'get', { activity_id: item.couponActivityId });
      editItem = res.data
    }
    this.setState({
      formData: {
        ...this.state.formData,
        showAddModal: true,
        title: isEdit ? (isViewMode ? '查看新人专享' : '编辑新人专享') : '新增新人专享',
        isViewMode: !!isViewMode,
        dataItem: editItem || item || {}
      }
    })
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
    if (type === "dateType" && e.target ? e.target.value : e === "1") {

    }
    if (type === 'dates' || type === 'activityDates') {
      if (type === 'activityDates') {
        this.state.formData.dataItem.activityDateStart = e[0] ? `${e[0].format('YYYY-MM-DD')} 00:00:00` : '';
        this.state.formData.dataItem.activityDateEnd = e[1] ? `${e[1].format('YYYY-MM-DD')} 00:00:00` : '';
      } else {
        this.state.formData.dataItem.dateStart = e[0] ? `${e[0].format('YYYY-MM-DD')} 00:00:00` : '';
        this.state.formData.dataItem.dateEnd = e[1] ? `${e[1].format('YYYY-MM-DD')} 00:00:00` : '';
      }
    } else {
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

  checkValidations = () => {
    let message = "";
    const { dataItem } = this.state.formData;
    const {
      couponActivityName,
      dateType,
      activityDateStart,
      activityDateEnd,
      dateStart,
      dateEnd,
      // remarks,
      couponMoney,
      limitMoney,
    } = dataItem;
    // 逆序
    const reg = /^\d+(?=\.{0,1}\d+$|$)/
    if (!reg.test(couponMoney) || !reg.test(limitMoney)) {
      message = "输入的金额不合法"
    }
    if (!dateStart || !dateEnd) {
      message = "请选择活动起止时间"
    }
    if (!dateType || dateType === '2' && (!activityDateStart || !activityDateEnd)) {
      message = "请选择有效期"
    }
    if (!couponActivityName || !couponActivityName.trim()) {
      message = "请输入优惠券名称"
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
    const {
      couponActivityId,
      couponActivityName,
      dateType,
      activityDateStart,
      activityDateEnd,
      dateStart,
      dateEnd,
      remarks,
      couponMoney,
      limitMoney,
    } = dataItem;
    if (!this.checkValidations()) {
      return;
    }
    try {
      this.hideAddModal();
      if (couponActivityId) {
        await makeAjaxRequest('/coupon/editnewuser', 'post', {}, {
          couponActivityId,
          busType: "1",
          couponActivityName: couponActivityName ? couponActivityName.trim() : "",
          dateType,
          activityDateStart: dateType === "1" ? "" : activityDateStart,
          activityDateEnd: dateType === "1" ? "" : activityDateEnd,
          dateStart,
          dateEnd,
          remarks: remarks ? remarks.trim() : "",
          couponMoney,
          limitMoney,
        });
      } else {
        await makeAjaxRequest('/coupon/addnewuser', 'post', {}, {
          busType: "1",
          couponActivityName: couponActivityName ? couponActivityName.trim() : "",
          dateType,
          activityDateStart: dateType === "1" ? "" : activityDateStart,
          activityDateEnd: dateType === "1" ? "" : activityDateEnd,
          dateStart,
          dateEnd,
          remarks: remarks ? remarks.trim() : "",
          couponMoney,
          limitMoney,
        });
      }
      message.success('操作成功');
      this.searchList();
    } catch (err) {
      message.error(err.message);
    }
  }

  hideDeleteModal = () => {
    this.setState({
      showDeleteModal: false
    })
  }

  confirmDelete = async () => {
    this.handleTableAction(this.state.deleteItem, 'confirmDelete')
  }

  render() {
    const {
      dataSource,
      couponActivityName,
      is_stop,
      formData,
      showDeleteModal,
    } = this.state;
    const { activePage, content, total, items } = dataSource;
    const { showAddModal, dataItem, isViewMode } = formData;
    return (
      <Fragment>
        <Header style={{ background: "#limitMoney", padding: 0 }} title="新人专享" />
        <Content className={this.props.className} style={{ width: "100%", overflowX: "auto" }}>
          <SearchPanel
            reset={this.resetSearch.bind(this)}
            search={this.searchList.bind(this, 0, 10)}
          >
            <FormList layoutOpt={{ md: 4, xs: 4 }}>
              <FormList.Item label="活动名称" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={couponActivityName}
                  onChange={this.handleChange.bind(null, "couponActivityName")}
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
        </Content>
        {/* 提示框 - 新增 */}
        <Modal
          show={showAddModal}
          style={{ marginTop: '15vh' }}
          onHide={this.hideAddModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>{formData.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormList.Item label="优惠券名称" labelCol={100}>
              {isViewMode ?
                <div>{dataItem.couponActivityName}</div>
                : <FormControl
                  className="search-item"
                  value={dataItem.couponActivityName}
                  onChange={this.handleFormDataChange.bind(null, "couponActivityName")}
                  style={{ width: 250 }}
                />}
            </FormList.Item>
            <FormList.Item label="有效期" labelCol={100}>
              {isViewMode ?
                <div>{dataItem.dateType === "2" ? `${dataItem.activityDateStart} - ${dataItem.activityDateEnd}` : '一直有效'}</div> :
                <Radio.RadioGroup
                  value={dataItem.dateType}
                  onChange={this.handleFormDataChange.bind(null, "dateType")}
                >
                  <Radio value='1'>一直有效</Radio>
                  <Radio value='2'>有效日期</Radio>
                </Radio.RadioGroup>}
            </FormList.Item>
            {dataItem.dateType === '2' && !isViewMode && <FormList.Item label="" labelCol={100}>
              <RangePicker
                className="search-item w-100"
                placeholder={'开始时间 ~ 结束时间'}
                format={format}
                onChange={this.handleFormDataChange.bind(null, "activityDates")}
                style={{ width: 250 }}
                defaultValue={dataItem.activityDateStart && dataItem.activityDateEnd
                  ? [new moment(dataItem.activityDateStart), new moment(dataItem.activityDateEnd)] :
                  []}
              />
            </FormList.Item>}
            <FormList.Item label="活动起止时间" labelCol={100}>
              {isViewMode ?
                <div>{`${dataItem.dateStart} - ${dataItem.dateEnd}`}</div> :
                <RangePicker
                  className="search-item w-100"
                  placeholder={'开始时间 ~ 结束时间'}
                  format={format}
                  onChange={this.handleFormDataChange.bind(null, "dates")}
                  style={{ width: 250 }}
                  defaultValue={dataItem.dateStart && dataItem.dateEnd ?
                    [new moment(dataItem.dateStart), new moment(dataItem.dateEnd)] :
                    []}
                />}
            </FormList.Item>
            <FormList.Item label="活动说明" labelCol={100}>
              {isViewMode ?
                <div>{dataItem.remarks}</div> :
                <FormControl
                  className="search-item"
                  value={dataItem.remarks}
                  onChange={this.handleFormDataChange.bind(null, "remarks")}
                  style={{ width: 250 }}
                />}
            </FormList.Item>
            <FormList.Item label="优惠金额" labelCol={100}>
              {isViewMode ?
                <div>{dataItem.couponMoney}</div> :
                <FormControl
                  className="search-item"
                  value={dataItem.couponMoney}
                  onChange={this.handleFormDataChange.bind(null, "couponMoney")}
                  style={{ width: 250 }}
                />}
              {!isViewMode && <div style={{ position: 'absolute' }}>此类型的优惠可以抵销的金额</div>}
            </FormList.Item>
            <FormList.Item label="最小订单金额" labelCol={100}>
              {isViewMode ?
                <div>{dataItem.limitMoney}</div> :
                <FormControl
                  className="search-item"
                  value={dataItem.limitMoney}
                  onChange={this.handleFormDataChange.bind(null, "limitMoney")}
                  style={{ width: 250, marginTop: '10px' }}
                />}
              {!isViewMode && <div style={{ position: 'absolute' }}>只有商品总金额达到这个数的订单才能使用这种优惠</div>}
            </FormList.Item>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideAddModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            {isViewMode && <Button onClick={this.hideAddModal} colors="primary">确认</Button>}
            {!isViewMode && <Button onClick={this.submit} colors="primary">确认</Button>}
          </Modal.Footer>
        </Modal>
        {/* 提示框 */}
        <Modal
          show={showDeleteModal}
          style={{ marginTop: '20vh' }}
          onHide={this.hideDeleteModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>提示</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            确认停止发放?新注册用户将无法收到优惠券
            </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideDeleteModal.bind(this)} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.confirmDelete.bind(this)} colors="primary">确认</Button>
          </Modal.Footer>
        </Modal>
      </Fragment >
    );
  }
}

export default styled(Newcomer)`
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
`;
