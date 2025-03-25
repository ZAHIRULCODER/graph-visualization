import { useCallback, useRef, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  NodeTypes,
  EdgeTypes,
  OnNodesChange,
  applyNodeChanges,
  OnConnect,
  Connection,
  addEdge,
  ConnectionLineType,
} from "reactflow";
import "reactflow/dist/style.css";

// Import data from constants
import { initialNodes, initialEdges } from "../constants/graphData";
import {
  formatDate,
  convertReactFlowEdgesToCustomEdges,
  convertCustomEdgesToReactFlowEdges,
} from "../utils/formatters";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { setNodes, setEdges } from "../store/graphSlice";
import { Node } from "../types";
import CustomNode from "./CustomNode";

// Type for the CustomEdge component props
interface CustomEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  source: string;
  target: string;
  data?: {
    amount: number;
    date: string;
    transactionType: string;
    transactionId?: string;
  };
}

// Custom edge with labels
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  source,
}: CustomEdgeProps) => {
  // Get a curved path
  const isDarkMode = useAppSelector((state) => state.graph.isDarkMode);
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  // Control points for the curve - add more curvature for visibility
  const controlX = centerX + 80 * (Math.random() > 0.5 ? 1 : -1);
  const controlY = centerY + 80 * (Math.random() > 0.5 ? 1 : -1);

  // Path definition
  const path = `M ${sourceX} ${sourceY} Q ${controlX} ${controlY}, ${targetX} ${targetY}`;

  // Determine color based on source/target
  const mainNodeId = "bc1q6nxd...s7uuwn"; // Main wallet address
  const isOutflow = source === mainNodeId;
  const edgeColor = isOutflow ? "#f56565" : "#63b3ed";

  // Format the label
  const formatAmount = () => {
    if (!data?.amount) return "";
    return data.amount.toFixed(8);
  };

  const label = `${formatAmount()} BTC | ${
    data?.date ? formatDate(data.date) : ""
  }`;

  return (
    <>
      <path
        id={id}
        stroke={edgeColor}
        strokeWidth={2}
        className="react-flow__edge-path"
        d={path}
        strokeOpacity={0.8}
        fill="none"
        strokeDasharray={isDarkMode ? "" : "5,5"}
      />
      {/* Add directional arrows to clearly show flow direction */}
      <path
        d="M 0,0 L -8,-4 L -8,4 Z"
        fill={edgeColor}
        stroke="none"
        className="react-flow__edge-path-arrow"
        transform={`translate(${targetX},${targetY}) rotate(${
          (Math.atan2(targetY - sourceY, targetX - sourceX) * 180) / Math.PI
        })`}
      />
      <foreignObject
        width={200}
        height={40}
        x={centerX - 100}
        y={centerY - 20}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div
          style={{
            background: isOutflow
              ? isDarkMode
                ? "rgba(254, 215, 215, 0.9)"
                : "rgba(254, 226, 226, 0.9)"
              : isDarkMode
              ? "rgba(215, 227, 254, 0.9)"
              : "rgba(219, 234, 254, 0.9)",
            color: isOutflow ? "#c53030" : "#2b6cb0",
            padding: "6px 8px",
            borderRadius: "5px",
            fontSize: "10px",
            fontWeight: 500,
            textAlign: "center",
            whiteSpace: "nowrap",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {label}
        </div>
      </foreignObject>
    </>
  );
};

// Define the node and edge types
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

const GraphVisualization = () => {
  const reactFlowRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodesState] = useState<Node[]>(initialNodes);
  const [edges, setEdgesState] = useState(
    convertReactFlowEdgesToCustomEdges(initialEdges)
  );
  const isDarkMode = useAppSelector((state) => state.graph.isDarkMode);
  const dispatch = useAppDispatch();

  // Make nodes draggable by handling node changes
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      const updatedNodes = applyNodeChanges(changes, nodes) as Node[];
      setNodesState(updatedNodes);
      dispatch(setNodes(updatedNodes));
    },
    [nodes, dispatch]
  );

  // Handle new connections between nodes
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      // Create new edge with custom properties
      const newEdge = {
        ...connection,
        id: `e-${connection.source}-${connection.target}`,
        type: "custom",
        data: {
          amount: 0.0001, // Default amount
          date: new Date().toISOString(), // Current date
          transactionType: "Normal Tx",
        },
        animated: true,
      };

      // Add edge using ReactFlow's addEdge function
      const reactFlowEdges = addEdge(
        newEdge,
        convertCustomEdgesToReactFlowEdges(edges)
      );
      // Convert back to our custom Edge type
      const updatedEdges = convertReactFlowEdgesToCustomEdges(reactFlowEdges);

      setEdgesState(updatedEdges);
      dispatch(setEdges(updatedEdges));
    },
    [edges, dispatch]
  );

  // Auto-connect new nodes based on relationships
  useEffect(() => {
    // This would be called when nodes or wallet data changes
    // For demonstration, this is just a placeholder
  }, [nodes]);


  const exportAsPNG = ()=> {}

  return (
    <div
      className={`h-full w-full ${isDarkMode ? "bg-black" : "bg-gray-100"}`}
      ref={reactFlowRef}
    >
      <div className="absolute top-4 right-4 z-10">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
          onClick={exportAsPNG}
        >
          Save as SVG
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={convertCustomEdgesToReactFlowEdges(edges)}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.2}
        maxZoom={4}
        defaultEdgeOptions={{
          animated: true,
          type: "custom",
        }}
        nodesDraggable={true}
        className={isDarkMode ? "dark" : ""}
        connectionLineType={ConnectionLineType.SmoothStep}
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color={isDarkMode ? "#222" : "#ccc"}
          className={isDarkMode ? "bg-black" : "bg-gray-100"}
        />
        <Controls className="bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200" />
        <MiniMap
          nodeColor={(node) => {
            const entityName = node.data?.entityName;
            if (isDarkMode) {
              switch (entityName) {
                case "Changenow":
                  return "#f6ad55";
                case "Whitebit":
                  return "#d6bcfa";
                case "Unknown":
                  return "#48bb78";
                default:
                  return "#4299e1";
              }
            } else {
              switch (entityName) {
                case "Changenow":
                  return "#ed8936";
                case "Whitebit":
                  return "#b794f4";
                case "Unknown":
                  return "#38a169";
                default:
                  return "#3182ce";
              }
            }
          }}
          maskColor={
            isDarkMode ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)"
          }
          className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-md ${
            isDarkMode ? "border-gray-700" : "border-gray-300"
          } border`}
        />
      </ReactFlow>
    </div>
  );
};

export default GraphVisualization;
