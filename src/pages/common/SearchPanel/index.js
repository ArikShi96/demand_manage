/**
 * 面板组件
 */

import React, { Component } from "react";
import { Button, Icon, Panel } from "tinper-bee";
import "bee-panel/build/Panel.css";
import "bee-button/build/Button.css";
import "bee-icon/build/Icon.css";
import PropTypes from "prop-types";
import "./index.css";

/**
 * 部分不能通过this.props.form.resetFields()清空的组件，需要传reset方法，在reset方法中自行清空
 */
const propTypes = {
  searchOpen: PropTypes.bool, //是否默认展开，false默认关闭
  search: PropTypes.func, //查询的回调
  reset: PropTypes.func, //重置的回调
  resetName: PropTypes.string, //重置的文字
  searchName: PropTypes.string, //查询的文字
  advanced: PropTypes.node, //高级搜索区,
  hideSearch: PropTypes.bool,
};

const defaultProps = {
  searchOpen: true,
  title: "搜索",
  resetName: "清空",
  searchName: "查询",
  hideSearch: false,
};

class SearchPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchOpen: props.searchOpen,
      ...this.getOpenText(props.searchOpen),
    };
    this.handleExit = this._onPanelChangeStart.bind(this, 0);
    this.handleEnter = this._onPanelChangeStart.bind(this, 1);
    this.handleExiting = this._onPanelChangeIng.bind(this, 0);
    this.handleEntering = this._onPanelChangeIng.bind(this, 1);
    this.handleExited = this._onPanelChangeEnd.bind(this, 0);
    this.handleEntered = this._onPanelChangeEnd.bind(this, 1);
  }

  getOpenText = (searchOpen) => {
    let openText = "展开",
      openIcon = "uf uf-arrow-down";
    if (searchOpen) {
      openText = "收起";
      openIcon = "uf uf-arrow-up";
    }
    return {
      openText,
      openIcon,
    };
  };

  changeOpen = () => {
    let changeSearchOpen = !this.state.searchOpen;
    this.setState({
      searchOpen: changeSearchOpen,
      ...this.getOpenText(changeSearchOpen),
    });
  };

  _onPanelChange = (type, func) => {
    if (func) {
      let status = "";
      if (type === 0) {
        status = "hide";
      } else if (type === 1) {
        status = "visible";
      }
      func(status);
    }
  };

  _onPanelChangeStart = (type) => {
    const { onPanelChangeStart } = this.props;
    onPanelChangeStart && this._onPanelChange(type, onPanelChangeStart);
  };
  _onPanelChangeIng = (type) => {
    const { onPanelChangeIng } = this.props;
    onPanelChangeIng && this._onPanelChange(type, onPanelChangeIng);
  };
  _onPanelChangeEnd = (type) => {
    const { onPanelChangeEnd } = this.props;
    onPanelChangeEnd && this._onPanelChange(type, onPanelChangeEnd);
  };

  search = () => {
    const { search } = this.props;
    search && search();
  };
  reset = () => {
    const { reset } = this.props;
    reset && reset();
  };

  render() {
    let { searchOpen, openText, openIcon } = this.state;
    let {
      children,
      bgColor,
      reset,
      searchName,
      hideSearch,
      style,
      advanced,
    } = this.props;
    let _style = style || {};
    return (
      <div
        className="ucg-search-panel"
        style={{ background: bgColor, ..._style }}
      >
        <div className="ucg-search-btn">
          {hideSearch ? null : (
            <Button colors="dark" onClick={this.search}>
              {searchName}
            </Button>
          )}
          {reset ? (
            <Button className="button-transparent" onClick={this.reset}>
              清空
            </Button>
          ) : null}
          {advanced ? (
            <Button className="button-transparent" onClick={this.changeOpen}>
              {openText} <i className={openIcon} />
            </Button>
          ) : null}
        </div>
        <div className="ucg-search-content">
          {children}
          {advanced ? (
            <Panel
              collapsible
              expanded={searchOpen}
              onExit={this.handleExit} //隐藏开始回调
              onEnter={this.handleEnter} //显示开始回调
              onExiting={this.handleExiting} //隐藏进行中回调
              onEntering={this.handleEntering} //显示进行中回调
              onExited={this.handleExited} //隐藏完成回调
              onEntered={this.handleEntered} //显示后回调
            >
              {typeof advanced === "function" ? advanced() : advanced}
            </Panel>
          ) : null}
        </div>
      </div>
    );
  }
}

SearchPanel.propTypes = propTypes;
SearchPanel.defaultProps = defaultProps;
export default SearchPanel;
