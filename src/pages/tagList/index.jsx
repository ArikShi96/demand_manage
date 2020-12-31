import { FormControl, Select, Table, Pagination, Button, Modal, Message } from "tinper-bee";
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
class TagList extends React.Component {
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
    labelName: '',
    labelType: '',
    showDeleteModal: false,
    deleteItem: '',
  };

  columns = [
    {
      title: "序号",
      dataIndex: "order",
      width: "10%",
    },
    {
      title: "标签名称",
      dataIndex: "labelName",
      width: "20%",
    },
    {
      title: "标签类型",
      dataIndex: "labelType",
      width: "20%",
      render: (value) => {
        return (
          <span>{{ "1": "产品标签", "2": "服务标签", "3": "行业标签" }[value]}</span>
        )
      }
    },
    {
      title: "创建时间",
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

  /* 重置 */
  resetSearch() {
    this.setState({
      labelName: '',
      comment: '',
      start_time: '',
      end_time: '',
      labelType: '',
      comment_type: '',
    }, () => {
      this.searchList();
    });
  }

  /* 搜索 */
  searchList = async () => {
    try {
      const {
        labelName,
        labelType,
        dataSource
      } = this.state;
      const { activePage, pageSize } = dataSource;
      const res = await makeAjaxRequest('/label/getLabelList', 'get', {
        start: activePage - 1,
        limit: pageSize,
        labelName,
        labelType,
      });
      const data = res.data.content || []
      data.forEach((item, index) => {
        item.order = (index + 1)
      })
      this.setState({
        dataSource: {
          ...this.state.dataSource,
          content: data,
          total: res.data.totalElements || 0,
          items: Math.floor((res.data.totalElements || 0) / this.state.dataSource.pageSize) + 1
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

  /* 新增/编辑/删除 */
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
          await makeAjaxRequest(`/label/delLabel/${item.labelId}`, 'post', {});
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
        title: isEdit ? '编辑标签' : '新增标签',
        showAddModal: true,
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
    this.state.formData.dataItem.labelName = this.state.formData.dataItem.labelName.trim();
    if (!this.state.formData.dataItem.labelName) {
      Message.create({ content: '请输入标签名称', color: 'danger' });
      return false;
    }
    return true;
  }

  submit = async () => {
    if (!this.checkValidation()) {
      return;
    }
    const { dataItem } = this.state.formData;
    const { labelName, labelType, labelId } = dataItem;
    try {
      this.hideAddModal();
      if (labelId) {
        await makeAjaxRequest(`/label/updateLabel`, 'post', {}, {
          labelName,
          labelType,
          labelId,
        });
      } else {
        await makeAjaxRequest(`/label/addLabel`, 'post', {}, {
          labelName,
          labelType
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

  confirmDelete = () => {
    this.handleTableAction(this.state.deleteItem, 'confirmDelete')
  }

  render() {
    const {
      dataSource,
      formData,
      labelName,
      labelType,
      showDeleteModal,
    } = this.state;
    const { showAddModal, title, dataItem } = formData;
    const { activePage, content, total, items } = dataSource;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="标签管理" />
        <Content className={this.props.className} style={{ width: "100%", overflowX: "auto" }}>
          <SearchPanel
            reset={this.resetSearch.bind(this)}
            search={this.searchList.bind(this)}
          >
            <FormList layoutOpt={{ md: 4, xs: 4 }}>
              <FormList.Item label="标签名称" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={labelName}
                  onChange={this.handleChange.bind(null, "labelName")}
                />
              </FormList.Item>
              <FormList.Item label="标签类型" labelCol={100}>
                <Select
                  placeholder="选择标签类型"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "labelType")}
                  value={labelType}
                >
                  {[
                    { id: "1", stat: "产品标签" },
                    { id: "2", stat: "服务标签" },
                    { id: "3", stat: "行业标签" }].map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.stat}
                      </Option>
                    ))}
                </Select>
              </FormList.Item>
            </FormList>
          </SearchPanel>
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
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormList layoutOpt={{ md: 12, xs: 12 }}>
              <FormList.Item label="标签类型" labelCol={100}>
                <Select
                  placeholder="选择标签类型"
                  className="dialog-input-item"
                  onChange={this.handleFormDataChange.bind(null, "labelType")}
                  value={dataItem.labelType}
                  style={{ width: '250px' }}
                >
                  {[
                    { id: "1", stat: "产品标签" },
                    { id: "2", stat: "服务标签" },
                    { id: "3", stat: "行业标签" }].map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.stat}
                      </Option>
                    ))}
                </Select>
              </FormList.Item>
              <FormList.Item label="标签名称" labelCol={100}>
                <FormControl
                  className="dialog-input-item"
                  value={dataItem.labelName}
                  onChange={this.handleFormDataChange.bind(null, "labelName")}
                  style={{ width: '250px' }}
                />
              </FormList.Item>
            </FormList>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideAddModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button
              onClick={this.submit}
              colors="primary"
              disabled={!dataItem.labelName || (!dataItem.labelType && dataItem.labelType !== 0)}
            >
              确认
            </Button>
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
            删除后,此标签名称将不再在前端显示.
            确认删除此标签?
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

export default styled(TagList)`
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
