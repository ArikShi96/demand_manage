import React from 'react'
import myapi from '../../api'
import { Form, Button, Icon, Modal, Label } from 'tinper-bee';
import 'bee-form/build/Form.css';
import 'bee-button/build/Button.css';
import 'bee-icon/build/Icon.css'
import 'bee-modal/build/Modal.css';
const FormItem = Form.FormItem;
class Viewdom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      domainName: "",
      sort: "",
      ids: ''
    };
  }

  componentWillReceiveProps(newProps) {
    //var vals = this.props.match.params
    //console.log(vals)
    let { id } = newProps;
    let { ids } = this.state;
    if (ids != id) {
      this.setState({
        ids: id
      })
      fetch(myapi.BASE_URL + `/market/requirement/domain/detail/${id}`, {
        method: 'get',
        dataType: 'json',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include"
      })
        .then(res => res.json())
        .then((response) => {
          var currentedit = response.data
          this.setState({
            domainName: currentedit.domainName,
            sort: currentedit.sort
          })
        })
    }
  }


  render() {
    let { showModal, close } = this.props;
    let { domainName, sort } = this.state;
    return (<div className="addemandlist">
      <Modal
        show={showModal}
        onHide={close}
      >
        <Modal.Header closeButton>
          <Modal.Title>查看</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <FormItem>
              <Label><Icon type="uf-mi" className='mast'></Icon>领域名称</Label>
              <p className="form-inline">{domainName}</p>
            </FormItem>
            <FormItem>
              <Label><Icon type="uf-mi" className='mast'></Icon>排序</Label>
              <p className="form-inline">{sort}</p>
            </FormItem>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={close} colors="secondary" style={{ marginRight: 8 }}>关闭</Button>
        </Modal.Footer>
      </Modal>
    </div>)
  }
}
export default Viewdom
