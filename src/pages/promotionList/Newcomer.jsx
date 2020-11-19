import { FormControl, Select, Pagination, Table, Modal, Button, Radio } from "tinper-bee";
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

const { RangePicker } = DatePicker;
const format = "YYYY-MM-DD";
const Option = Select.Option;

class Newcomer extends React.Component {
  state = {
    dataSource: {
      content: [],
      total: 0, // 总数量
      items: 0, // 总页数
      activePage: 1, // 当前页面
      size: 10, // 每页多少
    },
    startTime: '',
    endTime: '',
    formData: {
      dataItem: {}
    },
    deleteItem: '',
    showDeleteModal: false,
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
      case 'add': {
        this.showAdd(false);
        break;
      }
      case 'edit': {
        this.showAdd(true, item);
        break;
      }
      case 'view': {
        this.showAdd(false);
        break;
      }
      case 'confirmDelete': {
        try {
          this.hideDeleteModal();
          await makeAjaxRequest('/index/recommendisv/dele', 'get', { isv_recommend_id: item.isvId });
          message.success('操作成功');
          this.searchList();
        } catch (err) {
          message.error(err.message);
        }
        break;
      }
    }
  }

  showAdd = (isEdit, item) => {
    this.setState({
      formData: {
        ...this.state.formData,
        showAddModal: true,
        title: isEdit ? '编辑顶部导航' : '新增顶部导航',
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
      aaa,
      bbb,
      formData,
      showDeleteModal,
    } = this.state;
    const { activePage, content, total, items } = dataSource;
    const { showAddModal, dataItem } = formData;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="新人专享" />
        <Content className={this.props.className} style={{ width: "100%", overflowX: "auto" }}>
          <SearchPanel
            reset={this.resetSearch.bind(this)}
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
        >
          <Modal.Header closeButton>
            <Modal.Title>{formData.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormList.Item label="优惠券名称" labelCol={100}>
              <FormControl
                className="search-item"
                value={dataItem.aaa}
                onChange={this.handleFormDataChange.bind(null, "aaa")}
                style={{ width: 250 }}
              />
            </FormList.Item>
            <FormList.Item label="有效期" labelCol={100}>
              <Radio.RadioGroup
                value={dataItem.bbb}
                onChange={this.handleFormDataChange.bind(null, "bbb")}
              >
                <Radio value='0'>一直有效</Radio>
                <Radio value='1'>有效日期</Radio>
              </Radio.RadioGroup>
            </FormList.Item>
            <FormList.Item label="活动起止时间" labelCol={100}>
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
            <FormList.Item label="优惠金额" labelCol={100}>
              <FormControl
                className="search-item"
                value={dataItem.eee}
                onChange={this.handleFormDataChange.bind(null, "eee")}
                style={{ width: 250 }}
              />
              <div>此类型的优惠可以抵销的金额</div>
            </FormList.Item>
            <FormList.Item label="最小订单金额" labelCol={100}>
              <FormControl
                className="search-item"
                value={dataItem.fff}
                onChange={this.handleFormDataChange.bind(null, "fff")}
                style={{ width: 250 }}
              />
              <div>只有商品总金额达到这个数的订单才能使用这种优惠</div>
            </FormList.Item>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideAddModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.submit} colors="primary">确认</Button>
          </Modal.Footer>
        </Modal>
        {/* 提示框 */}
        <Modal
          show={showDeleteModal}
          style={{ marginTop: '20vh' }}
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
.action-wrap {
  text-align: right;
  padding: 20px;
  padding-right: 48px;
}
`;
