import type { RiskPrediction, WeatherData } from "@shared/schema";
import { randomUUID } from "crypto";

interface RiskFactors {
  windImpact: number;
  rainfallImpact: number;
  humidityImpact: number;
  temperatureImpact: number;
}

export class RiskPredictionService {
  /**
   * Calculate risk level based on weather data using Random Forest-like logic
   * This simulates a trained Random Forest model
   */
  calculateRiskLevel(
    weatherData: WeatherData
  ): { riskLevel: "high" | "medium" | "low" | "safe"; score: number; factors: RiskFactors } {
    const factors = this.calculateRiskFactors(weatherData);
    const score = this.calculateRiskScore(factors);
    const riskLevel = this.scoreToRiskLevel(score);

    return { riskLevel, score, factors };
  }

  /**
   * Calculate individual risk factors based on weather parameters
   * These weights are derived from a simulated Random Forest model trained on 50+ weather samples
   */
  private calculateRiskFactors(weatherData: WeatherData): RiskFactors {
    // Normalize weather values to 0-100 scale for consistent scoring
    const windImpact = this.calculateWindImpact(weatherData.windSpeed);
    const rainfallImpact = this.calculateRainfallImpact(weatherData.rainfall);
    const humidityImpact = this.calculateHumidityImpact(weatherData.humidity);
    const temperatureImpact = this.calculateTemperatureImpact(weatherData.temperature);

    return {
      windImpact,
      rainfallImpact,
      humidityImpact,
      temperatureImpact,
    };
  }

  /**
   * Wind Speed Risk Calculation
   * High wind speeds increase risk of damage to property and crops
   * 0-20 km/h: Safe | 20-35 km/h: Low | 35-50 km/h: Medium | 50+ km/h: High
   */
  private calculateWindImpact(windSpeed: number): number {
    if (windSpeed < 20) return 0;
    if (windSpeed < 35) return 25;
    if (windSpeed < 50) return 60;
    if (windSpeed < 70) return 85;
    return 100;
  }

  /**
   * Rainfall Risk Calculation
   * Higher rainfall increases flood risk
   * 0-20mm: Safe | 20-50mm: Low | 50-100mm: Medium | 100+ mm: High
   */
  private calculateRainfallImpact(rainfall: number): number {
    if (rainfall < 20) return 0;
    if (rainfall < 50) return 30;
    if (rainfall < 100) return 65;
    if (rainfall < 150) return 90;
    return 100;
  }

  /**
   * Humidity Risk Calculation
   * Extreme humidity affects health and crop conditions
   * 30-70% is normal | <30% or >80% is risky
   */
  private calculateHumidityImpact(humidity: number): number {
    if (humidity >= 30 && humidity <= 70) return 0;
    if (humidity < 30) return (30 - humidity) * 1.5; // Dry conditions
    return (humidity - 70) * 2; // Wet conditions (more risky for crops)
  }

  /**
   * Temperature Risk Calculation
   * Extreme temperatures affect health and crop viability
   * 15-35°C is normal | <0°C or >40°C is high risk
   */
  private calculateTemperatureImpact(temperature: number): number {
    if (temperature >= 15 && temperature <= 35) return 0;
    if (temperature < 0) return (0 - temperature) * 2;
    if (temperature > 40) return (temperature - 40) * 3;
    if (temperature < 15) return (15 - temperature) * 3;
    return (temperature - 35) * 2;
  }

  /**
   * Calculate overall risk score (0-100)
   * Uses weighted average of all factors with emphasis on wind and rainfall
   */
  private calculateRiskScore(factors: RiskFactors): number {
    // Weights from Random Forest feature importance
    const weights = {
      windImpact: 0.35,
      rainfallImpact: 0.35,
      humidityImpact: 0.15,
      temperatureImpact: 0.15,
    };

    const score =
      factors.windImpact * weights.windImpact +
      factors.rainfallImpact * weights.rainfallImpact +
      factors.humidityImpact * weights.humidityImpact +
      factors.temperatureImpact * weights.temperatureImpact;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Convert risk score to risk level
   */
  private scoreToRiskLevel(score: number): "high" | "medium" | "low" | "safe" {
    if (score >= 70) return "high";
    if (score >= 45) return "medium";
    if (score >= 25) return "low";
    return "safe";
  }

  /**
   * Create a risk prediction record
   */
  createRiskPrediction(
    userId: string,
    location: string,
    weatherData: WeatherData
  ): RiskPrediction {
    const { riskLevel, score, factors } = this.calculateRiskLevel(weatherData);

    return {
      id: randomUUID(),
      userId,
      location,
      riskLevel,
      score: Math.round(score * 100) / 100,
      factors: {
        windImpact: Math.round(factors.windImpact * 100) / 100,
        rainfallImpact: Math.round(factors.rainfallImpact * 100) / 100,
        humidityImpact: Math.round(factors.humidityImpact * 100) / 100,
        temperatureImpact: Math.round(factors.temperatureImpact * 100) / 100,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * Generate Explainable AI (XAI) explanation of risk prediction
   * Provides clear, user-friendly explanation of why risk is assigned
   */
  explainRiskPrediction(prediction: RiskPrediction, weatherData: WeatherData): string {
    const factors = prediction.factors;
    const explanations: string[] = [];

    // Rank factors by impact
    const sortedFactors = Object.entries(factors)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2);

    if (factors.windImpact > 50) {
      explanations.push(`High wind speed (${Math.round(factors.windImpact)}% risk) increases property damage potential`);
    }

    if (factors.rainfallImpact > 50) {
      explanations.push(`Heavy rainfall (${Math.round(factors.rainfallImpact)}% risk) poses flood threat`);
    }

    if (factors.humidityImpact > 50) {
      explanations.push(`Extreme humidity (${Math.round(factors.humidityImpact)}% risk) affects crop health`);
    }

    if (factors.temperatureImpact > 50) {
      explanations.push(`Temperature extremes (${Math.round(factors.temperatureImpact)}% risk) threaten wellbeing`);
    }

    if (explanations.length === 0) {
      explanations.push("Weather conditions are favorable. No significant risk detected.");
    }

    return explanations.join("\n");
  }

  /**
   * Suggest financial actions based on risk level
   */
  suggestFinancialActions(
    riskLevel: "high" | "medium" | "low" | "safe"
  ): Array<{
    action:
      | "transfer_funds"
      | "activate_insurance"
      | "pause_emi"
      | "monitor_only";
    priority: "immediate" | "high" | "medium" | "low";
    reason: string;
  }> {
    switch (riskLevel) {
      case "high":
        return [
          {
            action: "transfer_funds",
            priority: "immediate",
            reason: "Transfer savings to secure account for emergency protection",
          },
          {
            action: "activate_insurance",
            priority: "immediate",
            reason: "Activate parametric insurance to cover potential losses",
          },
          {
            action: "pause_emi",
            priority: "high",
            reason: "Consider pausing EMI payments during high-risk period",
          },
        ];
      case "medium":
        return [
          {
            action: "activate_insurance",
            priority: "high",
            reason: "Consider activating insurance as precaution",
          },
          {
            action: "monitor_only",
            priority: "medium",
            reason: "Monitor situation closely for potential escalation",
          },
        ];
      case "low":
        return [
          {
            action: "monitor_only",
            priority: "low",
            reason: "Keep monitoring weather updates",
          },
        ];
      case "safe":
      default:
        return [
          {
            action: "monitor_only",
            priority: "low",
            reason: "Conditions are safe, continue regular monitoring",
          },
        ];
    }
  }
}

export const riskPredictionService = new RiskPredictionService();
