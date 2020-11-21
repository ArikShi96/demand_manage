import { FormControl, Select, Pagination, Table, Modal, Button, Tabs } from "tinper-bee";
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
import { message, Tag, Radio, Checkbox } from 'antd';
import makeAjaxRequest from '../../util/request';
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
const format = "YYYY-MM-DD";
const Option = Select.Option;

class FullReduction extends React.Component {
  state = {
    dataSource: {
      content: [],
      total: 0, // 总数量
      items: 0, // 总页数
      activePage: 1, // 当前页面
      pageSize: 10, // 每页多少
    },
    activeTabKey: '0',
    aaa: '',
    bbb: '',
    start_time: '',
    end_time: '',
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
    this.searchList();
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
        dataSource
      } = this.state;
      const { activePage } = dataSource;
      const res = await makeAjaxRequest('/index/navigation/list', 'get', {
        page_num: activePage,
      });
      const data = res.data || [];
      data.forEach((item, index) => {
        item.order = (index + 1)
      })
      this.setState({
        dataSource: {
          ...this.state.dataSource,
          content: data,
          total: res.sum || 0,
          items: Math.floor((res.sum || 0) / this.state.dataSource.pageSize) + 1
        }
      });
    } catch (err) {
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
        this.showAdd(false);
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
          await makeAjaxRequest('/index/recommendisv/dele', 'get', { isv_recommend_id: item.isvId });
          message.success('删除成功');
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

  showAdd = (isEdit, item) => {
    this.setState({
      formData: {
        ...this.state.formData,
        showAddModal: true,
        title: isEdit ? '编辑活动' : '新增活动',
        dataItem: item || {}
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
    if (type === 'ccc') {
      this.state.formData.dataItem.start_time = e[0] ? e[0].format('YYYY-MM-DD') : '';
      this.state.formData.dataItem.end_time = e[1] ? e[1].format('YYYY-MM-DD') : '';
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

  handleListDataChange = (type, index, e) => {
    this.state.formData.dataItem.conditions[index][type] = e.target ? e.target.value : e;
    this.forceUpdate();
  }

  addListData = () => {
    if (!this.state.formData.dataItem.conditions) {
      this.state.formData.dataItem.conditions = []
    }
    this.state.formData.dataItem.conditions.push({});
    this.forceUpdate();
  }

  onFormCheckBoxChange = (e) => {
    this.state.formData.dataItem.checks = e;
  }

  submit = async () => {
    const { dataItem } = this.state.formData;
    const { in_id, username, navigation_url } = dataItem;
    try {
      this.hideAddModal();
      if (in_id) {
        await makeAjaxRequest('/index/navigation/editQuerSave', 'post', {
          in_id, username, navigation_url
        });
      } else {
        await makeAjaxRequest('/index/navigation/save', 'post', {
          username, navigation_url
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
      activeTabKey,
      aaa,
      bbb,
      formData,
      confirmItem,
      confirmAction,
      confirmTip,
      showConfirmModal,
      rejectReason,
    } = this.state;
    const { activePage, content, total, items } = dataSource;
    const { dataItem, showAddModal } = formData;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="活动管理" />
        <Content className={this.props.className} style={{ width: "100%", overflowX: "auto" }}>
          <Tabs
            ref="tabs"
            activeKey={activeTabKey}
            onChange={this.handleTabChange}
            tabBarStyle="upborder"
          >
            <TabPane tab="活动列表" key="0">
            </TabPane>
            <TabPane tab="报名列表" key="1">
            </TabPane>
          </Tabs>
          <SearchPanel
            search={this.searchList.bind(this, 0, 10)}
          >
            <FormList layoutOpt={{ md: 4, xs: 4 }}>
              <FormList.Item label="活动名称" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={aaa}
                  onChange={this.handleChange.bind(null, "aaa")}
                />
              </FormList.Item>
              {activeTabKey === '1' && <FormList.Item label="活动名称" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={aaa}
                  onChange={this.handleChange.bind(null, "aaa")}
                />
              </FormList.Item>
              }
              <FormList.Item label="状态" labelCol={100}>
                <Select
                  className="search-item"
                  onChange={this.handleChange.bind(null, "bbb")}
                  value={bbb}
                >
                  {[
                    { id: "0", stat: "全部状态" },
                    { id: "1", stat: "进行中" },
                    { id: "2", stat: "已取消" }].map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.stat}
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
          {activeTabKey === '0'
            &&
            <div className='action-wrap'>
              <Button colors="primary" onClick={this.handleTableAction.bind(this, null, 'add')}>新建</Button>
            </div>
          }
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
            style={{ marginTop: '10vh' }}
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
                  value={dataItem.aaa}
                  onChange={this.handleFormDataChange.bind(null, "aaa")}
                  style={{ width: 250 }}
                />
              </FormList.Item>
              <FormList.Item label="活动时间" labelCol={100}>
                <RangePicker
                  ref="rangePicker"
                  className="search-item"
                  placeholder={'开始时间 ~ 结束时间'}
                  format={format}
                  onChange={this.handleFormDataChange.bind(null, "bbb")}
                />
              </FormList.Item>
              <FormList.Item label="报名时间" labelCol={100}>
                <RangePicker
                  ref="rangePicker"
                  className="search-item"
                  placeholder={'开始时间 ~ 结束时间'}
                  format={format}
                  onChange={this.handleFormDataChange.bind(null, "ccc")}
                />
              </FormList.Item>
              <FormList.Item label="活动说明" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={dataItem.ddd}
                  onChange={this.handleFormDataChange.bind(null, "ddd")}
                  style={{ width: 250 }}
                />
              </FormList.Item>
              <FormList.Item label="活动范围" labelCol={100}>
                <Radio.Group
                  value={dataItem.eee}
                  onChange={this.handleFormDataChange.bind(null, "eee")}
                >
                  <Radio value='0'>全品类</Radio>
                  <Radio value='1'>部分品类</Radio>
                </Radio.Group>
              </FormList.Item>
              <FormList.Item label="请选择品类" labelCol={100}>
                <Checkbox.Group onChange={this.onFormCheckBoxChange}>
                  <Checkbox value="0">1</Checkbox>
                  <Checkbox value="1">2</Checkbox>
                </Checkbox.Group>
              </FormList.Item>
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
                <Radio.Group
                  value={dataItem.fff}
                  onChange={this.handleFormDataChange.bind(null, "fff")}
                >
                  {(dataItem.conditions || [{}, {}]).map((item, index) => (
                    <Radio value={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>满</span>
                        <FormControl
                          className="search-item"
                          value={item.ggg1}
                          onChange={this.handleListDataChange.bind(null, "ggg1", index)}
                          style={{ width: 40, margin: "0 20px" }}
                        />
                        <span>元, </span>
                        <span>减</span>
                        <FormControl
                          className="search-item"
                          value={item.ggg2}
                          onChange={this.handleListDataChange.bind(null, "ggg2", index)}
                          style={{ width: 40, margin: "0 20px" }}
                        />
                        <span>元, </span>
                        <span>平台分摊</span>
                        <FormControl
                          className="search-item"
                          value={item.ggg3}
                          onChange={this.handleListDataChange.bind(null, "ggg3", index)}
                          style={{ width: 40, margin: "0 20px" }}
                        />
                        <span>%</span>
                      </div>
                    </Radio>
                  ))}
                </Radio.Group>
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
        </Content>
      </Fragment>
    );
  }
}

export default styled(FullReduction)`
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
