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
import { Input, message } from 'antd';
import makeAjaxRequest from '../../util/request';
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

  fetchDetail = async () => {
    try {
      const res = await makeAjaxRequest(`/live/info`, 'get', { liveTelecastId: this.props.match.params.id })
      this.setState({
        detail: res.data,
        status: res.data.auditStatus
      })
    } catch (err) {
      message.error(err.message)
    }
  }

  navigateBack = () => {
    this.props.history.push(`/LiveList`);
  }

  submit = async () => {
    const { status } = this.state;
    if (status === '2') {
      this.showReject();
    } else {
      try {
        await makeAjaxRequest(`/live/audit`, 'post', {
          liveTelecastId: this.props.match.params.id,
          type: status,
          reason: status === '0' ? "待审核" : '通过'
        });
        message.success('操作成功');
        this.fetchDetail();
      } catch (err) {
        message.error(err.message);
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

  confirmRejectModal = async () => {
    this.setState({
      formData: {
        ...this.state.formData,
        showRejectModal: false,
      }
    });
    try {
      await makeAjaxRequest(`/live/audit`, 'post', {
        liveTelecastId: this.props.match.params.id,
        type: '2',
        reason: this.state.formData.dataItem.reason
      });
      message.success('操作成功');
      this.fetchDetail();
    } catch (err) {
      message.error(err.message);
    }
  }

  render() {
    const { className } = this.props;
    const { formData, status, detail } = this.state;
    const { showRejectModal, dataItem } = formData;
    return (
      <div className={className}>
        <Header title="直播详情" />
        <div className='detail-wrap'>
          <div className='label'>直播名称</div>
          <div className='content'>{detail.liveName}</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>直播时间</div>
          <div className='content'>
            {detail.liveTelecastId && `${new Date(detail.liveStarttime).toLocaleString()} 至 ${new Date(detail.liveEndtime).toLocaleString()}`}
          </div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>直播封面</div>
          <div className='content'>
            <img src={detail.coverUrl} alt="" />
          </div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>直播预告</div>
          <div className='content'>
            <video controls>
              <source src={detail.noticeUrl} />
            </video>
          </div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>直播描述</div>
          <div className='content'>{detail.liveInfo}</div>
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
          onHide={this.hideRejectModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>拒绝原因</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input.TextArea value={dataItem.reason} rows={4} onChange={this.handleFormDataChange.bind(this, 'reason')} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideRejectModal} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.confirmRejectModal} colors="primary" disabled={!dataItem.reason}>确认</Button>
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
    img, video {
      width: 300px;
      height: auto;
    }
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
