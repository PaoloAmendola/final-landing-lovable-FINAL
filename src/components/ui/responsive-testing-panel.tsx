import React, { useState, useEffect, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Wifi, 
  WifiOff, 
  Battery,
  Eye,
  Zap,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  X,
  BarChart3
} from 'lucide-react';
import { logger } from '@/utils/logger';

interface ResponsiveTestingPanelProps {
  enabled?: boolean;
  onClose?: () => void;
}

type DevicePreset = {
  name: string;
  width: number;
  height: number;
  icon: React.ElementType;
  category: 'mobile' | 'tablet' | 'desktop';
};

const devicePresets: DevicePreset[] = [
  // Mobile
  { name: 'iPhone SE', width: 375, height: 667, icon: Smartphone, category: 'mobile' },
  { name: 'iPhone 12', width: 390, height: 844, icon: Smartphone, category: 'mobile' },
  { name: 'Samsung S21', width: 384, height: 854, icon: Smartphone, category: 'mobile' },
  { name: 'Pixel 5', width: 393, height: 851, icon: Smartphone, category: 'mobile' },
  
  // Tablet
  { name: 'iPad', width: 768, height: 1024, icon: Tablet, category: 'tablet' },
  { name: 'iPad Pro', width: 1024, height: 1366, icon: Tablet, category: 'tablet' },
  { name: 'Surface Pro', width: 912, height: 1368, icon: Tablet, category: 'tablet' },
  
  // Desktop
  { name: 'Laptop', width: 1366, height: 768, icon: Monitor, category: 'desktop' },
  { name: 'Desktop', width: 1920, height: 1080, icon: Monitor, category: 'desktop' },
  { name: 'Wide', width: 2560, height: 1440, icon: Monitor, category: 'desktop' },
];

const ResponsiveTestingPanel = memo(({ enabled = false, onClose }: ResponsiveTestingPanelProps) => {
  const [currentDevice, setCurrentDevice] = useState<DevicePreset | null>(null);
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionSpeed, setConnectionSpeed] = useState<string>('');
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    // Network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Connection info
    const connection = (navigator as any).connection;
    if (connection) {
      setConnectionSpeed(connection.effectiveType);
      
      const handleConnectionChange = () => {
        setConnectionSpeed(connection.effectiveType);
      };
      
      connection.addEventListener('change', handleConnectionChange);
    }

    // Battery info
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        
        const handleBatteryChange = () => {
          setBatteryLevel(Math.round(battery.level * 100));
        };
        
        battery.addEventListener('levelchange', handleBatteryChange);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const applyDeviceSize = (device: DevicePreset) => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.style.width = `${device.width}px`;
      iframe.style.height = `${device.height}px`;
      iframe.style.transform = 'scale(0.8)';
      iframe.style.transformOrigin = 'top left';
      iframe.style.border = '2px solid #e2e8f0';
      iframe.style.borderRadius = '12px';
    }
    
    setCurrentDevice(device);
    
    logger.info('Device simulation applied', {
      device: device.name,
      dimensions: `${device.width}x${device.height}`,
      category: device.category
    });
  };

  const applyCustomSize = () => {
    const width = parseInt(customWidth);
    const height = parseInt(customHeight);
    
    if (width && height && width > 0 && height > 0) {
      const customDevice: DevicePreset = {
        name: `Custom ${width}x${height}`,
        width,
        height,
        icon: Monitor,
        category: width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'
      };
      
      applyDeviceSize(customDevice);
    }
  };

  const resetViewport = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.style.width = '100%';
      iframe.style.height = '100vh';
      iframe.style.transform = 'none';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '0';
    }
    
    setCurrentDevice(null);
    logger.info('Viewport reset to default');
  };

  if (!enabled) return null;

  return (
    <div className="fixed top-4 left-4 z-50 max-w-sm">
      <Card className="bg-background/95 backdrop-blur-sm border-primary/20 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Teste Responsivo
            </CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Current Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              {isOnline ? (
                <Wifi className="w-3 h-3 text-green-500" />
              ) : (
                <WifiOff className="w-3 h-3 text-red-500" />
              )}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
              {connectionSpeed && (
                <Badge variant="outline" className="text-xs h-4">
                  {connectionSpeed.toUpperCase()}
                </Badge>
              )}
            </div>
            
            {batteryLevel !== null && (
              <div className="flex items-center gap-2 text-xs">
                <Battery className="w-3 h-3" />
                <span>Bateria: {batteryLevel}%</span>
              </div>
            )}
            
            {currentDevice && (
              <div className="flex items-center gap-2 text-xs">
                <currentDevice.icon className="w-3 h-3 text-primary" />
                <span>{currentDevice.name}</span>
                <Badge variant="secondary" className="text-xs h-4">
                  {currentDevice.width}×{currentDevice.height}
                </Badge>
              </div>
            )}
          </div>

          <Separator />

          {/* Device Presets */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Dispositivos
            </h4>
            
            {/* Mobile */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Mobile</div>
              <div className="grid grid-cols-2 gap-1">
                {devicePresets.filter(d => d.category === 'mobile').map((device) => (
                  <Button
                    key={device.name}
                    onClick={() => applyDeviceSize(device)}
                    variant={currentDevice?.name === device.name ? "default" : "outline"}
                    size="sm"
                    className="text-xs h-8 justify-start gap-1"
                  >
                    <device.icon className="w-3 h-3" />
                    <span className="truncate">{device.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Tablet */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Tablet</div>
              <div className="grid grid-cols-1 gap-1">
                {devicePresets.filter(d => d.category === 'tablet').map((device) => (
                  <Button
                    key={device.name}
                    onClick={() => applyDeviceSize(device)}
                    variant={currentDevice?.name === device.name ? "default" : "outline"}
                    size="sm"
                    className="text-xs h-8 justify-start gap-1"
                  >
                    <device.icon className="w-3 h-3" />
                    <span>{device.name} ({device.width}×{device.height})</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Desktop */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Desktop</div>
              <div className="grid grid-cols-1 gap-1">
                {devicePresets.filter(d => d.category === 'desktop').map((device) => (
                  <Button
                    key={device.name}
                    onClick={() => applyDeviceSize(device)}
                    variant={currentDevice?.name === device.name ? "default" : "outline"}
                    size="sm"
                    className="text-xs h-8 justify-start gap-1"
                  >
                    <device.icon className="w-3 h-3" />
                    <span>{device.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Custom Size */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Tamanho Personalizado
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Largura"
                value={customWidth}
                onChange={(e) => setCustomWidth(e.target.value)}
                className="px-2 py-1 text-xs border border-border rounded bg-background"
              />
              <input
                type="number"
                placeholder="Altura"
                value={customHeight}
                onChange={(e) => setCustomHeight(e.target.value)}
                className="px-2 py-1 text-xs border border-border rounded bg-background"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-1">
              <Button
                onClick={applyCustomSize}
                variant="outline"
                size="sm"
                className="text-xs h-7"
              >
                Aplicar
              </Button>
              <Button
                onClick={resetViewport}
                variant="outline"
                size="sm"
                className="text-xs h-7"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Ações Rápidas
            </h4>
            
            <div className="grid grid-cols-2 gap-1">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                className="text-xs h-7"
              >
                Recarregar
              </Button>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
                variant="outline"
                size="sm"
                className="text-xs h-7"
              >
                Copiar URL
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

ResponsiveTestingPanel.displayName = 'ResponsiveTestingPanel';

export { ResponsiveTestingPanel };