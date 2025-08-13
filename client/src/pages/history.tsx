import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calculator, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Weight,
  ArrowLeftRight,
  Expand,
  Settings
} from "lucide-react";
import { useState } from "react";

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: calculations = [], isLoading } = useQuery({
    queryKey: ["/api/calculations"],
  });

  const filteredCalculations = calculations.filter((calc: any) =>
    calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.material?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCalculationIcon = (type: string) => {
    switch (type) {
      case 'stress_analysis':
        return <Weight className="h-4 w-4" />;
      case 'beam_deflection':
        return <ArrowLeftRight className="h-4 w-4" />;
      case 'strain_calculation':
        return <Expand className="h-4 w-4" />;
      case 'material_properties':
        return <Settings className="h-4 w-4" />;
      default:
        return <Calculator className="h-4 w-4" />;
    }
  };

  const getCalculationTypeLabel = (type: string) => {
    switch (type) {
      case 'stress_analysis':
        return 'Stress Analysis';
      case 'beam_deflection':
        return 'Beam Deflection';
      case 'strain_calculation':
        return 'Strain Calculation';
      case 'material_properties':
        return 'Material Properties';
      default:
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Calculation History</h1>
        <p className="mt-2 text-gray-600">
          View, edit, and manage all your previous calculations.
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search calculations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculations List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Calculations ({filteredCalculations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                    </div>
                    <div className="space-x-2">
                      <div className="w-16 h-8 bg-gray-200 rounded"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCalculations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">
                {searchTerm ? "No calculations found" : "No calculations yet"}
              </p>
              <p className="text-sm">
                {searchTerm 
                  ? "Try adjusting your search terms" 
                  : "Start by creating your first calculation"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCalculations.map((calculation: any) => (
                <div key={calculation.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      {getCalculationIcon(calculation.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-gray-900">{calculation.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {getCalculationTypeLabel(calculation.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{calculation.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      {calculation.material && (
                        <span>Material: {calculation.material}</span>
                      )}
                      <span>
                        Created: {calculation.createdAt ? new Date(calculation.createdAt).toLocaleDateString() : 'Recently'}
                      </span>
                      {calculation.results && (
                        <span>
                          Result: {calculation.results.stress || calculation.results.maxDeflection || 'N/A'} 
                          {calculation.results.stress ? ' MPa' : calculation.results.maxDeflection ? ' mm' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
