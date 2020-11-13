import { FormControl, Select, Pagination, Table, Message } from 'tinper-bee';
import 'bee-form-control/build/FormControl.css';
import 'bee-select/build/Select.css';
import 'bee-table/build/Table.css';
import 'bee-pagination/build/Pagination.css';
import 'bee-message/build/Message.css';
import "./index.css"
import myapi from '../../api'
import React, { Fragment } from 'react'
import Header from '../common/Header';
import Content from '../common/Content'
import FormList from '../common/Form';
import SearchPanel from '../common/SearchPanel';
import moment from 'moment';
const Option = Select.Option;
class Contracts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {
                content: [],
                last: false,
                totalElements: 0,
                totalPages: 0,
                firstPage: true,
                lastPage: false,
                number: 0,
                size: 10,
                sort: [],
                numberOfElements: 0,
                first: true
            },
            settledData: {
                content: [],
                last: false,
                totalElements: 0,
                totalPages: 0,
                firstPage: true,
                lastPage: false,
                number: 0,
                size: 10,
                sort: [],
                numberOfElements: 0,
                first: true
            },
            selectStatus: [
                {
                    "stat": "待上传文件",
                    "id": "0"
                },
                {
                    "stat": "待甲方确认合同",
                    "id": "1"
                },
                {
                    "stat": "待乙方盖章",
                    "id": "2"
                },
                {
                    "stat": "待甲方确认盖章",
                    "id": "3"
                },
                {
                    "stat": "完成",
                    "id": "4"
                },
                {
                    "stat": "拒签",
                    "id": "5"
                },
                {
                    "stat": "归档",
                    "id": "6"
                },
            ],
            selectStatusSettled: [
                {
                    "stat": "待上传文件",
                    "id": "0"
                },
                {
                    "stat": "待乙方盖章",
                    "id": "1"
                },
                {
                    "stat": "待甲方确认盖章",
                    "id": "2"
                },
                {
                    "stat": "完成",
                    "id": "3"
                },
                {
                    "stat": "拒签",
                    "id": "4"
                },
                {
                    "stat": "归档",
                    "id": "9"
                },
            ],
            contractNum: "", //合同号
            agreementNum: "", //订单号
            applyEnt: "", //申请企业
            isvEnt: "", //服务商
            status: "",//状态
            activePage: 1,
            activeTabKey: "1",
            contractNumSettled: "",//模板合同号
            statusSettled: "",//模板合同状态 0-待上传文件,1-待乙方盖章,2-待甲方确认盖章,3-完成,4-拒签,9-归档
            entName: "",//企业名称
            userName: "",//用户名称
            activePageSettled: 1,
        }
    }

    componentDidMount() {
        this.getSearch();
    }

    columns = [
        { title: "合同编号", dataIndex: "contractNum", key: "contractNum", width: "10%" },
        {
            title: "关联订单号", dataIndex: "agreementNum", key: "agreementNum", width: "13%",
            render: (value) => {
                return <a onClick={this.goDetail.bind(null, value)}> {value} </a>
            }
        },
        { title: "产品名称", dataIndex: "productName", key: "productName", width: "10%" },
        { title: "产品规格", dataIndex: "specificationsName", key: "specificationsName", width: "6%" },
        { title: "金额（元）", dataIndex: "busiAmount", key: "busiAmount", width: "7%" },
        {
            title: "状态", dataIndex: "status", key: "status", width: "8%",
            render: (value) => {
                return this.renderStatus(value)
            }
        },
        { title: "申请人", dataIndex: "userName", key: "userName", width: "7%" },
        { title: "申请企业名称（甲方）", dataIndex: "applyEnt", key: "applyEnt", width: "11%" },
        {
            title: "合同申请时间", dataIndex: "createTime", key: "createTime", width: "10%",
            render: (value) => {
                return value ? <span>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span> : null
            }
        },
        { title: "服务商名称（乙方）", dataIndex: "isvEnt", key: "isvEnt", width: "10%" },
        {
            title: "操作", dataIndex: "operation", key: "operation", width: "8%",
            render: (value, record) => {
                return record.status != "0" ? <a onClick={this.handleClick.bind(null, record.status, record.contractNum)}>{record.status === "4" ? "下载合同" : "查看合同"}</a> : null
            }
        },
    ];

    settledColumns = [
        { title: "合同编号", dataIndex: "contractNum", key: "contractNum", width: "15%" },
        { title: "合同名称", dataIndex: "contractName", key: "contractName", width: "15%" },
        { title: "用户名称", dataIndex: "userName", key: "userName", width: "10%" },
        { title: "企业名称", dataIndex: "entName", key: "entName", width: "20%" },
        {
            title: "状态", dataIndex: "status", key: "status", width: "10%",
            render: (value) => {
                return this.renderSettledStatus(value)
            }
        },
        {
            title: "创建时间", dataIndex: "createTime", key: "createTime", width: "20%",
            render: (value) => {
                return value ? <span>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span> : null
            }
        },
        {
            title: "操作", dataIndex: "operation", key: "operation", width: "10%",
            render: (value, record) => {
                return <a onClick={this.handleSettledClick.bind(null, record.status, record.contractNum)}>{record.status === "3" ? "下载合同" : "查看合同"}</a>
            }
        },
    ];

    getSearch = (pageIndex = 0, pageSize = 10) => {
        //myapi.BASE_URL + `
        //`https://mock.yonyoucloud.com/mock/3831
        let { contractNum, agreementNum, applyEnt, isvEnt, status } = this.state;
        let newData = { contractNum, agreementNum, applyEnt, isvEnt, status, size: pageSize, page: pageIndex }
        fetch(myapi.BASE_URL + `/market/contract/getOrderContractList`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(newData),
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Headers': 'X-Requested-With',
                'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
                'Access-Control-Allow-Origin': '*',
            },
            credentials: "include"
        })
            .then(res => res.json())
            .then((response) => {
                console.log(response)
                if (response.status === 1) {
                    let infolist = response.data
                    this.setState({
                        dataSource: infolist
                    })
                }
                else {
                    Message.destroy();
                    Message.create({ content: response.msg, color: 'danger' });
                }
            })
    }

    getSettledSearch = (pageIndex = 0, pageSize = 10) => {
        //myapi.BASE_URL + `
        //`https://mock.yonyoucloud.com/mock/3831
        let { contractNumSettled, statusSettled, entName, userName } = this.state;
        let newData = { contractNum: contractNumSettled, status: statusSettled, entName, userName, pageSize: pageSize, pageIndex: pageIndex }
        fetch(myapi.BASE_URL + `/market/contract/getISVContractList`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(newData),
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Headers': 'X-Requested-With',
                'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
                'Access-Control-Allow-Origin': '*',
            },
            credentials: "include"
        })
            .then(res => res.json())
            .then((response) => {
                console.log(response)
                if (response.status === 1) {
                    let infolist = response.data
                    this.setState({
                        settledData: infolist
                    })
                }
                else {
                    Message.destroy();
                    Message.create({ content: response.msg, color: 'danger' });
                }
            })
    }

    settledService = (status, num) => {
        //myapi.BASE_URL + `
        //`https://mock.yonyoucloud.com/mock/3831
        let url = status === "3" ? myapi.BASE_URL + `/market/contract/download/${num}` : myapi.BASE_URL + `/market/contract/view/${num}`
        fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Headers': 'X-Requested-With',
                'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
                'Access-Control-Allow-Origin': '*',
            },
            credentials: "include"
        })
            .then(res => res.json())
            .then((response) => {
                console.log(response)
                if (response.status === 1) {
                    let url = response.data
                    window.open(url)
                }
                else {
                    Message.destroy();
                    Message.create({ content: response.msg, color: 'danger' });
                }
            })
    }

    orderService = (status, num) => {
        //myapi.BASE_URL + `
        //`https://mock.yonyoucloud.com/mock/3831
        let url = status === "4" ? myapi.BASE_URL + `/market/contract/downloadOrderContract/${num}` : myapi.BASE_URL + `/market/contract/viewOrderContract/${num}`
        fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Headers': 'X-Requested-With',
                'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
                'Access-Control-Allow-Origin': '*',
            },
            credentials: "include"
        })
            .then(res => res.json())
            .then((response) => {
                console.log(response)
                if (response.status === 1) {
                    window.open(response.data)
                }
                else {
                    Message.destroy();
                    Message.create({ content: response.msg, color: 'danger' });
                }
            })
    }

    renderStatus = (value) => {
        let text = null;
        switch (value) {
            case '0':
                text = "待上传文件"
                break;
            case '1':
                text = "待甲方确认合同"
                break;
            case '2':
                text = "待乙方盖章"
                break;
            case '3':
                text = "待甲方确认盖章"
                break;
            case '4':
                text = "完成"
                break;
            case '5':
                text = "拒签"
                break;
            case '6':
                text = "归档"
                break;
        }
        return <span>{text}</span>
    }

    renderSettledStatus = (value) => {
        let text = null;
        switch (value) {
            case '0':
                text = "待上传文件"
                break;
            case '1':
                text = "待乙方盖章"
                break;
            case '2':
                text = "待甲方确认盖章"
                break;
            case '3':
                text = "完成"
                break;
            case '4':
                text = "拒签"
                break;
            case '9':
                text = "归档"
                break;
        }
        return <span>{text}</span>
    }

    handleSettledClick = (status, num) => {
        this.settledService(status, num)
    }

    handleClick = (status, num) => {
        this.orderService(status, num)
    }

    handleSelect = (e) => {
        this.setState({ activePage: e })
        this.getSearch(e - 1)
    }

    handleSettledSelect = (e) => {
        this.setState({ activePageSettled: e })
        this.getSettledSearch(e - 1)
    }

    dataNumSelect = (index, value) => {
        this.getSearch(0, value)
    }

    dataNumSettledSelect = (index, value) => {
        this.getSettledSearch(0, value)
    }

    handleChange = (type, e) => {
        this.setState({
            [type]: e
        })
    }

    handleTabChange = (activeKey) => {
        this.resetfun();
        if (activeKey === "1") {
            this.getSearch()
        }
        else {
            this.getSettledSearch()
        }
        this.setState({
            activeTabKey: activeKey
        })
    }

    /**重置 */
    resetfun() {
        this.setState({
            contractNum: "",
            agreementNum: "",
            applyEnt: "",
            isvEnt: "",
            status: "",
            contractNumSettled: "",
            statusSettled: "",
            entName: "",
            userName: "",
        })
    }

    goDetail = (id) => {
        this.props.history.push(`/OrderDetail/${id}`);
    }

    render() {
        let { dataSource, contractNum, agreementNum, applyEnt, isvEnt, status, selectStatus, activeTabKey, settledData, activePage,
            contractNumSettled, statusSettled, entName, userName, selectStatusSettled } = this.state;
        return (
            <Fragment>
                <Header style={{ background: '#fff', padding: 0 }} title="合同列表" />
                <Content style={{ width: '100%' }}>
                    <div className="tabList">
                        <div onClick={this.handleTabChange.bind(null, 1)} className={activeTabKey == 1 ? "active" : ""}>订单合同列表</div>
                        <div onClick={this.handleTabChange.bind(null, 2)} className={activeTabKey == 2 ? "active" : ""}>入驻合同列表</div>
                    </div>
                    {
                        activeTabKey == 1 ?
                            <Fragment>
                                <SearchPanel
                                    reset={this.resetfun.bind(this)}
                                    search={this.getSearch.bind(null, 0, 10)}
                                >
                                    <FormList
                                        layoutOpt={{ md: 4, xs: 4 }}
                                    >
                                        <FormList.Item
                                            label="合同编号"
                                            labelCol={100}
                                        >
                                            <FormControl
                                                className="search-item"
                                                value={contractNum}
                                                onChange={this.handleChange.bind(null, "contractNum")}
                                            />
                                        </FormList.Item>

                                        <FormList.Item
                                            label="合同状态"
                                            labelCol={100}
                                        >
                                            <Select
                                                className="search-item" onChange={this.handleChange.bind(null, "status")} value={status}
                                            >
                                                <Option value="">全部</Option>
                                                {
                                                    selectStatus.map((item) => (
                                                        <Option key={item.id} value={item.id}>{item.stat}</Option>
                                                    ))
                                                }
                                            </Select>
                                        </FormList.Item>

                                        <FormList.Item
                                            label="订单号"
                                            labelCol={100}
                                        >
                                            <FormControl
                                                className="search-item"
                                                value={agreementNum}
                                                onChange={this.handleChange.bind(null, "agreementNum")}
                                            />
                                        </FormList.Item>

                                        <FormList.Item
                                            label="申请企业"
                                            labelCol={100}
                                        >
                                            <FormControl
                                                className="search-item"
                                                value={applyEnt}
                                                onChange={this.handleChange.bind(null, "applyEnt")}
                                            />
                                        </FormList.Item>

                                        <FormList.Item
                                            label="服务商"
                                            labelCol={100}
                                        >
                                            <FormControl
                                                className="search-item"
                                                value={isvEnt}
                                                onChange={this.handleChange.bind(null, "isvEnt")}
                                            />
                                        </FormList.Item>
                                    </FormList>
                                </SearchPanel>
                                <Table columns={this.columns} data={dataSource.content} />
                                <Pagination
                                    first
                                    last
                                    prev
                                    next
                                    maxButtons={5}
                                    boundaryLinks
                                    activePage={activePage}
                                    onSelect={this.handleSelect}
                                    onDataNumSelect={this.dataNumSelect}
                                    showJump={true}
                                    noBorder={true}
                                    total={dataSource.totalElements}
                                    items={dataSource.totalPages}
                                />
                            </Fragment>
                            : null
                    }
                    {
                        activeTabKey == 2 ?
                            <Fragment>
                                <SearchPanel
                                    reset={this.resetfun.bind(this)}
                                    search={this.getSettledSearch.bind(null, 0, 10)}
                                >
                                    <FormList
                                        layoutOpt={{ md: 4, xs: 4 }}
                                    >
                                        <FormList.Item
                                            label="合同编号"
                                            labelCol={100}
                                        >
                                            <FormControl
                                                className="search-item"
                                                value={contractNumSettled}
                                                onChange={this.handleChange.bind(null, "contractNumSettled")}
                                            />
                                        </FormList.Item>

                                        <FormList.Item
                                            label="用户名称"
                                            labelCol={100}
                                        >
                                            <FormControl
                                                className="search-item"
                                                value={userName}
                                                onChange={this.handleChange.bind(null, "userName")}
                                            />
                                        </FormList.Item>

                                        <FormList.Item
                                            label="企业名称"
                                            labelCol={100}
                                        >
                                            <FormControl
                                                className="search-item"
                                                value={entName}
                                                onChange={this.handleChange.bind(null, "entName")}
                                            />
                                        </FormList.Item>

                                        <FormList.Item
                                            label="合同状态"
                                            labelCol={100}
                                        >
                                            <Select
                                                className="search-item" onChange={this.handleChange.bind(null, "statusSettled")} value={statusSettled}
                                            >
                                                <Option value="">全部</Option>
                                                {
                                                    selectStatusSettled.map((item) => (
                                                        <Option key={item.id} value={item.id}>{item.stat}</Option>
                                                    ))
                                                }
                                            </Select>
                                        </FormList.Item>
                                    </FormList>
                                </SearchPanel>
                                <Table columns={this.settledColumns} data={settledData.content} />
                                <Pagination
                                    first
                                    last
                                    prev
                                    next
                                    maxButtons={5}
                                    boundaryLinks
                                    activePage={activePage}
                                    onSelect={this.handleSettledSelect}
                                    onDataNumSelect={this.dataNumSettledSelect}
                                    showJump={true}
                                    noBorder={true}
                                    total={settledData.totalElements}
                                    total={settledData.totalPages}
                                />
                            </Fragment>
                            : null
                    }
                </Content>
            </Fragment>
        )
    }
}

export default Contracts
