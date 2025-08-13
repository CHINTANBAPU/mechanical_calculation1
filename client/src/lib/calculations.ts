export interface StressAnalysisInputs {
  force: number; // N
  area: number; // mm²
  material: string;
  loadType: string;
}

export interface StressAnalysisResults {
  stress: number; // MPa
  safetyFactor: number;
  status: 'safe' | 'warning' | 'danger';
  steps: string[];
}

export interface BeamDeflectionInputs {
  length: number; // mm
  load: number; // N
  momentOfInertia: number; // mm⁴
  elasticModulus: number; // GPa
  supportType: 'simply_supported' | 'cantilever' | 'fixed_both_ends';
}

export interface BeamDeflectionResults {
  maxDeflection: number; // mm
  maxStress: number; // MPa
  safetyFactor: number;
  status: 'safe' | 'warning' | 'danger';
  steps: string[];
}

const MATERIAL_PROPERTIES = {
  'Steel (A36)': { yieldStrength: 250, elasticModulus: 200 }, // MPa, GPa
  'Aluminum (6061-T6)': { yieldStrength: 270, elasticModulus: 70 },
  'Stainless Steel (304)': { yieldStrength: 215, elasticModulus: 200 },
};

export function calculateStressAnalysis(inputs: StressAnalysisInputs): StressAnalysisResults {
  const { force, area, material } = inputs;
  
  // Convert area from mm² to m²
  const areaM2 = area / 1000000;
  
  // Calculate stress in Pa, then convert to MPa
  const stressPa = force / areaM2;
  const stress = stressPa / 1000000; // Convert to MPa
  
  // Get material properties
  const materialProps = MATERIAL_PROPERTIES[material as keyof typeof MATERIAL_PROPERTIES];
  const yieldStrength = materialProps?.yieldStrength || 250;
  
  // Calculate safety factor
  const safetyFactor = yieldStrength / stress;
  
  // Determine status
  let status: 'safe' | 'warning' | 'danger';
  if (safetyFactor > 4) {
    status = 'safe';
  } else if (safetyFactor > 2) {
    status = 'warning';
  } else {
    status = 'danger';
  }
  
  const steps = [
    `σ = F / A`,
    `σ = ${force} N / ${area} mm²`,
    `σ = ${force} N / ${areaM2.toExponential(3)} m²`,
    `σ = ${stress.toFixed(2)} MPa`,
    `Safety Factor = Yield Strength / Stress`,
    `Safety Factor = ${yieldStrength} MPa / ${stress.toFixed(2)} MPa`,
    `Safety Factor = ${safetyFactor.toFixed(2)}`
  ];
  
  return {
    stress: Number(stress.toFixed(2)),
    safetyFactor: Number(safetyFactor.toFixed(2)),
    status,
    steps
  };
}

export function calculateBeamDeflection(inputs: BeamDeflectionInputs): BeamDeflectionResults {
  const { length, load, momentOfInertia, elasticModulus, supportType } = inputs;
  
  // Convert units: length mm to m, E GPa to Pa, I mm⁴ to m⁴
  const L = length / 1000; // m
  const E = elasticModulus * 1e9; // Pa
  const I = momentOfInertia / 1e12; // m⁴
  const P = load; // N
  
  let maxDeflection: number;
  let maxStress: number;
  
  // Calculate based on support type
  switch (supportType) {
    case 'simply_supported':
      // For simply supported beam with point load at center
      maxDeflection = (P * Math.pow(L, 3)) / (48 * E * I);
      maxStress = (P * L) / (4 * (momentOfInertia / 1000000)); // Convert I back to mm⁴ for stress calc
      break;
    case 'cantilever':
      // For cantilever beam with point load at free end
      maxDeflection = (P * Math.pow(L, 3)) / (3 * E * I);
      maxStress = (P * L) / (momentOfInertia / 1000000);
      break;
    case 'fixed_both_ends':
      // For fixed beam with point load at center
      maxDeflection = (P * Math.pow(L, 3)) / (192 * E * I);
      maxStress = (P * L) / (8 * (momentOfInertia / 1000000));
      break;
    default:
      maxDeflection = 0;
      maxStress = 0;
  }
  
  // Convert deflection back to mm
  maxDeflection = maxDeflection * 1000;
  
  // Convert stress to MPa
  maxStress = maxStress / 1000000;
  
  // Calculate safety factor (assuming yield strength of 250 MPa)
  const safetyFactor = 250 / maxStress;
  
  // Determine status
  let status: 'safe' | 'warning' | 'danger';
  if (safetyFactor > 4) {
    status = 'safe';
  } else if (safetyFactor > 2) {
    status = 'warning';
  } else {
    status = 'danger';
  }
  
  const steps = [
    `Beam Type: ${supportType.replace('_', ' ')}`,
    `Length: ${length} mm = ${L.toFixed(3)} m`,
    `Load: ${load} N`,
    `Elastic Modulus: ${elasticModulus} GPa`,
    `Moment of Inertia: ${momentOfInertia} mm⁴`,
    `Max Deflection = ${maxDeflection.toFixed(3)} mm`,
    `Max Stress = ${maxStress.toFixed(2)} MPa`,
    `Safety Factor = ${safetyFactor.toFixed(2)}`
  ];
  
  return {
    maxDeflection: Number(maxDeflection.toFixed(3)),
    maxStress: Number(maxStress.toFixed(2)),
    safetyFactor: Number(safetyFactor.toFixed(2)),
    status,
    steps
  };
}
