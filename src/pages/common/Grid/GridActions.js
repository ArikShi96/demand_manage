import React, { useCallback } from 'react'
import classnames from 'classnames'
import './girdActions.css'
/**
 * Grid操作栏组件
 * @param {Object} props
 * @param {String} props.align=[right|left] -actionItem对其方式
 * @constructor
 */
export const GridActions = (props) => {
  let { children, align='left', className='' } = props;

  let cls = classnames('mix-grid-actions actions-align-' + align, className);
  return (
    <div className={cls}>
      {children}
    </div>
  )
}


export const GridAction = (props) => {
  let { className, children, onClick, ...other } = props;
  let handleClick = useCallback((event) => {
    event.stopPropagation();
    onClick && onClick()
  })
  let cls = classnames('mix-grid-action-item', className);
  return (
    <a className={cls} onClick={handleClick} {...other}>{children}</a>
  )
}