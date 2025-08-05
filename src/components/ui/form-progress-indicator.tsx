import React, { memo } from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface FormProgressIndicatorProps {
  progress: {
    totalFields: number;
    completedFields: number;
    validFields: number;
    completionPercentage: number;
    validationPercentage: number;
    isComplete: boolean;
    isValid: boolean;
  };
  showDetails?: boolean;
  variant?: 'compact' | 'detailed';
  className?: string;
}

const FormProgressIndicator = memo(({
  progress,
  showDetails = false,
  variant = 'compact',
  className = ''
}: FormProgressIndicatorProps) => {
  const getStatusIcon = () => {
    if (progress.isValid) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" aria-hidden="true" />;
    }
    if (progress.completedFields > 0) {
      return <AlertCircle className="w-5 h-5 text-yellow-500" aria-hidden="true" />;
    }
    return <Circle className="w-5 h-5 text-muted-foreground" aria-hidden="true" />;
  };

  const getStatusMessage = () => {
    if (progress.isValid) {
      return 'Formulário completo e válido';
    }
    if (progress.isComplete) {
      return 'Formulário completo - verificando validação';
    }
    if (progress.completedFields > 0) {
      return `${progress.completedFields} de ${progress.totalFields} campos preenchidos`;
    }
    return 'Comece preenchendo os campos';
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {getStatusIcon()}
        <div className="flex-1">
          <Progress 
            value={progress.validationPercentage} 
            className="h-2"
            aria-label={`Progresso do formulário: ${progress.validationPercentage}%`}
          />
        </div>
        <span className="text-sm text-muted-foreground min-w-[3rem]">
          {progress.validationPercentage}%
        </span>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-foreground">
            {getStatusMessage()}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {progress.validationPercentage}%
        </span>
      </div>
      
      <Progress 
        value={progress.validationPercentage} 
        className="h-3"
        aria-label={`Progresso do formulário: ${progress.validationPercentage}%`}
      />
      
      {showDetails && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Preenchidos: {progress.completedFields}/{progress.totalFields}</span>
          <span>Válidos: {progress.validFields}/{progress.totalFields}</span>
        </div>
      )}
    </div>
  );
});

FormProgressIndicator.displayName = 'FormProgressIndicator';

export { FormProgressIndicator };