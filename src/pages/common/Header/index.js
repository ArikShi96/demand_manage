import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import "./index.css";

class Header extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    title: PropTypes.node,
    contentAlign: PropTypes.oneOf(["right", "left"]),
    back: PropTypes.bool,
    backFn: PropTypes.func,
    fixed: PropTypes.bool,
  };

  static defaultProps = {
    title: "",
    contentAlign: "right",
    back: false,
    fixed: true,
    backFn: () => {
      window.history.go(-1);
    },
  };

  componentDidMount() {
    // if (this.props.fixed && this.headerNode) {
    //   let headerNodeRect = this.headerNode.getBoundingClientRect();
    //   let { top, left } = headerNodeRect;
    //   this.headerNode.style.position = 'fixed';
    //   this.headerNode.style.top = top + 'px';
    //   this.headerNode.style.right = '0px';
    //   this.headerNode.style.left = left + 'px';
    // }
  }

  render() {
    let { title, back, backFn, children, className } = this.props;
    let cls = "mix-ma-page-header " + className;
    return (
      <Fragment>
        <div ref={(node) => (this.headerNode = node)} className={cls}>
          {back ? (
            <a onClick={backFn} className="header-back">
              <i className={"uf uf-arrow-left"} />
              返回
            </a>
          ) : null}
          <span className="page-header-title">{title}</span>
          <div className="page-header-content">{children}</div>
        </div>
      </Fragment>
    );
  }
}

export default Header;
