import { transform } from '@babel/standalone';
import React, { ReactNode } from 'react';
import { Node, Edge } from '@xyflow/react'; 
import { v4 as uuidv4 } from 'uuid'; // Importing uuid

// Import ALL components you might reference in JSX
import VideoAudio from './components/VideoAudio';
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
  VideoAudio,
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

export interface Word {
  word: string;
  start: number;
  end: number;
}

export interface Line {
  text: string;
  start?: number;
  end?: number;
  wordCount: number;
}

interface NodeProps {
  title: string;
  children?: ReactNode;
}

function parseChildren(
  children: ReactNode,
  parentId: string | null = null,
  nodes: Node[] = [],
  edges: Edge[] = [],
  indexCounter: { current: number } = { current: 1 },
  nextNodeTitle: string | null = null
): ReactNode[] {
  const directChildren: ReactNode[] = [];

  const childArray = React.Children.toArray(children);

  childArray.forEach((child, index) => {
    if (React.isValidElement(child) && child.type === MyNode) {
      const { title } = child.props as NodeProps;

      // Determine the title of the next node
      let nextNodeTitle = null;

      if (index + 1 < childArray.length) {
        const nextSibling = childArray[index + 1] as React.ReactElement;
        if (nextSibling && nextSibling.props.title) {
          nextNodeTitle = nextSibling.props.title;
        }
      } else if (nextNodeTitle) {
        nextNodeTitle = nextNodeTitle;
      }

      const nodeId = uuidv4(); // Generate unique ID using uuid
      const nodeIndex = indexCounter.current++;
      const newNode: Node = {
        id: nodeId,
        type: 'child',
        data: {
          id: nodeId,
          label: title,
          title,
          nextNodeTitle, // Add the title of the next node
          children: child.props.children,
          index: nodeIndex,
          activeNode: null,  // Assume these are set in the parent component
          setActiveNode: () => {},
        },
        position: { x: 0, y: 0 },
        draggable: false,
      };

      nodes.push(newNode);

      if (parentId) {
        const newEdge: Edge = {
          id: `e${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          style: {
            stroke: getComputedStyle(document.documentElement).getPropertyValue('--main_primary'),
            strokeWidth: 2,
          },
        };
        edges.push(newEdge);
      }

      // Recursively parse the children of this node, passing the correct nextTitle
      const directChildContent = parseChildren(child.props.children, nodeId, nodes, edges, indexCounter, nextNodeTitle);
      newNode.data.children = directChildContent.length > 0 ? directChildContent : undefined;
    } else if (parentId) {
      directChildren.push(child);
    }
  });

  return directChildren;
}

export function parseNodesAndEdges(rootElement: React.ReactElement): { nodes: Node[], edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const indexCounter = { current: 1 }; // Start indexing children from 1

  const rootNodeId = uuidv4(); // Generate unique ID for root node
  const rootChildren = parseChildren(rootElement.props.children, rootNodeId, nodes, edges, indexCounter);

  const rootNode: Node = {
    id: rootNodeId,
    type: 'root',
    data: {
      id: rootNodeId,
      label: rootElement.props.title,
      title: rootElement.props.title,
      children: rootChildren.length > 0 ? rootChildren : undefined,
      index: 0, // Root node has index 0
      activeNode: null,  
      setActiveNode: () => {},
    },
    position: { x: 0, y: 0 },
    draggable: false,
  };

  nodes.unshift(rootNode); // Ensure the root node is first

  // Set the nextNodeTitle for each node in the list
  nodes.forEach((node, index) => {
    if (index < nodes.length - 1) {
      node.data.nextNodeTitle = nodes[index + 1].data.title;
    } else {
      node.data.nextNodeTitle = null; // Last node has no next node
    }
  });

  return { nodes, edges };
}

export function getWordCount(children: Array<any>): number {
  // Helper function to count words in a string
  const countWords = (text: string) => text.trim().split(/\s+/).length;

  let totalWordCount = 0;

  React.Children.forEach(children, (child) => {
    if (typeof child === 'string') {
      // If the child is a string, count its words
      totalWordCount += countWords(child);
    } else if (child && typeof child === 'object' && child.props && child.props.children) {
      // If the child is a JSX element, recursively count the words in its children
      totalWordCount += getWordCount(child.props.children);
    }
  });

  return totalWordCount;
}
