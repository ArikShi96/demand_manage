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
class ArticleList extends React.Component {
  state = {
    dataSource: {
      content: [],
      total: 0, // 总数量
      items: 0, // 总页数
      activePage: 1, // 当前页面
      pageSize: 10, // 每页多少
    },
    isv_name: '',
    article_title: '',
    article_type: '',
    showDeleteModal: false,
    deleteItem: '',
  };

  columns = [
    {
      title: "编号",
      dataIndex: "order",
      width: "10%",
    },
    {
      title: "服务商",
      dataIndex: "isvName",
      width: "20%",
    },
    {
      title: "文章标题",
      dataIndex: "articleTitle",
      width: "10%",
    },
    {
      title: "类型",
      dataIndex: "articleType",
      width: "10%",
      render: (value) => {
        if (value === 0 || value === '0') {
          return <span>动态</span>
        } else {
          return <span>文库</span>
        }
      }
    },
    {
      title: "展示状态",
      dataIndex: "isdisplay",
      width: "10%",
      render: (value) => {
        if (value === 0 || value === '0') {
          return <span>隐藏</span>
        } else {
          return <span>显示</span>
        }
      }
    },
    { title: "时间", dataIndex: "addTime", width: "20%" },
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
      isv_name: '',
      article_title: '',
      article_type: '',
    }, () => {
      this.searchList();
    });
  }

  /* 搜索 */
  searchList = async () => {
    try {
      const {
        isv_name,
        article_title,
        article_type,
        dataSource
      } = this.state;
      const { activePage } = dataSource;
      const res = await makeAjaxRequest('/article/getOperateList', 'get', {
        page_num: activePage,
        isv_name,
        article_title,
        article_type,
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

  /* 查看/隐藏/删除 */
  handleTableAction = async (item, action) => {
    switch (action) {
      case 'view': {
        this.props.history.push(`/ArticleDetail/${item.articleId}`);
        break;
      }
      case 'toggle': {
        try {
          await makeAjaxRequest('/article/updateIsdisplay', 'get', {
            article_id: item.articleId,
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
          await makeAjaxRequest('/article/deleOperate', 'get', { article_id: item.articleId });
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
    const {
      dataSource,
      isv_name,
      article_title,
      article_type,
      showDeleteModal,
    } = this.state;
    const { activePage, content, total, items } = dataSource;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="文章管理" />
        <Content className={this.props.className} style={{ width: "100%", overflowX: "auto" }}>
          <SearchPanel
            reset={this.resetSearch.bind(this)}
            search={this.searchList.bind(this)}
          >
            <FormList layoutOpt={{ md: 4, xs: 4 }}>
              <FormList.Item label="文章标题" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={article_title}
                  onChange={this.handleChange.bind(null, "article_title")}
                />
              </FormList.Item>
              <FormList.Item label="服务商" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={isv_name}
                  onChange={this.handleChange.bind(null, "isv_name")}
                />
              </FormList.Item>
              <FormList.Item label="" labelCol={100}>
                <Select
                  placeholder="选择类型"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "article_type")}
                  value={article_type}
                >
                  {[{ id: "0", stat: "动态" }, { id: "1", stat: "文库" }].map((item) => (
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
            删除后,此文章将不再在前端显示.
            确认删除此文章?
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

export default styled(ArticleList)`
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
