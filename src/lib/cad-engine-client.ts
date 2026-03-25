/**
 * CAD Engine Client - Professional API Integration
 * 
 * This client integrates with the professional CAD engine backend
 * that uses OpenCascade Technology (OCCT) for industry-standard
 * STEP to STL conversion and advanced geometry analysis.
 * 
 * Features intelligent caching to minimize API calls.
 */

// Cache system removed for simplicity

export interface ConversionResponse {
  success: boolean;
  stl_base64: string;
  original_filename: string;
  stl_filename: string;
  stl_size: number;
  mesh_quality: {
    linear_deflection: number;
    angular_deflection: number;
  };
}

export interface GeometryFeatures {
  volume_mm3: number;
  surface_area_mm2: number;
  bounding_box: {
    min: [number, number, number];
    max: [number, number, number];
    size: [number, number, number];
  };
  complexity_score: number;
  feature_count: number;
  manufacturing_features: string[];
  mass_properties: Record<string, any>;
}

export interface MemoryMetrics {
  original_size_kb: number;
  optimized_size_kb: number;
  compression_ratio: number;
  memory_reduction_percent: number;
  processing_time_ms: number;
  cache_efficiency: number;
}

export interface DFMAnalysis {
  manufacturability_score: number;
  difficulty_level: string;
  recommended_processes: string[];
  warnings: string[];
  confidence: number;
  ai_enhanced: boolean;
  ai_insights: {
    manufacturing_complexity: string;
    process_recommendations: string[];
    cost_optimization_suggestions: string[];
    quality_considerations: string[];
    material_recommendations: string[];
    tooling_requirements: Record<string, any>;
    lead_time_estimate_days: number | null;
    risk_assessment: Record<string, any>;
    ai_confidence: number;
    generation_time_ms: number | null;
    dfm_warnings: string[];
  };
  detailed_recommendations: any[];
  competitive_analysis: Record<string, any>;
  sustainability_metrics: Record<string, any>;
  estimated_cost_range?: string;
  complexity?: string;
}

export interface GeometryAnalysisResponse {
  success: boolean;
  analysis_id: string;
  original_filename: string;
  optimization_strategy: string;
  model_version: string;
  timestamp: string;
  geometry_features: GeometryFeatures;
  memory_optimization: MemoryMetrics;
  dfm_analysis: DFMAnalysis;
  performance_metrics: {
    lod_levels_generated: number;
    recommendations: string[];
  };
}

export interface CADEngineConfig {
  baseUrl: string;
  timeout: number;
  maxRetries: number;
  getAuthToken?: () => Promise<string | null>;
}

export class CADEngineClient {
  private config: CADEngineConfig;

  constructor(config: Partial<CADEngineConfig> = {}) {
    this.config = {
      baseUrl: '/api/cad-engine',
      timeout: 120000,
      maxRetries: 3,
      ...config
    };
  }


  /**
   * Check if the CAD engine is healthy and available
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Use a shorter timeout for health check
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${this.config.baseUrl}/health`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn('CAD Engine health check failed:', response.status);
        return false;
      }
      
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('CAD Engine health check timed out');
      } else {
        console.warn('CAD Engine health check failed:', error);
      }
      return false;
    }
  }

  /**
   * Check if CAD engine is available before making requests
   */
  async isAvailable(): Promise<boolean> {
    return await this.healthCheck();
  }

