import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./lib/auth";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Calculations from "./pages/calculations";
import History from "./pages/history";
import Projects from "./pages/projects";
import NotFound from "./pages/not-found";
import Navigation from "./components/navigation";
import Sidebar from "./components/sidebar";

function AuthenticatedApp() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex h-screen pt-16">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/calculations" component={Calculations} />
            <Route path="/history" component={History} />
            <Route path="/projects" component={Projects} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function UnauthenticatedApp() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/" component={Login} />
        <Route component={Login} />
      </Switch>
    </div>
  );
}

function Router() {
  const { data: auth, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return auth?.user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
