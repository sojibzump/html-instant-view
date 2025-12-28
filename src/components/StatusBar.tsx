import React from 'react';
import { 
  FileCode2, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Wifi, 
  WifiOff,
  Save,
  Terminal
} from 'lucide-react';

interface StatusBarProps {
  isDarkMode: boolean;
  charCount: number;
  lineCount: number;
  language: 'html' | 'xml';
  errorCount: number;
  warningCount: number;
  lastSaved: Date | null;
  isAutoSaveEnabled: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({
  isDarkMode,
  charCount,
  lineCount,
  language,
  errorCount,
  warningCount,
  lastSaved,
  isAutoSaveEnabled,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`flex items-center justify-between px-3 py-1.5 text-xs border-t transition-colors ${
      isDarkMode 
        ? 'bg-card border-border text-muted-foreground' 
        : 'bg-card border-border text-muted-foreground'
    }`}>
      {/* Left side - File info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5">
          <FileCode2 size={12} className="text-primary" />
          <span className="font-medium uppercase">{language}</span>
        </div>
        
        <div className="flex items-center space-x-1.5">
          <Terminal size={12} />
          <span>{lineCount} lines</span>
        </div>
        
        <div className="flex items-center space-x-1.5">
          <span>{charCount.toLocaleString()} chars</span>
        </div>
      </div>

      {/* Center - Status indicators */}
      <div className="flex items-center space-x-3">
        {errorCount > 0 && (
          <div className="flex items-center space-x-1 text-destructive">
            <AlertTriangle size={12} />
            <span>{errorCount} {errorCount === 1 ? 'error' : 'errors'}</span>
          </div>
        )}
        
        {warningCount > 0 && (
          <div className="flex items-center space-x-1 text-warning">
            <AlertTriangle size={12} />
            <span>{warningCount} {warningCount === 1 ? 'warning' : 'warnings'}</span>
          </div>
        )}
        
        {errorCount === 0 && warningCount === 0 && (
          <div className="flex items-center space-x-1 text-success">
            <CheckCircle2 size={12} />
            <span>No issues</span>
          </div>
        )}
      </div>

      {/* Right side - Save status */}
      <div className="flex items-center space-x-4">
        {isAutoSaveEnabled && (
          <div className="flex items-center space-x-1 text-success">
            <Wifi size={12} />
            <span>Auto-save on</span>
          </div>
        )}
        
        {lastSaved && (
          <div className="flex items-center space-x-1.5">
            <Save size={12} />
            <span>Saved {formatTime(lastSaved)}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-1.5">
          <Clock size={12} />
          <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
