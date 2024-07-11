import { createRoot } from "react-dom/client";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import QueryProvider from "./lib/react-query/QueryProvider";

createRoot(document.getElementById("root")!).render(
    <QueryProvider>
        <AuthProvider>
            <App />
        </AuthProvider>
    </QueryProvider>
);

