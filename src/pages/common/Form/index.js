/**
 * 用于向搜索面板，表单等输出统一的表单容器和表单项目
 * */
import React, { Component, Children } from "react";
import PropTypes from "prop-types";
import { Label, Row, Col, Form } from "tinper-bee";
import "bee-form/build/Form.css";
import "bee-layout/build/Layout.css";
import "./index.css";

const FormItem = Form.FormItem;

class FormError extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    errorMsg: "",
    className: "",
  };
  static propTypes = {
    errorMsg: PropTypes.node,
    className: PropTypes.string,
  };

  renderError = () => {
    let classes = "error";
    if (this.props.className) {
      classes += " " + this.props.className;
    }
    return this.props.errorMsg ? (
      <span className={classes}>
        <i className="uf uf-exc-t-o" />
        {this.props.errorMsg}
      </span>
    ) : (
      ""
    );
  };

  render() {
    return this.renderError();
  }
}

const ItemHint = ({ children }) => {
  return <p className="form-item-hint">{children}</p>;
};

class FormListItem extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    required: false,
    isDetail: false,
    label: "",
    labelCol: {
      md: 4,
      sm: 4,
      xs: 4,
    },
    wrapperCol: {
      md: 8,
      sm: 8,
      xs: 8,
    },
  };
  static propTypes = {
    required: PropTypes.bool,
    label: PropTypes.node,
  };

  getSpanCol = () => {
    let { labelCol, wrapperCol } = this.props;
    let labelColType = typeof labelCol;
    let spanCol = { labelCol: null, wrapperCol: null };
    if (labelColType === "string" || labelColType === "number") {
      spanCol.label = {
        style: {
          width: labelCol,
          float: "left",
        },
      };
      spanCol.wrapper = {};
    } else {
      spanCol.label = labelCol;
      spanCol.wrapper = wrapperCol;
    }
    return spanCol;
  };

  render() {
    const { children, label, required, isDetail } = this.props;
    let spanCol = this.getSpanCol();
    return (
      <FormItem className="u-form-item">
        <Col {...spanCol.label}>
          <Label
            className={required && !isDetail ? "required" : ""}
            style={{ width: "100%" }}
          >
            {label}
          </Label>
        </Col>
        <Col className="form-input-wrap" {...spanCol.wrapper}>
          {children}
        </Col>
      </FormItem>
    );
  }
}

class FormList extends Component {
  constructor(props) {
    super(props);
    this.wrapLayoutOpt = this.getLayoutOption();
  }

  static defaultProps = {
    size: "",
    className: "",
  };
  static propTypes = {
    size: PropTypes.string,
    title: PropTypes.node,
  };

  static Item = FormListItem;
  static FormError = FormError;
  static FormHint = ItemHint;
  static createForm = Form.createForm;

  getLayoutOption = () => {
    const { size, layoutOpt } = this.props;
    if (layoutOpt) {
      return layoutOpt;
    } else {
      if (size === "sm") {
        return {
          md: 3,
          xs: 4,
        };
      } else {
        return {
          md: 4,
          sm: 6,
          xs: 12,
        };
      }
    }
  };

  render() {
    const { className, size, children, title } = this.props;
    const cls = `ucg-ma-form ${size} ${className || ""}`;
    return (
      <Form className={cls}>
        {title ? <p className="form-title">{title}</p> : null}
        <Row>
          {Children.map(children, (child, index) => {
            if (child) {
              let layout = child.props.layout || this.wrapLayoutOpt;
              return (
                <Col key={index} {...layout}>
                  {child}
                </Col>
              );
            }
          })}
        </Row>
      </Form>
    );
  }
}

export default FormList;
