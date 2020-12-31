import { Table, Button, Modal, FormControl, Message } from "tinper-bee";
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
    deleteItem: '',
    showDeleteModal: false,
  };

  columns = [
    {
      title: "序号",
      dataIndex: "order",
      width: "10%",
    },
    {
      title: "名称",
      dataIndex: "name",
      width: "30%",
    },
    {
      title: "跳转链接",
      dataIndex: "navigationUrl",
      width: "20%",
    },
    {
      title: "添加时间",
      dataIndex: "addTime",
      width: "20%",
    },
    {
      title: "操作",
      dataIndex: "indexNavigationId",
      width: "20%",
      render: (value, item) => {
        return (
          <div className="actions">
            {value && <a className='action' onClick={this.handleTableAction.bind(null, item, 'edit')}>编辑</a>}
            {value && <a className='action' onClick={this.handleTableAction.bind(null, item, 'delete')}>删除</a>}
            {!value && <a className='action' onClick={this.handleTableAction.bind(null, item, 'add')}>添加</a>}
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
      const res = await makeAjaxRequest('/index/navigation/getAll', 'get', {
        page_num: activePage,
      });
      const data = res.data || [];
      while (data.length < 5) {
        data.push({})
      }
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
          await makeAjaxRequest('/index/navigation/dele', 'get', { in_id: item.indexNavigationId });
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
          [type]: e,
        }
      }
    })
  }

  checkValidation = () => {
    this.state.formData.dataItem.name = this.state.formData.dataItem.name.trim();
    this.state.formData.dataItem.navigationUrl = this.state.formData.dataItem.navigationUrl.trim();
    if (!this.state.formData.dataItem.name) {
      Message.create({ content: '请输入顶部导航名称', color: 'danger' });
      return false;
    }
    if (!this.state.formData.dataItem.navigationUrl) {
      Message.create({ content: '请输入跳转链接', color: 'danger' });
      return false;
    }
    return true;
  }

  submit = async () => {
    if (!this.checkValidation()) {
      return;
    }
    const { dataItem } = this.state.formData;
    const { indexNavigationId, name, navigationUrl } = dataItem;
    try {
      this.hideAddModal();
      if (indexNavigationId) {
        await makeAjaxRequest('/index/navigation/editQuerSave', 'post', {
          in_id: indexNavigationId,
          name,
          navigation_url: navigationUrl
        });
      } else {
        await makeAjaxRequest('/index/navigation/save', 'post', {
          name,
          navigation_url: navigationUrl
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
    const { content } = dataSource;
    const { showAddModal, dataItem } = formData;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="首页顶部导航管理" />
        <Content className={this.props.className} style={{ width: "100%", overflowX: "auto" }}>
          <Table rowKey="order" columns={this.columns} data={content} />
          {/* <Pagination
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
          /> */}
        </Content>
        {/* 提示框 - 新增 */}
        <Modal
          show={showAddModal}
          style={{ marginTop: '20vh' }}
          onHide={this.hideAddModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>{formData.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormList.Item label="名称" labelCol={100}>
              <FormControl
                className="search-item"
                value={dataItem.name}
                onChange={this.handleFormDataChange.bind(null, "name")}
                style={{ width: 250 }}
              />
            </FormList.Item>
            <FormList.Item label="跳转链接" labelCol={100}>
              <FormControl
                className="search-item"
                value={dataItem.navigationUrl}
                onChange={this.handleFormDataChange.bind(null, "navigationUrl")}
                style={{ width: 250 }}
              />
            </FormList.Item>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideAddModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.submit} colors="primary" disabled={!dataItem.name || !dataItem.navigationUrl}>确认</Button>
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
            删除后,此顶部导航将不再在前端显示.
            确认删除此顶部导航?
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
`;
