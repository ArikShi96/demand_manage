import {
  Form,
  FormControl,
  Button,
  Select,
  Pagination,
  Table,
  Message,
  Modal,
  Label,
  Icon,
  Upload,
  Timeline,
} from "tinper-bee";
import DatePicker from "bee-datepicker";
import "bee-form/build/Form.css";
import "bee-upload/build/Upload.css";
import "bee-form-control/build/FormControl.css";
import "bee-datepicker/build/DatePicker.css";
import "bee-button/build/Button.css";
import "bee-select/build/Select.css";
import "bee-table/build/Table.css";
import "bee-pagination/build/Pagination.css";
import "bee-message/build/Message.css";
import "bee-modal/build/Modal.css";
import "bee-icon/build/Icon.css";
import "bee-timeline/build/Timeline.css";
import "./index.css";
import myapi from "../../api";
import moment from "moment";
import Header from "../common/Header";
import Content from "../common/Content";
import FormList from "../common/Form";
import SearchPanel from "../common/SearchPanel";
import React, { Fragment } from "react";
const Option = Select.Option;
const FormItem = Form.FormItem;
class Template extends React.Component {
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
      selectStatus: [
        {
          stat: "启用",
          id: "1",
        },
        {
          stat: "停用",
          id: "0",
        },
      ],
      templateName: "", //模板名称
      //templateCategory: 2,//模版分类 1-入驻合同  2-订单合同
      isvName: "", //服务商名称
      status: "", //1-启用 0-停用
      activePage: 1,
      activeTabKey: "1",
      activeTemPage: 1,
      showModal: false,
      showDateModal: false,
      upLoadData: {
        file: null,
        id: "",
        templateName: "", //模版名称
        status: "", //1-启用 2-停用
        templateNum: "", //模版id
        templateScope: "", //订单模版适用范围 1-融合类产品 2-自由产品
        templateType: "", //订单模版类别  1-协议条款合同模版  2-订单内容模版
        templateValidity: "", //模版中合同有效期 单位年  1，3
        templateCategory: "", //模版分类 1-入驻合同 2-订单合同
        expireTime: null,
      },
      file: null,
      logData: [], //操作日志数据
    };
  }

  componentDidMount() {
    this.getSearch();
  }

  columns = [
    {
      title: "合同模板ID",
      dataIndex: "templateNum",
      key: "templateNum",
      width: "10%",
    },
    {
      title: "合同模板名称",
      dataIndex: "templateName",
      key: "templateName",
      width: "20%",
    },
    {
      title: "模板创建时间",
      dataIndex: "createTime",
      key: "createTime",
      width: "15%",
      render: (value) => {
        return value ? (
          <span>{moment(value).format("YYYY-MM-DD HH:mm:ss")}</span>
        ) : null;
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (value) => {
        return <span>{value === "1" ? "启用" : "停用"}</span>;
      },
    },
    { title: "服务商名称", dataIndex: "isvName", key: "isvName", width: "20%" },
    {
      title: "模板级别",
      dataIndex: "templateLevel",
      key: "templateLevel",
      width: "10%",
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      width: "10%",
      render: (value, record) => {
        return (
          <Fragment>
            <a
              onClick={this.enable.bind(
                null,
                record.status,
                record.templateNum
              )}
            >
              {record.status === "1" ? "停用" : "启用"}
            </a>
            <a
              style={{ marginLeft: "10px" }}
              onClick={this.getDateService.bind(null, record.id)}
            >
              查看日志
            </a>
          </Fragment>
        );
      },
    },
  ];

  settledColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: "15%" },
    {
      title: "模板名称",
      dataIndex: "templateName",
      key: "templateName",
      width: "15%",
    },
    {
      title: "模板分类",
      dataIndex: "templateCategory",
      key: "templateCategory",
      width: "10%",
      render: (value) => {
        return <span>{value === "1" ? "入驻合同" : "订单合同"}</span>;
      },
    },
    {
      title: "到期日",
      dataIndex: "expireTime",
      key: "expireTime",
      width: "10%",
      render: (value) => {
        return value ? <span>{moment(value).format("YYYY-MM-DD")}</span> : null;
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (value) => {
        return <span>{value === "1" ? "启用" : "停用"}</span>;
      },
    },
    {
      title: "模板ID",
      dataIndex: "templateNum",
      key: "templateNum",
      width: "15%",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      width: "15%",
      render: (value) => {
        return value ? (
          <span>{moment(value).format("YYYY-MM-DD HH:mm:ss")}</span>
        ) : null;
      },
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      width: "10%",
      render: (value, record) => {
        return record.status === "1" ? (
          <a onClick={this.edit.bind(null, record)}>修改</a>
        ) : null;
      },
    },
  ];

  uploadProps = {
    name: "file",
    action: myapi.BASE_URL + `/contract/uploadFile`,
    accept: ".pdf",
    beforeUpload: (file, fileList) => {
      this.setState({ file });
      return false;
    },
  };

  //入驻合同模板
  getInitList = (pageIndex = 0, pageSize = 10) => {
    //myapi.BASE_URL + `
    //`https://mock.yonyoucloud.com/mock/3831
    let newData = { size: pageSize, page: pageIndex, templateCategory: 1 };
    fetch(myapi.BASE_URL + `/market/contract/getTemplateList`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(newData),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "X-Requested-With",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Origin": "*",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        if (response.status === 1) {
          let infolist = response.data;
          this.setState({
            dataSource: infolist,
          });
        } else {
          Message.destroy();
          Message.create({ content: response.msg, color: "danger" });
        }
      });
  };

  //订单合同模板及查询
  getSearch = (pageIndex = 0, pageSize = 10) => {
    //myapi.BASE_URL + `
    //`https://mock.yonyoucloud.com/mock/3831
    let { templateName, isvName, status } = this.state;
    let newData = {
      templateName,
      isvName,
      status,
      size: pageSize,
      page: pageIndex,
      templateCategory: 2,
    };
    fetch(myapi.BASE_URL + `/market/contract/getTemplateList`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(newData),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "X-Requested-With",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Origin": "*",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        if (response.status === 1) {
          let infolist = response.data;
          this.setState({
            dataSource: infolist,
          });
        } else {
          Message.destroy();
          Message.create({ content: response.msg, color: "danger" });
        }
      });
  };

  enable = (status, num) => {
    //myapi.BASE_URL + `
    //`https://mock.yonyoucloud.com/mock/3831
    fetch(myapi.BASE_URL + `/market/contract/updateTemplate`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({ id: num, status: !status }),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "X-Requested-With",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Origin": "*",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        if (response.status === 1) {
          this.getSearch();
        } else {
          Message.destroy();
          Message.create({ content: response.msg, color: "danger" });
        }
      });
  };

  handleSelect = (e) => {
    this.setState({ activePage: e });
    this.getSearch(e - 1);
  };

  handleSettledSelect = (e) => {
    this.setState({ activeTemPage: e });
    this.getInitList(e - 1);
  };

  dataNumSelect = (index, value) => {
    this.getSearch(0, value);
  };

  dataNumSettledSelect = (index, value) => {
    this.getInitList(0, value);
  };

  handleChange = (type, e) => {
    this.setState({
      [type]: e,
    });
  };

  handleTabChange = (activeKey) => {
    this.resetfun();
    if (activeKey === "1") {
      this.getSearch();
    } else {
      this.getInitList();
    }
    this.setState({
      activeTabKey: activeKey,
    });
  };

  /**重置 */
  resetfun = () => {
    this.setState({
      templateName: "",
      isvName: "",
      status: "",
      upLoadData: {
        id: "",
        file: "",
        status: "",
        templateName: "",
        templateNum: "",
        templateScope: "",
        templateType: "",
        templateValidity: "",
        templateCategory: "",
      },
    });
  };

  edit = (record) => {
    console.log(record);
    this.setState({
      upLoadData: record,
      showModal: true,
    });
  };

  close = () => {
    this.setState({
      showModal: false,
      showDateModal: false,
    });
  };

  open = () => {
    this.resetfun();
    this.setState({
      showModal: true,
    });
  };

  upLoad = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let { upLoadData } = this.state;
        /*接口以formatData形式接收*/
        upLoadData.templateName = values.templateName;
        upLoadData.templateCategory = values.templateCategory;
        upLoadData.status = values.status;
        upLoadData.expireTime = moment(values.expireTime).format("YYYY-MM-DD");
        this.setState({ upLoadData });
        this.upLoadService();
      }
    });
  };

  /**
   * 查询日志
   * @memberof id number
   */
  getDateService = (id) => {
    //myapi.BASE_URL + `
    //`https://mock.yonyoucloud.com/mock/3831
    fetch(myapi.BASE_URL + `/market/contract/operationLogs/${id}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "X-Requested-With",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Origin": "*",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        if (response.status === 1) {
          this.setState({ logData: response.data, showDateModal: true });
        } else {
          Message.destroy();
          Message.create({ content: response.msg, color: "danger" });
        }
      });
  };

  //上传模板
  upLoadService = () => {
    //myapi.BASE_URL + `
    //`https://mock.yonyoucloud.com/mock/3831
    let { upLoadData, file } = this.state;
    let { templateName, status, templateCategory, expireTime } = upLoadData;
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("templateName", templateName);
    formdata.append("status", status);
    formdata.append("templateCategory", templateCategory);
    formdata.append("expireTime", expireTime);
    fetch(myapi.BASE_URL + `/market/contract/uploadFile`, {
      method: "POST",
      mode: "cors",
      body: formdata,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        if (response.status === 1) {
          this.setState({
            showModal: false,
          });
          this.getInitList();
        } else {
          Message.destroy();
          Message.create({ content: response.msg, color: "danger" });
        }
      });
  };

  render() {
    let {
      dataSource,
      templateName,
      isvName,
      status,
      selectStatus,
      activeTabKey,
      activeTemPage,
      activePage,
      upLoadData,
      logData,
      showDateModal,
      showModal,
    } = this.state;
    let { getFieldProps, getFieldError } = this.props.form;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="模板管理" />
        <Content style={{ width: "100%" }}>
          <div className="tabList">
            <div
              onClick={this.handleTabChange.bind(null, 1)}
              className={activeTabKey == 1 ? "active" : ""}
            >
              订单合同模板
            </div>
            <div
              onClick={this.handleTabChange.bind(null, 2)}
              className={activeTabKey == 2 ? "active" : ""}
            >
              入驻合同模板
            </div>
          </div>
          {activeTabKey == 1 ? (
            <Fragment>
              <SearchPanel
                reset={this.resetfun.bind(this)}
                search={this.getSearch.bind(null, 0, 10)}
              >
                <FormList layoutOpt={{ md: 4, xs: 4 }}>
                  <FormList.Item label="合同模板名称" labelCol={100}>
                    <FormControl
                      className="search-item"
                      value={templateName}
                      onChange={this.handleChange.bind(null, "templateName")}
                    />
                  </FormList.Item>

                  <FormList.Item label="服务商名称" labelCol={100}>
                    <FormControl
                      className="search-item"
                      value={isvName}
                      onChange={this.handleChange.bind(null, "isvName")}
                    />
                  </FormList.Item>

                  <FormList.Item label="状态" labelCol={100}>
                    <Select
                      className="search-item"
                      onChange={this.handleChange.bind(null, "status")}
                      value={status}
                    >
                      <Option value="">全部</Option>
                      {selectStatus.map((item) => (
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
            </Fragment>
          ) : null}
          {activeTabKey == 2 ? (
            <Fragment>
              <div className="button-zone">
                <Button colors="primary" onClick={this.open}>
                  添加合同模板
                </Button>
              </div>
              <Table columns={this.settledColumns} data={dataSource.content} />
              <Pagination
                first
                last
                prev
                next
                maxButtons={5}
                boundaryLinks
                activePage={activeTemPage}
                onSelect={this.handleSettledSelect}
                onDataNumSelect={this.dataNumSettledSelect}
                showJump={true}
                noBorder={true}
                total={dataSource.totalElements}
                items={dataSource.totalPages}
              />
            </Fragment>
          ) : null}
        </Content>

        <Modal show={showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>创建/修改合同模板</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div>
              <Form>
                <FormItem>
                  <Label>
                    <Icon type="uf-mi" className="mast"></Icon>模板名称
                  </Label>
                  <FormControl
                    {...getFieldProps("templateName", {
                      validateTrigger: "onBlur",
                      initialValue: upLoadData.templateName,
                      rules: [
                        {
                          required: true,
                          message: "请输入模板名称",
                        },
                      ],
                    })}
                  />
                  <span className="error">{getFieldError("templateName")}</span>
                </FormItem>
                <FormItem>
                  <Label>
                    <Icon type="uf-mi" className="mast"></Icon>模板分类
                  </Label>
                  <Select
                    {...getFieldProps("templateCategory", {
                      initialValue: upLoadData.templateCategory,
                      rules: [{ required: true, message: "请选择模板分类" }],
                    })}
                  >
                    <Option value="1">入驻合同</Option>
                    <Option value="2">订单合同</Option>
                  </Select>
                  <span className="error">
                    {getFieldError("templateCategory")}
                  </span>
                </FormItem>
                <FormItem>
                  <Label>
                    <Icon type="uf-mi" className="mast"></Icon>模板状态
                  </Label>
                  <Select
                    {...getFieldProps("status", {
                      initialValue: upLoadData.status,
                      rules: [{ required: true, message: "请选择模板状态" }],
                    })}
                  >
                    <Option value="1">启用</Option>
                    <Option value="0">停用</Option>
                  </Select>
                  <span className="error">{getFieldError("status")}</span>
                </FormItem>
                <FormItem>
                  <Label>
                    <Icon type="uf-mi" className="mast"></Icon>上传模板
                  </Label>
                  <Upload {...this.uploadProps}>
                    <Button shape="border">
                      <Icon type="uf-upload" /> 选择文件
                    </Button>
                  </Upload>
                </FormItem>
                <FormItem>
                  <Label style={{ marginTop: "6px", verticalAlign: "top" }}>
                    <Icon type="uf-mi" className="mast"></Icon>合同到期日
                  </Label>
                  <DatePicker
                    {...getFieldProps("expireTime", {
                      validateTrigger: "onBlur",
                      initialValue: upLoadData.expireTime,
                      rules: [
                        {
                          required: true,
                          message: "请选择合同到期时间",
                        },
                      ],
                    })}
                  />
                  <span className="error">{getFieldError("expireTime")}</span>
                </FormItem>
              </Form>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              onClick={this.close}
              colors="secondary"
              style={{ marginRight: 8 }}
            >
              取消
            </Button>
            <Button onClick={this.upLoad} colors="primary">
              确认
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDateModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>合同模版操作日志明细</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Timeline>
              {logData.map((item) => {
                return (
                  <Timeline.Item>
                    <p>{item.createTime}</p>
                    <p>{item.logContent}</p>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </Modal.Body>
        </Modal>
      </Fragment>
    );
  }
}

export default Form.createForm()(Template);
