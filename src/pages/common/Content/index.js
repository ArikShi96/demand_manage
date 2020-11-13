import React, { useEffect, useRef } from 'react'
import classnames from 'classnames'
import './index.css'

const bodyClientHeight = document.body.clientHeight;
/**
 * 页面级布局content
 *
 * @param {Object} props
 * @param {String} props.className
 * @param {String} props.contentCls
 * @param {Boolean} props.hasFooter -children中是否有Footer组件
 * @param {Boolean} props.minHeight -控制是否最小高度占剩余屏幕高度\
 * @param {Boolean} props.setHeight -设置固定高度
 * */
const Content = (props) => {
  let contentNode = useRef(null);
  let {
    className="", contentCls="", hasFooter=false, contentTop,
    minHeight=true, setHeight=false, viewType='card'
  } = props;
  let cls = classnames('mix-ma-content-wrap', className, {
    'footer-bottom': hasFooter,
    'view-card': viewType === 'card',
    'has-content-top': !!contentTop
  });
  let _contentCls = classnames("content-con-wrap", contentCls);

  useEffect(() => {
    if (minHeight || setHeight) {
      let contentDom = contentNode.current;
      let clientRect = contentDom.getBoundingClientRect();
      let { top } = clientRect;
      let styleKey = 'height';
      if (setHeight) {
        styleKey = 'height'
      }else {
        if (minHeight) {
          styleKey = 'minHeight'
        }
      }
      contentDom.style[styleKey] = ( bodyClientHeight - top - 20 - (props.minus || 0) ) + 'px'
    }
  }, [minHeight, setHeight, viewType]);
  let { children } = props;
  return (
    <div ref={contentNode} className={cls}>
      {typeof contentTop === 'function' ? contentTop() : contentTop}
      <div className={_contentCls}>
        {children}
      </div>
    </div>
  )
}

export default Content