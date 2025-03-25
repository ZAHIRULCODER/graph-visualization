// Node represents a wallet address in the graph
export interface Node {
  id: string;
  data: {
    label: string;
    entityName?: string;
    tokenType?: string;
    amount?: number;
    imageUrl?: string; // Added for custom node images
  };
  position: { x: number; y: number };
  type?: string;
  draggable?: boolean; // Allow nodes to be draggable
}

// Edge represents a transaction between wallet addresses
export interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  data?: {
    amount: number;
    date: string;
    transactionType: string;
    transactionId?: string;
  };
  type?: string;
  label?: string;
  animated?: boolean;
}

// Transaction data
export interface Transaction {
  tx_amount: number;
  date_time: string;
  transaction_id: string;
}

// Common interface for inflow and outflow data
interface TransactionData {
  amount: number;
  date: string;
  transactions: Transaction[];
  entity_name: string;
  token_type: string;
  transaction_type: string;
}

// Inflow data structure
export interface InflowData extends TransactionData {
  beneficiary_address: string;
}

// Outflow data structure
export interface OutflowData extends TransactionData {
  payer_address: string;
}

export interface InflowResponse {
  message: string;
  data: InflowData[];
}

export interface OutflowResponse {
  message: string;
  data: OutflowData[];
}

// Graph state for Redux
export interface GraphState {
  nodes: Node[];
  edges: Edge[];
  searchAddress: string;
  isDarkMode: boolean;
  isLoading: boolean;
  error: string | null;
}
