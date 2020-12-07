import React, { Fragment } from "react";
import _get from "lodash/get";
import myapi from "../../api";
import { FormControl, Button, Select, Message } from "tinper-bee";
import "bee-form-control/build/FormControl.css";
import "bee-button/build/Button.css";
import "bee-select/build/Select.css";
import "bee-message/build/Message.css";
import { withRouter } from "react-router-dom";
import Header from "../common/Header";
import Content from "../common/Content";
import AuthImg from "./auth.png";
import BasicImg from "./basic.png";
import LinkManImg from "./linkman.png";
import "./index.css";
const Option = Select.Option;
let accountInfo = [
  {
    title: "绑定的对公银行账户",
    value: "basInfo.bindBankCard",
  },
  {
    title: "银行账户名",
    value: "basInfo.bindCardAccName",
  },
  {
    title: "开户行名称",
    value: "basInfo.bindBankName",
  },
  {
    title: "开户行联行号",
    value: "basInfo.bindBankNo",
  },
  {
    title: "中关村银行电子账户",
    value: "basInfo.accNo",
  },
];

class IsvDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allValue: {
        basInfo: {
          memberName: "", //企业名称
          regAddress: "", //企业注册地址
          unitLice: "", //统一社会信用代码
          custCertSdate: "", //企业证件起始日期
          custCertEdate: "", //企业证件截至日期
          custCertPath: "", //营业执照照片
          regDate: "", //企业注册日期
          businessType: "", //所属行业
          finaPhone: "", //企业联系人手机号
          legalName: "", //法定代表人
          corporateCertTypeDesc: "", //法人证件类型
          corporateCertNo: "", //法人证件号码
          corporateCertSdate: "", //法人证件起始日期
          corporateCertEdate: "", //法人证件结束日期
          operatorMobile: "", //经办人联系电话
          operatorName: null, //经办人姓名
          operatorCertTypeDesc: "", //经办人证件类型
          operatorCertNo: null, //经办人证件号码
          operatorCertSdate: null, //经办人证件起始日期
          operatorCertEdate: null, //经办人证件结束日期
          bindBankCard: "", //绑定银行卡号
          bindCardAccName: "", //银行卡户名
          bindBankNo: "", //开户行联行号
          bindBankName: "", //开户行名称
        },
        data: {
          userId: "",
          statue: "",
          isvName: "", //企业名称
          legalPerson: "", //法人
          industry: "", //所属行业
          location: "", //企业注册地址
          licenceNumber: "", //统一社会信用代码
          licencePic: "", //营业执照地址
          chanpayAccount: "", //畅捷支付账号
          partnerType: "", //伙伴类型 1基础伙伴 2参与类型伙伴 3推广型伙伴 4融合型伙伴 5-中端产业链伙伴 6-服务星联盟(中端)
        },
      }, //所有数据
      basicInfo: [],
      personInfo: [],
      isNew: null,
      partnerType: false,
      partnerTypeValue: "",
      partnerBackup: "1",
      chanpayAccount: false,
      chanpayAccountValue: "",
      chanpayBackup: "",
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    var vals = this.props.match.params;
    var id = vals.id;
    this.setState({
      isvId: id,
    });
    fetch(myapi.BASE_URL + `/market/isv/info?isvId=${id}`, {
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
        if (response.status === 1) {
          var allCarouse = {
            basInfo: response.basInfo,
            data: response.data,
          };
          console.log(allCarouse);
          let basicInfo = [
            {
              title: "企业名称",
              value: response.basInfo ? "basInfo.memberName" : "data.isvName",
            },
            {
              title: "统一社会信用代码",
              value: response.basInfo
                ? "basInfo.unitLice"
                : "data.licenceNumber",
            },
            {
              title: "所属行业",
              value: response.basInfo
                ? "basInfo.businessType"
                : "data.industry",
            },
            {
              title: "企业注册地址",
              value: response.basInfo ? "basInfo.regAddress" : "data.location",
            },
            {
              title: "企业注册日期",
              value: "basInfo.regDate",
            },
            {
              title: "企业证件起始日期",
              value: "basInfo.custCertSdate",
            },
            {
              title: "企业证件截止日期",
              value: "basInfo.custCertEdate",
            },
            {
              title: "企业联系人的手机号码",
              value: "basInfo.finaPhone",
            },
          ];
          let personInfo = [
            {
              title: "法定代表人姓名",
              value: response.basInfo
                ? "basInfo.legalName"
                : "data.legalPerson",
            },
            {
              title: "法人证件类型",
              value: "basInfo.corporateCertTypeDesc",
            },
            {
              title: "法人证件号码",
              value: "basInfo.corporateCertNo",
            },
            {
              title: "法人证件起始日期",
              value: "basInfo.corporateCertSdate",
            },
            {
              title: "法人证件截止日期",
              value: "basInfo.corporateCertEdate",
            },
            {
              title: "经办人姓名",
              value: "basInfo.operatorName",
            },
            {
              title: "经办人证件类型",
              value: "basInfo.operatorCertTypeDesc",
            },
            {
              title: "经办人证件号码",
              value: "basInfo.operatorCertNo",
            },
            {
              title: "经办人证件起始日期",
              value: "basInfo.operatorCertSdate",
            },
            {
              title: "经办人证件截止日期",
              value: "basInfo.operatorCertEdate",
            },
            {
              title: "经办人联系电话",
              value: "basInfo.operatorMobile",
            },
          ];
          this.setState({
            allValue: allCarouse,
            basicInfo,
            personInfo,
            isNew: response.basInfo ? false : true,
            partnerBackup: response.data.partnerType,
            chanpayBackup: response.data.chanpayAccount,
          });
        } else {
          Message.destroy();
          Message.create({ content: response.msg, color: "danger" });
        }
      });
  };

  renderType = (type) => {
    let value = null;
    switch (type) {
      case "1":
        value = "基础伙伴";
        break;
      case "2":
        value = "参与类型伙伴";
        break;
      case "3":
        value = "推广型伙伴";
        break;
      case "4":
        value = "融合型伙伴";
        break;
      case "5":
        value = "中端产业链伙伴";
        break;
      case "6":
        value = "服务星联盟(中端)";
        break;
    }
    return value;
  };

  show = (type) => {
    this.setState({ [type]: true });
  };

  hide = (type) => {
    this.setState({ [type]: false });
  };

  chanpayChange = (v) => {
    this.setState({ chanpayBackup: v });
  };

  partnerChange = (v) => {
    this.setState({ partnerBackup: v });
  };

  save = (type) => {
    let { partnerBackup, chanpayBackup, allValue } = this.state;
    let { userId } = allValue.data;
    let query = {
      userId,
      chanpayAccount: chanpayBackup,
      partnerType: partnerBackup,
    };
    fetch(myapi.BASE_URL + `/market/isv/operator/update`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(query),
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
        if (response.status === 1) {
          this.getData();
          this.setState({ [type]: false });
        } else {
          Message.destroy();
          Message.create({ content: response.msg, color: "danger" });
        }
      });
  };

  enable = () => {
    let { allValue } = this.state;
    let { userId, status } = allValue.data;
    let query = {
      userId,
      status: status === "1" ? "0" : "1",
    };
    fetch(myapi.BASE_URL + `/market/isv/operator/update`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(query),
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
        if (response.status === 1) {
          this.getData();
        } else {
          Message.destroy();
          Message.create({ content: response.msg, color: "danger" });
        }
      });
  };

  render() {
    let {
      allValue,
      basicInfo,
      personInfo,
      isNew,
      partnerType,
      partnerBackup,
      chanpayAccount,
      chanpayBackup,
    } = this.state;
    return (
      <Fragment>
        <Header
          style={{ background: "#fff", padding: 0 }}
          title="服务商详情"
          back
        />
        <Content style={{ width: "100%" }}>
          <div className="isv-detail">
            <div className="isv-detail-zone">
              <div className="isv-detail-zone-row">
                <img className="isv-detail-zone-icon" src={BasicImg} />
                <div className="isv-detail-zone-header">企业基本信息</div>
                <Button
                  className="isv-detail-zone-btn"
                  style={{ marginRight: 0 }}
                  colors="dark"
                  onClick={this.enable}
                >
                  {allValue.data.status === "1" ? "停用服务商" : "启用服务商"}
                </Button>
              </div>
              {basicInfo.length > 0
                ? basicInfo.map((item) => {
                    return (
                      <div className="isv-detail-zone-item">
                        <div className="isv-detail-zone-item-title">
                          {item.title}
                        </div>
                        <div className="isv-detail-zone-item-value">
                          {_get(allValue, item.value)}
                        </div>
                      </div>
                    );
                  })
                : null}
              <div className="isv-detail-zone-item">
                <div className="isv-detail-zone-item-title">伙伴类型</div>
                {partnerType ? (
                  <Select
                    className="isv-detail-zone-item-select"
                    value={partnerBackup}
                    onChange={this.partnerChange}
                  >
                    <Option value="1">基础伙伴</Option>
                    <Option value="2">参与类型伙伴</Option>
                    <Option value="3">推广型伙伴</Option>
                    <Option value="4">融合型伙伴</Option>
                    <Option value="5">中端产业链伙伴</Option>
                    <Option value="6">服务星联盟(中端)</Option>
                  </Select>
                ) : (
                  <div className="isv-detail-zone-item-value">
                    {this.renderType(allValue.data.partnerType)}
                  </div>
                )}

                {partnerType ? (
                  <Fragment>
                    <Button
                      className="isv-detail-zone-item-edit"
                      colors="dark"
                      onClick={this.save.bind(null, "partnerType")}
                    >
                      保存
                    </Button>
                    <Button
                      className="isv-detail-zone-item-edit"
                      colors="secondary"
                      onClick={this.hide.bind(null, "partnerType")}
                    >
                      取消
                    </Button>
                  </Fragment>
                ) : (
                  <Button
                    className="isv-detail-zone-item-btn"
                    bordered
                    onClick={this.show.bind(null, "partnerType")}
                  >
                    修改
                  </Button>
                )}
              </div>
              <div className="isv-detail-zone-item">
                <div className="isv-detail-zone-item-title">
                  企业营业执照图片
                </div>
                <img
                  className="isv-detail-zone-item-value"
                  src={
                    isNew
                      ? allValue.basInfo.custCertPath
                      : allValue.data.licencePic
                  }
                />
              </div>
            </div>

            <div className="isv-detail-zone">
              <div className="isv-detail-zone-row">
                <img className="isv-detail-zone-icon" src={LinkManImg} />
                <div className="isv-detail-zone-header">
                  企业法人及经办人信息
                </div>
              </div>
              {personInfo.length > 0
                ? personInfo.map((item) => {
                    return (
                      <div className="isv-detail-zone-item">
                        <div className="isv-detail-zone-item-title">
                          {item.title}
                        </div>
                        <div className="isv-detail-zone-item-value">
                          {_get(allValue, item.value)}
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>

            <div className="isv-detail-zone">
              <div className="isv-detail-zone-row">
                <img className="isv-detail-zone-icon" src={AuthImg} />
                <div className="isv-detail-zone-header">企业银行账户信息</div>
              </div>
              {accountInfo.map((item) => {
                return (
                  <div className="isv-detail-zone-item">
                    <div className="isv-detail-zone-item-title">
                      {item.title}
                    </div>
                    <div className="isv-detail-zone-item-value">
                      {_get(allValue, item.value)}
                    </div>
                  </div>
                );
              })}
              <div className="isv-detail-zone-item">
                <div className="isv-detail-zone-item-title">畅捷支付账户</div>
                {chanpayAccount ? (
                  <FormControl
                    className="isv-detail-zone-item-input"
                    value={chanpayBackup}
                    onChange={this.chanpayChange}
                  />
                ) : (
                  <div className="isv-detail-zone-item-value">
                    {allValue.data.chanpayAccount}
                  </div>
                )}
                {chanpayAccount ? (
                  <Fragment>
                    <Button
                      className="isv-detail-zone-item-edit"
                      colors="dark"
                      onClick={this.save.bind(null, "chanpayAccount")}
                    >
                      保存
                    </Button>
                    <Button
                      className="isv-detail-zone-item-edit"
                      colors="secondary"
                      onClick={this.hide.bind(null, "chanpayAccount")}
                    >
                      取消
                    </Button>
                  </Fragment>
                ) : (
                  <Button
                    className="isv-detail-zone-item-btn"
                    bordered
                    onClick={this.show.bind(null, "chanpayAccount")}
                  >
                    修改
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Content>
      </Fragment>
    );
  }
}
export default withRouter(IsvDetail);
