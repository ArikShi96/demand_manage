import {
  FormControl,
  Button,
  Select,
  Switch,
  Pagination,
  Table,
  Message,
  Icon,
  Modal,
} from "tinper-bee";
import "bee-form-control/build/FormControl.css";
import "bee-button/build/Button.css";
import "bee-select/build/Select.css";
import "bee-switch/build/Switch.css";
import "bee-table/build/Table.css";
import "bee-pagination/build/Pagination.css";
import "bee-message/build/Message.css";
import "bee-modal/build/Modal.css";
import "bee-icon/build/Icon.css";
import myapi from "../../api";
import Header from "../common/Header";
import Content from "../common/Content";
import FormList from "../common/Form";
import SearchPanel from "../common/SearchPanel";
import React, { Fragment } from "react";
import Addentlist from "../addemlist";
import { Link } from "react-router-dom";
import moment from "moment";
import "./index.css";
const { Option } = Select;

class SearchModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allist: [],
      successtyle: false,
      currentlist: "",
      activePage: 1,
      verifyMsg: "",
      statusBox: [
        {
          stat: "审核中",
          id: "2",
        },
        {
          stat: "审核通过",
          id: "3",
        },
        {
          stat: "已拒绝",
          id: "4",
        },
        {
          stat: "已下架",
          id: "5",
        },
      ],
      contactPhone: "", //电话号码
      domainid: "", //领域id
      statuid: "0", //状态id
      defautDomain: "所属领域",
      defautStats: "审核状态",
      domainlist: [],
      alldomainbox: [],
      visible: false,
      pullBlackState: false,
      currentId: -1,
      blackIds: 0,
      blackIndex: 0,
      addVisible: false,
      verifyStatus: "",
      id: "",
    };
    this.domainstyle = this.domainstyle.bind(this);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //     //在这个函数被调用时，this.state还没有被改变
  //     return nextProps !== nextState;
  // }

  columns = [
    {
      title: "发布人",
      dataIndex: "publisherName",
      key: "publisherName",
      width: "10%",
    },
    {
      title: "预算",
      dataIndex: "projectBudget",
      key: "projectBudget",
      width: "10%",
    },
    {
      title: "竞标截至时间",
      dataIndex: "bidEndtime",
      key: "bidEndtime",
      width: "15%",
      render: (value) => {
        return value ? (
          <span>{moment(value).format("YYYY-MM-DD HH:mm:ss")}</span>
        ) : null;
      },
    },
    {
      title: "所属领域",
      dataIndex: "domain",
      key: "domain",
      width: "10%",
      render: (value) => {
        return this.domainstyle(value);
      },
    },
    {
      title: "联系人",
      dataIndex: "contactMan",
      key: "contactMan",
      width: "10%",
    },
    {
      title: "联系方式",
      dataIndex: "contactPhone",
      key: "contactPhone",
      width: "15%",
    },
    {
      title: "推荐",
      dataIndex: "recommend",
      key: "recommend",
      width: "10%",
      render: (value, record) => {
        return (
          <Switch
            checked={value === 0 ? false : true}
            onChange={this.switchfun.bind(this, record.id)}
          />
        );
      },
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      width: "20%",
      render: (value, record, index) => {
        return (
          <Fragment>
            <a
              onClick={this.showDetail.bind(
                null,
                record.id,
                record.verifyStatus
              )}
            >
              查看
            </a>
            {this.OperationState(record.verifyStatus, record.id, index)}
          </Fragment>
        );
      },
    },
  ];

  componentDidMount() {
    this.getInitList();

    /**所属领域接口 */
    fetch(myapi.BASE_URL + `/market/requirement/domain/list?pn=0&ps=50`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === 1) {
          let allistdata = response.data.content;
          this.setState({
            domainlist: allistdata,
            alldomainbox: allistdata,
          });
        }
      });
  }

  getInitList(current = 0, ps = 10) {
    // https://mock.yonyoucloud.com/mock/815/market/requirement/manage/getList
    // /api/market/requirement/manage/getList?pn=${current}&ps=10&isAjax=1
    fetch(
      myapi.BASE_URL +
        `/market/requirement/manage/getList?pn=${current}&ps=${ps}&isAjax=1`,
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
        console.log(response);
        if (response.status === 0) {
          if (response.msg == "没有权限") {
            alert("没有权限, 请联系管理员");
            window.location.href = "/";
          } else if (response.needrelogin) {
            fetch(myapi.BASE_URL + `/market/getLoginPrefix`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json;charset=UTF-8",
              },
              credentials: "include",
            })
              .then((res) => res.json())
              .then((res) => {
                let getUrl = res.data;
                // setTimeout(() => {
                window.location.href = getUrl + window.location.href;
                // }, 500);
              });
          }
        } else {
          if (response.status === 1) {
            let allCarouse = response.data.content;
            allCarouse.sort((a, b) => {
              return (
                new Date(b.bidEndtime).getTime() -
                new Date(a.bidEndtime).getTime()
              );
            });
            let infolist = response.data;
            this.setState({
              allist: allCarouse,
              currentlist: infolist,
            });
          }
        }
      });
  }

  /**推荐 */
  switchfun(id, event) {
    let states = "";
    if (event) {
      states = "recommend";
    } else {
      states = "unRecommend";
    }
    //
    fetch(myapi.BASE_URL + `/market/requirement/manage/${states}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === 1 && states === "recommend") {
          Message.create({ content: "推荐成功", color: "success" });
        } else if (response.status === 1 && states === "unRecommend") {
          Message.create({ content: "取消推荐成功", color: "success" });
        } else {
          Message.create({ content: "取消推荐成功", color: "success" });
        }
        this.getInitList(this.state.activePage - 1);
      });
  }

  /**通过、下架、删除 */
  managefun(states, id, index, adoptUp) {
    let that = this;
    let listbox = [...that.state.allist];
    let tripText = "";
    let tripTitle = "";
    if (states === "delete") {
      tripText = "删除成功";
      tripTitle = "删除";
    } else if (states === "offline") {
      tripText = "下架成功";
      tripTitle = "下架";
    } else if (states === "approve") {
      if (adoptUp === "downshelf") {
        tripText = "审核通过";
        tripTitle = "审核";
      } else {
        tripText = "上架成功";
        tripTitle = "上架";
      }
    }
    fetch(myapi.BASE_URL + `/market/requirement/manage/${states}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === 1) {
          Message.create({ content: tripText, color: "success" });
          if (states === "delete") {
            listbox.splice(index, 1);
            that.setState({
              allist: listbox,
            });
          } else if (states === "approve") {
            /**审核通过 */
            if (adoptUp === "downshelf") {
              listbox[index].verifyStatus = 3;
              that.setState({
                allist: listbox,
              });
            } else {
              /**上架 */
              listbox[index].verifyStatus = 3;
              that.setState({
                allist: listbox,
              });
            }
          } else if (states === "offline") {
            /**下架 */
            listbox[index].verifyStatus = 5;
            that.setState({
              allist: listbox,
            });
          }
        }
      });
  }

  showModal(state, index) {
    this.setState({
      visible: true,
      currentId: index,
    });
  }

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  hideAddModal = () => {
    this.setState({
      addVisible: false,
    });
  };

  handleKeyPress = (e) => {
    this.setState({
      verifyMsg: e,
    });
  };

  /**拒绝 */
  refusefun(ids, indx) {
    let that = this;
    let datalistbox = [...that.state.allist];

    let vismess = this.state.verifyMsg;
    console.log(ids, vismess);
    if (vismess === "") {
      Message.create({ content: "拒绝理由不能为空", color: "info" });
      return false;
    }
    const currentObj = this.currentlist.content[this.state.currentId];

    fetch(myapi.BASE_URL + `/market/requirement/manage/reject`, {
      method: "post",
      body: JSON.stringify({
        id: currentObj.id,
        verifyMsg: vismess,
      }),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === 1) {
          Message.create({ content: "拒绝成功", color: "success" });
          if (currentObj) {
            currentObj.verifyStatus = 4;
          }
          that.setState({
            visible: false,
            allist: datalistbox,
          });
        } else {
          Message.create({ content: response.msg, color: "danger" });
        }
      });
  }

  pullBlack(ids, index) {
    this.setState({
      pullBlackState: true,
      blackIds: ids,
      blackIndex: index,
    });
  }

  pullBlackFun() {
    let that = this;
    fetch(
      myapi.BASE_URL +
        `/market/requirement/blacklist/${this.state.blackIds}/add`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 0) {
          Message.create({
            content: "已在黑名单中，请勿重复操作",
            color: "danger",
          });
          that.setState({
            pullBlackState: false,
          });
        } else {
          Message.create({ content: "已成功加入黑名单", color: "success" });
          that.setState(
            {
              pullBlackState: false,
            },
            () => {
              that.getInitList();
            }
          );
        }
        console.log(data, "data");
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }

  hidePullBlack() {
    this.setState({
      pullBlackState: false,
    });
  }

  /**判断操作按钮 */
  OperationState(e, ids, index) {
    if (e === 2) {
      return (
        <div className="a-box">
          <a
            onClick={this.managefun.bind(
              this,
              "approve",
              ids,
              index,
              "downshelf"
            )}
          >
            通过
          </a>
          <a onClick={this.showModal.bind(this, ids, index)}>拒绝</a>
          <a onClick={this.pullBlack.bind(this, ids, index)}>拉黑</a>
        </div>
      );
    } else if (e === 3) {
      return (
        <div className="a-box">
          <a onClick={this.managefun.bind(this, "offline", ids, index)}>下架</a>
          <a onClick={this.managefun.bind(this, "delete", ids, index)}>删除</a>
          <a onClick={this.pullBlack.bind(this, ids, index)}>拉黑</a>
        </div>
      );
    } else if (e === 4) {
      return (
        <div className="a-box">
          <a>已拒绝</a>
          <a onClick={this.managefun.bind(this, "delete", ids, index)}>删除</a>
          <a onClick={this.pullBlack.bind(this, ids, index)}>拉黑</a>
        </div>
      );
    } else if (e === 5) {
      return (
        <div className="a-box">
          <a
            onClick={this.managefun.bind(
              this,
              "approve",
              ids,
              index,
              "upshelf"
            )}
          >
            上架
          </a>
          <a onClick={this.managefun.bind(this, "delete", ids, index)}>删除</a>
          <a onClick={this.pullBlack.bind(this, ids, index)}>拉黑</a>
        </div>
      );
    }
  }

  handleChange = (type, e) => {
    this.setState({
      [type]: e,
    });
  };

  changePageNum(e) {
    this.setState({ activePage: e });
    this.getInitList(e - 1);
  }

  dataNumSelect = (index, value) => {
    this.getInitList(0, value);
  };

  /**判断领域为null的时候 */
  domainstyle(event) {
    if (event === null) {
      return "";
    } else {
      return event.domainName;
    }
  }

  /**重置 */
  resetfun() {
    this.setState({
      contactPhone: "",
      defautDomain: "所属领域",
      defautStats: "审核状态",
      statuid: "0",
      domainid: "",
    });
    this.componentDidMount();
  }

  /**搜索 */
  searchlist() {
    let domid = this.state.domainid; //领域id
    let stid = this.state.statuid; // 状态id
    let phones = this.state.contactPhone;
    console.log(domid, stid, phones);
    fetch(
      myapi.BASE_URL +
        `/market/requirement/manage/getList?contactPhone=${phones}&isAjax=1&ps=10&verifyStatus=${stid}&domainId=${domid}`,
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
        if (response.status === 1) {
          let allCarouse = response.data.content;
          let infolist = response.data;
          this.setState({
            allist: allCarouse,
            currentlist: infolist,
          });
        }
      });
  }

  showDetail = (id, verifyStatus) => {
    this.setState({ id: id, verifyStatus: verifyStatus, addVisible: true });
  };

  render() {
    this.allist = this.state.allist;
    this.currentlist = this.state.currentlist;
    this.activePage = this.state.activePage;
    this.statusBox = this.state.statusBox;
    this.defautDomain = this.state.defautDomain;
    this.defautStats = this.state.defautStats;
    this.domainlist = this.state.domainlist;
    this.contactPhone = this.state.contactPhone;
    this.statuid = this.state.statuid;
    this.domainid = this.state.domainid;
    this.alldomainbox = this.state.alldomainbox;
    this.addVisible = this.state.addVisible;
    this.verifyStatus = this.state.verifyStatus;
    this.editId = this.state.id;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="需求列表" />
        <Content style={{ width: "100%" }}>
          <SearchPanel
            reset={this.resetfun.bind(this)}
            search={this.searchlist.bind(this)}
          >
            <FormList layoutOpt={{ md: 4, xs: 4 }}>
              <FormList.Item label="电话" labelCol={100}>
                <FormControl
                  className="search-item"
                  value={this.contactPhone}
                  onChange={this.handleChange.bind(null, "contactPhone")}
                />
              </FormList.Item>

              <FormList.Item label="审核状态" labelCol={100}>
                <Select
                  className="search-item"
                  onChange={this.handleChange.bind(null, "statuid")}
                  value={this.statuid}
                >
                  <Option value="0">全部</Option>
                  {this.statusBox.map((item, index) => (
                    <Option key={index} value={item.id}>
                      {item.stat}
                    </Option>
                  ))}
                </Select>
              </FormList.Item>

              <FormList.Item label="所属领域" labelCol={100}>
                <Select
                  className="search-item"
                  onChange={this.handleChange.bind(null, "domainid")}
                  value={this.domainid}
                >
                  <Option value="">全部</Option>
                  {this.alldomainbox.map((item, idx) => (
                    <Option key={idx} value={item.id}>
                      {item.domainName}
                    </Option>
                  ))}
                </Select>
              </FormList.Item>
            </FormList>
          </SearchPanel>
          <Table columns={this.columns} data={this.allist} />
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

          <Modal show={this.state.visible} onHide={this.hideModal.bind(this)}>
            <Modal.Header closeButton>
              <Modal.Title>拒绝</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <FormControl
                componentClass={"textarea"}
                onChange={this.handleKeyPress}
                placeholder="拒绝原因"
                className="custom"
                style={{ height: 200 }}
              />
            </Modal.Body>

            <Modal.Footer>
              <Button
                onClick={this.hideModal.bind(this)}
                colors="secondary"
                style={{ marginRight: 8 }}
              >
                取消
              </Button>
              <Button onClick={this.refusefun.bind(this)} colors="primary">
                确认
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={this.state.pullBlackState}
            onHide={this.hidePullBlack.bind(this)}
          >
            <Modal.Header closeButton>
              <Modal.Title>提示</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              加入黑名单，服务商无法发布新的需求 <br />
              <br />
              确定加入黑名单？
            </Modal.Body>

            <Modal.Footer>
              <Button
                onClick={this.hidePullBlack.bind(this)}
                colors="secondary"
                style={{ marginRight: 8 }}
              >
                取消
              </Button>
              <Button onClick={this.pullBlackFun.bind(this)} colors="primary">
                确认
              </Button>
            </Modal.Footer>
          </Modal>
        </Content>

        <Addentlist
          showModal={this.addVisible}
          close={this.hideAddModal}
          id={this.editId}
          staid={this.verifyStatus}
        />
      </Fragment>
    );
  }
}

export default SearchModel;
