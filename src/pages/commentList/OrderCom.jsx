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
import { message } from 'antd';
const { RangePicker } = DatePicker;
const format = "YYYY-MM-DD";
const Option = Select.Option;
class OrderCom extends React.Component {
  state = {
    dataSource: {
      content: [],
      total: 0, // 总数量
      items: 0, // 总页数
      activePage: 1, // 当前页面
      pageSize: 10, // 每页多少
    },
    order_id: '',
    comment: '',
    start_time: '',
    end_time: '',
    average: '',
    show_status: '',
    showDeleteModal: false,
    deleteItem: '',
  };

  columns = [
    {
      title: "订单号",
      dataIndex: "order_id",
      width: "15%",
    },
    {
      title: "评价分数（交付速度、交付质量、商家服务）",
      dataIndex: "average",
      width: "25%",
      render: (value, item) => {
        return <span>{`${value} ( ${item.speed_score} 、 ${item.quality_score} 、 ${item.attitude_score} )`}</span>
      }
    },
    {
      title: "用户名",
      dataIndex: "user_name",
      width: "10%",
    },
    { title: "评论时间", dataIndex: "create_time", width: "20%" },
    {
      title: "状态",
      dataIndex: "show_status",
      width: "10%",
      render: (value, item) => {
        if (value === 0 || value === '0') {
          return <a onClick={this.handleTableAction.bind(this, item, 'toggle')}>显示</a>
        } else {
          return <a onClick={this.handleTableAction.bind(this, item, 'toggle')}>隐藏</a>
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
            <a className='action' onClick={this.handleTableAction.bind(null, item, 'delete')}>删除</a>
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
      order_id: '',
      comment: '',
      start_time: '',
      end_time: '',
      average: '',
      show_status: '',
    }, () => {
      this.searchList();
    });
  }

  /* 搜索 */
  searchList = async () => {
    try {
      const {
        order_id,
        comment,
        start_time,
        end_time,
        average,
        show_status,
        dataSource
      } = this.state;
      const { activePage } = dataSource;
      const res = await makeAjaxRequest('/newcomment/getallOperateOrder', 'get', {
        page_num: activePage,
        order_id,
        comment,
        start_time,
        end_time,
        average,
        show_status
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
      case 'toggle': {
        try {
          await makeAjaxRequest('/newcomment/hide', 'get', {
            id: item.id,
            show_status: item.show_status === 0 ? 1 : 0
          });
          message.success('操作成功');
          this.searchList();
        } catch (err) {
          message.error(err.message);
        }
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
          await makeAjaxRequest('/newcomment/dele', 'get', { id: item.id });
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
      dataSource,
      order_id,
      comment,
      average,
      show_status,
      showDeleteModal,
    } = this.state;
    const { activePage, content, total, items } = dataSource;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="订单评价" />
        <Content className={this.props.className} style={{ width: "100%", overflowX: "auto" }}>
          <SearchPanel
            reset={this.resetSearch.bind(this)}
            search={this.searchList.bind(this)}
          >
            <FormList layoutOpt={{ md: 4, xs: 4 }}>
              <FormList.Item label="订单号" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={order_id}
                  onChange={this.handleChange.bind(null, "order_id")}
                />
              </FormList.Item>
              <FormList.Item label="评论内容" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={comment}
                  onChange={this.handleChange.bind(null, "comment")}
                />
              </FormList.Item>
              <FormList.Item label="评分" labelCol={100}>
                <Select
                  // placeholder="全部评分"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "average")}
                  value={average}
                >
                  {[
                    { id: "", stat: "全部" },
                    { id: "1", stat: "1" },
                    { id: "2", stat: "2" },
                    { id: "3", stat: "3" },
                    { id: "4", stat: "4" },
                    { id: "5", stat: "5" }].map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.stat}
                      </Option>
                    ))}
                </Select>
              </FormList.Item>
              <FormList.Item label="状态" labelCol={100}>
                <Select
                  // placeholder="全部状态"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "show_status")}
                  value={show_status}
                >
                  {[
                    { id: "", stat: "全部" },
                    { id: "0", stat: "显示" },
                    { id: "1", stat: "隐藏" }].map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.stat}
                      </Option>
                    ))}
                </Select>
              </FormList.Item>
              <FormList.Item label="评价时间" labelCol={100}>
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
            删除后,此评论将不再在前端显示.
            确认删除此评论?
            </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideDeleteModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.confirmDelete} colors="primary">确认</Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}

export default styled(OrderCom)`
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
`;
