import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";

interface CustomNodeData {
  label: string;
  entityName?: string;
  tokenType?: string;
  amount?: number;
  imageUrl?: string; // Custom image URL for the node
}

const CustomNode = ({ data, isConnectable }: NodeProps<CustomNodeData>) => {
  const { label, entityName, imageUrl } = data;

  // Determine node color based on entity name
  const getNodeColor = () => {
    if (!entityName || entityName === "Unknown") return "bg-green-400";

    switch (entityName.toLowerCase()) {
      case "changenow":
        return "bg-orange-400";
      case "whitebit":
        return "bg-purple-300";
      case "binance":
        return "bg-yellow-400";
      case "coinbase":
        return "bg-blue-400";
      default:
        return "bg-pink-300";
    }
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.substring(0, 8)}...${address.substring(
      address.length - 7
    )}`;
  };

  return (
    <div
      className={`px-4 py-2 rounded-full shadow-lg flex items-center justify-between min-w-[180px] ${getNodeColor()}`}
    >
      {/* Inflow handle (left side) with improved visual distinction */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-4 h-4 -ml-2 bg-blue-400 border border-blue-600 rounded-full"
        style={{ zIndex: 1 }}
      />

      <div className="flex-1 items-center flex justify-between">
        {/* Left side - display image if available */}
        {imageUrl && (
          <div className="mr-2 flex-shrink-0">
            <img
              src={imageUrl}
              alt={entityName || "wallet"}
              className="h-8 w-8 object-contain rounded-full"
            />
          </div>
        )}

        {/* Center - display entity name or wallet address */}
        <div className="flex-1 text-center">
          {entityName && entityName !== "Unknown" ? (
            <div className="text-sm font-bold">{entityName}</div>
          ) : (
            <div className="text-sm font-medium text-white">
              {truncateAddress(label)}
            </div>
          )}
        </div>

        {/* Three-dot menu */}
        <div className="cursor-pointer text-lg px-1 font-bold">⋮</div>
      </div>

      {/* Outflow handle (right side) with improved visual distinction */}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-4 h-4 -mr-2 bg-red-400 border border-red-600 rounded-full"
        style={{ zIndex: 1 }}
      />
    </div>
  );
};

export default memo(CustomNode);
