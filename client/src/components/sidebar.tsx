import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Calculator, 
  History, 
  Bookmark, 
  Weight, 
  ArrowLeftRight, 
  Expand, 
  Settings,
  Book,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/calculations", label: "New Calculation", icon: Calculator },
  { path: "/history", label: "History", icon: History },
  { path: "/projects", label: "Saved Calculations", icon: Bookmark },
];

const calculationTypes = [
  { path: "/calculations?type=stress", label: "Stress Analysis", icon: Weight },
  { path: "/calculations?type=deflection", label: "Beam Deflection", icon: ArrowLeftRight },
  { path: "/calculations?type=strain", label: "Strain Calculations", icon: Expand },
  { path: "/calculations?type=material", label: "Material Properties", icon: Settings },
];

const resources = [
  { path: "/documentation", label: "Documentation", icon: Book },
  { path: "/help", label: "Help & Support", icon: HelpCircle },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                location === item.path
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-700 hover:bg-gray-50"
              )}>
                <item.icon className={cn(
                  "mr-3 h-5 w-5",
                  location === item.path ? "text-primary-500" : "text-gray-400"
                )} />
                {item.label}
              </a>
            </Link>
          ))}
        </nav>

        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Calculation Types
          </h3>
          <div className="mt-3 space-y-1">
            {calculationTypes.map((item) => (
              <Link key={item.path} href={item.path}>
                <a className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                  <item.icon className="mr-3 h-4 w-4 text-gray-400" />
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Resources
          </h3>
          <div className="mt-3 space-y-1">
            {resources.map((item) => (
              <Link key={item.path} href={item.path}>
                <a className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                  <item.icon className="mr-3 h-4 w-4 text-gray-400" />
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
