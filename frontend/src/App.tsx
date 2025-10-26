import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AppRoutes } from "./routes";

const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ToastContainer
                    position="top-right"
                    autoClose={4000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick={true}
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable={true}
                    pauseOnHover={true}
                    theme="colored"
                    toastClassName="modern-toast"
                    bodyClassName="modern-toast-body"
                    progressClassName="modern-toast-progress"
                />
                <AppRoutes />
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
