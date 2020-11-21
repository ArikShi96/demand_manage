import React from "react";
import styled from 'styled-components';
import { Button, Tabs, Modal } from 'tinper-bee';
import Header from "../common/Header";
import Content from '../common/Content';
import FormList from "../common/Form";
import "bee-button/build/Button.css";
import { FormControl, Table, Pagination } from "tinper-bee";
import "bee-form-control/build/FormControl.css";
import "bee-button/build/Button.css";
import "bee-select/build/Select.css";
import "bee-table/build/Table.css";
import "bee-pagination/build/Pagination.css";
import "bee-tabs/build/Tabs.css";
import makeAjaxRequest from '../../util/request';
import { message } from 'antd';
const TabPane = Tabs.TabPane;
class SettingCom extends React.Component {
  state = {
    activeTabKey: '0',
    comment_set: '',
    comment_set_id: '',
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
      title: "敏感词名称",
      dataIndex: "evaluationName",
      width: "50%",
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
    this.fetchDetail();
    this.searchList();
  }

  fetchDetail = async () => {
    try {
      const res = await makeAjaxRequest('/newcomment/editQCS', 'get');
      this.setState({
        comment_set_id: res.data.commentSetId,
        comment_set: res.data.commentSet,
      });
    } catch (err) {
      message.error(err.message);
    }
  }

  submit = async () => {
    const { comment_set, comment_set_id } = this.state;
    try {
      await makeAjaxRequest('/newcomment/saveCommentSet', 'post', { comment_set, comment_set_id });
      message.success('操作成功');
      this.fetchDetail();
    } catch (err) {
      message.error(err.message)
    }
  }

  handleChange = (type, e) => {
    this.setState({
      [type]: e,
    });
  };

  handleTabChange = (key) => {
    this.setState({ activeTabKey: key });
  }

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

  searchList = async () => {
    try {
      const {
        dataSource
      } = this.state;
      const { activePage } = dataSource;
      const res = await makeAjaxRequest('/sensitive/getAll', 'get', {
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
          await makeAjaxRequest('/sensitive/dele', 'get', { evaluation_sensitive_id: item.evaluationSensitiveId });
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
        title: isEdit ? '编辑敏感词' : '新增敏感词',
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

  submitAddOrEdit = async () => {
    const { evaluationSensitiveId, evaluationName } = this.state.formData.dataItem
    try {
      this.hideAddModal()
      if (evaluationSensitiveId) {
        await makeAjaxRequest('/sensitive/editAction', 'post', {
          sensitive_id: evaluationSensitiveId,
          evaluation_name: evaluationName,
        });

      } else {
        await makeAjaxRequest('/sensitive/save', 'post', {
          evaluation_name: evaluationName
        });
      }
      this.searchList();
      message.success('操作成功')
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
    const { className } = this.props;
    const { comment_set, dataSource, formData, showDeleteModal } = this.state;
    const { content, activePage, total, items } = dataSource;
    const { showAddModal, title, dataItem } = formData;
    return (
      <div className={className}>
        <Header title="评价设置" />
        <Content style={{ width: '100%', overflowX: 'auto' }}>
          <Tabs
            ref="tabs"
            activeKey={this.state.activeTabKey}
            onChange={this.handleTabChange}
            tabBarStyle="upborder"
          >
            <TabPane tab="基本设置" key="0">
              <div className='detail-wrap'>
                <div className='label'>
                  <span>晒单/评价有效期</span>
                </div>
                <div className='content'>
                  <FormControl className="search-item"
                    value={comment_set}
                    onChange={this.handleChange.bind(null, "comment_set")}
                  />
                </div>
              </div>
              <div className='action-wrap'>
                <Button colors="primary" onClick={this.submit} disabled={!comment_set}>提交</Button>
              </div>
            </TabPane>
            <TabPane tab="敏感词" key="1">
              <div className='action-wrap-right'>
                <Button colors="primary" onClick={this.showAdd.bind(this, null)}>新建</Button>
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
            </TabPane>
          </Tabs>
        </Content>
        {/* 提示框 - 新增 */}
        <Modal
          show={showAddModal}
          style={{ marginTop: '20vh' }}
        >
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormList layoutOpt={{ md: 12, xs: 12 }}>
              <FormList.Item label="敏感词" labelCol={100}>
                <FormControl
                  className="dialog-input-item"
                  value={dataItem.evaluationName}
                  onChange={this.handleFormDataChange.bind(null, "evaluationName")}
                  style={{ width: '250px' }}
                />
              </FormList.Item>
            </FormList>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideAddModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.submitAddOrEdit} colors="primary" disabled={!dataItem.evaluationName}>确认</Button>
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
            删除后,此敏感词将不再在前端显示.
            确认删除此敏感词?
            </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideDeleteModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.confirmDelete} colors="primary">确认</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default styled(SettingCom)`
.mix-ma-page-header {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 0;
}
.content-con-wrap{
  padding: 0;
}
.detail-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0 300px 0 60px;
  margin-bottom: 40px;
  .label {
    text-align: right;
    min-width: 200px;
    flex-shrink: 0;
    margin-right: 5%;
  }
  .content {
    flex: auto;
    position: relative;
    .search-item {
      margin-bottom: 0;
    }
    .tip {
      position: absolute;
      font-pageSize: 14px;
      color: #cccccc;
    }
  }
}
.action-wrap {
  text-align: center;
  margin: 40px auto;
}
.action-wrap-right {
  text-align: right;
  padding: 20px;
  padding-right: 48px;
}
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
