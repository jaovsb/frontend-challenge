import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { NftDetailsPage } from "@/features/nfts/pages/NftDetailsPage";
import { CartPage } from "@/features/cart/pages/CartPage";
import App from "@/App";
import { CheckoutPage } from "@/features/checkout/pages/CheckoutPage";
import { OrderConfirmationPage } from "@/features/checkout/pages/OrderConfirmationPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { CollectorProfilePage } from "@/features/profile/pages/CollectorProfilePage";
import { WalletsPage } from "@/features/profile/pages/WalletsPage";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});

const nftDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nfts/$nftId",
  component: NftDetailsPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order-confirmation",
  component: OrderConfirmationPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: CollectorProfilePage,
});

const walletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/wallets",
  component: WalletsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  nftDetailsRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmationRoute,
  loginRoute,
  registerRoute,
  profileRoute,
  walletsRoute,
]);

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
