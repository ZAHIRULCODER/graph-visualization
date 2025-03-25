/**
 * Format a date string into a more readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  } catch (error) {
    return dateString; // Return original string if parsing fails
  }
};

/**
 * Truncate a wallet address for display
 * @param address Wallet address string
 * @param startChars Number of characters to show at start (default: 10)
 * @param endChars Number of characters to show at end (default: 6)
 * @returns Truncated address
 */
export const truncateAddress = (
  address: string,
  startChars = 10,
  endChars = 6
): string => {
  if (!address || address.length <= startChars + endChars) {
    return address;
  }
  return `${address.substring(0, startChars)}...${address.substring(
    address.length - endChars
  )}`;
};

/**
 * Format a BTC amount with 8 decimal places
 * @param amount BTC amount as number
 * @returns Formatted BTC amount string
 */
export const formatBtcAmount = (amount: number): string => {
  return amount.toFixed(8);
};

/**
 * Get color for entity
 * @param entityName Entity name
 * @param isDarkMode Whether dark mode is enabled
 * @returns CSS color class
 */
export const getEntityColor = (
  entityName: string | undefined,
  isDarkMode: boolean
): string => {
  if (!entityName || entityName === "Unknown") {
    return isDarkMode ? "bg-green-500" : "bg-green-400";
  }

  switch (entityName.toLowerCase()) {
    case "changenow":
      return isDarkMode ? "bg-orange-500" : "bg-orange-400";
    case "whitebit":
      return isDarkMode ? "bg-purple-400" : "bg-purple-300";
    case "binance":
      return isDarkMode ? "bg-yellow-500" : "bg-yellow-400";
    case "coinbase":
      return isDarkMode ? "bg-blue-500" : "bg-blue-400";
    default:
      return isDarkMode ? "bg-pink-400" : "bg-pink-300";
  }
};

// Convert ReactFlow edge to our Edge type and vice versa
export const convertReactFlowEdgesToCustomEdges = (
  reactFlowEdges: any[]
): any[] => {
  return reactFlowEdges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle || null,
    targetHandle: edge.targetHandle || null,
    data: edge.data,
    type: edge.type,
    label: typeof edge.label === "string" ? edge.label : undefined,
    animated: edge.animated,
  }));
};

// Convert custom Edge type to ReactFlow edge type
export const convertCustomEdgesToReactFlowEdges = (
  customEdges: any[]
): any[] => {
  return customEdges.map((edge) => ({
    ...edge,
    // Ensure label is a string if present
    label: edge.label || undefined,
  }));
};
