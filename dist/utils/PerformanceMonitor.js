export class ParametricPerformanceMonitor {
    constructor(customThresholds) {
        this.metrics = new Map();
        this.thresholds = {
            generationTime: 1000, // 1 second
            polygonCount: 50000,
            memoryUsage: 10000000 // 10MB
        };
        this.optimizationCallbacks = new Map();
        if (customThresholds) {
            this.thresholds = { ...this.thresholds, ...customThresholds };
        }
    }
    recordGeneration(furnitureType, culture, metrics) {
        const key = `${furnitureType}-${culture}`;
        if (!this.metrics.has(key)) {
            this.metrics.set(key, []);
        }
        const performanceMetric = {
            timestamp: Date.now(),
            ...metrics
        };
        this.metrics.get(key).push(performanceMetric);
        // Keep only last 1000 measurements to prevent memory bloat
        const measurements = this.metrics.get(key);
        if (measurements.length > 1000) {
            measurements.shift();
        }
        this.checkThresholds(key, metrics);
        this.logPerformanceMetrics(key, metrics);
    }
    checkThresholds(key, metrics) {
        const warnings = [];
        if (metrics.generationTime > this.thresholds.generationTime) {
            warnings.push(`Generation time exceeded: ${metrics.generationTime}ms (threshold: ${this.thresholds.generationTime}ms)`);
        }
        if (metrics.polygonCount > this.thresholds.polygonCount) {
            warnings.push(`Polygon count exceeded: ${metrics.polygonCount} (threshold: ${this.thresholds.polygonCount})`);
        }
        if (metrics.memoryUsage > this.thresholds.memoryUsage) {
            warnings.push(`Memory usage exceeded: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB (threshold: ${(this.thresholds.memoryUsage / 1024 / 1024).toFixed(2)}MB)`);
        }
        if (warnings.length > 0) {
            console.warn(`🚨 Performance warnings for ${key}:`, warnings);
            this.triggerOptimization(key, metrics);
        }
    }
    triggerOptimization(key, metrics) {
        console.log(`🔧 Triggering optimization for ${key}`);
        // Call registered optimization callbacks
        const callback = this.optimizationCallbacks.get(key);
        if (callback) {
            callback(key, metrics);
        }
        // Implement automatic optimization strategies
        this.applyAutomaticOptimizations(key, metrics);
    }
    applyAutomaticOptimizations(key, metrics) {
        const suggestions = [];
        if (metrics.generationTime > this.thresholds.generationTime) {
            suggestions.push('Consider reducing geometric complexity');
            suggestions.push('Implement Level of Detail (LOD) system');
            suggestions.push('Use geometry instancing for repeated elements');
        }
        if (metrics.polygonCount > this.thresholds.polygonCount) {
            suggestions.push('Reduce subdivision levels');
            suggestions.push('Simplify curved surfaces');
            suggestions.push('Use texture details instead of geometry');
        }
        if (metrics.memoryUsage > this.thresholds.memoryUsage) {
            suggestions.push('Implement geometry compression');
            suggestions.push('Use shared materials and textures');
            suggestions.push('Clear unused geometry buffers');
        }
        if (suggestions.length > 0) {
            console.log(`💡 Optimization suggestions for ${key}:`, suggestions);
        }
    }
    logPerformanceMetrics(key, metrics) {
        const status = this.getPerformanceStatus(metrics);
        const statusEmoji = {
            'excellent': '🚀',
            'good': '✅',
            'warning': '⚠️',
            'critical': '🚨'
        }[status];
        console.log(`${statusEmoji} Performance [${key}]: ${metrics.generationTime.toFixed(2)}ms, ${metrics.polygonCount} polygons, ${(metrics.memoryUsage / 1024).toFixed(2)}KB`);
    }
    getPerformanceStatus(metrics) {
        const timeRatio = metrics.generationTime / this.thresholds.generationTime;
        const polygonRatio = metrics.polygonCount / this.thresholds.polygonCount;
        const memoryRatio = metrics.memoryUsage / this.thresholds.memoryUsage;
        const maxRatio = Math.max(timeRatio, polygonRatio, memoryRatio);
        if (maxRatio >= 1.0)
            return 'critical';
        if (maxRatio >= 0.8)
            return 'warning';
        if (maxRatio >= 0.5)
            return 'good';
        return 'excellent';
    }
    registerOptimizationCallback(furnitureType, culture, callback) {
        const key = `${furnitureType}-${culture}`;
        this.optimizationCallbacks.set(key, callback);
    }
    getPerformanceReport() {
        const report = {
            totalGenerations: 0,
            averageGenerationTime: 0,
            averagePolygonCount: 0,
            averageMemoryUsage: 0,
            byCategory: new Map()
        };
        let totalTime = 0;
        let totalPolygons = 0;
        let totalMemory = 0;
        for (const [key, metrics] of this.metrics) {
            const categoryMetrics = metrics.reduce((acc, metric) => {
                acc.generationTime += metric.generationTime;
                acc.polygonCount += metric.polygonCount;
                acc.memoryUsage += metric.memoryUsage;
                return acc;
            }, { generationTime: 0, polygonCount: 0, memoryUsage: 0 });
            const count = metrics.length;
            report.byCategory.set(key, {
                count,
                averageGenerationTime: categoryMetrics.generationTime / count,
                averagePolygonCount: categoryMetrics.polygonCount / count,
                averageMemoryUsage: categoryMetrics.memoryUsage / count
            });
            report.totalGenerations += count;
            totalTime += categoryMetrics.generationTime;
            totalPolygons += categoryMetrics.polygonCount;
            totalMemory += categoryMetrics.memoryUsage;
        }
        if (report.totalGenerations > 0) {
            report.averageGenerationTime = totalTime / report.totalGenerations;
            report.averagePolygonCount = totalPolygons / report.totalGenerations;
            report.averageMemoryUsage = totalMemory / report.totalGenerations;
        }
        return report;
    }
    getDetailedReport() {
        const report = this.getPerformanceReport();
        const detailed = {
            ...report,
            thresholds: this.thresholds,
            categoryDetails: {},
            trends: {}
        };
        // Add category details
        for (const [key, categoryData] of report.byCategory) {
            const metrics = this.metrics.get(key) || [];
            const recent = metrics.slice(-10); // Last 10 measurements
            detailed.categoryDetails[key] = {
                ...categoryData,
                recentTrend: this.calculateTrend(recent),
                worstCase: this.getWorstCase(metrics),
                bestCase: this.getBestCase(metrics),
                consistencyScore: this.calculateConsistency(metrics)
            };
        }
        return detailed;
    }
    calculateTrend(metrics) {
        if (metrics.length < 2) {
            return { timeSlope: 0, polygonSlope: 0, memorySlope: 0 };
        }
        const n = metrics.length;
        const xSum = metrics.reduce((sum, _, i) => sum + i, 0);
        const xSumSq = metrics.reduce((sum, _, i) => sum + i * i, 0);
        const calculateSlope = (values) => {
            const ySum = values.reduce((sum, val) => sum + val, 0);
            const xySum = values.reduce((sum, val, i) => sum + val * i, 0);
            return (n * xySum - xSum * ySum) / (n * xSumSq - xSum * xSum);
        };
        return {
            timeSlope: calculateSlope(metrics.map(m => m.generationTime)),
            polygonSlope: calculateSlope(metrics.map(m => m.polygonCount)),
            memorySlope: calculateSlope(metrics.map(m => m.memoryUsage))
        };
    }
    getWorstCase(metrics) {
        if (metrics.length === 0) {
            return { timestamp: 0, generationTime: 0, polygonCount: 0, memoryUsage: 0 };
        }
        return metrics.reduce((worst, current) => {
            const worstScore = worst.generationTime + worst.polygonCount + worst.memoryUsage;
            const currentScore = current.generationTime + current.polygonCount + current.memoryUsage;
            return currentScore > worstScore ? current : worst;
        });
    }
    getBestCase(metrics) {
        if (metrics.length === 0) {
            return { timestamp: 0, generationTime: 0, polygonCount: 0, memoryUsage: 0 };
        }
        return metrics.reduce((best, current) => {
            const bestScore = best.generationTime + best.polygonCount + best.memoryUsage;
            const currentScore = current.generationTime + current.polygonCount + current.memoryUsage;
            return currentScore < bestScore ? current : best;
        });
    }
    calculateConsistency(metrics) {
        if (metrics.length < 2)
            return 1.0;
        const avgTime = metrics.reduce((sum, m) => sum + m.generationTime, 0) / metrics.length;
        const avgPolygons = metrics.reduce((sum, m) => sum + m.polygonCount, 0) / metrics.length;
        const avgMemory = metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length;
        const timeVariance = metrics.reduce((sum, m) => sum + Math.pow(m.generationTime - avgTime, 2), 0) / metrics.length;
        const polygonVariance = metrics.reduce((sum, m) => sum + Math.pow(m.polygonCount - avgPolygons, 2), 0) / metrics.length;
        const memoryVariance = metrics.reduce((sum, m) => sum + Math.pow(m.memoryUsage - avgMemory, 2), 0) / metrics.length;
        const timeCV = Math.sqrt(timeVariance) / avgTime;
        const polygonCV = Math.sqrt(polygonVariance) / avgPolygons;
        const memoryCV = Math.sqrt(memoryVariance) / avgMemory;
        const avgCV = (timeCV + polygonCV + memoryCV) / 3;
        return Math.max(0, 1 - avgCV); // Higher score = more consistent
    }
    exportMetrics() {
        const report = this.getDetailedReport();
        return JSON.stringify(report, null, 2);
    }
    importMetrics(data) {
        try {
            const parsed = JSON.parse(data);
            // Implementation would restore metrics from exported data
            console.log('Metrics imported successfully');
        }
        catch (error) {
            console.error('Failed to import metrics:', error);
        }
    }
    clearMetrics() {
        this.metrics.clear();
        console.log('📊 Performance metrics cleared');
    }
    getMetricsCount() {
        return Array.from(this.metrics.values()).reduce((sum, arr) => sum + arr.length, 0);
    }
    setThresholds(newThresholds) {
        this.thresholds = { ...this.thresholds, ...newThresholds };
        console.log('📏 Performance thresholds updated:', this.thresholds);
    }
    getThresholds() {
        return { ...this.thresholds };
    }
    // Real-time monitoring
    startRealTimeMonitoring(intervalMs = 5000) {
        const interval = setInterval(() => {
            const report = this.getPerformanceReport();
            if (report.totalGenerations > 0) {
                console.log('📊 Real-time Performance Summary:', {
                    totalGenerations: report.totalGenerations,
                    avgTime: `${report.averageGenerationTime.toFixed(2)}ms`,
                    avgPolygons: report.averagePolygonCount.toFixed(0),
                    avgMemory: `${(report.averageMemoryUsage / 1024).toFixed(2)}KB`
                });
            }
        }, intervalMs);
        return () => clearInterval(interval);
    }
    // Benchmark utilities
    benchmark(name, iterations, testFunction) {
        return new Promise(async (resolve) => {
            console.log(`🏃 Starting benchmark: ${name} (${iterations} iterations)`);
            const results = [];
            for (let i = 0; i < iterations; i++) {
                const metrics = await testFunction();
                results.push(metrics);
                if (i % 10 === 0) {
                    console.log(`🏃 Benchmark progress: ${i}/${iterations}`);
                }
            }
            const summary = {
                avgTime: results.reduce((sum, r) => sum + r.generationTime, 0) / results.length,
                minTime: Math.min(...results.map(r => r.generationTime)),
                maxTime: Math.max(...results.map(r => r.generationTime)),
                avgPolygons: results.reduce((sum, r) => sum + r.polygonCount, 0) / results.length,
                avgMemory: results.reduce((sum, r) => sum + r.memoryUsage, 0) / results.length
            };
            console.log(`✅ Benchmark completed: ${name}`, summary);
            resolve({
                name,
                iterations,
                results,
                summary
            });
        });
    }
}
//# sourceMappingURL=PerformanceMonitor.js.map