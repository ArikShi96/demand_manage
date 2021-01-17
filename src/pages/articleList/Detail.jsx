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
    front_article_id: '',
    behind_article_id: '',
  };

  componentDidMount() {
    this.fetchDetail();
  }

  fetchDetail = async () => {
    try {
      const res = await makeAjaxRequest('/article/queryOperate', 'get', { article_id: this.props.match.params.id });
      this.setState({
        detail: res.data,
        front_article_id: res.front_article_id,
        behind_article_id: res.behind_article_id,
      });
    } catch (err) {
      message.error(err.message);
    }
  }

  navigateBack = () => {
    this.props.history.push(`/ArticleList`);
  }

  toggleHide = async () => {
    try {
      await makeAjaxRequest('/article/updateIsdisplay', 'get', {
        article_id: this.props.match.params.id,
        isdisplay: this.state.detail.isdisplay === 0 || this.state.detail.isdisplay === '0' ? 1 : 0
      });
      message.success('操作成功');
      this.fetchDetail();
    } catch (err) {
      message.error(err.message);
    }
  }

  navigate = (articleId) => {
    this.props.history.push(`/ArticleDetail/${articleId}`);
    window.setTimeout(() => {
      this.fetchDetail();
    }, 100)
  }

  render() {
    const { detail, front_article_id, behind_article_id } = this.state;
    const { className } = this.props;
    return (
      <div className={className}>
        <Header title="文章管理" />
        <div className='action-wrap'>
          <Button colors="primary" onClick={this.navigateBack}>返回</Button>
          <div className='left-right'>
            <Button colors="primary" onClick={this.navigate.bind(this, front_article_id)} disabled={!front_article_id}>上一篇</Button>
            <Button colors="primary" onClick={this.navigate.bind(this, behind_article_id)} disabled={!behind_article_id}>下一篇</Button>
          </div>
        </div>
        <div className='article-title'>{detail.articleTitle}</div>
        <div className='detail-wrap'>
          <div className='label'>发布人:</div>
          <div className='content'>{detail.isvName}</div>
        </div>
        <div className='detail-wrap'>
          <div className='label'>发布时间:</div>
          <div className='content'>{detail.updateTime}</div>
        </div>
        <div className={`detail-content visible`} dangerouslySetInnerHTML={{ __html: detail.content }}></div>
        <div className='status-wrap'>{`当前状态: ${detail.isdisplay ? '显示' : '隐藏'}`}</div>
        <div className='button-action'>
          <Button colors="primary" onClick={this.toggleHide}>{detail.isdisplay ? '隐藏' : '显示'}</Button>
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
  height: 200px;
  overflow: hidden;
  &.visible {
    min-height: 200px;
    height: auto;
    overflow: visible;
  }
}
.status-wrap {
  padding-left: 60px;
}
.button-action {
  text-align: center;
  margin: 40px 0;
}
`;
