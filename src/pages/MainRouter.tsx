import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./Login";
import Main from "./Main";
import Error404 from "./Error404";

export const RouterPrincipal = () => {
    return (
        <BrowserRouter>
        <div className='flex justify-center'>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/main" element={<Main/>} />
                <Route path="*" element={<Error404/> } />
            </Routes>
        </div>
        </BrowserRouter>
    );
};

export default RouterPrincipal
