import { Table, Pagination, Button, Modal, FormControl } from "tinper-bee";
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
import makeAjaxRequest from '../../util/request';
import { message } from 'antd';
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
    showDeleteModal: false,
    deleteItem: ''
  };

  columns = [
    {
      title: "名称",
      dataIndex: "linksName",
      width: "20%",
    },
    {
      title: "链接",
      dataIndex: "linksUrl",
      width: "30%",
    },
    {
      title: "排序",
      dataIndex: "sort",
      width: "30%",
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: "20%",
      render: (value, item) => {
        return (
          <div className="actions">
            <a className='action' onClick={this.handleTableAction.bind(null, item, 'edit')}>编辑</a>
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

  /* 搜索 */
  searchList = async () => {
    try {
      const {
        dataSource,
      } = this.state;
      const { activePage, pageSize } = dataSource;
      const res = await makeAjaxRequest('/link/getLinkList', 'get', {
        start: activePage - 1,
        pageSize
      });
      (res.data.content || []).forEach((item, index) => {
        item.order = (index + 1)
      })
      this.setState({
        dataSource: {
          ...this.state.dataSource,
          content: res.data.content || [],
          total: res.data.totalElements || 0,
          items: Math.floor((res.data.totalElements || 0) / this.state.dataSource.pageSize) + 1
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
          await makeAjaxRequest(`/link/delLink/${item.linksId}`, 'get');
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
        title: isEdit ? '编辑友情链接' : '新增友情链接',
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
          [type]: e,
        }
      }
    })
  }

  submit = async () => {
    const { linksId, linksName, linksUrl, sort } = this.state.formData.dataItem;
    try {
      this.hideAddModal();
      if (linksId) {
        await makeAjaxRequest('/link/updateLink', 'post', {}, {
          linksId,
          linksName,
          linksUrl,
          sort
        });
      } else {
        await makeAjaxRequest('/link/addLink', 'post', {}, {
          linksName,
          linksUrl,
          sort
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
      formData,
      showDeleteModal,
    } = this.state;
    const { activePage, content, total, items } = dataSource;
    const { showAddModal, dataItem } = formData;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="友情链接管理" />
        <Content className={this.props.className} style={{ width: "100%", overflowX: "auto" }}>
          <div className='action-wrap'>
            <Button colors="primary" onClick={this.showAdd.bind(this, false)}>新增</Button>
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
        >
          <Modal.Header closeButton>
            <Modal.Title>{formData.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormList.Item label="名称" labelCol={100}>
              <FormControl
                className="search-item"
                value={dataItem.linksName}
                onChange={this.handleFormDataChange.bind(null, "linksName")}
                style={{ width: 250 }}
              />
            </FormList.Item>
            <FormList.Item label="链接" labelCol={100}>
              <FormControl
                className="search-item"
                value={dataItem.linksUrl}
                onChange={this.handleFormDataChange.bind(null, "linksUrl")}
                style={{ width: 250 }}
              />
            </FormList.Item>
            <FormList.Item label="排序" labelCol={100}>
              <FormControl
                className="search-item"
                value={dataItem.sort}
                onChange={this.handleFormDataChange.bind(null, "sort")}
                style={{ width: 250 }}
              />
            </FormList.Item>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideAddModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button
              onClick={this.submit}
              colors="primary"
              disabled={!dataItem.linksName || !dataItem.linksUrl || (!dataItem.sort && dataItem.sort !== 0)}
            >
              确认
            </Button>
          </Modal.Footer>
        </Modal>
        {/* 提示框 - 删除 */}
        <Modal
          show={showDeleteModal}
          style={{ marginTop: '20vh' }}
        >
          <Modal.Header closeButton>
            <Modal.Title>删除提示</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            删除后,此链接将不再在前端显示.
            确认删除此链接?
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
