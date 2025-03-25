import { useState } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { toggleDarkMode, addWalletAddress } from "../store/graphSlice";
import { mockInflows, mockOutflows } from "../constants/transactionData";
import {
  formatDate,
  truncateAddress,
  formatBtcAmount,
} from "../utils/formatters";
import { applyDarkMode } from "../utils/theme";

const Sidebar = () => {
  const [newAddress, setNewAddress] = useState("");
  const [activeTab, setActiveTab] = useState<"inflows" | "outflows">("inflows");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.graph.isDarkMode);
  const globalLoading = useAppSelector((state) => state.graph.isLoading);

  const handleAddAddress = async () => {
    if (newAddress.trim()) {
      try {
        setIsLoading(true);
        await dispatch(addWalletAddress(newAddress)).unwrap();
        setNewAddress("");
      } catch (error) {
        console.error("Error adding wallet address:", error);
        alert(
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleToggleDarkMode = () => {
    // Dispatch toggle action to Redux
    dispatch(toggleDarkMode());

    // Apply or remove dark mode class to the document
    // This is a quick local UI update before the Redux state propagates
    applyDarkMode(!isDarkMode);
  };

  const isDisabled = isLoading || globalLoading;

  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 h-full overflow-y-auto border-r border-gray-300 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-300 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold text-gray-800 dark:text-white">
            Wallet Tracer
          </h1>
          <button
            onClick={handleToggleDarkMode}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>

        <div className="mt-4">
          <label
            htmlFor="wallet-address"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Add Wallet Address:
          </label>
          <div className="mt-1 flex">
            <textarea
              id="wallet-address"
              className={`flex-1 focus:ring-yellow-500 focus:border-yellow-500 block w-full text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 ${
                isDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              placeholder="Enter wallet address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !isDisabled && handleAddAddress()
              }
              disabled={isDisabled}
            />
            <button
              type="button"
              className={`ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                isDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleAddAddress}
              disabled={!newAddress.trim() || isDisabled}
            >
              {isLoading || globalLoading ? (
                <span className="inline-flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  LOADING
                </span>
              ) : (
                "ADD"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-300 dark:border-gray-700">
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === "inflows"
              ? "text-yellow-600 dark:text-yellow-500 border-b-2 border-yellow-500 dark:bg-gray-800"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 dark:bg-gray-750"
          }`}
          onClick={() => setActiveTab("inflows")}
        >
          INFLOWS
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === "outflows"
              ? "text-yellow-600 dark:text-yellow-500 border-b-2 border-yellow-500 dark:bg-gray-800"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 dark:bg-gray-750"
          }`}
          onClick={() => setActiveTab("outflows")}
        >
          OUTFLOWS
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800">
        {activeTab === "inflows" ? (
          <div>
            {mockInflows.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                No inflow data available
              </p>
            ) : (
              <ul className="space-y-3">
                {mockInflows.map((flow) => (
                  <li
                    key={flow.id}
                    className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm"
                  >
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      FROM:
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate mb-2">
                      {truncateAddress(flow.address)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Entity:{" "}
                      <span className="text-gray-700 dark:text-gray-200">
                        {flow.entityName}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-1">
                      Amount:{" "}
                      <span className="text-yellow-600 dark:text-yellow-400">
                        {formatBtcAmount(flow.amount)} BTC
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Date:{" "}
                      <span className="text-gray-700 dark:text-gray-300">
                        {formatDate(flow.date)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div>
            {mockOutflows.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                No outflow data available
              </p>
            ) : (
              <ul className="space-y-3">
                {mockOutflows.map((flow) => (
                  <li
                    key={flow.id}
                    className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm"
                  >
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      TO:
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate mb-2">
                      {truncateAddress(flow.address)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Entity:{" "}
                      <span className="text-gray-700 dark:text-gray-200">
                        {flow.entityName}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-1">
                      Amount:{" "}
                      <span className="text-yellow-600 dark:text-yellow-400">
                        {formatBtcAmount(flow.amount)} BTC
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Date:{" "}
                      <span className="text-gray-700 dark:text-gray-300">
                        {formatDate(flow.date)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-900">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <div className="font-medium">Connected Wallets: 5</div>
          <div>Transactions: 4</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
