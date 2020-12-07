import { FormControl, Select, Table, Pagination, Button, Modal } from "tinper-bee";
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
class RecommendProduct extends React.Component {
  state = {
    dataSource: {
      content: [],
      total: 0, // 总数量
      items: 0, // 总页数
      activePage: 1, // 当前页面
      pageSize: 10, // 每页多少
    },
    product_name: '',
    class_id: '',
    class_sun_id: '',
    class_ids: [],
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
      width: "10%",
    },
    {
      title: "商品名称",
      dataIndex: "product_name",
      width: "20%",
    },
    {
      title: "商品类型",
      dataIndex: "type",
      width: "20%",
    },
    {
      title: "排序",
      dataIndex: "sort",
      width: "10%",
      render: (value, item) => {
        return (
          <FormControl
            data-id={item.hot_sale_product_id}
            className="search-item"
            value={value}
            onChange={this.handleSortChange.bind(null, item)}
          />
        );
      }
    },
    {
      title: "添加时间",
      dataIndex: "addTime",
      width: "20%",
      render: (value) => {
        return (
          <span>{new Date(value).toLocaleString()}</span>
        );
      }
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
    this.fetchClassIds();
    // 绑定回车事件
    if (!this.tableRef || !this.tableRef.bodyTable) {
      return;
    }
    this.tableRef.bodyTable.addEventListener('keypress', (event) => {
      if (event.target.className.includes('u-form-control') && event.keyCode === 13) {
        const sort = event.target.value;
        this.setSort(event.target.dataset.id, sort);
        event.target.blur();
      }
    });
  }

  handleChange = (type, e) => {
    this.setState({
      [type]: e,
    }, () => {
      if (type === 'class_id') {
        this.fetchClassIds2()
      }
    });
  };

