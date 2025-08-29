import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import NotFound from "../components/not-found/NotFound";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  // {
  //   path: "/dashboard",
  //   element: (
  //     <PrivateRouter>
  //       <Dashboard></Dashboard>
  //     </PrivateRouter>
  //   ),
  //   children: [
  //     {
  //       index: true,
  //       Component: MyProfile,
  //     },
  //     {
  //       path: "/dashboard/comments/:id",
  //       Component: Comments,
  //     },
  //     {
  //       path: "/dashboard/add-post",
  //       Component: AddPost,
  //     },
  //     {
  //       path: "/dashboard/my-posts",
  //       Component: MyPosts,
  //     },
  //     {
  //       path: "/dashboard/admin-profile",
  //       element: (
  //         <AdminRoute>
  //           <AdminProfile></AdminProfile>
  //         </AdminRoute>
  //       ),
  //     },
  //     {
  //       path: "/dashboard/manage-users",
  //       element: (
  //         <AdminRoute>
  //           <ManageUser></ManageUser>
  //         </AdminRoute>
  //       ),
  //     },
  //     {
  //       path: "/dashboard/reported-comments",
  //       element: (
  //         <AdminRoute>
  //           <ReportedComments></ReportedComments>
  //         </AdminRoute>
  //       ),
  //     },
  //     {
  //       path: "/dashboard/announcements",
  //       element: (
  //         <AdminRoute>
  //           <MakeAnnouncements></MakeAnnouncements>
  //         </AdminRoute>
  //       ),
  //     },
  //   ],
  // },
  {
    path: "*",
    Component: NotFound,
  },
]);
