import { Report, Assessment,ShoppingBasket } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation} from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import RouterTabsBlock from "./RouterTabsBlock";
import styles from "./style.module.scss";

const elements = [
  {
    id: "branch_realization",
    title: "Реализация филиала",
    path: "/reports/branch_realization",
    icon: Report,
  },
  {
    id: "agent_realization",
    title: "Реализация агента",
    path: "/reports/agent_realization",
    icon: Assessment,
  },
  {
    id: "sold_products",
    title: "Проданные товары",
    path: "/reports/sold_products",
    icon: ShoppingBasket,
  },
];

const ReportsLayout = () => {
  const {pathname}=useLocation()
  const {t}=useTranslation()
  return (
    <div className={styles.layout}>
      <Sidebar elements={elements}  />
      <div className={styles.content}>
        <RouterTabsBlock />
        <h2 className="header_title">{t(pathname.split("/")?.[2])}</h2>
        <Outlet />
      </div>
    </div>
  );
};

export default ReportsLayout;
