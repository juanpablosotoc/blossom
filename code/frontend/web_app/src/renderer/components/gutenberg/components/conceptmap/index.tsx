import React, { useEffect, useRef, useState, useCallback, ReactNode } from 'react';
import { ReactFlow, Controls, Background, Node, Edge, useNodesState, useEdgesState, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css'; // Import the new required stylesheet
import dagre from 'dagre';
import { CustomNodeChild, CustomNodeRoot } from '../node';
import { parseNodesAndEdges } from '../../utils';
import styles from './styles.module.css';

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB' });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
      targetPosition: 'top',
      sourcePosition: 'bottom',
    } as Node; // Cast to Node to ensure correct typing
  });

  return { nodes: layoutedNodes, edges };
};

const nodeTypes = {
  root: CustomNodeRoot,
  child: CustomNodeChild,
};

function FlowWrapper({ children }: { children: ReactNode }) {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [activeNode, setActiveNode] = useState<number | null>(null);

  useEffect(() => {
    const { nodes: parsedNodes, edges: parsedEdges } = parseNodesAndEdges(children);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(parsedNodes, parsedEdges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    // Use a small timeout to allow rendering before fitting the view
    const fitTimeout = setTimeout(() => {
      fitView();
    }, 50);

    return () => clearTimeout(fitTimeout);
  }, [children, setNodes, setEdges, fitView]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: { ...node.data, activeNode, setActiveNode },
      }))
    );
  }, [activeNode, setNodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      zoomOnScroll={false}
      panOnScroll={false}
      preventScrolling={false}
      nodesDraggable={false}
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
}

function ConceptMap(props: React.PropsWithChildren<{}>) {
  const [opacity, setOpacity] = useState<number>(1);
  const wrapper = useRef<HTMLDivElement>(null);

  return (
    <div style={{ opacity }} ref={wrapper} className={styles.wrapper}>
      <FlowWrapper>
        {props.children}
      </FlowWrapper>
    </div>
  );
}

export default React.memo(ConceptMap);
