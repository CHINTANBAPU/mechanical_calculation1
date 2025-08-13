import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Save } from "lucide-react";
import type { StressAnalysisResults } from "@/lib/calculations";

interface CalculationResultsProps {
  results: StressAnalysisResults;
  onSave?: () => void;
  isSaving?: boolean;
}

export default function CalculationResults({ results, onSave, isSaving }: CalculationResultsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'danger':
        return <XCircle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'safe':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'danger':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Calculation Results</h3>
        {onSave && (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center px-4 py-2 rounded-lg shadow-md transition-colors" onClick={onSave} disabled={isSaving} size="sm">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Stress (σ)</p>
            <p className="text-2xl font-bold text-gray-900 font-mono">
              {results.stress} MPa
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Safety Factor</p>
            <p className="text-2xl font-bold text-green-600 font-mono">
              {results.safetyFactor}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Status</p>
            <Badge 
              variant={getStatusVariant(results.status)} 
              className="flex items-center gap-1 w-fit mt-2"
            >
              {getStatusIcon(results.status)}
              {results.status.charAt(0).toUpperCase() + results.status.slice(1)}
            </Badge>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Breakdown */}
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Calculation Steps</h4>
        <Card>
          <CardContent className="p-4 bg-white font-mono text-sm">
            {results.steps.map((step, index) => (
              <p key={index} className="text-gray-700 mb-1">
                {step}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
