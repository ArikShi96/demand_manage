import { Tabs } from "tinper-bee";
import React, { Fragment } from "react";
import styled from 'styled-components';
import "bee-form-control/build/FormControl.css";
import "bee-datepicker/build/DatePicker.css";
import "bee-button/build/Button.css";
import "bee-select/build/Select.css";
import "bee-table/build/Table.css";
import "bee-pagination/build/Pagination.css";
import "bee-tabs/build/Tabs.css";
import 'bee-modal/build/Modal.css';
import Header from "../common/Header";
import Content from "../common/Content";
import ActivityList from "./fullReduction/ActivityList.jsx";
import SignUpList from "./fullReduction/SignUpList.jsx";
const TabPane = Tabs.TabPane;
class FullReduction extends React.Component {
  state = {
    activeTabKey: '0',
  };

  handleTabChange = (key) => {
    this.setState({ activeTabKey: key });
  }

  render() {
    const {
      activeTabKey,
    } = this.state;
    return (
      <Fragment>
        <Header style={{ background: "#fff", padding: 0 }} title="活动管理" />
        <Content className={this.props.className} style={{ width: "100%", overflowX: "auto" }}>
          <Tabs
            ref="tabs"
            activeKey={activeTabKey}
            onChange={this.handleTabChange}
            tabBarStyle="upborder"
          >
            <TabPane tab="活动列表" key="0">
            </TabPane>
            <TabPane tab="报名列表" key="1">
            </TabPane>
          </Tabs>
          {activeTabKey === "0" ? <ActivityList history={this.props.history} /> : <SignUpList history={this.props.history} />}
        </Content>
      </Fragment>
    );
  }
}

export default styled(FullReduction)`
.u-table .u-table-thead th {
  text-align: center;
}
.u-table .u-table-tbody td {
  text-align: center;
}
.u-table .u-table-tbody .actions .action{
  margin: 0 10px;
}
.action-wrap {
  text-align: right;
  padding: 20px;
  padding-right: 48px;
}
.section-title {
  margin-bottom: 10px;
  .ant-tag.ant-tag-has-color {
    color: #666666;
  }
}
`;
