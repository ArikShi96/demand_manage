import {
  FormControl,
  Button,
  Select,
  Pagination,
  Table,
  Tabs,
} from "tinper-bee";
import React, { Fragment } from "react";
import DatePicker from "bee-datepicker";
import "bee-form-control/build/FormControl.css";
import "bee-datepicker/build/DatePicker.css";
import "bee-button/build/Button.css";
import "bee-select/build/Select.css";
import "bee-table/build/Table.css";
import "bee-pagination/build/Pagination.css";
import "bee-tabs/build/Tabs.css";
import myapi from "../../api";
import Header from "../common/Header";
import Content from "../common/Content";
import FormList from "../common/Form";
import SearchPanel from "../common/SearchPanel";
import moment from "moment";

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const format = "YYYY-MM-DD";
class SearchModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      suitStatus: [],
      statusCode: [
        {
          stat: "全部",
          id: "",
        },
        {
          stat: "是",
          id: "1",
        },
        {
          stat: "否",
          id: "0",
        },
      ],
      statusPaid: [
        {
          stat: "全部",
          id: "",
        },
        {
          stat: "已支付",
          id: "1",
        },
        {
          stat: "未支付",
          id: "2",
        },
        {
          stat: "已关闭",
          id: "0",
        },
      ],
      statusFree: [
        {
          stat: "全部",
          id: "",
        },
        {
          stat: "非零",
          id: "1",
        },
        {
          stat: "零",
          id: "0",
        },
      ],
      statusOrder: [
        {
          stat: "全部",
          id: "",
        },
        {
          stat: "发票未开具",
          id: "0",
        },
        {
          stat: "发票已寄出",
          id: "1",
        },
        {
          stat: "发票开具中",
          id: "2",
        },
        {
          stat: "发票开具失败",
          id: "3",
        },
        {
          stat: "电子发票已开票",
          id: "4",
        },
      ],
      payModeCode: [
        {
          text: "全部",
          value: "",
        },
        {
          text: "公司转账",
          value: "offline",
        },
        {
          text: "畅捷支付",
          value: "chanpay",
        },
        {
          text: "新畅捷支付",
          value: "chanpay-new",
        },
        {
          text: "融联支付",
          value: "bas",
        },
      ],
      defautDomain: "", //所属子站
      notFree: "", //成交额
      recommendCode: "", //推荐码
      orderStatus: "", //支付状态
      agreementNum: "", //订单编号
      isvName: "", //服务商名称
      startTime: "", //开始时间
      endTime: "", //结束时间
      siteId: "", //所属子站
      activePage: 1,
      activeTabKey: "",
      payMode: "", //支付方式
      productName: "", //产品名称
      operatorName: "", //客户名称
    };
  }

  columns = [
    {
      title: "订单编号",
      dataIndex: "agreementNum",
      key: "agreementNum",
      width: "14%",
      render: (value) => {
        return <a onClick={this.goDetail.bind(null, value)}>{value}</a>;
      },
    },
    {
      title: "商品名称",
      dataIndex: "productName",
      key: "productName",
      width: "10%",
    },
    {
      title: "服务商",
      dataIndex: "isvName",
      key: "isvName",
      width: "12%",
    },
    {
      title: "客户名称",
      dataIndex: "operatorName",
      key: "operatorName",
      width: "10%",
    },
    {
      title: "订单原价",
      dataIndex: "originalPrice",
      key: "originalPrice",
      width: "8%",
    },
    { title: "折扣", dataIndex: "discount", key: "discount", width: "8%" },
    { title: "支付方式", dataIndex: "payMode", key: "payMode", width: "8%" },
    {
      title: "应付金额",
      dataIndex: "busiAmount",
      key: "busiAmount",
      width: "8%",
    },
    {
      title: "推荐码",
      dataIndex: "recommendCode",
      key: "recommendCode",
      width: "6%",
      render: (value) => {
        return this.renderField(value, "recommendCode");
      },
    },
    {
      title: "下单时间",
      dataIndex: "commitTime",
      key: "commitTime",
      width: "7%",
      render: (value) => {
        return value ? (
          <span>{moment(value).format("YYYY-MM-DD HH:mm:ss")}</span>
        ) : null;
      },
    },
  ];

  componentDidMount() {
    this.getSiteList();
    this.searchlist();
  }

  changeDate = (d, dataString) => {
    if (dataString && dataString.length > 0) {
      let data = dataString.split('"');
      this.setState({ startTime: data[1], endTime: data[3] });
    }
  };

  handleSelect = (e) => {
    this.setState({ activePage: e });
    this.searchlist(e - 1);
  };

  handleChange = (type, e) => {
    this.setState({
      [type]: e,
    });
  };

  dataNumSelect = (index, value) => {
    this.searchlist(0, value);
  };

  renderField = (e, type) => {
    let value = null;
    if (type === "recommendCode") {
      if (e.length > 0) {
        value = e;
      } else value = "无";
    } else if (type === "orderStatus") {
      switch (e) {
        case 0:
          value = "已关闭";
          break;
        case 1:
          value = "已支付";
          break;
        case 2:
          value = "未支付";
          break;
      }
    }
    return value;
  };

  /**重置 */
  resetfun() {
    this.setState({
      defautDomain: "", //所属子站
      notFree: "", //成交额
      recommendCode: "", //推荐码
      orderStatus: "", //支付状态
      agreementNum: "", //订单编号
      isvName: "", //服务商名称
      siteId: "", //所属子站
      payMode: "", //支付方式
      productName: "", //产品名称
      operatorName: "", //客户名称
    });
  }

  goDetail = (id) => {
    this.props.history.push(`/OrderDetail/${id}`);
  };

  /**搜索 */
  searchlist = (page = 0, size = 10, billStatus = "") => {
    let {
      startTime,
      endTime,
      notFree,
      recommendCode,
      orderStatus,
      payMode,
      productName,
      operatorName,
      siteId,
      isvName,
      agreementNum,
    } = this.state;
    fetch(
      myapi.BASE_URL +
        `/market/yonyoucloud/allOrders?agreementNum=${agreementNum}&isvName=${isvName}&startTime=${startTime}&endTime=${endTime}
        &notFree=${notFree}&billStatus=${billStatus}&recommendCode=${recommendCode}&orderStatus=${orderStatus}&siteId=${siteId}&page=${page}&size=${size}&payMode=${payMode}&productName=${productName}&operatorName=${operatorName}&isAjax=1`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          // 'Access-Control-Allow-Credentials': 'true',
          // 'Access-Control-Allow-Headers': 'X-Requested-With',
          // 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
          // 'Access-Control-Allow-Origin': '*',
        },
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        if (response.status === 1) {
          let infolist = response.data;
          this.setState({
            dataSource: infolist,
          });
        }
      });
  };

  getSiteList = () => {
    fetch(myapi.BASE_URL + `/market/productSite/getList`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        // 'Access-Control-Allow-Credentials': 'true',
        // 'Access-Control-Allow-Headers': 'X-Requested-With',
        // 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        // 'Access-Control-Allow-Origin': '*',
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === 1) {
          this.setState({
            suitStatus: response.data,
          });
        }
      });
  };

  jsonToExcel = () => {
    let { content } = this.state.dataSource;
    let jsonData = [];
    content.map((item) => {
      jsonData.push({
        agreementNum: item.agreementNum,
        productName: item.productName,
        isvName: item.isvName,
        operatorName: item.operatorName,
        originalPrice: item.originalPrice,
        discount: item.originalPrice,
        busiAmount: item.busiAmount,
        recommendCode: this.renderField(item.recommendCode, "recommendCode"),
        commitTime: moment(item.commitTime).format("YYYY-MM-DD HH:mm:ss"),
        orderStatus: this.renderField(item.orderStatus, "orderStatus"),
        payMode: item.payMode,
      });
    });
    //列标题，逗号隔开
    let str = `订单编号,商品名称,服务商,客户名称,订单原价,折扣,应付金额,推荐码,下单时间,状态,支付方式\n`;
    //增加\t为了不让表格显示科学计数法或者其他格式
    for (let i = 0; i < jsonData.length; i++) {
      for (let item in jsonData[i]) {
        str += `${jsonData[i][item] + "\t"},`;
      }
      str += "\n";
    }
    //encodeURIComponent解决中文乱码， \ufeff是 ""
    let uri = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
    //通过创建a标签实现
    let link = document.createElement("a");
    link.href = uri;
    //对下载的文件命名
    link.download = "产品列表.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //渲染顶部tab页
  getTabPane = () => {
    let {
      dataSource,
      activePage,
      statusCode,
      statusPaid,
      recommendCode,
      notFree,
      orderStatus,
      statusOrder,
      statusFree,
      isvName,
      agreementNum,
      suitStatus,
      siteId,
      payMode,
      payModeCode,
      operatorName,
      productName,
    } = this.state;
    return statusPaid.map((tabPane) => {
      let { stat, id } = tabPane;
      return (
        <TabPane tab={stat} key={id}>
          <SearchPanel
            reset={this.resetfun.bind(this)}
            search={this.searchlist.bind(this, 0, 10)}
          >
            <FormList layoutOpt={{ md: 4, xs: 4 }}>
              <FormList.Item label="客户名称" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={operatorName}
                  onChange={this.handleChange.bind(null, "operatorName")}
                />
              </FormList.Item>
              <FormList.Item label="订单编号" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={agreementNum}
                  onChange={this.handleChange.bind(null, "agreementNum")}
                />
              </FormList.Item>

              <FormList.Item label="服务商名称" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={isvName}
                  onChange={this.handleChange.bind(null, "isvName")}
                />
              </FormList.Item>

              <FormList.Item label="创建时间" labelCol={100}>
                <RangePicker
                  className="search-item"
                  placeholder={"开始 ~ 结束"}
                  format={format}
                  onChange={this.changeDate}
                />
              </FormList.Item>

              <FormList.Item label="推荐码" labelCol={100}>
                <Select
                  className="search-item"
                  onChange={this.handleChange.bind(null, "recommendCode")}
                  value={recommendCode}
                >
                  {statusCode.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.stat}
                    </Option>
                  ))}
                </Select>
              </FormList.Item>

              <FormList.Item label="所属子站" labelCol={100}>
                <Select
                  className="search-item"
                  onChange={this.handleChange.bind(null, "siteId")}
                  value={siteId}
                >
                  <Option value="">全部</Option>
                  {suitStatus && suitStatus.length > 0
                    ? suitStatus.map((item) => (
                        <Option key={item.siteId} value={item.siteId}>
                          {item.siteName}
                        </Option>
                      ))
                    : null}
                </Select>
              </FormList.Item>

              <FormList.Item label="成交额" labelCol={100}>
                <Select
                  className="search-item"
                  onChange={this.handleChange.bind(null, "notFree")}
                  value={notFree}
                >
                  {statusFree.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.stat}
                    </Option>
                  ))}
                </Select>
              </FormList.Item>
              <FormList.Item label="商品名称" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={productName}
                  onChange={this.handleChange.bind(null, "productName")}
                />
              </FormList.Item>
              <FormList.Item label="支付方式" labelCol={100}>
                <Select
                  className="search-item"
                  onChange={this.handleChange.bind(null, "payMode")}
                  value={payMode}
                >
                  {payModeCode.map((item) => (
                    <Option key={item.value} value={item.value}>
                      {item.text}
                    </Option>
                  ))}
                </Select>
              </FormList.Item>
            </FormList>
          </SearchPanel>
          <div style={{ height: "32px", margin: "10px 0" }}>
            <Button
              colors="primary"
              style={{ float: "right", marginRight: "20px" }}
              onClick={this.jsonToExcel}
            >
              列表导出
            </Button>
          </div>
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
        </TabPane>
      );
    });
  };

  //tab切换
  handleTabChange = async (key) => {
    let func = null;
    switch (key) {
      case "":
        func = await this.searchlist(0, 10, "");
        break;
      case "1":
        func = await this.searchlist(0, 10, "1");
        break;
      case "2":
        func = await this.searchlist(0, 10, "2");
        break;
      case "0":
        func = await this.searchlist(0, 10, "0");
        break;
    }
    this.setState({ activeTabKey: key });
  };

  render() {
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="订单管理" />
        <Content style={{ width: "100%", overflowX: "auto" }}>
          <Tabs
            className="order-tabs-pane"
            ref="tabsPane"
            activeKey={this.state.activeTabKey}
            onChange={this.handleTabChange}
            tabBarStyle="upborder"
          >
            {this.getTabPane()}
          </Tabs>
        </Content>
      </Fragment>
    );
  }
}

export default SearchModel;
