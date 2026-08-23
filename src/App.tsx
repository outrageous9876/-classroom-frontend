import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { BookOpen, Building2, Home, Layers, LogIn, Users as UsersIcon } from "lucide-react";
import SubjectsList from "./pages/subjects/list";
import { Layout } from "./components/refine-ui/layout/layout";
import SubjectsCreate from "./pages/subjects/create";
import SubjectsShow from "./pages/subjects/show";
import Dashboard from "./pages/dashboard";
import ClassesEdit from "./pages/classes/edit";
import { dataProvider } from "./providers/data";
import { authProvider } from "./providers/auth";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import ClassesJoin from "./pages/classes/join";

import ClassesList from "./pages/classes/list";
import ClassesCreate from "./pages/classes/create";
import ClassesShow from "./pages/classes/show";

import DepartmentsList from "./pages/departments/list";
import DepartmentsCreate from "./pages/departments/create";
import DepartmentsShow from "./pages/departments/show";

import UsersList from "./pages/users/list";
import UsersShow from "./pages/users/show";

// TODO: enrollments pages haven't been built yet. Re-add their imports,
// resources, and routes below once they exist (see src/pages/subjects/*
// for the pattern to follow).

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "kkWuv7-GgBIfw-P8CGy0",
              }}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: {
                    label: "Home",
                    icon: <Home />,
                  },
                },
                {
                  name: "subjects",
                  list: "/subjects",
                  create: "/subjects/create",
                  show: "/subjects/show/:id",
                  meta: {
                    label: "Subjects",
                    icon: <BookOpen />,
                  },
                },
               {
                name: "classes",
                list: "/classes",
                create: "/classes/create",
                edit: "/classes/edit/:id",
                show: "/classes/show/:id",
                meta: {
                  label: "Classes",
                  icon: <Layers />,
                },
              },
              {
              name: "join-class",
              list: "/classes/join",
              meta: {
                label: "Join a Class",
                icon: <LogIn />,
              },
            },
              {
                name: "departments",
                list: "/departments",
                create: "/departments/create",
                show: "/departments/show/:id",
                meta: {
                  label: "Departments",
                  icon: <Building2 />,
                },
              },
              {
                name: "users",
                list: "/users",
                show: "/users/show/:id",
                meta: {
                  label: "Faculty",
                  icon: <UsersIcon />,
                },
              },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated key="public-routes" fallback={<Outlet />}>
                      <NavigateToResource fallbackTo="/" />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>

                <Route
                  element={
                    <Authenticated key="private-routes" fallback={<Login />}>
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route path="/" element={<Dashboard />} />

                  <Route path="subjects">
                    <Route index element={<SubjectsList />} />
                    <Route path="create" element={<SubjectsCreate />} />
                    <Route path="show/:id" element={<SubjectsShow />} />
                  </Route>
               <Route path="classes">
                <Route index element={<ClassesList />} />
                <Route path="create" element={<ClassesCreate />} />
                <Route path="edit/:id" element={<ClassesEdit />} />
                <Route path="show/:id" element={<ClassesShow />} />
                <Route path="join" element={<ClassesJoin />} />
              </Route>

                  <Route path="departments">
                    <Route index element={<DepartmentsList />} />
                    <Route path="create" element={<DepartmentsCreate />} />
                    <Route path="show/:id" element={<DepartmentsShow />} />
                  </Route>

                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path="show/:id" element={<UsersShow />} />
                  </Route>
                </Route>
              </Routes>

              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;