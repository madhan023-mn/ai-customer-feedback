import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Feedback from "./pages/Feedback";
import AddFeedback from "./pages/AddFeedback";
import ImportFeedback from "./pages/ImportFeedback";
import FeedbackDetails from "./pages/FeedbackDetails";
import Members from "./pages/Members";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Themes from "./pages/Themes";
import ThemeDetails from "./pages/ThemeDetails";
import Insights from "./pages/Insights";
import AskLoop from "./pages/AskLoop";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";

function AppLayout({ children }) {
    return (
        <div className="app-shell">
            <Navbar />
            <main className="main-viewport">
                {children}
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Workspace Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Dashboard />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Analytics />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/feedback"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Feedback />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/feedback/add"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AddFeedback />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/feedback/new"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AddFeedback />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/feedback/import"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <ImportFeedback />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/feedback/:id"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <FeedbackDetails />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/themes"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Themes />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/themes/:theme"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <ThemeDetails />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/insights"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Insights />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ask"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AskLoop />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/insights/ask"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AskLoop />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Reports />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/members"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Members />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/403"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Forbidden />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <NotFound />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}


export default App;