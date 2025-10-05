import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';


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

  return <span ref={mathContainerRef}></span>;
};

export default Math;

