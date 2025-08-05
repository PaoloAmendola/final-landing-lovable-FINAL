import React, { memo, useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface NetworkConnection extends EventTarget {
  readonly effectiveType: string;
  readonly downlink: number;
  readonly rtt: number;
  readonly saveData: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkConnection;
  mozConnection?: NetworkConnection;
  webkitConnection?: NetworkConnection;
}

interface NetworkStatusProps {
  showToasts?: boolean;
  showIndicator?: boolean;
  onStatusChange?: (status: {
    isOnline: boolean;
    connectionType?: string;
    speed?: string;
  }) => void;
}

const NetworkStatus = memo(({
  showToasts = true,
  showIndicator = true,
  onStatusChange
}: NetworkStatusProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionInfo, setConnectionInfo] = useState<{
    type?: string;
    speed?: string;
    quality?: 'slow' | 'medium' | 'fast';
  }>({});

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);

      if (showToasts) {
        if (online) {
          toast.success('Conexão restaurada', {
            description: 'Você está online novamente',
            duration: 3000,
          });
        } else {
          toast.error('Sem conexão', {
            description: 'Verifique sua internet',
            duration: 5000,
          });
        }
      }

      onStatusChange?.({
        isOnline: online,
        connectionType: connectionInfo.type,
        speed: connectionInfo.speed
      });
    };

    const updateConnectionInfo = () => {
      const nav = navigator as NavigatorWithConnection;
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

      if (connection) {
        const info = {
          type: connection.effectiveType,
          speed: `${connection.downlink} Mbps`,
          quality: getQualityFromSpeed(connection.downlink) as 'slow' | 'medium' | 'fast'
        };

        setConnectionInfo(info);

        // Warn about slow connections
        if (info.quality === 'slow' && showToasts) {
          toast.warning('Conexão lenta detectada', {
            description: 'Alguns recursos podem carregar mais devagar',
            duration: 4000,
          });
        }
      }
    };

    const getQualityFromSpeed = (downlink: number): string => {
      if (downlink < 1) return 'slow';
      if (downlink < 5) return 'medium';
      return 'fast';
    };

    // Event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Connection info listeners
    const nav = navigator as NavigatorWithConnection;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    
    if (connection) {
      connection.addEventListener('change', updateConnectionInfo);
      updateConnectionInfo(); // Initial check
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      
      if (connection) {
        connection.removeEventListener('change', updateConnectionInfo);
      }
    };
  }, [showToasts, onStatusChange, connectionInfo.type, connectionInfo.speed]);

  if (!showIndicator) return null;

  const getIcon = () => {
    if (!isOnline) {
      return <WifiOff className="w-4 h-4 text-red-500" aria-hidden="true" />;
    }
    
    if (connectionInfo.quality === 'slow') {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" aria-hidden="true" />;
    }
    
    return <Wifi className="w-4 h-4 text-green-500" aria-hidden="true" />;
  };

  const getStatus = () => {
    if (!isOnline) return 'Offline';
    if (connectionInfo.quality === 'slow') return 'Conexão lenta';
    return 'Online';
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      {getIcon()}
      <span className={`${
        !isOnline ? 'text-red-500' : 
        connectionInfo.quality === 'slow' ? 'text-yellow-500' : 
        'text-green-500'
      }`}>
        {getStatus()}
      </span>
      {connectionInfo.type && (
        <span className="text-muted-foreground">
          ({connectionInfo.type})
        </span>
      )}
    </div>
  );
});

NetworkStatus.displayName = 'NetworkStatus';

export { NetworkStatus };