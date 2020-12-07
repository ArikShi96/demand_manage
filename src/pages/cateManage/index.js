import {
  Button,
  Message,
  FormControl,
  Pagination,
  Table,
  Form,
  Icon,
  Modal,
  InputNumber,
  Label,
} from "tinper-bee";
import "bee-form/build/Form.css";
import "bee-button/build/Button.css";
import "bee-message/build/Message.css";
import "bee-form-control/build/FormControl.css";
import "bee-table/build/Table.css";
import "bee-pagination/build/Pagination.css";
import "bee-icon/build/Icon.css";
import "bee-input-number/build/InputNumber.css";
import "bee-modal/build/Modal.css";
import Header from "../common/Header";
import Content from "../common/Content";
import FormList from "../common/Form";
import SearchPanel from "../common/SearchPanel";
import React, { Fragment } from "react";
import Addcate from "../addCate";
import Viewdom from "./query";
import myapi from "../../api";
const FormItem = Form.FormItem;
class CateModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listdata: [],
      dominid: "",
      currentlist: "",
      activePage: 1,
      showModal: false,
      showEditModal: false,
      showViewModal: false,
      editId: "",
      viewId: "",
    };
  }

  columns = [
    { title: "领域名称", dataIndex: "domainName", key: "domainName" },
    { title: "排序", dataIndex: "sort", key: "sort" },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (value, record, index) => {
        return (
          <Fragment>
            <a onClick={this.showView.bind(null, record.id)}>查看</a>
            <a
              style={{ marginLeft: "10px" }}
              onClick={this.showEdit.bind(null, record.id)}
            >
              编辑
            </a>
            <a
              style={{ marginLeft: "10px" }}
              onClick={this.delelistfun.bind(this, record.id, index)}
            >
              删除
            </a>
          </Fragment>
        );
      },
    },
  ];

  componentDidMount() {
    this.getlistinfo();
  }

  getlistinfo(e = 0, ps = 10) {
    fetch(myapi.BASE_URL + `/market/requirement/domain/list?pn=${e}&ps=${ps}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === 1) {
          var allistdata = response.data.content;
          var infolist = response.data;
          this.setState({
            listdata: allistdata,
            currentlist: infolist,
          });
          return true;
        }
      });
  }

  show = () => {
    this.setState({ showModal: true });
  };

  showEdit = async (id) => {
    this.setState({ editId: id });
    let res = await this.getEditDetail(id);
    if (res) {
      this.setState({ showEditModal: true });
    }
  };

  showView = (id) => {
    this.setState({ viewId: id, showViewModal: true });
  };

  close = () => {
    this.setState({
      showModal: false,
      showEditModal: false,
      showViewModal: false,
    });
  };

  changePageNum(e) {
    this.setState({ activePage: e });
    this.getlistinfo(e - 1);
  }

  dataNumSelect = (index, value) => {
    this.getlistinfo(0, value);
  };

  domainfun(e) {
    this.setState({
      dominid: e,
    });
  }

  resetSearch() {
    this.setState({
      dominid: "",
    });
    this.getlistinfo();
  }

  /**搜索 */
  searchDomain() {
    var names = this.state.dominid;
    console.log(names);
    fetch(
      myapi.BASE_URL + `/market/requirement/domain/list?domainName=${names}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((response) => {
        var allistdata = response.data.content;
        this.setState({
          listdata: allistdata,
        });
      });
  }

  delelistfun(ids, indx) {
    var listdemas = [...this.state.listdata];
    fetch(myapi.BASE_URL + `/market/requirement/manage/domain/delete`, {
      method: "post",
      body: JSON.stringify({
        id: ids,
      }),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === 1) {
          listdemas.splice(indx, 1);
          this.setState({
            listdata: listdemas,
          });
          Message.create({ content: "删除成功", color: "success" });
        } else {
          Message.create({ content: response.msg, color: "danger" });
        }
      });
  }

  getEditDetail(id) {
    fetch(myapi.BASE_URL + `/market/requirement/domain/detail/${id}`, {
      method: "get",
      dataType: "json",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        var currentedit = response.data;
        this.props.form.setFieldsValue({
          domainName: currentedit.domainName,
          sort: currentedit.sort,
        });
        return true;
      });
  }

  addCateFun() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let alldata = {
          domainName: values.domainName,
          sort: values.sort,
          id: this.state.editId,
        };
        fetch(myapi.BASE_URL + `/market/requirement/manage/domain/save`, {
          method: "post",
          dataType: "json",
          body: JSON.stringify(alldata),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
          .then((res) => res.json())
          .then(async (response) => {
            if (response.status === 1) {
              Message.create({ content: "编辑成功", color: "success" });
              let res = await this.getlistinfo();
              if (res) {
                this.close();
              }
            } else {
              Message.create({ content: response.msg, color: "danger" });
            }
          });
      }
    });
  }

  render() {
    this.listdata = this.state.listdata;
    this.dominid = this.state.dominid;
    this.currentlist = this.state.currentlist;
    this.activePage = this.state.activePage;
    this.showModal = this.state.showModal;
    this.showEditModal = this.state.showEditModal;
    this.showViewModal = this.state.showViewModal;
    this.editId = this.state.editId;
    this.viewId = this.state.viewId;
    let {
      form: { getFieldProps, getFieldError },
    } = this.props;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="模板管理" />
        <Content style={{ width: "100%" }}>
          <SearchPanel
            reset={this.resetSearch.bind(this)}
            search={this.searchDomain.bind(this)}
          >
            <FormList layoutOpt={{ md: 4, xs: 4 }}>
              <FormList.Item label="领域名称" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={this.dominid}
                  onChange={this.domainfun.bind(this)}
                />
              </FormList.Item>
            </FormList>
          </SearchPanel>
          <div className="button-zone">
            <Button colors="primary" onClick={this.show}>
              新增
            </Button>
          </div>
          <Table columns={this.columns} data={this.listdata} />
          <Pagination
            first
            last
            prev
            next
            maxButtons={5}
            boundaryLinks
            activePage={this.activePage}
            onSelect={this.changePageNum.bind(this)}
            onDataNumSelect={this.dataNumSelect}
            showJump={true}
            noBorder={true}
            total={this.currentlist.totalElements}
            items={this.currentlist.totalPages}
          />
        </Content>

        <Addcate
          showModal={this.showModal}
          close={this.close}
          getlistinfo={this.getlistinfo}
        />

        <div className="addemandlist">
          <Modal show={this.showEditModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>编辑</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form>
                <FormItem>
                  <Label>
                    <Icon type="uf-mi" className="mast"></Icon>领域名称
                  </Label>
                  <FormControl
                    {...getFieldProps("domainName", {
                      validateTrigger: "onBlur",
                      rules: [
                        {
                          required: true,
                          message: "请输入领域名称",
                        },
                      ],
                    })}
                  />
                  <span className="error">{getFieldError("domainName")}</span>
                </FormItem>
                <FormItem>
                  <Label>
                    <Icon type="uf-mi" className="mast"></Icon>排序
                  </Label>
                  <InputNumber
                    min={-999999}
                    max={999999}
                    {...getFieldProps("sort", {
                      validateTrigger: "onBlur",
                      rules: [
                        {
                          required: true,
                          message: "请输入排序顺序",
                        },
                      ],
                    })}
                  />
                  <span className="error">{getFieldError("sort")}</span>
                </FormItem>
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <Button
                onClick={this.close}
                colors="secondary"
                style={{ marginRight: 8 }}
              >
                取消
              </Button>
              <Button onClick={this.addCateFun.bind(this)} colors="primary">
                保存
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        <Viewdom
          showModal={this.showViewModal}
          close={this.close}
          id={this.viewId}
        />
      </Fragment>
    );
  }
}
export default Form.createForm()(CateModel);
