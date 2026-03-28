import { BrowserRouter, createBrowserRouter } from "react-router-dom";
import Welcome from "./components/pages/Welcome.jsx";
import Home from "./components/pages/Home.jsx"

export const router = createBrowserRouter([
    {
        path:"/",
        element:<Welcome/>
    },
    {
        path:"/home",
        element:<Home/>
    }
]);