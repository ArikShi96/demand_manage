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
    showModal: false,
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
    }
  };

  handleSelect = (e) => {
    this.setState({ activePage: e });
    this.searchList(e - 1);
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

  /* 搜索 */
  searchList = () => {
  };

  /* Modal */
  hideModal = () => {
    this.setState({ showModal: false });
  }
  confirmModal = () => {
    this.hideModal();
  }
  showAdd = (e) => {
    console.log(e.target);
  }

  render() {
    const { dataSource, activeTabKey, aaa, bbb } = this.state;
    const { activePage, content, total, items } = dataSource;
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
              <Button colors="primary" onClick={this.showAdd}>新建</Button>
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
          {/* 提示框 */}
          <Modal
            show={this.state.showModal}
          >
            <Modal.Header closeButton>
              <Modal.Title>提示</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              确认停止发放?新注册用户将无法收到优惠券
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.hideModal.bind(this)} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
              <Button onClick={this.confirmModal.bind(this)} colors="primary">确认</Button>
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
`;
