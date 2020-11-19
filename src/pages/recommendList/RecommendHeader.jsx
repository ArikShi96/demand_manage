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
      size: 10, // 每页多少
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
      dataIndex: "username",
      width: "30%",
    },
    {
      title: "跳转链接",
      dataIndex: "navigation_url",
      width: "20%",
    },
    {
      title: "添加时间",
      dataIndex: "addTime",
      width: "20%",
    },
    {
      title: "操作",
      dataIndex: "in_id",
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
    this.setState({ dataSource: { ...this.state.dataSource, size: value, activePage: 1 } }, () => {
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
          items: Math.floor((res.sum || 0) / this.state.dataSource.size) + 1
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
      case 'delete': {
        this.setState({
          showDeleteModal: true
        })
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
          [type]: e,
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
      formData,
      showDeleteModal,
    } = this.state;
    const { activePage, content, total, items } = dataSource;
    const { showAddModal, dataItem } = formData;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="首页顶部导航管理" />
        <Content className={this.props.className} style={{ width: "100%", overflowX: "auto" }}>
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
                value={dataItem.username}
                onChange={this.handleFormDataChange.bind(null, "username")}
                style={{ width: 250 }}
              />
            </FormList.Item>
            <FormList.Item label="跳转链接" labelCol={100}>
              <FormControl
                className="search-item"
                value={dataItem.navigation_url}
                onChange={this.handleFormDataChange.bind(null, "navigation_url")}
                style={{ width: 250 }}
              />
            </FormList.Item>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideAddModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.submit} colors="primary">确认</Button>
          </Modal.Footer>
        </Modal>
        {/* 提示框 - 删除 */}
        <Modal
          show={showDeleteModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>删除提示</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
