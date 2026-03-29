import { createBrowserRouter } from "react-router-dom";
import Home from "./components/pages/Home.jsx"

export const router = createBrowserRouter([
    {
        path:"/",
        element:<Home/>
    }
]);