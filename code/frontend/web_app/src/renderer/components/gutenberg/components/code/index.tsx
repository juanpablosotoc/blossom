import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { monokaiSublime } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { solarizedDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { rainbow } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { xcode } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { tomorrowNight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import styles from './styles.module.css';
import React from 'react';
import Copy from '../../icons/copy';


export default function Code(props: React.PropsWithChildren<{language: string}>) {
    let codeString = props.children?.toLocaleString();
  return (
    <div className={styles.wrapper}>
        <div className={styles.top}>
            <p>{props.language}</p>
            <button>
                <Copy className={styles.copy}></Copy>
            </button>
        </div>
        <SyntaxHighlighter language="javascript" style={monokaiSublime} className={styles.code}>
            {codeString!}
        </SyntaxHighlighter>
    </div>
  );
};

