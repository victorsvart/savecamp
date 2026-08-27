import { Navigate } from "react-router";

export function RootRedirect() {
  return <Navigate to="/home" replace />;
}

export default RootRedirect;
