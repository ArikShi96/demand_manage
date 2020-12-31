import { Table, Button, Modal, Select, Pagination } from "tinper-bee";
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
class RecommendCloud extends React.Component {
  state = {
    dataSource: {
      content: [],
      total: 0, // 总数量
      items: 0, // 总页数
      activePage: 1, // 当前页面
      pageSize: 10, // 每页多少
    },
    class_sun_ids: [],
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
      width: "20%",
    },
    {
      title: "商品名称",
      dataIndex: "productName",
      width: "20%",
    },
    {
      title: "商品类型",
      dataIndex: "categoryName",
      width: "20%",
    },
    {
      title: "添加时间",
      dataIndex: "addTime",
      width: "20%",
      render: (value) => {
        return (
          <span>{value}</span>
        );
      }
    },
    {
      title: "操作",
      dataIndex: "productRecommendId",
      width: "20%",
      render: (value, item) => {
        return (
          <div className="actions">
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
    this.fetchClassIds2();
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
      const res = await makeAjaxRequest('/recommend/getRecommendList', 'get', {
        start: activePage - 1,
        limit: pageSize,
        type: '1'
      });
      while (res.data.content.length < 5) {
        res.data.content.push({});
      }
      (res.data.content || []).forEach((item, index) => {
        item.order = (index + 1)
      })
      this.setState({
        dataSource: {
          ...this.state.dataSource,
          content: res.data.content || [],
          total: res.data.totalCount || 0,
          items: Math.floor((res.data.totalCount || 0) / this.state.dataSource.pageSize) + 1
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

  fetchClassIds2 = async () => {
    try {
      const res = await makeAjaxRequest('/recommend/getProductCategory2', 'get', {
        category_name: "云平台服务"
      });
      this.setState({
        class_sun_ids: res.data || [],
        class_pros: []
      })
    } catch (err) {
      message.error(err.message);
    }
  };
  fetchClassProducts = async (class_sun_id) => {
    try {
      const res = await makeAjaxRequest('/hot/sale/selectProduct', 'get', {
        product_name: "",
        product_category2: class_sun_id
      });
      this.setState({
        class_pros: res.data || []
      });
    } catch (err) {
      this.setState({
        class_pros: []
      });
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
          await makeAjaxRequest(`/recommend/delRecommend/${item.productRecommendId}`, 'get');
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
      class_pros: [],
      formData: {
        ...this.state.formData,
        showAddModal: true,
        title: isEdit ? '编辑商品' : '新增商品',
        dataItem: item || {}
      }
    }, async () => {
      if (isEdit && item) {
        await this.fetchClassProducts(item.class_sun_id);
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
    if (type === 'class_sun_id') {
      this.fetchClassProducts(e);
      this.state.formData.dataItem.product_id = "";
      this.forceUpdate();
    }
  }

  submit = async () => {
    const { productRecommendId, product_id, position } = this.state.formData.dataItem;
    const product = this.state.class_pros.find(pro => {
      return pro.product_id === product_id
    });
    try {
      this.hideAddModal();
      if (productRecommendId) {
        await makeAjaxRequest('/recommend/updateRecommend', 'post', {}, {
          productRecommendId,
          type: "1",
          position: position || this.getCurrentPosition(),
          productId: product_id,
          productName: product.product_name
        });
      } else {
        await makeAjaxRequest('/recommend/addRecommend', 'post', {}, {
          type: "1",
          position: this.getCurrentPosition(),
          productId: product_id,
          productName: product.product_name
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
      class_sun_ids,
      class_pros,
    } = this.state;
    const { content, activePage, total, items } = dataSource;
    const { showAddModal, dataItem } = formData;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="云平台产品推荐列表" />
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
          onHide={this.hideAddModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>{formData.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormList.Item label="一级分类" labelCol={100}>
              <div>云平台</div>
            </FormList.Item>
            <FormList.Item label="二级分类" labelCol={100}>
              <Select
                placeholder="选择二级分类"
                notFoundContent="暂无数据"
                className="search-item"
                onChange={this.handleFormDataChange.bind(null, "class_sun_id")}
                value={dataItem.class_sun_id}
              >
                {class_sun_ids.map((item) => (
                  <Option key={item.category_id2} value={item.category_id2}>
                    {item.category_name}
                  </Option>
                ))}
              </Select>
            </FormList.Item>
            <FormList.Item label="选择商品" labelCol={100}>
              <Select
                placeholder="选择商品"
                notFoundContent="暂无数据"
                showSearch={true}
                supportWrite={true}
                optionFilterProp="children"
                className="search-item"
                onChange={this.handleFormDataChange.bind(null, "product_id")}
                value={dataItem.product_id}
              >
                {class_pros.map((item) => (
                  <Option key={item.product_id} value={item.product_id}>
                    {item.product_name}
                  </Option>
                ))}
              </Select>
            </FormList.Item>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideAddModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.submit} colors="primary" disabled={!dataItem.product_id}>确认</Button>
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

export default styled(RecommendCloud)`
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
