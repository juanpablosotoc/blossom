import { transformJsxCodeToReactComponent } from "@/components/gutenberg/utils";
import styles from '@/components/gutenberg/general.module.scss';
import { useEffect, useState } from "react";
import Output1 from "@/components/gutenberg/test_gut1";
import Output2 from "@/components/gutenberg/test_gut2";

function GutenbergRenderer({ jsx }: { jsx: string }) {
    const [Component, setComponent] = useState<React.ComponentType | null>(null);

    useEffect(() => {
      try {
        setComponent(() => transformJsxCodeToReactComponent(jsx));
      } catch (e) {
        console.error('Error transforming jsx to react component', e);
      }
    }, [jsx]);

    return (
      <div className={styles.scope}>
        {Component && <Component />}
      </div>
    );
  }

// For testing
// function GutenbergRenderer({ jsx }: { jsx: string }) {
//     return (
//       <div className={styles.scope}>
//         <Output2 />
//       </div>
//     )
// };

export default GutenbergRenderer;