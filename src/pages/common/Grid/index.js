import React, { Component } from 'react';
import PropTypes from 'prop-types'
import moment from 'moment';
import { Checkbox, Icon, Radio, Popover, Table as BeeTable } from '../index'
import Pagination from '../Pagination'
import multiSelectFun from 'bee-table/build/lib/multiSelect';
import singleSelect from 'bee-table/build/lib/singleSelect';
import filterColumn from 'bee-table/build/lib/filterColumn';
import NoDataImg from './no-data.png'
import _uniqBy from 'lodash/uniqBy';
import _cloneDeep from 'lodash/cloneDeep';
import _differenceBy from 'lodash/differenceBy';

let FBeeTable = filterColumn(BeeTable, Popover, Icon);

import './index.css'

const defualtPagination = {
  dataNumSelect: Pagination.dataNumSelect
};


class Grid extends Component {
  constructor(props) {
    super(props);
    let { multiSelect, radioSelect, data } = props;
    this.Talle = FBeeTable;
    let _data = data
    if (multiSelect) {
      this.Talle = multiSelectFun(FBeeTable, Checkbox);
      _data = _cloneDeep(data)
    }
    if (radioSelect) {
      this.Talle = singleSelect(FBeeTable, Radio);
      _data = _cloneDeep(data)
    }
    this.state = {
      activePage: 1,
      dataNum: 2,
      selectedList: [],
      data: _data
    }
  }

  componentWillReceiveProps(nextProps) {
    let { multiSelect, radioSelect, data } = nextProps;
    let _data = data;
    if ('selectedList' in nextProps) {
      this.state.selectedList = nextProps.selectedList;
    }
    if (multiSelect || radioSelect) {
      if (multiSelect !== this.props.multiSelect) {
        this.Talle = multiSelectFun(FBeeTable, Checkbox);
      }
      if (radioSelect !== this.props.radioSelect) {
        this.Talle = singleSelect(FBeeTable, Radio);
      }
      _data = _cloneDeep(data);
      let selectedRowIndex = '';
      _data.forEach((record, recordIndex) => {
        if (nextProps.getDisabled) {
          Object.assign(record, nextProps.getDisabled(record))
        }
        let { dataKey, rowKey } = nextProps;
        let _dataKey = dataKey || rowKey;
        let selectedItem = nextProps.selectedList.find(item => {
          let isSelect = item[_dataKey] === record[_dataKey];
          if (isSelect) selectedRowIndex = recordIndex;
          return isSelect
        });
        if (selectedItem) {
          record._checked = true
        }
      })
      this.state.selectedRowIndex = selectedRowIndex;
    }else {
      this.Talle = FBeeTable;
    }
    this.setState({
      data: _data
    })
  }

  static propTypes = {
    multiSelect: PropTypes.bool, //是否多选
    radioSelect: PropTypes.bool, //是否单选
    dataKey: PropTypes.string // data 主键
  }

  static defaultProps = {
    //   hideBodyScroll: true,
    headerScroll: true,
    multiSelect: false,
    singleSelect: false,
    data: [],
    noBorder: false,
    columnFilterAble: false,
    emptyText: '暂时还没有数据哦～'
  };

  static hoverButtonPorps = {
    size: 'sm',
    colors: 'dark',
    className: 'ucg-mar-r-5'
  }

  static renderIndex = (value, record, index) => {
    return index + 1
  }

  static renderText = (value) => {
    return value || '-'
  }

  static renderTime = (value) => {
    return value ? moment(value).format('YYYY-MM-DD HH:mm') : '-'
  }

  onPagiSelect = (active) => {
    let { onSelect, onPageChange } = this.props.pagination || {};
    this.setState({ active });
    onSelect && onSelect(active);
    onPageChange && onPageChange({pageIndex: active})
  }

  onDataNumSelect = (index, value) => {
    let { onDataNumSelect, onPageChange} = this.props.pagination || {};
    this.setState({ dataNum: index });
    onDataNumSelect && onDataNumSelect(index, value);
    onPageChange && onPageChange({pageSize: value, pageIndex: 1})

  }

