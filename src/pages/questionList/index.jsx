import { FormControl, Select, Table, Pagination, Modal, Button } from "tinper-bee";
import styled from 'styled-components';
import React, { Fragment } from "react";
import "bee-form-control/build/FormControl.css";
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
const Option = Select.Option;
class QuestionList extends React.Component {
  state = {
    dataSource: {
      content: [],
      total: 0, // 总数量
      items: 0, // 总页数
      activePage: 1, // 当前页面
      pageSize: 10, // 每页多少
    },
    question: '',
    product_name: '',
    isv_name: '',
    question_type: '',
    question_status: '',
    showDeleteModal: false,
    deleteItem: ''
  };

  columns = [
    {
      title: "编号",
      dataIndex: "order",
      width: "5%",
    },
    {
      title: "问题描述",
      dataIndex: "question",
      width: "20%",
    },
    {
      title: "类型",
      dataIndex: "questionType",
      width: "8%",
      render: (value) => {
        if (value === 0 || value === '0') {
          return <span>商品问答</span>
        } else {
          return <span>店铺问答</span>
        }
      }
    },
    {
      title: "服务商",
      dataIndex: "isvName",
      width: "8%",
    },
    {
      title: "商品名称",
      dataIndex: "productName",
      width: "8%",
    },
    { title: "提问时间", dataIndex: "askTime", width: "15%" },
    {
      title: "问题状态",
      dataIndex: "questionStatus",
      width: "8%",
      render: (value) => {
        if (value === 0 || value === '0') {
          return <span>待回答</span>
        } else {
          return <span>已回答</span>
        }
      }
    },
    {
      title: "展示状态",
      dataIndex: "isdisplay",
      width: "8%",
      render: (value) => {
        if (value === 0 || value === '0') {
          return <span>隐藏</span>
        } else {
          return <span>显示</span>
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
            <a className='action' onClick={this.handleTableAction.bind(null, item, 'toggle')}>
              {item.isdisplay === 0 || item.isdisplay === '0' ? '显示' : '隐藏'}
            </a>
            <a className='action' onClick={this.handleTableAction.bind(null, item, 'delete')}>删除</a>
          </div>
        );
      },
    },
  ];

  componentDidMount() {
    this.searchList();
  }

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
      question: '', product_name: '', isv_name: '', question_type: '', question_status: ''
    }, () => {
      this.searchList();
    });
  }

  /* 搜索 */
  searchList = async () => {
    try {
      const { question, product_name, isv_name, question_type, question_status, dataSource } = this.state;
      const { activePage } = dataSource;
      const res = await makeAjaxRequest('/question/getallOperate', 'get', { page_num: activePage, question, product_name, isv_name, question_type, question_status });
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
        this.props.history.push(`/QuestionDetail/${item.qManageId}`);
        break;
      }
      case 'toggle': {
        try {
          await makeAjaxRequest('/question/operateDisplay', 'get', {
            q_manage_id: item.qManageId,
            isdisplay: item.isdisplay === 0 || item.isdisplay === '0' ? 1 : 0
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
          await makeAjaxRequest('/question/operateDele', 'get', { q_manage_id: item.qManageId });
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
    const { dataSource, question, product_name, isv_name, question_type, question_status, showDeleteModal,
    } = this.state;
    const { activePage, content, total, items } = dataSource;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="问答管理" />
        <Content className={this.props.className} style={{ width: "100%", overflowX: "auto" }}>
          <SearchPanel
            reset={this.resetSearch.bind(this)}
            search={this.searchList.bind(this)}
          >
            <FormList layoutOpt={{ md: 4, xs: 4 }}>
              <FormList.Item label="问答关键词" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={question}
                  onChange={this.handleChange.bind(null, "question")}
                />
              </FormList.Item>
              <FormList.Item label="商品名称" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={product_name}
                  onChange={this.handleChange.bind(null, "product_name")}
                />
              </FormList.Item>
              <FormList.Item label="服务商" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={isv_name}
                  onChange={this.handleChange.bind(null, "isv_name")}
                />
              </FormList.Item>
              <FormList.Item label="问题类型" labelCol={100}>
                <Select
                  // placeholder="选择类型"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "question_type")}
                  value={question_type}
                >
                  {[{ id: "", stat: "全部" }, { id: "0", stat: "商品问答" }, { id: "1", stat: "店铺问答" }].map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.stat}
                    </Option>
                  ))}
                </Select>
              </FormList.Item>
              <FormList.Item label="问题状态" labelCol={100}>
                <Select
                  // placeholder="选择状态"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "question_status")}
                  value={question_status}
                >
                  {[{ id: "", stat: "全部" }, { id: "1", stat: "已回答" }, { id: "0", stat: "待回答" }].map((item) => (
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
            删除后,此问答将不再在前端显示.
            确认删除此问答?
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

export default styled(QuestionList)`
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