  handleSortChange = (item, e) => {
    item.sort = e;
    this.forceUpdate();
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
      product_name: '',
      class_id: '',
      class_sun_id: '',
      class_sun_ids: []
    }, () => {
      this.searchList();
    });
  }

  /* 搜索 */
  searchList = async () => {
    try {
      const {
        product_name,
        class_id,
        class_sun_id,
        dataSource
      } = this.state;
      const { activePage } = dataSource;
      const res = await makeAjaxRequest('/hot/sale/getHotSaleList', 'get', {
        page_num: activePage,
        product_name,
        class_id,
        class_sun_id
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
      message.error(err.message);
    }
  };

  /* 排序 */
  setSort = async (id, sort) => {
    try {
      const res = await makeAjaxRequest('/hot/sale/editSort', 'post', {}, {
        hotSaleProductId: id,
        sort
      });
      message.success('操作成功');
      this.searchList();
    } catch (err) {
      message.error(err.message);
    }
  };

  /* 分类 */
  fetchClassIds = async () => {
    try {
      const res = await makeAjaxRequest('/hot/sale/getProductCategory1', 'get', {});
      this.setState({
        class_ids: res.data || []
      })
    } catch (err) {
      message.error(err.message);
    }
  };
  fetchClassIds2 = async (class_id) => {
    try {
      const res = await makeAjaxRequest('/hot/sale/getProductCategory2', 'get', {
        category_id: class_id || this.state.class_id
      });
      this.setState({
        class_sun_ids: res.data || [],
        class_pros: []
      })
    } catch (err) {
      message.error(err.message);
    }
  };
  fetchClassProducts = async (class_id, class_sun_id) => {
    try {
      const res = await makeAjaxRequest('/hot/sale/selectProduct', 'get', {
        product_name: "",
        product_category2: class_sun_id || this.state.class_sun_id
      });
      this.setState({
        class_pros: res.data || []
      })
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
          await makeAjaxRequest(`/hot/sale/delHotSale/${item.hot_sale_product_id}`, 'get');
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
      class_sun_ids: [],
      class_pros: [],
      formData: {
        ...this.state.formData,
        showAddModal: true,
        title: isEdit ? '编辑商品' : '新增商品',
        dataItem: item || {}
      }
    }, async () => {
      if (isEdit && item) {
        await this.fetchClassIds2(item.class_id);
        await this.fetchClassProducts(item.class_id, item.class_sun_id);
      }
    });
  }

  hideAddModal = () => {
    this.setState({
      class_sun_ids: [],
      class_pros: [],
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
    if (type === 'class_id') {
      this.fetchClassIds2(e);
    }
    if (type === 'class_sun_id') {
      this.fetchClassProducts(this.state.formData.dataItem.class_id, e);
    }
  }

  submit = async () => {
    const { hot_sale_product_id } = this.state.formData.dataItem;
    const { class_id, class_sun_id, product_id } = this.state.formData.dataItem;
    const product = this.state.class_pros.find(pro => {
      return pro.product_id === product_id
    })
    try {
      this.hideAddModal();
      if (hot_sale_product_id) {
        await makeAjaxRequest('/hot/sale/updateHotSale', 'post', {}, {
          productId: product_id,
          productName: product.product_name,
          hotSaleProductId: hot_sale_product_id,
          classId: class_id,
          classSunId: class_sun_id,
        });
      } else {
        await makeAjaxRequest('/hot/sale/addHotSale', 'post', {}, {
          productId: product_id,
          productName: product.product_name,
          classId: class_id,
          classSunId: class_sun_id,
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
      product_name,
      class_id,
      class_sun_id,
      class_ids,
      class_sun_ids,
      class_pros,
      formData,
      showDeleteModal,
    } = this.state;
    const { activePage, content, total, items } = dataSource;
    const { showAddModal, dataItem } = formData;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="热销商品列表" />
        <Content className={this.props.className} style={{ width: "100%", overflowX: "auto" }}>
          <SearchPanel
            reset={this.resetSearch.bind(this)}
            search={this.searchList.bind(this)}
          >
            <FormList layoutOpt={{ md: 4, xs: 4 }}>
              <FormList.Item label="商品名称" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={product_name}
                  onChange={this.handleChange.bind(null, "product_name")}
                />
              </FormList.Item>
              <FormList.Item label="一级分类" labelCol={100}>
                <Select
                  placeholder="选择一级分类"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "class_id")}
                  value={class_id}
                >
                  {class_ids.map((item) => (
                    <Option key={item.category_id1} value={item.category_id1}>
                      {item.category_name}
                    </Option>
                  ))}
                </Select>
              </FormList.Item>
              <FormList.Item label="二级分类" labelCol={100}>
                <Select
                  placeholder="选择二级分类"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "class_sun_id")}
                  value={class_sun_id}
                >
                  {class_sun_ids.map((item) => (
                    <Option key={item.category_id2} value={item.category_id2}>
                      {item.category_name}
                    </Option>
                  ))}
                </Select>
              </FormList.Item>
            </FormList>
          </SearchPanel>
          <div className='action-wrap'>
            <Button colors="primary" onClick={this.showAdd.bind(this, false)}>新增</Button>
          </div>
          <Table ref={(ref) => this.tableRef = ref} rowKey="order" columns={this.columns} data={content} />
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
            <FormList.Item label="选择分类" labelCol={100}>
              <Select
                placeholder="选择一级分类"
                className="search-item"
                onChange={this.handleFormDataChange.bind(null, "class_id")}
                value={dataItem.class_id}
              >
                {class_ids.map((item) => (
                  <Option key={item.category_id1} value={item.category_id1}>
                    {item.category_name}
                  </Option>
                ))}
              </Select>
            </FormList.Item>
            <FormList.Item label="选择分类" labelCol={100}>
              <Select
                placeholder="选择二级分类"
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
            <Button onClick={this.submit} colors="primary" disabled={!dataItem.class_id || !dataItem.class_sun_id || !dataItem.product_id}>确认</Button>
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

export default styled(RecommendProduct)`
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
