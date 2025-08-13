import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Weight, ArrowLeftRight, Expand, Settings } from "lucide-react";
import CalculationForm from "@/components/calculation-form";

export default function Calculations() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mechanical Calculations</h1>
        <p className="mt-2 text-gray-600">
          Perform various mechanical engineering calculations with step-by-step solutions.
        </p>
      </div>

      <Tabs defaultValue="stress" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stress" className="flex items-center gap-2">
            <Weight className="h-4 w-4" />
            Stress Analysis
          </TabsTrigger>
          <TabsTrigger value="deflection" className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            Beam Deflection
          </TabsTrigger>
          <TabsTrigger value="strain" className="flex items-center gap-2">
            <Expand className="h-4 w-4" />
            Strain Calculations
          </TabsTrigger>
          <TabsTrigger value="material" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Material Properties
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stress">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Weight className="h-5 w-5" />
                Stress Analysis Calculator
              </CardTitle>
              <p className="text-gray-600">
                Calculate stress, safety factors, and determine material suitability for various loading conditions.
              </p>
            </CardHeader>
            <CardContent>
              <CalculationForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deflection">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5" />
                Beam Deflection Calculator
              </CardTitle>
              <p className="text-gray-600">
                Calculate beam deflection, maximum stress, and analyze beam behavior under various loading conditions.
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <ArrowLeftRight className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Beam Deflection Calculator</p>
                <p className="text-sm">Coming soon - Advanced beam analysis tools</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strain">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Expand className="h-5 w-5" />
                Strain Calculations
              </CardTitle>
              <p className="text-gray-600">
                Calculate strain, deformation, and material behavior under various loading conditions.
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Expand className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Strain Calculator</p>
                <p className="text-sm">Coming soon - Comprehensive strain analysis</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="material">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Material Properties
              </CardTitle>
              <p className="text-gray-600">
                Explore material properties, compare materials, and select the right material for your application.
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Settings className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Material Properties Database</p>
                <p className="text-sm">Coming soon - Comprehensive material database</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
