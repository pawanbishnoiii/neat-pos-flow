import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import AppLayout from "@/components/layout/AppLayout";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
const Index = lazy(() => import("@/pages/Index"));
const Auth = lazy(() => import("@/pages/Auth"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Workspace = lazy(() => import("@/pages/Workspace"));
const Billing = lazy(() => import("@/pages/Billing"));
const Reports = lazy(() => import("@/pages/Reports"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const HomeRouter = lazy(() => import("@/pages/HomeRouter"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const BillHistory = lazy(() => import("@/pages/BillHistory"));
const CustomerManagement = lazy(() => import("@/pages/CustomerManagement"));
const OffersPage = lazy(() => import("@/pages/OffersPage"));
const StorePage = lazy(() => import("@/pages/StorePage"));
const StoreManager = lazy(() => import("@/pages/StoreManager"));
const ExpenseTracker = lazy(() => import("@/pages/ExpenseTracker"));
const CreditLedger = lazy(() => import("@/pages/CreditLedger"));
const ModulesHub = lazy(() => import("@/pages/ModulesHub"));
const ReviewsPage = lazy(() => import("@/pages/ReviewsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#f8f6f1]"><div className="flex flex-col items-center gap-4"><div className="relative h-14 w-14"><span className="absolute inset-0 animate-ping rounded-2xl bg-[#ff5d3b]/25" /><span className="absolute inset-1 grid place-items-center rounded-2xl bg-[#141b34] font-display text-lg font-black text-white">Z</span></div><p className="text-[10px] font-black uppercase tracking-[.22em] text-[#74798a]">Opening your workspace</p></div></div>}>
            <Routes>
              <Route path="/" element={<HomeRouter />} />
              <Route path="/landing" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/store/:slug" element={<StorePage />} />
              <Route path="/onboarding" element={<ProtectedRoute><AppLayout><Onboarding /></AppLayout></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute requireBusiness><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
              <Route path="/workspace" element={<ProtectedRoute requireBusiness><AppLayout><Workspace /></AppLayout></ProtectedRoute>} />
              <Route path="/billing" element={<ProtectedRoute requireBusiness><AppLayout><Billing /></AppLayout></ProtectedRoute>} />
              <Route path="/modules" element={<ProtectedRoute requireBusiness><AppLayout><ModulesHub /></AppLayout></ProtectedRoute>} />
              <Route path="/reviews" element={<ProtectedRoute requireBusiness><AppLayout><ReviewsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute requireBusiness><AppLayout><Reports /></AppLayout></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute requireBusiness><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute requireBusiness><AppLayout><BillHistory /></AppLayout></ProtectedRoute>} />
              <Route path="/customers" element={<ProtectedRoute requireBusiness><AppLayout><CustomerManagement /></AppLayout></ProtectedRoute>} />
              <Route path="/offers" element={<ProtectedRoute requireBusiness><AppLayout><OffersPage /></AppLayout></ProtectedRoute>} />
              <Route path="/store-manager" element={<ProtectedRoute requireBusiness><AppLayout><StoreManager /></AppLayout></ProtectedRoute>} />
              <Route path="/expenses" element={<ProtectedRoute requireBusiness><AppLayout><ExpenseTracker /></AppLayout></ProtectedRoute>} />
              <Route path="/credit-ledger" element={<ProtectedRoute requireBusiness><AppLayout><CreditLedger /></AppLayout></ProtectedRoute>} />
              {/* Admin routes */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/*" element={<ProtectedRoute adminOnly><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
