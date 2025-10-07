import { Handle, Position} from '@xyflow/react';
import styles from './styles.module.css';
import ReactDOM from 'react-dom';
import Close from '../../icons/close';
import Chevron from '../../icons/chevron';
import React from 'react';
import ErrorBoundary from '@/components/errorBoundary';

export const CustomNodeRoot = React.memo(({ data }: any) => {
  return (
    <ErrorBoundary errorMessage="Error in CustomNodeRoot component" onError={(error)=>{console.error(error)}}>
      <div onClick={(e)=>{
       data.setActiveNode(data.index);
      }}>
        <div data-tip data-for={`node-${data.id}`} className={styles.innerNode}>
          <p><b>{data.label}</b></p>
        </div>
        <Handle type="source" position={Position.Bottom} id="a" className={styles.handle}/>  
        </div>
      {ReactDOM.createPortal(
      <div className={styles.children + ' ' + (data.index === data.activeNode ? styles.active : '')}>
        <div className={styles.metadata}>
          <p className={styles.title}>{data.title}</p>
          <button onClick={(e)=>{
            data.setActiveNode(null);
          }}>
            <Close></Close>
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.left}>
          {data.children}
          </div>
          <button className={styles.right} style={{display: (data.isLast ? 'none' : 'static')}} onClick={(e)=>{
            data.setActiveNode(data.index + 1);
          }}>
            <span className={styles.nextTitle}>{data.nextNodeTitle}</span>
            <Chevron className={styles.chevron} stemClassName={styles.chevronStem}></Chevron>
          </button>
        </div>
      </div>
      ,document.body)}
    </ErrorBoundary>
  );
});

export const CustomNodeChild = React.memo(({ data }: any) => {
  return (
    <ErrorBoundary errorMessage="Error in CustomNodeChild component" onError={(error)=>{console.error(error)}}>
      <div onClick={(e)=>{
       data.setActiveNode(data.index);
      }}>
        <div data-tip data-for={`node-${data.id}`} className={styles.innerNode}>
          <p><b>{data.label}</b></p>
        </div>
        <Handle type="target" position={Position.Top} id="a" className={styles.handle}/>
        <Handle type="source" position={Position.Bottom} id="b" className={styles.handle} />      
        </div>
      {ReactDOM.createPortal(
      <div className={styles.children + ' ' + (data.index === data.activeNode ? styles.active : '')}>
        <div className={styles.metadata}>
          <p className={styles.title}>{data.title}</p>
          <button onClick={(e)=>{
            data.setActiveNode(null);
          }}>
            <Close></Close>
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.left}  data-is-parent={true}>
          {data.children}
          </div>
          <button className={styles.right} style={{display: (!data.nextNodeTitle ? 'none' : 'static')}} onClick={(e)=>{
            data.setActiveNode(data.index + 1);
          }}>
            <span className={styles.nextTitle}>{data.nextNodeTitle}</span>
            <Chevron className={styles.chevron} stemClassName={styles.chevronStem}></Chevron>
          </button>
        </div>
      </div>
      ,document.body)}
    </ErrorBoundary>
  );
});
