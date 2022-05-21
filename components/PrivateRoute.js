import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ protectedRoutes, children }) {
  const router = useRouter();
  const { currentUser, isLoading, currentRole } = useAuth();

  const pathIsProtected =
    protectedRoutes.map((r) => r.url).indexOf(router.pathname) !== -1;
  const authorizedRoles =
    pathIsProtected &&
    protectedRoutes.find((p) => p.url === router.pathname)?.roles;
  const pathIsRoleProtected = authorizedRoles && authorizedRoles?.length !== 0;
  const authorized = pathIsRoleProtected
    ? currentUser &&
      currentRole &&
      authorizedRoles &&
      authorizedRoles?.some((el) => currentRole?.includes(el))
    : true;
  useEffect(() => {
    if (!isLoading && currentUser && router.pathname === "/login") {
      router.push("/");
    } else if (!isLoading && !currentUser && pathIsProtected) {
      router.push(
        {
          pathname: "/login",
          query: { url: router.pathname },
        },
        "/login"
      );
    }
  }, [isLoading, currentUser, pathIsProtected]);
  if (
    (!isLoading && !currentUser && pathIsProtected) ||
    (!isLoading && currentUser && router.pathname === "/login")
  ) {
    return <div>loading</div>;
  }
  if (!authorized) {
    return <div>Not Authorized</div>;
  }
  return children;
}
