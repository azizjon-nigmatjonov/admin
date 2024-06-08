import {
    CTable,
    CTableBody,
    CTableCell,
    CTableHead,
    CTableHeadCell,
    CTableRow,
  } from "../CTable";

const StaticTable = ({
    headColumns,
    bodyColumns,
    loader
}) => {

  return (
    <>
        <CTable columnsCount={bodyColumns?.length} loader={loader}>
            <CTableHead>
                <CTableRow>
                    {headColumns?.map((item, colIndex) => (
                        <CTableHeadCell rowspan={item.rowspan ? item.rowspan : 2} width={item.width ? item.width : 10} key={colIndex}>
                            {item.title}
                        </CTableHeadCell>
                    ))}
                </CTableRow>
            </CTableHead>
            <CTableBody dataLength={bodyColumns.length}>
                {bodyColumns?.length ? bodyColumns?.map((item, rowIndex) => (
                    <CTableRow key={rowIndex}>
                        {headColumns.map((element, colIndex) => (
                            <CTableCell key={colIndex}>
                                {element.render ? (
                                    Array.isArray(element.key) ? (
                                        element.render(element.key.map((data) => item[data]))
                                    ) : (
                                        element.render(item[element.key])
                                    )
                                    ) : (
                                    item[element.key]
                                )}
                            </CTableCell>
                        ))}
                     </CTableRow>
                )) : ''}
            </CTableBody>
        </CTable>
    </>
  )
};

export default StaticTable;
