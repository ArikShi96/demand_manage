import React, { Fragment } from 'react'
import myapi from '../../api'
import { Form, FormControl, Button, Modal, Label, Message } from 'tinper-bee';
import 'bee-form/build/Form.css';
import 'bee-form-control/build/FormControl.css';
import 'bee-button/build/Button.css';
import 'bee-modal/build/Modal.css';
import 'bee-message/build/Message.css';
import { withRouter } from 'react-router-dom';
const FormItem = Form.FormItem;
class Addentlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allValue: "",
      lineyu: "",
      statuid: "",
      visible: false,
      verifyMsg: "",
      edid: ""
    }
  }

  componentWillReceiveProps(newProps) {
    let { id, staid } = newProps;
    let { statuid, edid } = this.state;
    if (statuid != staid || edid != id) {
      this.setState({
        statuid: staid,
        edid: id
      })
      fetch(myapi.BASE_URL + `/market/requirement/manage/detail/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        credentials: "include"
      })
        .then(res => res.json())
        .then((response) => {
          if (response.status === 1) {
            var allCarouse = response.data
            var ssly = allCarouse.domain.domainName
            this.setState({
              allValue: allCarouse,
              lineyu: ssly
            })
          }
          else {
            Message.create({ content: response.msg, color: 'danger' });
          }
        })
    }
  }

  handleKeyPress = (e) => {
    this.setState({
      verifyMsg: e
    })
  };


  showModal() {
    this.setState({
      visible: true
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  styleBtn(event) {
    if (event === 3) {
      return (
        <Button colors="primary">已通过</Button>
      )
    } else if (event === 4) {
      return (
        <Button colors="primary">已拒绝</Button>
      )
    } else {
      return (<div>
        <Button colors="secondary" style={{ marginRight: 8 }} onClick={this.showModal.bind(this)}>拒绝</Button>
        <Button colors="primary" onClick={this.adoptMethod.bind(this)}>通过</Button>
      </div>)
    }
  }

  /**通过 */
  adoptMethod() {
    var ids = this.props.id
    fetch(myapi.BASE_URL + `/market/requirement/manage/approve/${ids}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      credentials: "include"
    })
      .then(res => res.json())
      .then((response) => {
        if (response.status === 1) {
          Message.create({ content: '审核通过', color: 'success' });
          this.props.close();
        } else {
          Message.create({ content: response.msg, color: 'danger' });
        }
      })
  }

  /**拒绝 */
  refuseMethod() {
    // var ids = this.state.edid
    // var vismess = this.state.verifyMsg
    var ids = this.props.id
    var vismess = this.state.verifyMsg
    console.log(ids, vismess)
    if (vismess === "") {
      Message.create({ content: '拒绝理由不能为空', color: 'info' });
      return false
    }
    fetch(myapi.BASE_URL + `/market/requirement/manage/reject`, {
      method: 'post',
      body: JSON.stringify({ id: ids, verifyMsg: vismess }),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      credentials: "include"
    })
      .then(res => res.json())
      .then((response) => {
        if (response.status === 1) {
          this.setState({
            visible: false
          })
          Message.create({ content: '拒绝成功', color: 'success' });
          this.hideModal()
        } else {
          Message.create({ content: response.msg, color: 'danger' });
        }
      })
  }

  render() {
    let { close, showModal } = this.props;
    this.allValue = this.state.allValue
    this.lineyu = this.state.lineyu
    this.statuid = this.state.statuid
    return (<div className="addemandlist">
      <Modal
        show={showModal}
        onHide={close}
      >
        <Modal.Header closeButton>
          <Modal.Title>详情</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <FormItem>
              <Label>项目名称</Label>
              <p className="form-inline">{this.allValue.projectName}</p>
            </FormItem>
            <FormItem>
              <Label>项目预算</Label>
              <p className="form-inline">{this.allValue.projectBudget}</p>
            </FormItem>
            <FormItem>
              <Label>项目描述</Label>
              <p className="form-inline">{this.allValue.projectDescribe}</p>
            </FormItem>
            <FormItem >
              <Label>所属领域</Label>
              <p className="form-inline">{this.lineyu}</p>
            </FormItem>
            <FormItem>
              <Label>联系人</Label>
              <p className="form-inline">{this.allValue.contactMan}</p>
            </FormItem>
            <FormItem>
              <Label>联系方式</Label>
              <p className="form-inline">{this.allValue.contactPhone}</p>
            </FormItem>
            <FormItem>
              <Label>竞标截至</Label>
              <p className="form-inline">{this.allValue.bidEndtime}</p>
            </FormItem>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          {
            this.styleBtn(this.statuid)
          }
        </Modal.Footer>
      </Modal>

      {/* 模态框 */}
      <Modal
        show={this.state.visible}
        onHide={this.hideModal.bind(this)}
      >
        <Modal.Header closeButton>
          <Modal.Title>拒绝</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormControl
            componentClass={'textarea'}
            onChange={this.handleKeyPress}
            placeholder="拒绝原因"
            className="custom"
            style={{ height: 200 }}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.hideModal.bind(this)} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
          <Button onClick={this.refuseMethod.bind(this)} colors="primary">确认</Button>
        </Modal.Footer>
      </Modal>
    </div>)
  }
}
export default withRouter(Addentlist)
