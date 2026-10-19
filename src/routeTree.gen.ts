import { Route as rootRoute } from "./routes/__root";
import { Route as IndexRoute } from "./routes/index";
import { Route as AuthRoute } from "./routes/auth";
import { Route as SportsbookRoute } from "./routes/sportsbook";
import { Route as ContaRoute } from "./routes/conta";
import { Route as AdminRoute } from "./routes/admin";

const IndexRouteWithChildren = IndexRoute.update({
  path: "/",
  getParentRoute: () => rootRoute,
} as any);
const AuthRouteWithChildren = AuthRoute.update({
  path: "/auth",
  getParentRoute: () => rootRoute,
} as any);
const SportsbookRouteWithChildren = SportsbookRoute.update({
  path: "/sportsbook",
  getParentRoute: () => rootRoute,
} as any);
const ContaRouteWithChildren = ContaRoute.update({
  path: "/conta",
  getParentRoute: () => rootRoute,
} as any);
const AdminRouteWithChildren = AdminRoute.update({
  path: "/admin",
  getParentRoute: () => rootRoute,
} as any);

export const routeTree = rootRoute.addChildren([
  IndexRouteWithChildren,
  AuthRouteWithChildren,
  SportsbookRouteWithChildren,
  ContaRouteWithChildren,
  AdminRouteWithChildren,
]);
