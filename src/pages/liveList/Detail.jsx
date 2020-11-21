import { Button, Modal, Select } from "tinper-bee";
import styled from 'styled-components';
import React from "react";
import "bee-form-control/build/FormControl.css";
import "bee-button/build/Button.css";
import "bee-select/build/Select.css";
import "bee-table/build/Table.css";
import "bee-pagination/build/Pagination.css";
import "bee-tabs/build/Tabs.css";
import Header from "../common/Header";
import { Input } from 'antd';
class LiveDetail extends React.Component {
  state = {
    detail: {},
    formData: {
      dataItem: {}
    },
    status: "0",
  };

  componentDidMount() {
    this.fetchDetail();
  }

  handleChange = (type, e) => {
    this.setState({
      [type]: e,
    });
  };

  fetchDetail = () => { }

  navigateBack = () => {
    this.props.history.push(`/LiveList`);
  }

  submit = () => {
    const { status } = this.state;
    switch (status) {
      case '0': {
        this.showReject();
        break;
      }
      case '1': {
        break;
      }
      case '2': {
        break;
      }
    }
  }

  /* 提交/拒绝 */
  showReject = () => {
    this.setState({
      formData: {
        ...this.state.formData,
        showRejectModal: true,
      }
    })
  }

  hideRejectModal = () => {
    this.setState({
      formData: {
        ...this.state.formData,
        showRejectModal: false,
      }
    })
  }

  handleFormDataChange = (type, e) => {
    this.setState({
      formData: {
        ...this.state.formData,
        dataItem: {
          ...this.state.formData.dataItem,
          [type]: e.target ? e.target.value : e,
        }
      }
    })
  }

  confirmRejectModal = () => {
    this.setState({
      formData: {
        ...this.state.formData,
        showRejectModal: false,
      }
    })
  }

  render() {
    const { className } = this.props;
    const { formData, status } = this.state;
    const { showRejectModal, dataItem } = formData;
    return (
      <div className={className}>
        <Header title="直播详情" />
        <div className='detail-wrap'>
          <div className='label'>问答类型</div>
          <div className='content'>123</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>相关商品</div>
          <div className='content'>123</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>提问时间</div>
          <div className='content'>123</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>问题详情</div>
          <div className='content'>123</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>回答</div>
          <div className='content'>123</div>
        </div>
        {/* 审核状态 */}
        <div className='select-wrap'>
          <Select
            placeholder="审核状态"
            className="search-item"
            onChange={this.handleChange.bind(null, "status")}
            value={status}
            style={{ width: 200 }}
          >
            {[
              { id: "0", stat: "待审核" },
              { id: "1", stat: "审核通过" },
              { id: "2", stat: "审核拒绝" }].map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.stat}
                </Select.Option>
              ))}
          </Select>
        </div>
        {/* button */}
        <div className='action-wrap'>
          <Button colors="primary" onClick={this.navigateBack}>返回</Button>
          <Button colors="primary" onClick={this.submit}>提交</Button>
        </div>
        {/* 提示框 - 拒绝 */}
        <Modal
          show={showRejectModal}
          style={{ marginTop: '20vh' }}
        >
          <Modal.Header closeButton>
            <Modal.Title>拒绝原因</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input.TextArea value={dataItem.reason} rows={4} onChange={this.handleFormDataChange.bind(this, 'reason')} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideRejectModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.confirmRejectModal} colors="primary">确认</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default styled(LiveDetail)`
.mix-ma-page-header {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  margin-bottom: 40px;
  padding: 0;
}
.detail-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 0 60px;
  margin-bottom: 40px;
  .label {
    text-align: right;
    min-width: 80px;
    flex-shrink: 0;
    margin-right: 5%;
  }
  .content {
    flex: auto;
  }
}
.action-wrap {
  text-align: center;
  margin: 40px auto;
  .u-button {
    margin: 0 20px;
  }
}
.select-wrap {
  padding-left: 60px;

}
`;
