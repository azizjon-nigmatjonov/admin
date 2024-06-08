import { Report, Assessment } from "@mui/icons-material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation} from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import RouterTabsBlock from "./RouterTabsBlock";
import styles from "./style.module.scss";

const elements = [];

const PriceListLayout = () => {
  const {pathname}=useLocation()
  const {t}=useTranslation()
  return (
    <div className={styles.layout}>
      <Sidebar elements={elements}  />
      <div className={styles.content}>
        <RouterTabsBlock />
        <h2 className={`${styles.header_title} header_title`}>{t(pathname.split("/")?.[2])}</h2>
        <Outlet />
      </div>
    </div>
  );
};

export default PriceListLayout;
