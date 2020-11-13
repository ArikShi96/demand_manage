import { FormControl, Select, Pagination, Table, Message } from 'tinper-bee';
import DatePicker from "bee-datepicker";
import 'bee-form-control/build/FormControl.css';
import 'bee-select/build/Select.css';
import 'bee-table/build/Table.css';
import 'bee-pagination/build/Pagination.css';
import 'bee-datepicker/build/DatePicker.css';
import 'bee-message/build/Message.css';
import "./index.css"
import myapi from '../../api'
import React, { Fragment } from 'react'
import moment from 'moment';
import Header from '../common/Header';
import Content from '../common/Content'
import FormList from '../common/Form';
import SearchPanel from '../common/SearchPanel';
const Option = Select.Option;
const { RangePicker } = DatePicker;
const format = "YYYY-MM-DD";
class IsvModel extends React.Component {
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
            statusSelect: [
                {
                    "stat": "启用",
                    "id": "1"
                },
                {
                    "stat": "停用",
                    "id": "0"
                },
            ],
            approveStatusSelect: [
                {
                    "stat": "未认证",
                    "id": "1"
                },
                {
                    "stat": "审核中",
                    "id": "2"
                },
                {
                    "stat": "审核通过",
                    "id": "3"
                },
                {
                    "stat": "审核未通过",
                    "id": "4"
                },
            ],
            suitStatus: [],
            partnerStatus: [
                {
                    "stat": "基础伙伴",
                    "id": "1"
                },
                {
                    "stat": "参与类型伙伴",
                    "id": "2"
                },
                {
                    "stat": "推广型伙伴",
                    "id": "3"
                },
                {
                    "stat": "融合型伙伴",
                    "id": "4"
                },
                {
                    "stat": "中端产业链伙伴",
                    "id": "5"
                },
                {
                    "stat": "服务星联盟(中端)",
                    "id": "6"
                },
            ],
            isvName: "",
            status: "",//1-启用 0-停用
            siteId: "",
            partnerType: "",//1基础伙伴 2参与类型伙伴 3推广型伙伴 4融合型伙伴 5-中端产业链伙伴 6-服务星联盟(中端)
            registerStart: "",
            registerEnd: "",
            verifyStart: "",
            verifyEnd: "",
            approveStatus: "",
            activePage: 1
        }
    }

    componentDidMount() {
        this.getSiteList();
        this.getSearch();
    }

    columns = [
        {
            title: "企业名称", dataIndex: "isvName", key: "isvName", width: "25%",
            render: (value, record) => {
                return <a onClick={this.goDetail.bind(null, record.isvId)}> {value} </a>
            }
        },
        {
            title: "企业注册时间", dataIndex: "approveTime", key: "approveTime", width: "12%",
            render: (value) => {
                return value ? <span>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span> : null
            }
        },
        { title: "营业执照号码", dataIndex: "licenceNumber", key: "licenceNumber", width: "20%" },
        { title: "企业法人姓名", dataIndex: "legalPerson", key: "legalPerson", width: "11%" },
        {
            title: "企业认证时间", dataIndex: "basVerifyTime", key: "basVerifyTime", width: "12%",
            render: (value) => {
                return value ? <span>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span> : null
            }
        },
        {
            title: "状态", dataIndex: "status", key: "status", width: "10%",
            render: (value) => {
                return <span>{value === "1" ? "启用" : "停用"}</span>
            }
        },
        {
            title: "审核状态", dataIndex: "approveStatus", key: "approveStatus", width: "10%",
            render: (value) => {
                let text = null
                switch (value) {
                    case '1':
                        text = '未认证';
                        break;
                    case '2':
                        text = '审核中';
                        break;
                    case '3':
                        text = '审核通过';
                        break;
                    case '4':
                        text = '审核未通过';
                        break;
                }
                return <span>{text}</span>
            }
        },
    ];

    getSearch = (pageIndex = 0, pageSize = 10) => {
        // https://mock.yonyoucloud.com/mock/815/market/requirement/manage/getList
        // /api/market/requirement/manage/getList?pn=${current}&ps=10&isAjax=1
        console.log(pageSize, pageIndex)
        let { isvName, status, siteId, partnerType, registerStart, registerEnd, verifyEnd, verifyStart, approveStatus } = this.state;
        let newData = { isvName, status, siteId, partnerType, registerStart, registerEnd, verifyEnd, verifyStart, approveStatus, pageSize: pageSize, pageIndex: pageIndex }
        fetch(myapi.BASE_URL + `/market/isv/operator/all`, {
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

    getSiteList = () => {
        fetch(myapi.BASE_URL + `/market/productSite/getList`, {
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
                if (response.status === 1) {
                    this.setState({
                        suitStatus: response.data
                    })
                } else {
                    Message.destroy();
                    Message.create({ content: response.msg, color: 'danger' });
                }
            })
    }

    changeRegisterDate = (d, dataString) => {
        if (dataString && dataString.length > 0) {
            let data = dataString.split("\"");
            this.setState({ registerStart: data[1], registerEnd: data[3] })
        }
    };

    changeVerifyDate = (d, dataString) => {
        if (dataString && dataString.length > 0) {
            let data = dataString.split("\"");
            this.setState({ verifyStart: data[1], verifyEnd: data[3] })
        }
    };

    handleSelect = (e) => {
        this.setState({ activePage: e })
        this.getSearch(e - 1)
    }

    dataNumSelect = (index, value) => {
        this.getSearch(0, value)
    }

    handleChange = (type, e) => {
        this.setState({
            [type]: e
        })
    }

    goDetail = (id) => {
        this.props.history.push(`/isv-detail/${id}`);
    }

    render() {
        let { dataSource, isvName, status, siteId, partnerType, suitStatus, partnerStatus, statusSelect, activePage, approveStatusSelect } = this.state;
        return (
            <Fragment>
                <Header style={{ background: '#fff', padding: 0 }} title="服务商管理" />
                <Content style={{ width: '100%' }}>
                    <SearchPanel
                        search={this.getSearch.bind(null, 0, 10)}
                    >
                        <FormList
                            layoutOpt={{ md: 4, xs: 4 }}
                        >
                            <FormList.Item
                                label="企业名称"
                                labelCol={120}
                            >
                                <FormControl
                                    className="search-item"
                                    value={isvName}
                                    onChange={this.handleChange.bind(null, "isvName")}
                                />
                            </FormList.Item>

                            <FormList.Item
                                label="企业注册时间"
                                labelCol={120}
                            >
                                <RangePicker
                                    className="search-item"
                                    placeholder={'开始 ~ 结束'}
                                    format={format}
                                    onChange={this.changeRegisterDate.bind(this)}
                                />
                            </FormList.Item>

                            <FormList.Item
                                label="企业认证时间"
                                labelCol={120}
                            >
                                <RangePicker
                                    className="search-item"
                                    placeholder={'开始 ~ 结束'}
                                    format={format}
                                    onChange={this.changeVerifyDate.bind(this)}
                                />
                            </FormList.Item>

                            <FormList.Item
                                label="状态"
                                labelCol={120}
                            >
                                <Select
                                    className="search-item" onChange={this.handleChange.bind(null, "status")}
                                >
                                    <Option value="">全部</Option>
                                    {
                                        statusSelect.map((item) => (
                                            <Option key={item.id} value={item.id}>{item.stat}</Option>
                                        ))
                                    }
                                </Select>
                            </FormList.Item>

                            <FormList.Item
                                label="所属子站"
                                labelCol={120}
                            >
                                <Select
                                    className="search-item" onChange={this.handleChange.bind(null, "siteId")}
                                >
                                    <Option value="">全部</Option>
                                    {
                                        suitStatus.map((item) => (
                                            <Option key={item.siteId} value={item.siteId}>{item.siteName}</Option>
                                        ))
                                    }
                                </Select>
                            </FormList.Item>

                            <FormList.Item
                                label="伙伴类型"
                                labelCol={120}
                            >
                                <Select
                                    className="search-item" onChange={this.handleChange.bind(null, 'partnerType')}
                                >
                                    <Option value="">全部</Option>
                                    {
                                        partnerStatus.map((item) => (
                                            <Option key={item.id} value={item.id}>{item.stat}</Option>
                                        ))
                                    }
                                </Select>
                            </FormList.Item>

                            <FormList.Item
                                label="审核状态"
                                labelCol={120}
                            >
                                <Select
                                    className="search-item" onChange={this.handleChange.bind(null, 'approveStatus')}
                                >
                                    <Option value="">全部</Option>
                                    {
                                        approveStatusSelect.map((item) => (
                                            <Option key={item.id} value={item.id}>{item.stat}</Option>
                                        ))
                                    }
                                </Select>
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
                </Content>
            </Fragment>
        )
    }
}

export default IsvModel