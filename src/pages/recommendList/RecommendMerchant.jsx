import { Table, Pagination, Button, Modal, Select } from "tinper-bee";
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
import makeAjaxRequest from '../../util/request';
import { message } from 'antd';
import FormList from "../common/Form";
const { Option } = Select;
class RecommendMerchant extends React.Component {
  state = {
    dataSource: {
      content: [],
      total: 0, // 总数量
      items: 0, // 总页数
      activePage: 1, // 当前页面
      pageSize: 10, // 每页多少
    },
    formData: {
      dataItem: {}
    },
    allList: [],
    showDeleteModal: false,
    deleteItem: ''
  };

  columns = [
    {
      title: "序号",
      dataIndex: "order",
      width: "20%",
    },
    {
      title: "商家名称",
      dataIndex: "isvName",
      width: "30%",
    },
    {
      title: "添加时间",
      dataIndex: "addTime",
      width: "30%",
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
    this.fetchAllList();
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
      const res = await makeAjaxRequest('/index/recommendisv/List', 'get', {
        page_num: activePage,
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

  fetchAllList = async () => {
    try {
      const res = await makeAjaxRequest('/index/recommendisv/getLike', 'get', {
      });
      this.setState({
        allList: res.data
      });
    } catch (err) {
      message.error(err.message);
    }
  }

  /* 查看/隐藏/删除 */
  handleTableAction = async (item, action) => {
    switch (action) {
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
          await makeAjaxRequest('/index/recommendisv/dele', 'get', { isv_recommend_id: item.isvRecommendId });
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

  showAdd = () => {
    this.setState({
      formData: {
        ...this.state.formData,
        showAddModal: true,
        dataItem: {}
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
          [type]: e,
        }
      }
    })
  }

  submit = async () => {
    try {
      this.hideAddModal();
      const select = this.state.allList.find(item => {
        return item.isv_id === this.state.formData.dataItem.isv_id
      });
      await makeAjaxRequest('/index/recommendisv/save', 'post', select || {});
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
      formData,
      showDeleteModal,
      allList,
    } = this.state;
    const { activePage, content, total, items } = dataSource;
    const { showAddModal, dataItem } = formData;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="优质商家推荐" />
        <Content className={this.props.className} style={{ width: "100%", overflowX: "auto" }}>
          <div className='action-wrap'>
            <Button colors="primary" onClick={this.showAdd}>新增</Button>
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
        {/* 提示框 - 新增 */}
        <Modal
          show={showAddModal}
          style={{ marginTop: '20vh' }}
          onHide={this.hideAddModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>新增优质商家</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormList.Item label="选择商家" labelCol={100}>
              <Select
                placeholder="选择商家"
                notFoundContent="暂无数据"
                showSearch={true}
                supportWrite={true}
                optionFilterProp="children"
                className="search-item"
                onChange={this.handleFormDataChange.bind(null, "isv_id")}
                value={dataItem.isv_id}
                style={{ width: 250 }}
              >
                {
                  allList.map(item => {
                    return <Option value={item.isv_id}>{item.isv_name}</Option>
                  })
                }
              </Select>
            </FormList.Item>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideAddModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.submit} colors="primary" disabled={!dataItem.isv_id}>确认</Button>
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
            删除后,此商家将不再在前端显示.
            确认删除此商家?
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

export default styled(RecommendMerchant)`
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
.time-select {
  display: flex;
}
.action-wrap {
  text-align: right;
  padding: 20px;
  padding-right: 48px;
}
`;
