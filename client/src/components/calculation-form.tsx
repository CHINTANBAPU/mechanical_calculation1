import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, RotateCcw, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { calculateStressAnalysis, type StressAnalysisInputs, type StressAnalysisResults } from "@/lib/calculations";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CalculationResults from "./calculation-results";

const stressAnalysisSchema = z.object({
  material: z.string().min(1, "Material is required"),
  loadType: z.string().min(1, "Load type is required"),
  force: z.number().min(0.01, "Force must be greater than 0"),
  area: z.number().min(0.01, "Area must be greater than 0"),
  length: z.number().min(0.01, "Length must be greater than 0"),
});

type StressAnalysisForm = z.infer<typeof stressAnalysisSchema>;

export default function CalculationForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [results, setResults] = useState<StressAnalysisResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  const form = useForm<StressAnalysisForm>({
    resolver: zodResolver(stressAnalysisSchema),
    defaultValues: {
      material: "",
      loadType: "",
      force: 0,
      area: 0,
      length: 0,
    },
  });

  const saveCalculation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/calculations", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calculations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Calculation saved successfully",
      });
    },
  });

  const onSubmit = (data: StressAnalysisForm) => {
    const inputs: StressAnalysisInputs = {
      force: data.force,
      area: data.area,
      material: data.material,
      loadType: data.loadType,
    };

    const calculationResults = calculateStressAnalysis(inputs);
    setResults(calculationResults);
    setShowResults(true);
  };

  const handleSave = () => {
    if (!results) return;

    const formData = form.getValues();
    saveCalculation.mutate({
      type: "stress_analysis",
      name: `Stress Analysis - ${formData.material}`,
      description: `${formData.loadType} calculation`,
      material: formData.material,
      inputs: formData,
      results: results,
    });
  };

  const handleReset = () => {
    form.reset();
    setResults(null);
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Steel (A36)">Steel (A36)</SelectItem>
                      <SelectItem value="Aluminum (6061-T6)">Aluminum (6061-T6)</SelectItem>
                      <SelectItem value="Stainless Steel (304)">Stainless Steel (304)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loadType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Load Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select load type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Tensile Load">Tensile Load</SelectItem>
                      <SelectItem value="Compressive Load">Compressive Load</SelectItem>
                      <SelectItem value="Bending Moment">Bending Moment</SelectItem>
                      <SelectItem value="Shear Force">Shear Force</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="force"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Force (N)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="1000" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area (mm²)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="100" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length (mm)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="500" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center px-4 py-2 rounded-lg shadow-md transition-colors" type="submit" >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center px-4 py-2 rounded-lg shadow-md transition-colors" type="button" variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </form>
      </Form>

      {showResults && results && (
        <CalculationResults 
          results={results} 
          onSave={handleSave} 
          isSaving={saveCalculation.isPending}
        />
      )}
    </div>
  );
}
