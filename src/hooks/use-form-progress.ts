import { useState, useCallback, useMemo } from 'react';

interface FormField {
  name: string;
  required: boolean;
  validator?: (value: any) => boolean;
}

interface UseFormProgressConfig {
  fields: FormField[];
  values: Record<string, any>;
}

const useFormProgress = ({ fields, values }: UseFormProgressConfig) => {
  const [visitedFields, setVisitedFields] = useState<Set<string>>(new Set());

  const markFieldVisited = useCallback((fieldName: string) => {
    setVisitedFields(prev => new Set([...prev, fieldName]));
  }, []);

  const progress = useMemo(() => {
    const totalFields = fields.length;
    let completedFields = 0;
    let validFields = 0;

    fields.forEach(field => {
      const value = values[field.name];
      const hasValue = value !== undefined && value !== null && value !== '';
      const isValid = field.validator ? field.validator(value) : hasValue;

      if (hasValue) {
        completedFields++;
      }

      if (isValid) {
        validFields++;
      }
    });

    const completionPercentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
    const validationPercentage = totalFields > 0 ? Math.round((validFields / totalFields) * 100) : 0;

    return {
      totalFields,
      completedFields,
      validFields,
      completionPercentage,
      validationPercentage,
      isComplete: completedFields === totalFields,
      isValid: validFields === totalFields
    };
  }, [fields, values]);

  const getFieldStatus = useCallback((fieldName: string) => {
    const field = fields.find(f => f.name === fieldName);
    if (!field) return 'unknown';

    const value = values[fieldName];
    const hasValue = value !== undefined && value !== null && value !== '';
    const isValid = field.validator ? field.validator(value) : hasValue;
    const isVisited = visitedFields.has(fieldName);

    if (!isVisited) return 'untouched';
    if (!hasValue) return 'empty';
    if (!isValid) return 'invalid';
    return 'valid';
  }, [fields, values, visitedFields]);

  return {
    progress,
    markFieldVisited,
    getFieldStatus
  };
};

export { useFormProgress };
export type { FormField };