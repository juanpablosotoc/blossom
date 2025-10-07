import { transform } from '@babel/standalone';
import React from 'react';

// Import ALL components you might reference in JSX
import Audio from './components/audio';
import BigLi from './components/bigLi';
import BigUl from './components/bigUl';
import Code from './components/code';
import ConceptMap from './components/conceptmap';
import Frame from './components/frame';
import Image from './components/image';
import InfoLink from './components/infoLink';
import Math from './components/math';
import MyNode from './components/myNode';
import MyTooltip from './components/mytooltip';
import Quote from './components/quote';
import SpeedReader from './components/speedReader';
import Timeline from './components/timeline';
import TimelineEvent from './components/timelineEvent';
import Video from './components/video';
import VideoAudioNav from './components/videoAudioNav';

const scope = {
  React,
  // expose everything you imported:
  Audio,
  BigLi,
  BigUl,
  Code,
  ConceptMap,
  Frame,
  Image,
  InfoLink,
  Math,
  MyNode,
  MyTooltip,
  Quote,
  SpeedReader,
  Timeline,
  TimelineEvent,
  Video,
  VideoAudioNav,
};

// Safer than plain eval: evaluate inside a `with(scope)` sandbox
function evalInScope(jsCode: string, sandbox: Record<string, any>) {
  // eslint-disable-next-line no-new-func
  const runner = new Function('scope', `
    with (scope) {
      return (function(){ return eval(${JSON.stringify(jsCode)}); })();
    }
  `);
  return runner(sandbox);
}

export function transformJsxCodeToReactComponent(jsxCode: string) {
  if (!jsxCode) throw new Error('jsxCode is required');

  // Ensure the JSX expression evaluates to an element or a fragment
  const wrapped = `(function(){ return (${jsxCode}); })()`;

  const { code } = transform(wrapped, {
    presets: [['react', { runtime: 'classic' }]], // classic requires React in scope
  });

  if (typeof code !== 'string') throw new Error('transformedCode is not a string');

  const element = evalInScope(code, scope);

  // Return a React component that renders the produced element
  return function Rendered() {
    return element;
  };
}