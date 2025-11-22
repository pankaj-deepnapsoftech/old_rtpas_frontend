// @ts-nocheck
import React, { useMemo } from "react";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Select,
} from "@chakra-ui/react";
import {
  usePagination,
  useSortBy,
  useTable,
  Column,
  TableInstance,
  HeaderGroup,
  Cell,
} from "react-table";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import moment from "moment";
import Loading from "../../ui/Loading";
import EmptyData from "../../ui/emptyData";
import { colors } from "../../theme/colors";

interface ScrapTableProps {
  scraps: Array<{
    _id: string;
    Scrap_name: string;
    Scrap_id: string;
    price: number;
    Extract_from: string;
    Category: string;
    qty: number;
    description: string;
    createdAt: string;
    updatedAt: string;
  }>;
  isLoadingScraps: boolean;
  openScrapDetailsDrawerHandler?: (id: string) => void;
}

const ScrapTable: React.FC<ScrapTableProps> = ({
  scraps,
  isLoadingScraps,
  openScrapDetailsDrawerHandler,
}) => {
  const columns: Column<any>[] = useMemo(
    () => [
      { Header: "Scrap ID", accessor: "Scrap_id" },
      { Header: "Name", accessor: "Scrap_name" },
      { Header: "Category", accessor: "Category" },
      { Header: "Extract From", accessor: "Extract_from" },
      { Header: "Quantity", accessor: "qty" },
      { Header: "Price", accessor: "price" },
      { Header: "Description", accessor: "description" },
      { Header: "Created On", accessor: "createdAt" },
      { Header: "Last Updated", accessor: "updatedAt" },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state: { pageIndex },
    setPageSize,
    pageCount,
  }: TableInstance<any> = useTable(
    {
      columns,
      data: scraps,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  const dynamicBg = (index: number) =>
    index % 2 !== 0 ? "#ffffff40" : "#ffffff1f";

  if (isLoadingScraps) {
    return <Loading />;
  }

  if (!isLoadingScraps && scraps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div
          className="rounded-full p-6 mb-4"
          style={{ backgroundColor: colors.gray[100] }}
        >
          <svg
            className="w-12 h-12"
            style={{ color: colors.gray[400] }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: colors.gray[800] }}
        >
          No scrap records found
        </h3>
        <p className="max-w-md" style={{ color: colors.gray[600] }}>
          No scrap production data available at the moment. Scrap records will
          appear here once production processes generate waste materials.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with count and page size selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: colors.gray[800] }}
            >
              {scraps.length} Scrap Record{scraps.length !== 1 ? "s" : ""} Found
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="text-sm font-medium"
            style={{ color: colors.gray[600] }}
          >
            Show:
          </span>
          <select
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-3 py-2 text-sm rounded-lg border transition-colors"
            style={{
              backgroundColor: colors.gray[50],
              borderColor: colors.gray[300],
              color: colors.gray[800],
            }}
          >
            {[10, 20, 50, 100, 100000].map((size) => (
              <option key={size} value={size}>
                {size === 100000 ? "All" : size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Enhanced Table */}
      <div
        className="rounded-xl shadow-sm overflow-hidden"
        style={{
          backgroundColor: colors.gray[50],
          border: `1px solid ${colors.gray[200]}`,
        }}
      >
        <div className="overflow-x-auto max-height-600 overflow-y-auto">
          <Table variant="simple" {...getTableProps()}>
            <Thead
              style={{ backgroundColor: colors.gray[100] }}
              position="sticky"
              top="0"
              zIndex="1"
            >
              {headerGroups.map((hg: HeaderGroup<any>) => (
                <Tr {...hg.getHeaderGroupProps()}>
                  {hg.headers.map((column: any) => (
                    <Th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                      style={{
                        color: colors.gray[800],
                        borderBottom: `1px solid ${colors.gray[200]}`,
                      }}
                      cursor="pointer"
                      _hover={{ bg: colors.gray[200] }}
                    >
                      <div className="flex items-center gap-2">
                        {column.render("Header")}
                        {column.isSorted &&
                          (column.isSortedDesc ? (
                            <FaCaretDown className="text-xs" />
                          ) : (
                            <FaCaretUp className="text-xs" />
                          ))}
                      </div>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>

            <Tbody {...getTableBodyProps()}>
              {page.map((row: any, index: number) => {
                prepareRow(row);
                return (
                  <Tr
                    {...row.getRowProps()}
                    className="transition-colors hover:shadow-sm"
                    style={{
                      backgroundColor:
                        index % 2 === 0
                          ? colors.gray[50]
                          : colors.gray[25] || colors.gray[50],
                      borderBottom: `1px solid ${colors.gray[200]}`,
                    }}
                    _hover={{
                      bg: colors.gray[100],
                      cursor: openScrapDetailsDrawerHandler
                        ? "pointer"
                        : "default",
                    }}
                    onClick={() =>
                      openScrapDetailsDrawerHandler?.(row.original._id)
                    }
                  >
                    {row.cells.map((cell: Cell) => {
                      const colId = cell.column.id;
                      const original = row.original;

                      let displayValue;
                      if (colId === "Scrap_id") {
                        displayValue = original.Scrap_id || "N/A";
                      } else if (colId === "Scrap_name") {
                        displayValue = original.Scrap_name || "N/A";
                      } else if (colId === "Category") {
                        displayValue = original.Category || "N/A";
                      } else if (colId === "Extract_from") {
                        displayValue = original.Extract_from || "N/A";
                      } else if (colId === "qty") {
                        displayValue = original.qty || "0";
                      } else if (colId === "price") {
                        displayValue = original.price
                          ? `₹${original.price}`
                          : "₹0";
                      } else if (colId === "description") {
                        displayValue = original.description || "N/A";
                      } else if (colId === "createdAt") {
                        displayValue = original.createdAt
                          ? moment(original.createdAt).format("DD/MM/YYYY")
                          : "N/A";
                      } else if (colId === "updatedAt") {
                        displayValue = original.updatedAt
                          ? moment(original.updatedAt).format("DD/MM/YYYY")
                          : "N/A";
                      } else {
                        displayValue = cell.render("Cell");
                      }

                      return (
                        <Td
                          {...cell.getCellProps()}
                          className="px-4 py-3 text-sm whitespace-nowrap"
                          style={{
                            color: colors.gray[600],
                            borderBottom: `1px solid ${colors.gray[200]}`,
                          }}
                          title={
                            typeof displayValue === "string" ? displayValue : ""
                          }
                        >
                          {displayValue}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </div>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={previousPage}
          disabled={!canPreviousPage}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            canPreviousPage
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Previous
        </button>

        <span className="text-sm" style={{ color: colors.gray[600] }}>
          Page {pageIndex + 1} of {pageCount}
        </span>

        <button
          onClick={nextPage}
          disabled={!canNextPage}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            canNextPage
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ScrapTable;
