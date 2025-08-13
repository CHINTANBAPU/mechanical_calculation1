import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Bookmark, 
  Clock, 
  Users, 
  Plus,
  Weight,
  ArrowLeftRight,
  Expand,
  MoreHorizontal,
  Play,
  Book,
  Edit
} from "lucide-react";
import CalculationForm from "@/components/calculation-form";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: calculations = [], isLoading: calculationsLoading } = useQuery({
    queryKey: ["/api/calculations"],
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const recentCalculations = calculations.slice(0, 3);
  const recentProjects = projects.slice(0, 5);

  return (
    <div className="p-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome back! Here's an overview of your mechanical calculations.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href="/calculations">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center px-4 py-2 rounded-lg shadow-md transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                New Calculation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Calculations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? "..." : stats?.totalCalculations || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Bookmark className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Saved Projects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? "..." : stats?.savedProjects || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? "..." : stats?.thisWeek || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Shared With</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? "..." : stats?.sharedWith || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Calculation */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle>Quick Calculation</CardTitle>
              <p className="text-gray-600 text-sm">Perform a quick stress analysis calculation</p>
            </CardHeader>
            <CardContent className="p-6">
              <CalculationForm />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="mb-6">
            <CardHeader className="border-b border-gray-200">
              <CardTitle>Recent Calculations</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {calculationsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentCalculations.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No calculations yet</p>
                  <p className="text-sm">Create your first calculation to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentCalculations.map((calc) => (
                    <div key={calc.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Weight className="h-4 w-4 text-primary-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{calc.name}</p>
                        <p className="text-xs text-gray-500">{calc.description}</p>
                        <p className="text-xs text-gray-400">
                          {calc.createdAt ? new Date(calc.createdAt).toLocaleDateString() : 'Recently'}
                        </p>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center px-4 py-2 rounded-lg shadow-md transition-colors" variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6">
                <Link href="/history">
                  <a className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View all calculations →
                  </a>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Learning Resources */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle>Learning Resources</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <a href="#" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Play className="h-5 w-5 text-primary-500" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Stress Analysis Basics</p>
                      <p className="text-gray-600 text-xs">15 min video tutorial</p>
                    </div>
                  </div>
                </a>
                <a href="#" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Book className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Material Properties Guide</p>
                      <p className="text-gray-600 text-xs">Reference documentation</p>
                    </div>
                  </div>
                </a>
                <a href="#" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Calculator className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Example Calculations</p>
                      <p className="text-gray-600 text-xs">Step-by-step examples</p>
                    </div>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="mt-8">
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle>Saved Projects</CardTitle>
              <div className="flex items-center space-x-2">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center px-4 py-2 rounded-lg shadow-md transition-colors"variant="ghost" size="sm">
                  <Book className="h-4 w-4" />
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center px-4 py-2 rounded-lg shadow-md transition-colors"variant="ghost" size="sm">
                  <Book className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {projectsLoading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <Bookmark className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No saved projects yet</p>
                <p className="text-sm">Save your calculations as projects for easy access</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Modified
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center">
                                <Weight className="h-4 w-4 text-primary-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{project.name}</div>
                              <div className="text-sm text-gray-500">{project.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={project.status === 'complete' ? 'default' : 'secondary'}>
                            {project.status || 'In Progress'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'Recently'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center px-4 py-2 rounded-lg shadow-md transition-colors"variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center px-4 py-2 rounded-lg shadow-md transition-colors"variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
