import { FormControl, Select, Table, Pagination } from "tinper-bee";
import DatePicker from 'bee-datepicker'
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
const { RangePicker } = DatePicker;
const format = "YYYY-MM-DD";
const Option = Select.Option;
class ProductCom extends React.Component {
  state = {
    dataSource: {
      content: [],
      total: 0, // 总数量
      items: 0, // 总页数
      activePage: 1, // 当前页面
      size: 10, // 每页多少
    },
    product_name: '',
    comment: '',
    start_time: '',
    end_time: '',
    product_score: '',
    comment_type: '',
  };

  columns = [
    {
      title: "编号",
      dataIndex: "order",
      width: "8%",
    },
    {
      title: "用户名",
      dataIndex: "user_name",
      width: "8%",
    },
    {
      title: "评论对象",
      dataIndex: "ProductName",
      width: "8%",
    },
    {
      title: "评论内容",
      dataIndex: "comment",
      width: "20%",
    },
    {
      title: "评分",
      dataIndex: "product_score",
      width: "8%",
    },
    { title: "IP地址", dataIndex: "ip_address", width: "10%" },
    { title: "评论时间", dataIndex: "create_time", width: "10%" },
    {
      title: "状态",
      dataIndex: "show_status",
      width: "8%",
      render: (value, item) => {
        if (value === 0 || value === '0') {
          return <a onClick={this.handleTableAction.bind(this, item, 'toggle')}>隐藏</a>
        } else {
          return <a onClick={this.handleTableAction.bind(this, item, 'toggle')}>显示</a>
        }
      }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: "20%",
      render: (value, item) => {
        return (
          <div className="actions">
            <a className='action' onClick={this.handleTableAction.bind(null, item, 'view')}>查看</a>
            <a className='action' onClick={this.handleTableAction.bind(null, item, 'delete')}>删除</a>
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
    } else {
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
      product_name: '',
      comment: '',
      start_time: '',
      end_time: '',
      product_score: '',
      comment_type: '',
    }, () => {
      this.searchList();
    });
  }

  /* 搜索 */
  searchList = async () => {
    try {
      const {
        product_name,
        comment,
        start_time,
        end_time,
        product_score,
        comment_type,
        dataSource
      } = this.state;
      const { activePage, size } = dataSource;
      const res = await makeAjaxRequest('/newcomment/getallOperateProduct', 'get', {
        page_num: activePage,
        product_name,
        comment,
        start_time,
        end_time,
        product_score,
        comment_type
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

  /* 查看/隐藏/删除 */
  handleTableAction = async (item, action) => {
    switch (action) {
      case 'view': {
        this.props.history.push(`/ProductComDetail/${item.id}`);
      }
      case 'toggle': {
        try {
          await makeAjaxRequest('/newcomment/hide', 'get', { q_manage_id: item.qManageId });
        } catch (err) {
          message.error(err.message);
        }
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
      product_name,
      comment,
      product_score,
      comment_type
    } = this.state;
    const { activePage, size, content, total, items } = dataSource;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="商品评价" />
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
              <FormList.Item label="评论内容" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={comment}
                  onChange={this.handleChange.bind(null, "comment")}
                />
              </FormList.Item>
              <FormList.Item label="" labelCol={100}>
                <Select
                  placeholder="全部评分"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "product_score")}
                  value={product_score}
                >
                  {[
                    { id: "1", stat: "1" },
                    { id: "2", stat: "2" },
                    { id: "3", stat: "3" },
                    { id: "4", stat: "4" },
                    { id: "5", stat: "5" }].map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.stat}
                      </Option>
                    ))}
                </Select>
              </FormList.Item>
              <FormList.Item label="" labelCol={100}>
                <Select
                  placeholder="全部状态"
                  className="search-item"
                  onChange={this.handleChange.bind(null, "comment_type")}
                  value={comment_type}
                >
                  {[
                    { id: "0", stat: "显示" },
                    { id: "1", stat: "隐藏" },
                    { id: "2", stat: "待审核" },
                    { id: "3", stat: "已拒绝" }].map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.stat}
                      </Option>
                    ))}
                </Select>
              </FormList.Item>
              <FormList.Item label="评价时间" labelCol={100}>
                <RangePicker
                  showClear={true}
                  className="search-item"
                  placeholder={'开始时间 ~ 结束时间'}
                  format={format}
                  onChange={this.changeDate}
                />
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
      </Fragment>
    );
  }
}

export default styled(ProductCom)`
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
