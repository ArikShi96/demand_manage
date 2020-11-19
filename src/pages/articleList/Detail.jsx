import React from "react";
import styled from 'styled-components';
import { Button } from 'tinper-bee';
import Header from "../common/Header";
import "bee-button/build/Button.css";
import makeAjaxRequest from '../../util/request';
import { message } from 'antd';
class ArticleDetail extends React.Component {
  state = {
    detail: {},
    hide: true
  };

  componentDidMount() {
    this.fetchDetail();
  }

  fetchDetail = async () => {
    try {
      const res = await makeAjaxRequest('/article/queryOperate', 'get', { article_id: this.props.match.params.id });
      this.setState({
        detail: res.data
      });
    } catch (err) {
      message.error(err.message);
    }
  }

  navigateBack = () => {
    this.props.history.push(`/ArticleList`);
  }

  toggleHide = () => {
    this.setState({
      hide: !this.state.hide
    })
  }

  render() {
    const { detail, hide } = this.state;
    const { className } = this.props;
    return (
      <div className={className}>
        <Header title="文章管理" />
        <div className='action-wrap'>
          <Button colors="primary" onClick={this.navigateBack}>返回</Button>
          <div className='left-right'>
            <Button colors="primary" onClick={this.navigateLeft}>上一篇</Button>
            <Button colors="primary" onClick={this.navigateRight}>下一篇</Button>
          </div>
        </div>
        <div className='article-title'>文章标题</div>
        <div className='detail-wrap'>
          <div className='label'>发布人:</div>
          <div className='content'>123</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>发布时间:</div>
          <div className='content'>123</div>
        </div>
        <div className="detail-content"> 文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章详情文章</div>
        <div className='button-action'>
          <Button colors="primary" onClick={this.toggleHide}>{hide ? '显示' : '隐藏'}</Button>
        </div>
      </div>
    );
  }
}

export default styled(ArticleDetail)`
.mix-ma-page-header {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  margin-bottom: 40px;
  padding: 0;
}
.action-wrap {
  padding: 20px 40px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left-right{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .u-button{
      margin-left:20px;
    }
  }
}
.article-title {
  text-align: center;
  color: #212121;
  font-weight: 600;
  padding: 20px 0;
  font-size: 18px;
}
.detail-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 0 60px 20px;
  .label {
    text-align: left;
    min-width: 80px;
    flex-shrink: 0;
    margin-right: 5%;
  }
  .content {
    flex: auto;
  }
}
.detail-content {
  text-indent: 2em;
  line-height: 22px;
  padding: 16px 60px 32px;
}
.button-action {
  text-align: center;
}
`;