  renderEmpty = () => {
    let { emptyText } = this.props;
    return (
      <span className="ucg-grid-empty">
        <img className="ucg-grid-empty-img" src={NoDataImg} />
        <p className="ucg-grid-empty-text">{emptyText}</p>
      </span>
    )
  }

  rowKey = (record, index) => {
    let { dataKey } = this.props;
    return dataKey ? (record[dataKey] || index) : index
  }

  getSelectedDataFunc = (dataList, data ) => {
    /**
     * 多选 dataList=[...当前所有选中状态行数据]
     * 全选状态 dataList = [...this.props.data] data=undefined
     * 全反选状态 dataList = [] data=undefined
     * 单行数据选中装态 dataList=[...当前所有选中状态行数据(包含当前操作行)] data=当前操作行数据 且 data._checked=true
     * 单行数据反选状态 dataList=[...当前所有选中状态行数据(不包含包含当前操作行)] data=当前操作行数据 且data._checked=false
     *
     * 单选
     * 选中状态 dataList为选中行数据 data为选中行数据index
     * 反选状态 dataList undefined
     */
    let { dataKey, rowKey} = this.props;
    if (!Array.isArray(dataList)) {
      dataList = [dataList]
    }
    let selectedList = _cloneDeep(this.state.selectedList);
    let isSelected = false;//定义当前操作是选择还是反选，默认为反选
    let {multiSelect} = this.props;
    if (multiSelect) {
      if (data) {
        isSelected = data._checked
      }
      //当dataList.length
      else {
        isSelected = dataList.length > 0
      }
    }else {
      isSelected = typeof data !== 'undefined'
    }
    if (isSelected) {
      if (multiSelect) {
        selectedList = selectedList.concat(dataList);
        selectedList = _uniqBy(selectedList, dataKey || rowKey);
      } else {
        selectedList = dataList;
      }

    } else {
      let diffList = null;
      if (multiSelect) {
        //dataList.length === 0代表 当前页数据全部不选
        //需要从选择列表中剔除当前页面数据
        if (dataList.length === 0) {
          diffList = this.state.data;
        }
        //当dataList.length > 0 代表不选 某一行数据
        //需要从当前选择列表中剔除 此行数据
        else {
          diffList = [data]
        }
        selectedList = _differenceBy(selectedList, diffList, dataKey || rowKey);
      }else {
        selectedList = []
      }

    }

    this.state.selectedRowIndex = data;
    this.state.selectedList = selectedList;

    let { getSelectedDataFunc } = this.props;
    if (getSelectedDataFunc && typeof getSelectedDataFunc === 'function') {
      getSelectedDataFunc(selectedList, data);
    }
  }



  render() {
    let {
      pagination, multiSelect, columns, header, noBorder,
      footer, data,
      ...otherProps
    } = this.props;

    let Table = this.Talle;
    let cls = 'ucg-ma-grid-wrapper';
    if (noBorder) cls += ' noborder';
    return (
      <div className={cls}>
        {header ? (
          <div className="ucg-ma-grid-header">
            {typeof header === 'function' ? header() : header}
          </div>
        ) : null}
        <Table
          columns={columns}
          data={this.state.data}
          ref={node => this.tableNode = node}
          rowKey={this.rowKey}
          selectedRowIndex={this.state.selectedRowIndex}
          {...otherProps}
          getSelectedDataFunc={this.getSelectedDataFunc}
          emptyText={this.renderEmpty}
        />
        {footer ? (
          <div className="ucg-ma-grid-header">
            {typeof footer === 'function' ? footer() : footer}
          </div>
        ) : null}
        {pagination ? (
          <Pagination
            first
            last
            prev
            next
            noBorder
            showJump
            align="center"
            maxButtons={5}
            boundaryLinks
            activePage={pagination.activePage}
            onSelect={this.onPagiSelect}
            onDataNumSelect={this.onDataNumSelect}
            dataNumSelect={pagination.dataNumSelect || defualtPagination.dataNumSelect}
            total={pagination.total}
            items={pagination.items}
            dataNum={(pagination.dataNumSelect || defualtPagination.dataNumSelect).indexOf(pagination.pageSize)}
          />
        ) : null}
      </div>
    );
  }
}
export default Grid;
