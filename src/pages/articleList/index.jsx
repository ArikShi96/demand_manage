import { FormControl, Select, Pagination, Table } from "tinper-bee";
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

const Option = Select.Option;
class SearchModel extends React.Component {
  state = {
    dataSource: {
      content: [],
      last: false,
      totalElements: 0,
      totalPages: 0,
      firstPage: true,
      lastPage: false,
      number: 0,
      size: 10,
      sort: [],
      numberOfElements: 0,
      first: true,
    },
  };

  columns = [
    {
      title: "编号",
      dataIndex: "order",
      key: "agreementNum",
      width: "5%",
    },
    {
      title: "问题描述",
      dataIndex: "productName",
      key: "productName",
      width: "20%",
    },
    {
      title: "类型",
      dataIndex: "isvName",
      key: "isvName",
      width: "8%",
    },
    {
      title: "服务商",
      dataIndex: "operatorName",
      key: "operatorName",
      width: "8%",
    },
    {
      title: "商品名称",
      dataIndex: "originalPrice",
      key: "originalPrice",
      width: "8%",
    },
    { title: "提问时间", dataIndex: "discount", key: "discount", width: "15%" },
    { title: "问题状态", dataIndex: "payMode", key: "payMode", width: "8%" },
    {
      title: "展示状态",
      dataIndex: "busiAmount",
      key: "busiAmount",
      width: "8%",
    },
    {
      title: "操作",
      dataIndex: "commitTime",
      key: "commitTime",
      width: "20%",
      render: (value) => {
        return value ? (
          <div>
            <a>查看</a>
            <a>隐藏</a>
            <a>删除</a>
          </div>
        ) : null;
      },
    },
  ];

  componentDidMount() {
    this.searchList();
  }

  changeDate = (d, dataString) => {
    if (dataString && dataString.length > 0) {
      let data = dataString.split('"');
      this.setState({ startTime: data[1], endTime: data[3] });
    }
  };

  handleSelect = (e) => {
    this.setState({ activePage: e });
    this.searchList(e - 1);
  };

  handleChange = (type, e) => {
    this.setState({
      [type]: e,
    });
  };

  dataNumSelect = (index, value) => {
    this.searchList(0, value);
  };

  /* 重置 */
  resetSearch() {
    this.setState({});
  }

  /* 搜索 */
  searchList = (page = 0, size = 10) => {};

  render() {
    const { dataSource, aaa, bbb, ccc, ddd, eee } = this.state;
    const { first, last, prev, next, activePage } = dataSource;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="文章管理" />
        <Content style={{ width: "100%", overflowX: "auto" }}>
          <SearchPanel
            reset={this.resetSearch.bind(this)}
            search={this.searchList.bind(this, 0, 10)}
          >
            <FormList layoutOpt={{ md: 4, xs: 4 }}>
              <FormList.Item label="文章标题" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={aaa}
                  onChange={this.handleChange.bind(null, "aaa")}
                />
              </FormList.Item>
              <FormList.Item label="服务商" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={aaa}
                  onChange={this.handleChange.bind(null, "bbb")}
                />
              </FormList.Item>
              <FormList.Item label="类型" labelCol={100}>
                <Select
                  className="search-item"
                  onChange={this.handleChange.bind(null, "ddd")}
                  value={ddd}
                >
                  {[{ id: "1", stat: "1" }].map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.stat}
                    </Option>
                  ))}
                </Select>
              </FormList.Item>
            </FormList>
          </SearchPanel>
          <Table columns={this.columns} data={dataSource.content} />
          <Pagination
            first
            last
            prev
            next
            maxButtons={5}
            boundaryLinks
            activePage={activePage}
            onSelect={this.handleSelect}
            onDataNumSelect={this.dataNumSelect}
            showJump={true}
            noBorder={true}
            total={dataSource.totalElements}
            items={dataSource.totalPages}
          />
        </Content>
      </Fragment>
    );
  }
}

export default SearchModel;
