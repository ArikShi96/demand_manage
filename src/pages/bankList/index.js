import {
    Form,
    FormControl,
    Button,
    Select,
    Pagination,
    Table,
    Message,
    Modal,
    Label,
    Icon,
    Upload,
    Switch,
    Radio
} from 'tinper-bee';
import 'bee-form/build/Form.css';
import 'bee-upload/build/Upload.css';
import 'bee-form-control/build/FormControl.css';
import 'bee-datepicker/build/DatePicker.css';
import 'bee-button/build/Button.css';
import 'bee-select/build/Select.css';
import 'bee-radio/build/Radio.css';
import 'bee-table/build/Table.css';
import 'bee-pagination/build/Pagination.css';
import 'bee-message/build/Message.css';
import 'bee-modal/build/Modal.css';
import 'bee-icon/build/Icon.css'
import 'bee-timeline/build/Timeline.css';
import "./index.css"
import myapi from '../../api'
import Header from '../common/Header';
import Content from '../common/Content';
import FormList from '../common/Form';
import SearchPanel from '../common/SearchPanel';
import React, { Fragment } from 'react'
const Option = Select.Option;
const FormItem = Form.FormItem;
class Template extends React.Component {
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
            bankName: "",
            b2b:'',//企业网银
            debit:'',//储蓄卡
            credit:'',//信用卡
            showModal: false,
            upLoadData: {
                id: "",
                bankCode:'',
                imgUrl:'',
                bankName:'',
                b2b:true,//企业网银
                debit:true,//储蓄卡
                credit:true,//信用卡
                phone:'',
            },
            imgUrl: '',
            activeTemPage:1,
            statusCode: [
                {
                    "text": "全部",
                    "value": ""
                },
                {
                    "text": "支持",
                    "value": "1"
                },
                {
                    "text": "不支持",
                    "value": "0"
                },
            ],
        }
    }

    componentDidMount() {
        this.getSearch();
    }

    columns = [
        { title: "序号", dataIndex: "index", key: "index", width: "10%",
            render:(value,record, index) => {
             return index + 1
            }
        },
        { title: "银行卡标志", dataIndex: "bankCode", key: "bankCode", width: "10%" },
        { title: "银行名称", dataIndex: "bankName", key: "bankName", width: "20%" },
        {
            title: "支持银行网银", dataIndex: "b2b", key: "b2b", width: "10%",
            render: (value) => {
                return <Switch
                  checked={value}
                  disabled
                  // onChange={this.switchfun.bind(this, record.id)}
                />
            }
        },
        {
            title: "支持个人储蓄卡", dataIndex: "debit", key: "debit", width: "10%",
            render: (value) => {
                return <Switch
                  checked={value}
                  disabled
                />
            }
        },
        { title: "支持个人信用卡", dataIndex: "credit", key: "credit", width: "10%",
            render: (value) => {
                return <Switch
                  checked={value}
                  disabled
                />
            }
        },
        { title: "银行客服热线", dataIndex: "phone", key: "phone", width: "10%" },
        {
            title: "操作", dataIndex: "operation", key: "operation", width: "10%",
            render: (value, record) => {
                return <Fragment>
                    <a style={{ marginLeft: "10px" }} onClick={this.edit.bind(null, record)}>编辑</a>
                </Fragment>
            }
        },
    ];

    uploadProps = {
        name: 'file',
        action: myapi.BASE_URL + `/market/file/upload/img`,
        accept: 'image/png,image/jpg',
        showUploadList:false,
        onChange:(info)=> {
            if (info.file.status === 'done') {
                let {fileName} = info.file.response
                if(fileName != '-1') {
                    Message.create({ content: 'logo上传成功', color: 'success' });
                    this.setState({
                        imgUrl:fileName
                    })

                }else {
                    Message.destroy();
                    Message.create({ content: 'logo上传失败', color: 'danger' });
                }
            }

        },
    };

    //银行列表查询
    getSearch = (pageIndex = 1, pageSize) => {
        //myapi.BASE_URL + `
        //`https://mock.yonyoucloud.com/mock/3831
        let { bankName, b2b, debit, credit,dataSource,} = this.state;
        let _pageSize = 10;
        if(!pageSize) {
            _pageSize = dataSource.size;
        }else {
            _pageSize = pageSize
        }
        // let newData = { bankName, b2b, debit, credit, pageSize, pageIndex }
        fetch(myapi.BASE_URL + `/market/chanpay/getOperatorBankList?bankName=${bankName}&b2b=${b2b}&debit=${debit}&credit=${credit}&pageIndex=${pageIndex}&pageSize=${_pageSize}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                // 'Access-Control-Allow-Credentials': 'true',
                // 'Access-Control-Allow-Headers': 'X-Requested-With',
                // 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
                // 'Access--Allow-Origin': '*',
            },
            credentials: "include",
        })
            .then(res => res.json())
            .then((response) => {
                console.log(response)
                if (response.status === 1) {
                    this.setState({
                        dataSource: response.data
                    })
                }
                else {
                    Message.destroy();
                    Message.create({ content: response.msg, color: 'danger' });
                }
            })
    }


    //保存银行
    onOk = (valus) => {
        //myapi.BASE_URL + `
        //`https://mock.yonyoucloud.com/mock/3831

        fetch(myapi.BASE_URL + `/market/chanpay/saveBank`, {
            method: 'POST',
            mode: 'cors',
            // body:valus,
            body: JSON.stringify(valus),
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                // 'Access-Control-Allow-Credentials': 'true',
                // 'Access-Control-Allow-Headers': 'X-Requested-With',
                // 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
                // 'Access-Control-Allow-Origin': '*',
            },
            credentials: "include",
        })
          .then(res => res.json())
          .then((response) => {
              console.log(response)
              this.close()
              if (response.status === 1) {
                  Message.create({ content: '保存成功', color: 'success' });
                  this.getSearch()
              }
          })
    }



    handleSelect = (value) => {
        this.setState({ activeTemPage: value })
        this.getSearch(value)
    }

    dataNumSelect = (index,pageSize) => {
        this.getSearch(1,pageSize)
    }


    handleChange = (type, value) => {
        // let _value = value
        // if(type != 'bankName') {
        //     _value = Boolean(value*1)
        // }
        this.setState({
            [type]: value
        })
    }


    /**重置 */
    resetfun = () => {
        this.setState({
            bankName:'',
            b2b:'',
            credit:'',
            debit:'',
            imgUrl:'',
            upLoadData: {
                id: "",
                bankCode:'',
                imgUrl:'',
                bankName:'',
                b2b:true,
                credit:true,
                debit:true,
                phone:'',
            }
        })
    }

    edit = (record) => {
        console.log(record)
        this.setState({
            imgUrl:record.imgUrl,
            upLoadData: record,
            showModal: true,
        });
    }

    close = () => {
        this.setState({
            showModal: false,
        });
    }

    open = () => {
        this.resetfun()
        this.setState({
            showModal: true
        });
    }

    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                let {id} = this.state.upLoadData;
                let {imgUrl} = this.state;
                // let { upLoadData } = this.state;
                // this.setState({ upLoadData });
                if(!imgUrl) {
                    this.setState({
                        bankError:true
                    })
                    return
                }
                values.b2b = Boolean(values.b2b*1)
                values.credit = Boolean(values.credit*1)
                values.debit = Boolean(values.debit*1)
                values.imgUrl = imgUrl;
                if(id) {
                    values.id = id
                }
                this.onOk(values)

            }
        })
    }





    render() {
        let { dataSource, bankName, b2b, debit, credit,imgUrl,
            activeTemPage, upLoadData, showModal,bankError,statusCode } = this.state;
        let { getFieldProps, getFieldError } = this.props.form;
        console.log(this.state);
        return (
            <Fragment>
                <Header style={{ background: '#fff', padding: 0 }} title="畅捷银行维护" />
                <Content style={{ width: '100%' }}>
                    <Fragment>
                        <SearchPanel
                          reset={this.resetfun.bind(this)}
                          search={this.getSearch.bind(null, 1, 10)}
                        >
                            <FormList
                              layoutOpt={{ md: 4, xs: 4 }}
                            >
                                <FormList.Item
                                  label="银行名称"
                                  labelCol={100}
                                >
                                    <FormControl
                                      className="search-item"
                                      value={bankName}
                                      onChange={this.handleChange.bind(null, "bankName")}
                                    />
                                </FormList.Item>

                                <FormList.Item
                                  label="银行网银"
                                  labelCol={100}
                                >
                                    <Select
                                      className="search-item"
                                      onChange={this.handleChange.bind(null, "b2b")}
                                      value={b2b}
                                    >
                                        {
                                            statusCode.map((item) => (
                                              <Option key={item.value} value={item.value}>{item.text}</Option>
                                            ))
                                        }
                                    </Select>
                                </FormList.Item>

                                <FormList.Item
                                  label="个人储蓄卡"
                                  labelCol={100}
                                >
                                    <Select
                                      className="search-item"
                                      onChange={this.handleChange.bind(null, "debit")}
                                      value={debit}
                                    >
                                        {
                                            statusCode.map((item) => (
                                              <Option key={item.value} value={item.value}>{item.text}</Option>
                                            ))
                                        }
                                    </Select>
                                </FormList.Item>
                                <FormList.Item
                                  label="个人信用卡"
                                  labelCol={100}
                                >
                                    <Select
                                      className="search-item"
                                      onChange={this.handleChange.bind(null, "credit")}
                                      value={credit}
                                    >
                                        {
                                            statusCode.map((item) => (
                                              <Option key={item.value} value={item.value}>{item.text}</Option>
                                            ))
                                        }
                                    </Select>
                                </FormList.Item>
                            </FormList>
                        </SearchPanel>
                        <div className="button-zone">
                            <Button colors="primary" onClick={this.open}>新增</Button>
                        </div>
                        <Table columns={this.columns} data={dataSource.content} />
                        <Pagination
                            first
                            last
                            prev
                            next
                            maxButtons={5}
                            boundaryLinks
                            activePage={activeTemPage}
                            onSelect={this.handleSelect}
                            onDataNumSelect={this.dataNumSelect}
                            showJump={true}
                            noBorder={true}
                            total={dataSource.totalElements}
                            items={dataSource.totalPages}
                        />
                    </Fragment>
                </Content>

                <Modal
                    show={showModal}
                    onHide={this.close} >
                    <Modal.Header closeButton>
                        <Modal.Title>编辑</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div>
                            <Form>
                                <FormItem>
                                    <Label><Icon type="uf-mi" className='mast'></Icon>银行卡标志</Label>
                                    <FormControl
                                        {...getFieldProps('bankCode', {
                                            validateTrigger: 'onBlur',
                                            initialValue: upLoadData.bankCode,
                                            rules: [{
                                                required: true, message: '请输入银行卡标志',
                                            }],
                                        })}
                                    />
                                    <span className='error'>
                                        {getFieldError('bankCode')}
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <Label><Icon type="uf-mi" className='mast'></Icon>银行卡名称</Label>
                                    <FormControl
                                      {...getFieldProps('bankName', {
                                          validateTrigger: 'onBlur',
                                          initialValue: upLoadData.bankName,
                                          rules: [{
                                              required: true, message: '请输入银行卡名称',
                                          }],
                                      })}
                                    />
                                    <span className='error'>
                                        {getFieldError('bankName')}
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <Label><Icon type="uf-mi" className='mast'></Icon>银行LOGO</Label>
                                    <div className='upload-logo'>
                                        <Upload {...this.uploadProps}>
                                            <Button shape="border">
                                                <Icon type="uf-upload" /> 上传
                                            </Button>
                                            <span className="txt-tip">图片大小为260px*70px，图片类型为jpg、png</span>
                                        </Upload>
                                    </div>
                                    {
                                        bankError?<span className="error">请输入银行卡LOGO</span>:null
                                    }

                                </FormItem>
                                {
                                    imgUrl?<FormItem>
                                        <Label></Label>
                                        <div className="upload-logo-img">
                                            <img src={imgUrl} alt=""/>
                                        </div>
                                    </FormItem>:null
                                }
                                <FormItem >
                                    <Label><Icon type="uf-mi" className='mast'></Icon>支持网银</Label>
                                    <Radio.RadioGroup
                                      // selectedValue={this.state.selectedValue2}
                                      {
                                          ...getFieldProps('b2b', {
                                                initialValue: upLoadData.b2b?'1':'0',
                                                rules: [{ required: true }]
                                            }
                                          ) }
                                    >
                                        <Radio value='1'>支持</Radio>
                                        <Radio value='0'>不支持</Radio>
                                    </Radio.RadioGroup>
                                </FormItem>
                                <FormItem >
                                    <Label><Icon type="uf-mi" className='mast'></Icon>支持个人储蓄卡</Label>
                                    <Radio.RadioGroup
                                      // selectedValue={this.state.selectedValue2}
                                      {
                                          ...getFieldProps('debit', {
                                                initialValue: upLoadData.debit?'1':'0',
                                                rules: [{ required: true }]
                                            }
                                          ) }
                                    >
                                        <Radio value='1'>支持</Radio>
                                        <Radio value='0'>不支持</Radio>
                                    </Radio.RadioGroup>
                                </FormItem>
                                <FormItem >
                                    <Label><Icon type="uf-mi" className='mast'></Icon>支持个人信用卡</Label>
                                    <Radio.RadioGroup
                                      // selectedValue={this.state.selectedValue2}
                                      {
                                          ...getFieldProps('credit', {
                                                initialValue: upLoadData.credit?'1':'0',
                                                rules: [{ required: true }]
                                            }
                                          ) }
                                    >
                                        <Radio value='1'>支持</Radio>
                                        <Radio value='0'>不支持</Radio>
                                    </Radio.RadioGroup>
                                </FormItem>
                                <FormItem>
                                    <Label><Icon type="uf-mi" className='mast'></Icon>银行客服热线</Label>
                                    <FormControl
                                      {...getFieldProps('phone', {
                                          validateTrigger: 'onBlur',
                                          initialValue: upLoadData.phone,
                                          rules: [{
                                              required: true, message: '请输入银行客服热线',
                                          }],
                                      })}
                                    />
                                    <span className='error'>
                                        {getFieldError('phone')}
                                    </span>
                                </FormItem>

                            </Form>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.close} colors="secondary" style={{ marginRight: 8 }}>取消</Button>
                        <Button onClick={this.handleOk} colors="primary">确认</Button>
                    </Modal.Footer>
                </Modal>

            </Fragment>
        )
    }
}

export default Form.createForm()(Template)
