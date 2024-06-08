import { useSelector } from "react-redux";

const ClientTypeWrapper = ({ children, type, status }) => {
  const clientType = useSelector((state) => state.auth?.clientType?.name);
  if (status === "done") {
    if (typeof type === "object") {
      if (clientType === type[0] || clientType === type[1]) return children;
      else return null;
    } else {
      if (clientType?.[type]) return children;
      return null;
    }
  } else {
    return null;
  }
};

export default ClientTypeWrapper;
