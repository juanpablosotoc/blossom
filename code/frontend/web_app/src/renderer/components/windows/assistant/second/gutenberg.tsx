import { transformJsxCodeToReactComponent as processedGutenbergEl} from "@/components/gutenberg/processedGutenbergEl";
import { transformJsxCodeToReactComponent as unprocessedGutenbergEl} from "@/components/gutenberg/unprocessedGutenbergEl";
import styles from '@/components/gutenberg/general.module.scss';
import { useEffect, useState } from "react";

interface GutenbergRendererProps {
    jsxCode: string;
    stage: 'unprocessed-gutenberg' | 'processed-gutenberg';
}

function GutenbergRenderer({ jsxCode, stage }: GutenbergRendererProps) {
    const [Component, setComponent] = useState<React.ComponentType | null>(null);

    useEffect(() => {
      try {
        if (stage === 'unprocessed-gutenberg') {
            setComponent(() => unprocessedGutenbergEl(jsxCode));
        } else if (stage === 'processed-gutenberg') {
            setComponent(() => processedGutenbergEl(jsxCode));
        }
      } catch (e) {
        console.error('Error transforming jsx to react component', e);
      }
    }, [jsxCode, stage]);

    return (
      <div className={styles.scope}>
        {Component && <Component />}
      </div>
    );
  }

export default GutenbergRenderer;
