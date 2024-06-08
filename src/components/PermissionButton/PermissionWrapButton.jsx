import { useSelector } from "react-redux";

export const PermissionWrapButton = ({ tableSlug, children, status,id }) => {
  const clientType = useSelector((state) => state.auth.clientType.name);
  if (clientType === "CASHIER") {
    if (tableSlug === "inventory") {
      if (!id) {
        return children
      } else return null
    } else {
      return children
    } 
  } else return children;
};
