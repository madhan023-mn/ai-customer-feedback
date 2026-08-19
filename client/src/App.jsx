import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Code-split pages for instant initial loading & optimal performance
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Feedback = lazy(() => import("./pages/Feedback"));
const AddFeedback = lazy(() => import("./pages/AddFeedback"));
const ImportFeedback = lazy(() => import("./pages/ImportFeedback"));
const FeedbackDetails = lazy(() => import("./pages/FeedbackDetails"));
const Members = lazy(() => import("./pages/Members"));
const Themes = lazy(() => import("./pages/Themes"));
const ThemeDetails = lazy(() => import("./pages/ThemeDetails"));
const Insights = lazy(() => import("./pages/Insights"));
const AskLoop = lazy(() => import("./pages/AskLoop"));
const Reports = lazy(() => import("./pages/Reports"));
const Analytics = lazy(() => import("./pages/Analytics"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Forbidden = lazy(() => import("./pages/Forbidden"));

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LoadingScreen from "./components/LoadingScreen";

function PageLoader() {
    return (
        <LoadingScreen
            title="Initializing Project LOOP..."
            subtitle="Preparing workspace telemetry, neural models & analytics engines"
            minHeight="70vh"
        />
    );
}

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
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* Front Page / Landing */}
                    <Route path="/" element={<Landing />} />

                    {/* Public Authentication Pages */}
                    <Route path="/login" element={<Login />} />
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
            </Suspense>
        </BrowserRouter>
    );
}

export default App;