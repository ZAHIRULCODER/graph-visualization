// Transaction interface
export interface Transaction {
  id: string;
  address: string;
  entityName: string;
  amount: number;
  date: string;
  transactionType: string;
}

// Mock inflow data
export const mockInflows: Transaction[] = [
  {
    id: "inflow-1",
    address: "bc1qq7ldp3mza8q7q9e9gmzg72rzafyegckg57wluu",
    entityName: "Unknown",
    amount: 0.01000191,
    date: "2022-07-17 14:10:09",
    transactionType: "Normal Tx",
  },
  {
    id: "inflow-2",
    address: "bc1qng0keqn7cq6p8qdt4rjnzdxrygnzq7nd0pju8q",
    entityName: "Changenow",
    amount: 2.4163156,
    date: "2022-07-17 14:10:09",
    transactionType: "Normal Tx",
  },
];

// Mock outflow data
export const mockOutflows: Transaction[] = [
  {
    id: "outflow-1",
    address: "bc1qf786lw92dy09cx3tt9qhn4tf69dw9ak7m3ktkk",
    entityName: "Whitebit",
    amount: 1.47741817,
    date: "2022-07-13 00:35:37",
    transactionType: "Normal Tx",
  },
  {
    id: "outflow-2",
    address: "3Bn9uxMTY9HpTLaCo9YNBTq96QNhSYRxJk",
    entityName: "Unknown",
    amount: 0.02851,
    date: "2022-07-13 00:35:37",
    transactionType: "Normal Tx",
  },
];
