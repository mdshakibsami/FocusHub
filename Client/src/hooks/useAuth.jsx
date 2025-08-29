import { use } from "react";
import { AuthContext } from "../contexts/auth/AuthContext";

const useAuth = () => {
  const userInfo = use(AuthContext);
  return userInfo;
};
export default useAuth
