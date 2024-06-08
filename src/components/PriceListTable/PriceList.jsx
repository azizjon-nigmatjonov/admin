import { useEffect, useState, useMemo } from "react";
import { getPriceList } from "@/services/priceListService";
import StaticTable from "../StaticTable";

const AgentRealizationTable = () => {
  const [loader, setLoader] = useState(false);
  const [tableData, setTableData] = useState([])

  const headData = [
    {
        title: '№',
        key: 'ind',
        width: 10,
        rowspan: 2
    },
    {
        title: 'Товар',
        key: 'product',
        width: 200,
        render: (value) => <>{value.name}</>
    },
    {
        title: 'Количество',
        key: 'count'
    },
    {
        title: 'Сумма прихода',
        key: 'buy_price'
    },
    {
        title: 'Мерчант',
        key: 'merchant',
        render: (value) => <>{value.name}</>
    },
    {
        title: '3 месяцев',
        key: 'merchant_prices',
        render: (value) => <>{value.for_3_month}</>
    },
    {
        title: "6 месяцев",
        key: 'merchant_prices',
        render: (value) => <>{value.for_6_month}</>
    },
    {
        title: "9 месяцев",
        key: 'merchant_prices',
        render: (value) => <>{value.for_9_month}</>
    },
    {
        title: "12 месяцев",
        key: 'merchant_prices',
        render: (value) => <>{value.for_12_month}</>
    },
    {
        title: "15 месяцев",
        key: 'merchant_prices',
        render: (value) => <>{value.for_15_month}</>
    },
    {
        title: "18 месяцев",
        key: 'merchant_prices',
        render: (value) => <>{value.for_18_month}</>
    }
  ]

  const getTableData = () => {
    setLoader(true);
    getPriceList().then((res) => {
        setTableData(res?.price_list_data)
    })
  }

  const dataSource = useMemo(
    () =>
      tableData.map((item, index) => {
        item.ind = index + 1
        return item
      }),
    [tableData]
  )

  useEffect(() => {
    getTableData()
  }, [])

  return (
    <>
        <StaticTable 
            headColumns={headData}
            bodyColumns={dataSource}
            loader={loader}
         />
    </>
  )
};

export default AgentRealizationTable;
