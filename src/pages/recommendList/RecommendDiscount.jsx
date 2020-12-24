import { Table, Button, Modal, Select } from "tinper-bee";
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
const { Option } = Select;
class RecommendDiscount extends React.Component {
  state = {
    dataSource: {
      content: [],
      total: 0, // 总数量
      items: 0, // 总页数
      activePage: 1, // 当前页面
      pageSize: 10, // 每页多少
    },
    class_pros: [],
    formData: {
      dataItem: {}
    },
    showDeleteModal: false,
    deleteItem: ''
  };

  columns = [
    {
      title: "序号",
      dataIndex: "order",
      width: "25%",
    },
    {
      title: "商品名称",
      dataIndex: "productName",
      width: "25%",
    },
    // {
    //   title: "商品类型",
    //   dataIndex: "productType",
    //   width: "20%",
    // },
    {
      title: "添加时间",
      dataIndex: "addTime",
      width: "25%",
      render: (value) => {
        return (
          <span>{value}</span>
        );
      }
    },
    {
      title: "操作",
      dataIndex: "preferentialProductId",
      width: "25%",
      render: (value, item) => {
        return (
          <div className="actions">
            {/* <a className='action' onClick={this.handleTableAction.bind(null, item, 'edit')}>编辑</a> */}
            {value ?
              <a className='action' onClick={this.handleTableAction.bind(null, item, 'delete')}>删除</a> :
              <a className='action' onClick={this.showAdd.bind(null, false)}>添加</a>}
          </div>
        );
      },
    },
  ];

  componentDidMount() {
    this.searchList();
    this.fetchClassProducts();
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
        dataSource
      } = this.state;
      const { activePage, pageSize } = dataSource;
      const res = await makeAjaxRequest('/preferential/getPreferentialList', 'get', {
        start: activePage - 1,
        limit: pageSize,
      });
      // 不够四条，补充空数据
      while (res.data.content.length < 4) {
        res.data.content.push({})
      }
      res.data.content.forEach((item, index) => {
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

  /* 分类 */
  fetchClassProducts = async () => {
    try {
      const res = await makeAjaxRequest('/preferential/getSelectProduct', 'get');
      this.setState({
        class_pros: res.data || []
      })
    } catch (err) {
      message.error(err.message);
    }
  };

  /* 编辑/删除 */
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
          await makeAjaxRequest(`/preferential/del`, 'post', {
            id: item.preferentialProductId
          });
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
        title: isEdit ? '编辑商品' : '新增商品',
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
    });
  }

  submit = async () => {
    const { preferentialProductId, productId, position } = this.state.formData.dataItem;
    const product = this.state.class_pros.find(pro => {
      return pro.productId === productId
    })
    try {
      this.hideAddModal();
      if (preferentialProductId) {
        await makeAjaxRequest('/link/updatePreferential', 'post', {}, {
          preferentialProductId,
          productId: productId,
          productName: product.productName,
          position: position || this.getCurrentPosition() //排列位置
        });
      } else {
        await makeAjaxRequest('/preferential/save', 'post', {}, {
          productId: productId,
          productName: product.productName,
          position: this.getCurrentPosition() //排列位置
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

  getCurrentPosition() {
    let position = 0;
    this.state.dataSource.content.forEach(item => {
      position = item.position > position ? item.position : position
    });
    return position + 1;
  }

  render() {
    const {
      dataSource,
      formData,
      showDeleteModal,
      class_pros,
    } = this.state;
    const { content } = dataSource;
    const { showAddModal, dataItem } = formData;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="特惠商品列表" />
        <Content className={this.props.className} style={{ width: "100%", overflowX: "auto" }}>
          {/* <div className='action-wrap'>
            <Button colors="primary" onClick={this.showAdd.bind(this, false)}>新增</Button>
          </div> */}
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
          <Modal.Body><FormList.Item label="选择商品" labelCol={100}>
            <Select
              placeholder="选择商品"
              className="search-item"
              onChange={this.handleFormDataChange.bind(null, "productId")}
              value={dataItem.productId}
            >
              {class_pros.map((item) => (
                <Option key={item.productId} value={item.productId}>
                  {item.productName}
                </Option>
              ))}
            </Select>
          </FormList.Item>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideAddModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.submit} colors="primary" disabled={!dataItem.productId}>确认</Button>
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
            删除后,此商品将不再在前端显示.
            确认删除此商品?
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

export default styled(RecommendDiscount)`
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
.action-wrap {
  text-align: right;
  padding: 20px;
  padding-right: 48px;
}
`;
