import { Node, Edge } from "../types";

// Entity icon URLs
const entityIcons = {
  changenow: "https://cryptologos.cc/logos/changenow-now-logo.png?v=023",
  whitebit: "https://cryptologos.cc/logos/whitebit-logo.png?v=023",
  unknown: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023",
  bitcoin: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023",
  main: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023",
};

// Define the initial nodes
export const initialNodes: Node[] = [
  // Central node (main wallet address)
  {
    id: "bc1q6nxd...s7uuwn",
    type: "custom",
    data: {
      label: "bc1q6nxdnz58kexp48sm2t3scwqcw9stt7r8s7uuwn",
      imageUrl: entityIcons.main,
    },
    position: { x: 600, y: 300 },
    draggable: true,
  },
  // Inflow nodes (left side)
  {
    id: "bc1qq7l...g57wluu",
    type: "custom",
    data: {
      label: "bc1qq7ldp3mza8q7q9e9gmzg72rzafyegckg57wluu",
      entityName: "Unknown",
      imageUrl: entityIcons.unknown,
    },
    position: { x: 300, y: 150 },
    draggable: true,
  },
  {
    id: "bc1qng0...0pju8q",
    type: "custom",
    data: {
      label: "bc1qng0keqn7cq6p8qdt4rjnzdxrygnzq7nd0pju8q",
      entityName: "Changenow",
      imageUrl: entityIcons.changenow,
    },
    position: { x: 300, y: 450 },
    draggable: true,
  },
  // Outflow nodes (right side)
  {
    id: "bc1qf78...m3ktkk",
    type: "custom",
    data: {
      label: "bc1qf786lw92dy09cx3tt9qhn4tf69dw9ak7m3ktkk",
      entityName: "Whitebit",
      imageUrl: entityIcons.whitebit,
    },
    position: { x: 900, y: 150 },
    draggable: true,
  },
  {
    id: "3Bn9ux...YRxJk",
    type: "custom",
    data: {
      label: "3Bn9uxMTY9HpTLaCo9YNBTq96QNhSYRxJk",
      entityName: "Unknown",
      imageUrl: entityIcons.unknown,
    },
    position: { x: 900, y: 450 },
    draggable: true,
  },
];

// Define the initial edges
export const initialEdges: Edge[] = [
  // Inflow edges (pointing to the central node)
  {
    id: "e-inflow-1",
    source: "bc1qq7l...g57wluu", // Source is on the left side
    target: "bc1q6nxd...s7uuwn", // Target is the central node
    type: "custom",
    data: {
      amount: 0.01000191,
      date: "2022-07-17 14:10:09",
      transactionType: "Normal Tx",
    },
    animated: true,
  },
  {
    id: "e-inflow-2",
    source: "bc1qng0...0pju8q", // Source is on the left side
    target: "bc1q6nxd...s7uuwn", // Target is the central node
    type: "custom",
    data: {
      amount: 2.4163156,
      date: "2022-07-17 14:10:09",
      transactionType: "Normal Tx",
    },
    animated: true,
  },
  // Outflow edges (from the central node to others)
  {
    id: "e-outflow-1",
    source: "bc1q6nxd...s7uuwn", // Source is the central node
    target: "bc1qf78...m3ktkk", // Target is on the right side
    type: "custom",
    data: {
      amount: 1.47741817,
      date: "2022-07-13 00:35:37",
      transactionType: "Normal Tx",
    },
    animated: true,
  },
  {
    id: "e-outflow-2",
    source: "bc1q6nxd...s7uuwn", // Source is the central node
    target: "3Bn9ux...YRxJk", // Target is on the right side
    type: "custom",
    data: {
      amount: 0.02851,
      date: "2022-07-13 00:35:37",
      transactionType: "Normal Tx",
    },
    animated: true,
  },
];
