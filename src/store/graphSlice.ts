import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  GraphState,
  Node,
  Edge,
  InflowResponse,
  OutflowResponse,
} from "../types";
import { prefersDarkMode } from "../utils/theme";

// Mock API call functions (replace with actual API calls in a real implementation)
// @ts-ignore
const fetchInflowData = async (address: string): Promise<InflowResponse> => {
  // In a real app, this would be an API call
  return {
    message: "success",
    data: [
      {
        beneficiary_address: "bc1qq7ldp3mza8q7q9e9gmzg72rzafyegckg57wluu",
        amount: 0.01000191,
        date: "2022-07-17 14:10:09",
        transactions: [
          {
            tx_amount: 0.01000191,
            date_time: "2022-07-17 14:10:09",
            transaction_id:
              "7e9885a3d2d236ea21bcb10c0b65f89010b3abbe9e705375b4f2856b0da32c7c",
          },
        ],
        entity_name: "Unknown",
        token_type: "BTC",
        transaction_type: "Normal Tx",
      },
      {
        beneficiary_address: "bc1qng0keqn7cq6p8qdt4rjnzdxrygnzq7nd0pju8q",
        amount: 2.4163156,
        date: "2022-07-17 14:10:09",
        transactions: [
          {
            tx_amount: 2.4163156,
            date_time: "2022-07-17 14:10:09",
            transaction_id:
              "7e9885a3d2d236ea21bcb10c0b65f89010b3abbe9e705375b4f2856b0da32c7c",
          },
        ],
        entity_name: "Changenow",
        token_type: "BTC",
        transaction_type: "Normal Tx",
      },
    ],
  };
};
// @ts-ignore
const fetchOutflowData = async (address: string): Promise<OutflowResponse> => {
  // In a real app, this would be an API call
  return {
    message: "success",
    data: [
      {
        payer_address: "bc1qf786lw92dy09cx3tt9qhn4tf69dw9ak7m3ktkk",
        amount: 1.47741817,
        date: "2022-07-13 00:35:37",
        transactions: [
          {
            tx_amount: 1.47741817,
            date_time: "2022-07-13 00:35:37",
            transaction_id:
              "31e72dac1b2528efd3d6bf6b0108bd0558dbe2612ec6af3c9b0af746196af7c9",
          },
        ],
        entity_name: "Whitebit",
        token_type: "BTC",
        transaction_type: "Normal Tx",
      },
      {
        payer_address: "3Bn9uxMTY9HpTLaCo9YNBTq96QNhSYRxJk",
        amount: 0.02851,
        date: "2022-07-13 00:35:37",
        transactions: [
          {
            tx_amount: 0.02851,
            date_time: "2022-07-13 00:35:37",
            transaction_id:
              "31e72dac1b2528efd3d6bf6b0108bd0558dbe2612ec6af3c9b0af746196af7c9",
          },
        ],
        entity_name: "Unknown",
        token_type: "BTC",
        transaction_type: "Normal Tx",
      },
    ],
  };
};

// Entity icon URLs
const entityIcons = {
  changenow: "https://cryptologos.cc/logos/changenow-now-logo.png?v=023",
  whitebit: "https://cryptologos.cc/logos/whitebit-logo.png?v=023",
  unknown: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023",
  bitcoin: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023",
  default: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023",
};

// Function to get the icon URL based on entity name
const getEntityIcon = (entityName: string): string => {
  if (!entityName || entityName === "Unknown") return entityIcons.unknown;

  switch (entityName.toLowerCase()) {
    case "changenow":
      return entityIcons.changenow;
    case "whitebit":
      return entityIcons.whitebit;
    default:
      return entityIcons.default;
  }
};