  /**
   * Convert STEP/IGES file to STL using professional OpenCascade engine
   * Uses intelligent caching to avoid repeated conversions
   */
  async convertToSTL(file: File): Promise<ConversionResponse> {
    // Check if service is available
    const isServiceAvailable = await this.isAvailable();
    if (!isServiceAvailable) {
      throw new Error('CAD engine service is currently unavailable. Please try again later.');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await this.fetch('/convert/step-to-stl-base64', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Service temporarily unavailable' }));
        const errorMessage = errorData.detail || response.statusText;
        
        if (response.status === 503) {
          throw new Error('CAD engine service is temporarily unavailable. Please try again in a few minutes.');
        } else if (response.status === 413) {
          throw new Error('File is too large. Please try a smaller file.');
        } else if (response.status === 415) {
          throw new Error('File format not supported. Please use STEP (.step, .stp) or IGES (.iges, .igs) files.');
        } else {
          throw new Error(`Conversion failed: ${errorMessage}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error('STEP to STL conversion failed:', error);
      
      if (error instanceof Error) {
        // Re-throw known errors
        throw error;
      }
      
      // Generic fallback error
      throw new Error('Unable to convert file. The CAD engine may be temporarily unavailable.');
    }
  }

  /**
   * Perform advanced geometry analysis with DFM insights
   * Uses intelligent caching to avoid repeated analysis calls
   */
  async analyzeGeometry(
    file: File, 
    options: {
      strategy?: 'aggressive' | 'balanced' | 'conservative';
      forceReanalysis?: boolean;
      userProcesses?: any[];
    } = {}
  ): Promise<GeometryAnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options.strategy) {
      formData.append('strategy', options.strategy);
    }
    
    if (options.forceReanalysis) {
      formData.append('force_reanalysis', 'true');
    }
    
    if (options.userProcesses && options.userProcesses.length > 0) {
      formData.append('user_processes', JSON.stringify(options.userProcesses));
    }

    try {
      const response = await this.fetch('/analyze/geometry', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Service temporarily unavailable' }));
        const errorMessage = errorData.detail || response.statusText;
        
        if (response.status === 503) {
          throw new Error('Analysis service is temporarily unavailable. Please try again in a few minutes.');
        } else if (response.status === 413) {
          throw new Error('File is too large. Please try a smaller file.');
        } else if (response.status === 415) {
          throw new Error('File format not supported. Please use STEP (.step, .stp) or IGES (.iges, .igs) files.');
        } else {
          throw new Error(`Analysis failed: ${errorMessage}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error('Geometry analysis failed:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Unable to analyze geometry. The CAD engine may be temporarily unavailable.');
    }
  }

  /**
   * Memory-focused optimization without full DFM analysis (faster)
   */
  async optimizeMemory(
    file: File,
    strategy: 'aggressive' | 'balanced' | 'conservative' = 'balanced'
  ): Promise<{
    success: boolean;
    original_filename: string;
    optimization_strategy: string;
    memory_optimization: MemoryMetrics;
    performance: {
      lod_levels_generated: number;
      cache_efficiency: number;
    };
    recommendations: string[];
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('strategy', strategy);

    try {
      const response = await this.fetch('/optimize/memory', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(`Memory optimization failed: ${errorData.detail || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Memory optimization failed:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to optimize memory usage.'
      );
    }
  }

  /**
   * Get comprehensive memory usage report
   */
  async getMemoryReport(): Promise<{
    success: boolean;
    service_info: {
      version: string;
      capabilities: string[];
    };
    memory_report: any;
  }> {
    try {
      const response = await this.fetch('/memory/usage-report');
      
      if (!response.ok) {
        throw new Error(`Failed to get memory report: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get memory report:', error);
      throw new Error('Failed to retrieve memory usage report');
    }
  }

  /**
   * Validate if a file is supported for CAD processing
   */
  static isSupportedCADFile(file: File): boolean {
    const supportedExtensions = ['.step', '.stp', '.iges', '.igs'];
    const filename = file.name.toLowerCase();
    return supportedExtensions.some(ext => filename.endsWith(ext));
  }

  /**
   * Get file type for supported CAD files
   */
  static getCADFileType(file: File): string | null {
    const filename = file.name.toLowerCase();
    
    if (filename.endsWith('.step') || filename.endsWith('.stp')) {
      return 'STEP';
    }
    
    if (filename.endsWith('.iges') || filename.endsWith('.igs')) {
      return 'IGES';
    }
    
    return null;
  }

  /**
   * Internal fetch wrapper with retry logic and timeout
   */
  private async fetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      let lastError: Error | null = null;
      
      for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
        try {
          const token = this.config.getAuthToken ? await this.config.getAuthToken() : null;
          
          const headers: Record<string, string> = {
            ...options.headers as Record<string, string>,
          };
          
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers,
          });
          
          clearTimeout(timeoutId);
          return response;
          
        } catch (error) {
          lastError = error as Error;
          
          if (attempt < this.config.maxRetries) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
            continue;
          }
        }
      }
      
      throw lastError || new Error('Max retries exceeded');
      
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

// Create default client instance
export const cadEngine = new CADEngineClient();