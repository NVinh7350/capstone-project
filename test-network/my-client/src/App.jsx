import { Route, Routes } from "react-router-dom";
import "./App.css";
import { privateRoute, publicRoute } from "./routes";
import LoginPage from "./pages/LoginPage/LoginPage";
import { PrivateRoute } from "./routes/PrivateRoute";
import { Fragment } from "react";

function App() {
    const role = "ADMIN";
    const accessToken = "";
    return (
        <>
            <Routes>
                {publicRoute.map((route, index) => {
                    const Page = route.componet;
                    let Layout;
                    if (route.layout === null) {
                        Layout = Fragment;
                    } else {
                        Layout = route.layout;
                    }
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        ></Route>
                    );
                })}
                {privateRoute.map((route, index) => {
                    const Page = route.componet;
                    let Layout;
                    if (route.layout === null) {
                        Layout = Fragment;
                    } else {
                        Layout = route.layout;
                    }
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <PrivateRoute role={route.role}>
                                    <Layout element={<Page />}></Layout>
                                </PrivateRoute>
                            }
                        ></Route>
                    );
                })}
            </Routes>
        </>
    );
}

export default App;