// Function to calculate node position in a specific layout
const calculateNodePosition = (
  type: "inflow" | "outflow",
  index: number,
  total: number,
  centerX: number,
  centerY: number
) => {
  // Adjust vertical spacing based on total nodes
  const verticalSpacing = total <= 2 ? 200 : 400 / (total - 1);
  const horizontalOffset = 300; // Distance from center node

  if (type === "inflow") {
    // Position inflow nodes on the left - more evenly distributed vertically
    const yPos = centerY - 200 + index * verticalSpacing;
    return { x: centerX - horizontalOffset, y: yPos };
  } else {
    // Position outflow nodes on the right - more evenly distributed vertically
    const yPos = centerY - 200 + index * verticalSpacing;
    return { x: centerX + horizontalOffset, y: yPos };
  }
};

// Helper to find connections between new and existing nodes
const findConnectionsWithExistingNodes = (
  address: string,
  inflowData: InflowResponse,
  outflowData: OutflowResponse,
  existingAddresses: string[]
) => {
  const connections: Array<{ source: string; target: string; data: any }> = [];

  // Check inflows for connections with existing nodes
  inflowData.data.forEach((inflow) => {
    if (
      existingAddresses.includes(inflow.beneficiary_address) &&
      inflow.beneficiary_address !== address
    ) {
      connections.push({
        source: inflow.beneficiary_address,
        target: address,
        data: {
          amount: inflow.amount,
          date: inflow.date,
          transactionType: inflow.transaction_type,
          transactionId: inflow.transactions[0]?.transaction_id,
        },
      });
    }
  });

  // Check outflows for connections with existing nodes
  outflowData.data.forEach((outflow) => {
    if (
      existingAddresses.includes(outflow.payer_address) &&
      outflow.payer_address !== address
    ) {
      connections.push({
        source: address,
        target: outflow.payer_address,
        data: {
          amount: outflow.amount,
          date: outflow.date,
          transactionType: outflow.transaction_type,
          transactionId: outflow.transactions[0]?.transaction_id,
        },
      });
    }
  });

  return connections;
};

