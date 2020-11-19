import { Button, Modal } from "tinper-bee";
import styled from 'styled-components';
import React from "react";
import "bee-form-control/build/FormControl.css";
import "bee-datepicker/build/DatePicker.css";
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
    formData: {}
  };

  componentDidMount() {
    this.fetchDetail();
  }

  fetchDetail = () => { }

  navigateBack = () => {
    this.props.history.push(`/LiveList`);
  }

  /* 提交/拒绝 */
  showReject = (item) => {
    this.setState({
      formData: {
        ...this.state.formData,
        showRejectModal: true,
        data: item || {}
      }
    })
  }

  handleFormDataChange = (type, e) => {
    this.setState({
      formData: {
        ...this.state.formData,
        dataItem: {
          ...this.state.formData,
          [type]: e,
        }
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

  showReject = (item) => {
    this.setState({
      formData: {
        ...this.state.formData,
        showRejectModal: true,
        data: item || {}
      }
    })
  }

  handleFormDataChange = (type, e) => {
    this.setState({
      formData: {
        ...this.state.formData,
        dataItem: {
          ...this.state.formData,
          [type]: e,
        }
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

  render() {
    const { className } = this.props;
    const { formData } = this.state;
    const { showRejectModal, reason } = formData;
    return (
      <div className={className}>
        <Header title="问答详情" />
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
        <div className='action-wrap'>
          <Button colors="primary" onClick={this.navigateBack}>返回</Button>
        </div>
        {/* 提示框 - 拒绝 */}
        <Modal
          show={showRejectModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>拒绝原因</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input.TextArea value={reason} rows={4} onChange={this.handleFormDataChange.bind(this, reason)} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideRejectModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.submitReject} colors="primary">确认</Button>
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
  margin-top: 40px;
}
`;
