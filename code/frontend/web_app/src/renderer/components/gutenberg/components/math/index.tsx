import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import ErrorBoundary from '@/components/errorBoundary';


interface Props {
    mathExpression?: string;
    expression?: string;
}

const Math = (props: Props) => {
  const mathContainerRef = useRef(null);

  useEffect(() => {
    if (mathContainerRef.current) {
      katex.render(props.mathExpression || props.expression || '', mathContainerRef.current, {
        throwOnError: false,
      });
    }
  }, [props.mathExpression]);

  return (
    <ErrorBoundary errorMessage="Error in Math component" onError={(error)=>{console.error(error)}}> 
  <span ref={mathContainerRef}></span>
  </ErrorBoundary>

  );
};

export default Math;