// Async thunk for fetching wallet data
export const fetchWalletData = createAsyncThunk(
  "graph/fetchWalletData",
  async (address: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { graph: GraphState };
      const existingNodes = state.graph.nodes;
      const existingEdges = state.graph.edges;

      // Create list of all existing addresses for auto-connection
      const existingAddresses = existingNodes.map((node) => node.data.label);

      // Check if address already exists as a node
      if (
        existingNodes.some(
          (node) => node.id === address || node.data.label === address
        )
      ) {
        return {
          nodes: existingNodes,
          edges: existingEdges,
        };
      }

      const [inflowData, outflowData] = await Promise.all([
        fetchInflowData(address),
        fetchOutflowData(address),
      ]);

      const newNodes: Node[] = [...existingNodes];
      const newEdges: Edge[] = [...existingEdges];

      // Truncate the address for display
      const truncatedId = `${address.substring(0, 8)}...${address.substring(
        address.length - 7
      )}`;

      // Add the searched address as a node if it doesn't exist
      if (!newNodes.some((node) => node.data.label === address)) {
        newNodes.push({
          id: truncatedId,
          data: {
            label: address,
            imageUrl: entityIcons.default,
          },
          position: { x: 600, y: 300 },
          draggable: true,
        });
      }

      // Process inflow data (connections coming into the address)
      inflowData.data.forEach((inflow, index) => {
        const sourceAddress = inflow.beneficiary_address;
        const truncatedSourceId = `${sourceAddress.substring(
          0,
          8
        )}...${sourceAddress.substring(sourceAddress.length - 7)}`;

        // Add the source node if it doesn't exist
        if (!newNodes.some((node) => node.data.label === sourceAddress)) {
          const position = calculateNodePosition(
            "inflow",
            index,
            inflowData.data.length,
            600,
            300
          );

          newNodes.push({
            id: truncatedSourceId,
            data: {
              label: sourceAddress,
              entityName: inflow.entity_name,
              tokenType: inflow.token_type,
              amount: inflow.amount,
              imageUrl: getEntityIcon(inflow.entity_name),
            },
            position,
            draggable: true,
          });
        }

        // Add the edge if it doesn't exist
        const edgeId = `e-${truncatedSourceId}-${truncatedId}`;
        if (!newEdges.some((edge) => edge.id === edgeId)) {
          newEdges.push({
            id: edgeId,
            source: truncatedSourceId,
            target: truncatedId,
            type: "custom",
            data: {
              amount: inflow.amount,
              date: inflow.date,
              transactionType: inflow.transaction_type,
              transactionId: inflow.transactions[0]?.transaction_id,
            },
            animated: true,
          });
        }
      });

      // Process outflow data (connections going out from the address)
      outflowData.data.forEach((outflow, index) => {
        const targetAddress = outflow.payer_address;
        const truncatedTargetId = `${targetAddress.substring(
          0,
          8
        )}...${targetAddress.substring(targetAddress.length - 7)}`;

        // Add the target node if it doesn't exist
        if (!newNodes.some((node) => node.data.label === targetAddress)) {
          const position = calculateNodePosition(
            "outflow",
            index,
            outflowData.data.length,
            600,
            300
          );

          newNodes.push({
            id: truncatedTargetId,
            data: {
              label: targetAddress,
              entityName: outflow.entity_name,
              tokenType: outflow.token_type,
              amount: outflow.amount,
              imageUrl: getEntityIcon(outflow.entity_name),
            },
            position,
            draggable: true,
          });
        }

        // Add the edge if it doesn't exist
        const edgeId = `e-${truncatedId}-${truncatedTargetId}`;
        if (!newEdges.some((edge) => edge.id === edgeId)) {
          newEdges.push({
            id: edgeId,
            source: truncatedId,
            target: truncatedTargetId,
            type: "custom",
            data: {
              amount: outflow.amount,
              date: outflow.date,
              transactionType: outflow.transaction_type,
              transactionId: outflow.transactions[0]?.transaction_id,
            },
            animated: true,
          });
        }
      });

      // Find and add connections between the new wallet and existing wallets
      const connections = findConnectionsWithExistingNodes(
        address,
        inflowData,
        outflowData,
        existingAddresses
      );

      // Add any discovered connections between nodes
      connections.forEach((conn) => {
        const sourceId =
          conn.source.substring(0, 8) +
          "..." +
          conn.source.substring(conn.source.length - 7);
        const targetId =
          conn.target.substring(0, 8) +
          "..." +
          conn.target.substring(conn.target.length - 7);
        const edgeId = `e-${sourceId}-${targetId}`;

        if (!newEdges.some((edge) => edge.id === edgeId)) {
          newEdges.push({
            id: edgeId,
            source: sourceId,
            target: targetId,
            type: "custom",
            data: conn.data,
            animated: true,
          });
        }
      });

      return {
        nodes: newNodes,
        edges: newEdges,
      };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Function to add wallet address
export const addWalletAddress = createAsyncThunk(
  "graph/addWalletAddress",
  async (address: string, { getState, dispatch }) => {
    const state = getState() as { graph: GraphState };

    // If this is the first address, set it as the search address
    if (state.graph.nodes.length === 0) {
      dispatch(setSearchAddress(address));
    }

    return dispatch(fetchWalletData(address)).unwrap();
  }
);

const initialState: GraphState = {
  nodes: [],
  edges: [],
  searchAddress: "",
  isDarkMode: prefersDarkMode(), // Initialize based on user preference using our utility
  isLoading: false,
  error: null,
};

const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
    setSearchAddress: (state, action: PayloadAction<string>) => {
      state.searchAddress = action.payload;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    clearGraph: (state) => {
      state.nodes = [];
      state.edges = [];
      state.searchAddress = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWalletData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nodes = action.payload.nodes;
        state.edges = action.payload.edges;
      })
      .addCase(fetchWalletData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setNodes,
  setEdges,
  setSearchAddress,
  toggleDarkMode,
  clearGraph,
} = graphSlice.actions;
export default graphSlice.reducer;
