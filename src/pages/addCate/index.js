import React, { Fragment } from "react";
import myapi from "../../api";
import {
  Form,
  FormControl,
  Button,
  Message,
  Modal,
  InputNumber,
  Label,
  Icon,
} from "tinper-bee";
import "bee-form/build/Form.css";
import "bee-form-control/build/FormControl.css";
import "bee-button/build/Button.css";
import "bee-message/build/Message.css";
import "bee-modal/build/Modal.css";
import "bee-input-number/build/InputNumber.css";
import "bee-icon/build/Icon.css";
const FormItem = Form.FormItem;
class Addcate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  addCateFun() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let alldata = {
          domainName: values.domainName,
          sort: values.sort,
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
              let res = await this.props.getlistinfo();
              if (res) {
                this.props.close();
              }
            } else {
              Message.create({ content: response.msg, color: "danger" });
            }
          });
      }
    });
  }

  render() {
    let {
      form: { getFieldProps, getFieldError },
      showModal,
      close,
    } = this.props;
    return (
      <Modal show={showModal} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>新建需求</Modal.Title>
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
          <Button onClick={close} colors="secondary" style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={this.addCateFun.bind(this)} colors="primary">
            确认
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Form.createForm()(Addcate);
