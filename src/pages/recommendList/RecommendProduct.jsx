import { FormControl, Select, Table, Pagination, Button } from "tinper-bee";
import styled from 'styled-components';
import React, { Fragment } from "react";
import "bee-form-control/build/FormControl.css";
import "bee-datepicker/build/DatePicker.css";
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
      size: 10, // 每页多少
    },
    aaa: '',
    bbb: '',
    ccc: '',
  };

  columns = [
    {
      title: "序号",
      dataIndex: "order",
      width: "10%",
    },
    {
      title: "商品名称",
      dataIndex: "aaa",
      width: "20%",
    },
    {
      title: "商品类型",
      dataIndex: "ProductName",
      width: "20%",
    },
    {
      title: "排序",
      dataIndex: "comment",
      width: "10%",
    },
    {
      title: "添加时间",
      dataIndex: "comment",
      width: "20%",
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
    this.setState({ dataSource: { ...this.state.dataSource, size: value, activePage: 1 } }, () => {
      this.searchList();
    });
  };

  /* 重置 */
  resetSearch() {
    this.setState({
      aaa: '',
      bbb: '',
      ccc: '',
    }, () => {
      this.searchList();
    });
  }

  /* 搜索 */
  searchList = async () => {
    try {
      const {
        aaa,
        bbb,
        ccc,
        dataSource
      } = this.state;
      const { activePage } = dataSource;
      const res = await makeAjaxRequest('/newcomment/getallOperateProduct', 'get', {
        page_num: activePage,
        aaa,
        bbb,
        ccc
      });
      // const res = { "data": [{ "qManageId": "74e9f34a-3423-415e-b1fc-9fda6d3b866e", "question": "问题2", "questionType": 0, "isvId": "bb635124-1ac4-491c-90fb-8d7dc8485f17", "isvName": "深圳市宏数科技有限公司", "productId": "sdfdsfdsfdsfsdf", "productName": "任意的商品名", "askTime": null, "questionStatus": 0, "isdisplay": 1, "userId": "bb635124-1ac4-491c-90fb-8d7dc8485f17", "delFlag": 0, "addTime": "2020-11-12 14:48:26", "updateTime": null }, { "qManageId": "1f77de75-f11b-486c-b42c-dcb622163e69", "question": "问题1", "questionType": 0, "isvId": "bb635124-1ac4-491c-90fb-8d7dc8485f17", "isvName": "深圳市宏数科技有限公司", "productId": "空", "productName": "空", "askTime": null, "questionStatus": 0, "isdisplay": 1, "userId": "bb635124-1ac4-491c-90fb-8d7dc8485f17", "delFlag": 0, "addTime": "2020-11-12 14:48:02", "updateTime": null }, { "qManageId": "sdfdsf", "question": "4", "questionType": 0, "isvId": "bb635124-1ac4-491c-90fb-8d7dc8485f17", "isvName": "", "productId": "bc663882-bc56-4910-a4ae-69f9a7863e18", "productName": "", "askTime": "2020-11-10 18:03:54.0", "questionStatus": 1, "isdisplay": 1, "userId": "ab635124-1ac4-491c-90fb-8d7dc8485f16", "delFlag": 0, "addTime": "2020-11-10 18:03:47", "updateTime": null }, { "qManageId": "65456456", "question": "2", "questionType": 0, "isvId": "bb635124-1ac4-491c-90fb-8d7dc8485f17", "isvName": "", "productId": "91462e8b-dba5-4256-bf13-3e1d2b884844", "productName": "", "askTime": "2020-11-10 18:03:26.0", "questionStatus": 0, "isdisplay": 1, "userId": "ab635124-1ac4-491c-90fb-8d7dc8485f15", "delFlag": 0, "addTime": "2020-11-10 18:03:39", "updateTime": null }, { "qManageId": "45tretert", "question": "1", "questionType": 1, "isvId": "bb635124-1ac4-491c-90fb-8d7dc8485f17", "isvName": "", "productId": "", "productName": "", "askTime": "2020-11-10 16:28:01.0", "questionStatus": 0, "isdisplay": 1, "userId": "ab635124-1ac4-491c-10fb-8d7dc8485f17", "delFlag": 0, "addTime": "2020-11-10 16:28:16", "updateTime": null }, { "qManageId": "dsfdsfdsfadsf", "question": "3", "questionType": 0, "isvId": "bb635124-1ac4-491c-90fb-8d7dc8485f17", "isvName": "", "productId": "bc663882-bc56-4910-a4ae-69f9a7863e18", "productName": "", "askTime": "2020-11-10 16:15:35.0", "questionStatus": 0, "isdisplay": 1, "userId": "bb635124-1ac4-491c-90fb-8d7dc8485f17", "delFlag": 0, "addTime": "2020-11-10 16:16:52", "updateTime": null }], "new_page_num": 1, "sum": 6, "status": 1, "msg": "查询成功" };
      res.data.forEach((item, index) => {
        item.order = (index + 1)
      })
      this.setState({
        dataSource: {
          ...this.state.dataSource,
          content: res.data,
          total: res.sum || 0,
          items: Math.floor((res.sum || 0) / this.state.dataSource.size) + 1
        }
      });
    } catch (err) {
      message.error(err.message);
    }
  };

  /* 编辑/删除 */
  handleTableAction = async (item, action) => {
    switch (action) {
      case 'edit': {
      }
      case 'delete': {
        try {
          await makeAjaxRequest('/newcomment/dele', 'get', { q_manage_id: item.qManageId });
        } catch (err) {
          message.error(err.message);
        }
      }
    }
  }

  render() {
    const {
      dataSource,
      aaa,
      bbb,
      ccc,
    } = this.state;
    const { activePage, content, total, items } = dataSource;
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
                  value={aaa}
                  onChange={this.handleChange.bind(null, "aaa")}
                />
              </FormList.Item>
              <FormList.Item label="一级分类" labelCol={100}>
                <Select
                  placeholder="选择一级分类"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "bbb")}
                  value={bbb}
                >
                  {[].map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.stat}
                    </Option>
                  ))}
                </Select>
              </FormList.Item>
              <FormList.Item label="二级分类" labelCol={100}>
                <Select
                  placeholder="选择二级分类"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "ccc")}
                  value={ccc}
                >
                  {[].map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.stat}
                    </Option>
                  ))}
                </Select>
              </FormList.Item>
            </FormList>
          </SearchPanel>
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
