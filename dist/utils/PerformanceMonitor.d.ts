import { FurnitureType, CultureType, PerformanceMetrics, PerformanceReport } from '../types/index';
export declare class ParametricPerformanceMonitor {
    private metrics;
    private thresholds;
    private optimizationCallbacks;
    constructor(customThresholds?: Partial<typeof this.thresholds>);
    recordGeneration(furnitureType: FurnitureType, culture: CultureType, metrics: PerformanceMetrics): void;
    private checkThresholds;
    private triggerOptimization;
    private applyAutomaticOptimizations;
    private logPerformanceMetrics;
    private getPerformanceStatus;
    registerOptimizationCallback(furnitureType: FurnitureType, culture: CultureType, callback: (key: string, metrics: PerformanceMetrics) => void): void;
    getPerformanceReport(): PerformanceReport;
    getDetailedReport(): any;
    private calculateTrend;
    private getWorstCase;
    private getBestCase;
    private calculateConsistency;
    exportMetrics(): string;
    importMetrics(data: string): void;
    clearMetrics(): void;
    getMetricsCount(): number;
    setThresholds(newThresholds: Partial<typeof this.thresholds>): void;
    getThresholds(): typeof this.thresholds;
    startRealTimeMonitoring(intervalMs?: number): () => void;
    benchmark(name: string, iterations: number, testFunction: () => Promise<PerformanceMetrics>): Promise<{
        name: string;
        iterations: number;
        results: PerformanceMetrics[];
        summary: {
            avgTime: number;
            minTime: number;
            maxTime: number;
            avgPolygons: number;
            avgMemory: number;
        };
    }>;
}
//# sourceMappingURL=PerformanceMonitor.d.ts.map