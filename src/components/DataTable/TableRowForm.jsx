import { Delete } from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import { useState } from "react";

import RectangleIconButton from "../Buttons/RectangleIconButton";
import ClientTypeWrapper from "../ClientTypeWrapper/ClientTypeWrapper";
import { CTableCell, CTableRow } from "../CTable";
import DeleteWrapperModal from "../DeleteWrapperModal";
import CellFormElementGenerator from "../ElementGenerators/CellFormElementGenerator";
import RejectedWrapperModal from "../RejectedWrapperModal";

const TableRowForm = ({
  onCheckboxChange,
  selected,
  onSelectedRowChange,
  checkboxValue,
  watch = () => {},
  row,
  onDeleteClick = () => {},
  formVisible,
  remove,
  control,
  currentPage,
  rowIndex,
  columns,
  tableSettings,
  tableSlug,
  setFormValue,
  pageName,
  calculateWidth,
  limit = 10,
  onRejectedClick
}) => {
  const [showCheckbox, setShowCheckbox] = useState(false);
  return (
    <CTableRow>
      <CTableCell
        onMouseEnter={() => setShowCheckbox(true)}
        onMouseLeave={() => setShowCheckbox(false)}
        style={{ padding: 0, textAlign: "center" }}
      >
        {showCheckbox || !!selected.find((i) => i === row.guid) ? (
          <Checkbox
            onChange={(_, val) => onSelectedRowChange(val, row)}
            checked={!!selected.find((i) => i === row.guid)}
          />
        ) : (
          (currentPage - 1) * limit + rowIndex + 1
        )}
      </CTableCell>
      {onCheckboxChange && !formVisible && (
        <CTableCell>
          <Checkbox
            checked={checkboxValue === row.guid}
            onChange={(_, val) => onCheckboxChange(val, row)}
            onClick={(e) => e.stopPropagation()}
          />
        </CTableCell>
      )}
      {!formVisible && (
        <CTableCell align="center">
          {(currentPage - 1) * limit + rowIndex + 1}
        </CTableCell>
      )}
      {columns.map((column, index) => (
        <CTableCell
          key={column.id}
          className={`overflow-ellipsis editable_col`}
          style={{
            padding: 0,
            position: tableSettings?.[pageName]?.find(
              (item) => item?.id === column?.id
            )?.isStiky
              ? "sticky"
              : "relative",
            left: tableSettings?.[pageName]?.find(
              (item) => item?.id === column?.id
            )?.isStiky
              ? calculateWidth(column?.id, index)
              : "0",
            backgroundColor: "#fff",
            zIndex: tableSettings?.[pageName]?.find(
              (item) => item?.id === column?.id
            )?.isStiky
              ? "1"
              : "",
            minWidth: "auto",
          }}
        >
          <CellFormElementGenerator
            selected={selected}
            tableSlug={tableSlug}
            watch={watch}
            fields={columns}
            field={column}
            row={row}
            index={rowIndex}
            control={control}
            setFormValue={setFormValue}
          />
        </CTableCell>
      ))}
      <CTableCell style={{ verticalAlign: "middle", padding: 0 }}>
        <div className="flex justify-between">
          <div>
            {tableSlug === "sale" && (
              <>
              <ClientTypeWrapper
                status={row?.status?.[0]}
                type={["ALBATTA ADMIN", "ADMIN"]}
              >
                <RejectedWrapperModal
                  id={row.guid}
                  onRejected={() => onRejectedClick(row, rowIndex)}
                >
                  <RectangleIconButton
                    color="warning"
                    className="mr-1"
                    size="small"
                  >
                    <span style={{ color: "#FFC107" }} className="p-1">
                      Отказ
                    </span>
                  </RectangleIconButton>
                </RejectedWrapperModal>
              </ClientTypeWrapper>
              </>
            )}
          </div>

          <div>
          
              <DeleteWrapperModal
                id={row.guid}
                onDelete={() =>
                  row.guid ? onDeleteClick(row, rowIndex) : remove(rowIndex)
                }
              >
                <RectangleIconButton color="error">
                  <Delete color="error" />
                </RectangleIconButton>
              </DeleteWrapperModal>
          
          </div>
        </div>
        {/* <RectangleIconButton
          color="error"
          onClick={() =>
            row.guid ? onDeleteClick(row, rowIndex) : remove(rowIndex)
          }
        >
          <Delete color="error" />
        </RectangleIconButton> */}
      </CTableCell>
    </CTableRow>
  );
};

export default TableRowForm;
