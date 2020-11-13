import { Button, Message, FormControl, Pagination, Table, Modal } from 'tinper-bee';
import 'bee-button/build/Button.css';
import 'bee-table/build/Table.css';
import 'bee-form-control/build/FormControl.css';
import 'bee-pagination/build/Pagination.css';
import 'bee-message/build/Message.css';
import 'bee-modal/build/Modal.css';
import Header from '../common/Header';
import Content from '../common/Content';
import FormList from '../common/Form';
import SearchPanel from '../common/SearchPanel';
import React, { Fragment } from 'react'
import myapi from '../../api'
import { Link } from 'react-router-dom'

class CateModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listdata: [],
            dominid: "",
            currentlist: "",
            activePage: 1
        }
    }

    componentDidMount() {
        this.getlistinfo()
    }

    columns = [
        { title: "发布人", dataIndex: "publisherName", key: "publisherName", width: "15%" },
        { title: "预算", dataIndex: "projectBudget", key: "projectBudget", width: "15%" },
        { title: "竞标截至时间", dataIndex: "bidEndtime", key: "bidEndtime", width: "15%" },
        {
            title: "所属领域", dataIndex: "domain", key: "domain", width: "15%",
            render: (value) => {
                return <span>{value.domainName}</span>
            }
        },
        { title: "联系人", dataIndex: "contactMan", key: "contactMan", width: "15%" },
        { title: "联系方式", dataIndex: "contactPhone", key: "contactPhone", width: "15%" },
        {
            title: "操作", dataIndex: "operation", key: "operation", width: "10%",
            render: (value, record, index) => {
                return <a onClick={this.moveOut.bind(this, record.id, index)}>移出</a>
            }
        },
    ];

    getlistinfo(e = 0, ps = 10) {
        fetch(myapi.BASE_URL + `/market/requirement/blacklist/list?pn=${e}&ps=${ps}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            credentials: "include"
        })
            .then(res => res.json())
            .then((response) => {
                if (response.status === 1) {
                    var allistdata = response.data.content
                    var infolist = response.data
                    this.setState({
                        listdata: allistdata,
                        currentlist: infolist
                    })
                }
            })
    }

    changePageNum(e) {
        this.setState({ activePage: e })
        this.getlistinfo(e - 1)
    }

    dataNumSelect = (index, value) => {
        this.getSearch(0, value)
    }

    domainfun(e) {
        var dname = e.target.value
        this.setState({
            dominid: dname
        })
    }

    resetSearch() {
        this.setState({
            dominid: ""
        })
        this.getlistinfo()
    }

    /**搜索 */
    searchDomain() {
        var names = this.state.dominid
        console.log(names)
        fetch(myapi.BASE_URL + `/market/requirement/domain/list?domainName=${names}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            credentials: "include"
        })
            .then(res => res.json())
            .then((response) => {
                var allistdata = response.data.content
                this.setState({
                    listdata: allistdata
                })
            })
    }

    moveOut(ids, index) {
        this.setState({
            moveState: true,
            moveID: ids,
            moveIndex: index
        })

    }

    hidePullBlack() {
        this.setState({
            moveState: false
        })
    }

    moveFun() {
        let that = this
        fetch(myapi.BASE_URL + `/market/requirement/blacklist/${this.state.moveID}/remove`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            credentials: "include"
        }).then(res => res.json()).then(data => {
            console.log(data, 'data')
            if (data.status !== 0) {
                Message.create({ content: '操作成功', color: 'success' });
                that.setState({
                    moveState: false
                }, () => {
                    that.getlistinfo()
                })
            } else {
                that.setState({
                    moveState: false
                })
            }

        }).catch(error => {
            console.log(error, 'error')
            that.setState({
                moveState: false
            })
        })
    }

    delelistfun(ids, indx) {
        var listdemas = [...this.state.listdata]
        fetch(myapi.BASE_URL + `/market/requirement/manage/domain/delete`, {
            method: 'post',
            body: JSON.stringify({
                id: ids
            }),
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            credentials: "include"
        })
            .then(res => res.json())
            .then((response) => {
                if (response.status === 1) {
                    listdemas.splice(indx, 1)
                    this.setState({
                        listdata: listdemas
                    })
                    Message.create({ content: '删除成功', color: 'success' });
                } else {
                    Message.create({ content: response.msg, color: 'danger' });
                }
            })
    }

    render() {
        this.listdata = this.state.listdata
        this.dominid = this.state.dominid
        this.currentlist = this.state.currentlist
        this.activePage = this.state.activePage
        return (
            <Fragment>
                <Header style={{ background: '#fff', padding: 0 }} title="服务商黑名单" />
                <Content style={{ width: '100%' }}>
                    {/*<SearcHead>*/}
                    {/*    <Form layout="inline">*/}
                    {/*        <FormControl onChange={this.domainfun.bind(this)} value={this.dominid}*/}
                    {/*               style={{width: '30%', marginRight: '3%'}}/>*/}
                    {/*        <Button type="primary" htmlType="submit" style={{marginRight: '3%'}}*/}
                    {/*                onClick={this.searchDomain.bind(this)}>搜索</Button>*/}
                    {/*        <Button type="primary" htmlType="reset" style={{marginRight: '3%'}}*/}
                    {/*                onClick={this.resetSearch.bind(this)}>重置</Button>*/}
                    {/*        <Button type="primary"><Link to="/Addcate">新增</Link></Button>*/}
                    {/*    </Form>*/}
                    {/*</SearcHead>*/}
                    <Table columns={this.columns} data={this.listdata} />
                    <Pagination
                        first
                        last
                        prev
                        next
                        maxButtons={5}
                        boundaryLinks
                        activePage={this.activePage}
                        onSelect={this.changePageNum.bind(this)}
                        onDataNumSelect={this.dataNumSelect}
                        showJump={true}
                        noBorder={true}
                        total={this.currentlist.totalElements}
                        items={this.currentlist.totalPages}
                    />

                    <Modal
                        show={this.state.moveState}
                        onHide={this.hidePullBlack.bind(this)}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>提示</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            移出黑名单，将恢复发布需求的权限<br />
                            <br />
                             确定移出黑名单？
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={this.hidePullBlack.bind(this)} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
                            <Button onClick={this.moveFun.bind(this)} colors="primary">确认</Button>
                        </Modal.Footer>
                    </Modal>
                </Content>
            </Fragment>
        )
    }
}

export default CateModel