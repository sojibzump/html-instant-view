
export interface AdMetrics {
  impressions: number;
  clicks: number;
  revenue: number;
  ctr: number; // Click-through rate
  rpm: number; // Revenue per mille (thousand impressions)
}

export interface AdZone {
  id: string;
  name: string;
  size: string;
  position: string;
  metrics: AdMetrics;
  isHighRevenue: boolean;
}

class AdRevenueSystem {
  private static instance: AdRevenueSystem;
  private adZones: Map<string, AdZone> = new Map();

  private constructor() {
    this.initializeAdZones();
  }

  static getInstance(): AdRevenueSystem {
    if (!AdRevenueSystem.instance) {
      AdRevenueSystem.instance = new AdRevenueSystem();
    }
    return AdRevenueSystem.instance;
  }

  private initializeAdZones() {
    const zones: AdZone[] = [
      {
        id: 'mobile-ad',
        name: 'Mobile Banner',
        size: '320x50',
        position: 'bottom',
        metrics: { impressions: 0, clicks: 0, revenue: 0, ctr: 0, rpm: 0 },
        isHighRevenue: false
      },
      {
        id: 'sidebar-ad',
        name: 'Sidebar Banner',
        size: '160x600',
        position: 'left',
        metrics: { impressions: 0, clicks: 0, revenue: 0, ctr: 0, rpm: 0 },
        isHighRevenue: false
      },
      {
        id: 'footer-ad',
        name: 'Footer Banner',
        size: '728x90',
        position: 'footer',
        metrics: { impressions: 0, clicks: 0, revenue: 0, ctr: 0, rpm: 0 },
        isHighRevenue: false
      }
    ];

    zones.forEach(zone => this.adZones.set(zone.id, zone));
  }

  trackImpression(adId: string): void {
    const zone = this.adZones.get(adId);
    if (zone) {
      zone.metrics.impressions++;
      this.updateMetrics(zone);
      console.log(`📊 Ad impression tracked: ${zone.name} - Total: ${zone.metrics.impressions}`);
    }
  }

  trackClick(adId: string): void {
    const zone = this.adZones.get(adId);
    if (zone) {
      zone.metrics.clicks++;
      zone.metrics.revenue += this.calculateRevenue(zone);
      this.updateMetrics(zone);
      console.log(`💰 Ad click tracked: ${zone.name} - Revenue: $${zone.metrics.revenue.toFixed(2)}`);
    }
  }

  private calculateRevenue(zone: AdZone): number {
    // Simulated revenue calculation based on ad zone performance
    const baseRevenue = {
      'mobile-ad': 0.15,
      'sidebar-ad': 0.25,
      'footer-ad': 0.35
    };
    
    return baseRevenue[zone.id as keyof typeof baseRevenue] || 0.10;
  }

  private updateMetrics(zone: AdZone): void {
    if (zone.metrics.impressions > 0) {
      zone.metrics.ctr = (zone.metrics.clicks / zone.metrics.impressions) * 100;
      zone.metrics.rpm = (zone.metrics.revenue / zone.metrics.impressions) * 1000;
      zone.isHighRevenue = zone.metrics.rpm > 2.0 || zone.metrics.ctr > 5.0;
    }
  }

  getAdZone(adId: string): AdZone | undefined {
    return this.adZones.get(adId);
  }

  getAllMetrics(): AdZone[] {
    return Array.from(this.adZones.values());
  }

  getHighRevenueZones(): AdZone[] {
    return Array.from(this.adZones.values()).filter(zone => zone.isHighRevenue);
  }
}

export const adRevenueSystem = AdRevenueSystem.getInstance();
