import { ApiErrorDetails } from "./errorHandling";

// Generic validation interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  fieldErrors?: Record<string, string[]>;
}

// Base validation rules
export const ValidationRules = {
  required: (value: any, fieldName = 'Field'): string | null => {
    if (value === null || value === undefined || value === '') {
      return `${fieldName} is required`;
    }
    return null;
  },

  minLength: (value: string, min: number, fieldName = 'Field'): string | null => {
    if (value && value.length < min) {
      return `${fieldName} must be at least ${min} characters long`;
    }
    return null;
  },

  maxLength: (value: string, max: number, fieldName = 'Field'): string | null => {
    if (value && value.length > max) {
      return `${fieldName} must not exceed ${max} characters`;
    }
    return null;
  },

  email: (value: string, fieldName = 'Email'): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return `${fieldName} must be a valid email address`;
    }
    return null;
  },

  password: (value: string): string | null => {
    const errors: string[] = [];
    
    if (value && value.length < 8) {
      errors.push('at least 8 characters long');
    }
    
    if (value && !/[A-Z]/.test(value)) {
      errors.push('at least one uppercase letter');
    }
    
    if (value && !/[a-z]/.test(value)) {
      errors.push('at least one lowercase letter');
    }
    
    if (value && !/\d/.test(value)) {
      errors.push('at least one number');
    }
    
    if (value && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors.push('at least one special character');
    }
    
    return errors.length > 0 ? `Password must contain ${errors.join(', ')}` : null;
  },

  phone: (value: string, fieldName = 'Phone number'): string | null => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (value && !phoneRegex.test(value)) {
      return `${fieldName} must be a valid phone number`;
    }
    return null;
  },

  url: (value: string, fieldName = 'URL'): string | null => {
    try {
      if (value) {
        new URL(value);
        return null;
      }
    } catch {
      return `${fieldName} must be a valid URL`;
    }
    return null;
  },

  date: (value: string, fieldName = 'Date'): string | null => {
    if (value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return `${fieldName} must be a valid date`;
      }
    }
    return null;
  },

  futureDate: (value: string, fieldName = 'Date'): string | null => {
    if (value) {
      const date = new Date(value);
      const now = new Date();
      if (date <= now) {
        return `${fieldName} must be in the future`;
      }
    }
    return null;
  },

  pastDate: (value: string, fieldName = 'Date'): string | null => {
    if (value) {
      const date = new Date(value);
      const now = new Date();
      if (date >= now) {
        return `${fieldName} must be in the past`;
      }
    }
    return null;
  },

  number: (value: any, fieldName = 'Field'): string | null => {
    if (value !== null && value !== undefined && isNaN(Number(value))) {
      return `${fieldName} must be a valid number`;
    }
    return null;
  },

  min: (value: number, min: number, fieldName = 'Field'): string | null => {
    if (value !== null && value !== undefined && value < min) {
      return `${fieldName} must be at least ${min}`;
    }
    return null;
  },

  max: (value: number, max: number, fieldName = 'Field'): string | null => {
    if (value !== null && value !== undefined && value > max) {
      return `${fieldName} must not exceed ${max}`;
    }
    return null;
  },

  range: (value: number, min: number, max: number, fieldName = 'Field'): string | null => {
    if (value !== null && value !== undefined && (value < min || value > max)) {
      return `${fieldName} must be between ${min} and ${max}`;
    }
    return null;
  },

  array: (value: any, fieldName = 'Field'): string | null => {
    if (value !== null && value !== undefined && !Array.isArray(value)) {
      return `${fieldName} must be an array`;
    }
    return null;
  },

  object: (value: any, fieldName = 'Field'): string | null => {
    if (value !== null && value !== undefined && (typeof value !== 'object' || Array.isArray(value))) {
      return `${fieldName} must be an object`;
    }
    return null;
  },

  oneOf: (value: any, allowedValues: any[], fieldName = 'Field'): string | null => {
    if (value !== null && value !== undefined && !allowedValues.includes(value)) {
      return `${fieldName} must be one of: ${allowedValues.join(', ')}`;
    }
    return null;
  },

  pattern: (value: string, pattern: RegExp, errorMessage?: string, fieldName = 'Field'): string | null => {
    if (value && !pattern.test(value)) {
      return errorMessage || `${fieldName} format is invalid`;
    }
    return null;
  },

  fileSize: (file: File, maxSizeMB: number, fieldName = 'File'): string | null => {
    if (file && file.size > maxSizeMB * 1024 * 1024) {
      return `${fieldName} must not exceed ${maxSizeMB}MB`;
    }
    return null;
  },

  fileType: (file: File, allowedTypes: string[], fieldName = 'File'): string | null => {
    if (file && !allowedTypes.includes(file.type)) {
      return `${fieldName} must be one of: ${allowedTypes.join(', ')}`;
    }
    return null;
  },
};

// Specific validators for different entities
export const UserValidators = {
  register: (data: any): ValidationResult => {
    const errors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    // Name validation
    const nameError = ValidationRules.required(data.name, 'Name');
    if (nameError) {
      errors.push(nameError);
      fieldErrors.name = [nameError];
    } else {
      const nameLengthError = ValidationRules.maxLength(data.name, 100, 'Name');
      if (nameLengthError) {
        errors.push(nameLengthError);
        fieldErrors.name = fieldErrors.name || [];
        fieldErrors.name.push(nameLengthError);
      }
    }

    // Email validation
    const emailError = ValidationRules.email(data.email);
    if (emailError) {
      errors.push(emailError);
      fieldErrors.email = [emailError];
    }

    // Password validation
    const passwordError = ValidationRules.password(data.password);
    if (passwordError) {
      errors.push(passwordError);
      fieldErrors.password = [passwordError];
    }

    // Confirm password validation
    if (data.password !== data.confirmPassword) {
      const confirmError = 'Passwords do not match';
      errors.push(confirmError);
      fieldErrors.confirmPassword = [confirmError];
    }

    // Role validation
    const roleError = ValidationRules.oneOf(data.role, ['student', 'mentor', 'admin'], 'Role');
    if (roleError) {
      errors.push(roleError);
      fieldErrors.role = [roleError];
    }

    // Country validation
    const countryError = ValidationRules.required(data.country, 'Country');
    if (countryError) {
      errors.push(countryError);
      fieldErrors.country = [countryError];
    }

    return {
      isValid: errors.length === 0,
      errors,
      fieldErrors,
    };
  },

  login: (data: any): ValidationResult => {
    const errors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    const emailError = ValidationRules.required(data.email, 'Email') || 
                     ValidationRules.email(data.email);
    if (emailError) {
      errors.push(emailError);
      fieldErrors.email = [emailError];
    }

    const passwordError = ValidationRules.required(data.password, 'Password');
    if (passwordError) {
      errors.push(passwordError);
      fieldErrors.password = [passwordError];
    }

    return {
      isValid: errors.length === 0,
      errors,
      fieldErrors,
    };
  },

  profile: (data: any): ValidationResult => {
    const errors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    // Optional fields with validation
    if (data.name) {
      const nameError = ValidationRules.maxLength(data.name, 100, 'Name');
      if (nameError) {
        errors.push(nameError);
        fieldErrors.name = [nameError];
      }
    }

    if (data.email) {
      const emailError = ValidationRules.email(data.email);
      if (emailError) {
        errors.push(emailError);
        fieldErrors.email = [emailError];
      }
    }

    if (data.phoneNumber) {
      const phoneError = ValidationRules.phone(data.phoneNumber);
      if (phoneError) {
        errors.push(phoneError);
        fieldErrors.phoneNumber = [phoneError];
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      fieldErrors,
    };
  },
};

export const MentorValidators = {
  create: (data: any): ValidationResult => {
    const errors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    // Name validation
    const nameError = ValidationRules.required(data.name, 'Name');
    if (nameError) {
      errors.push(nameError);
      fieldErrors.name = [nameError];
    }

    // Expertise validation
    let expertiseError: string | null = null;
    if (Array.isArray(data.expertise)) {
      if (data.expertise.length === 0) {
        expertiseError = 'At least one expertise area is required';
      }
    } else if (typeof data.expertise === 'string') {
      expertiseError = ValidationRules.required(data.expertise, 'Expertise');
    }

    if (expertiseError) {
      errors.push(expertiseError);
      fieldErrors.expertise = [expertiseError];
    }

    // Optional validations
    if (data.yearsOfExperience) {
      const experienceError = ValidationRules.min(data.yearsOfExperience, 0, 'Years of experience');
      if (experienceError) {
        errors.push(experienceError);
        fieldErrors.yearsOfExperience = [experienceError];
      }
    }

    if (data.linkedin) {
      const linkedinError = ValidationRules.url(data.linkedin, 'LinkedIn URL');
      if (linkedinError) {
        errors.push(linkedinError);
        fieldErrors.linkedin = [linkedinError];
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      fieldErrors,
    };
  },
};

export const OrganizationValidators = {
  create: (data: any): ValidationResult => {
    const errors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    // Name validation
    const nameError = ValidationRules.required(data.name, 'Organization name');
    if (nameError) {
      errors.push(nameError);
      fieldErrors.name = [nameError];
    }

    // Email validation
    const emailError = ValidationRules.email(data.email);
    if (emailError) {
      errors.push(emailError);
      fieldErrors.email = [emailError];
    }

    // Industry validation
    const industryError = ValidationRules.required(data.industry, 'Industry');
    if (industryError) {
      errors.push(industryError);
      fieldErrors.industry = [industryError];
    }

    return {
      isValid: errors.length === 0,
      errors,
      fieldErrors,
    };
  },
};

export const EventValidators = {
  create: (data: any): ValidationResult => {
    const errors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    // Required fields
    const titleError = ValidationRules.required(data.title, 'Event title');
    if (titleError) {
      errors.push(titleError);
      fieldErrors.title = [titleError];
    }

    const descriptionError = ValidationRules.required(data.description, 'Description');
    if (descriptionError) {
      errors.push(descriptionError);
      fieldErrors.description = [descriptionError];
    }

    const typeError = ValidationRules.oneOf(data.type, ['workshop', 'webinar', 'meetup', 'competition', 'conference'], 'Event type');
    if (typeError) {
      errors.push(typeError);
      fieldErrors.type = [typeError];
    }

    // Date validations
    const startDateError = ValidationRules.required(data.startDate, 'Start date') || 
                           ValidationRules.date(data.startDate, 'Start date');
    if (startDateError) {
      errors.push(startDateError);
      fieldErrors.startDate = [startDateError];
    }

    const endDateError = ValidationRules.required(data.endDate, 'End date') || 
                         ValidationRules.date(data.endDate, 'End date');
    if (endDateError) {
      errors.push(endDateError);
      fieldErrors.endDate = [endDateError];
    }

    // Check if end date is after start date
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (end <= start) {
        const dateError = 'End date must be after start date';
        errors.push(dateError);
        fieldErrors.endDate = fieldErrors.endDate || [];
        fieldErrors.endDate.push(dateError);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      fieldErrors,
    };
  },
};

// Utility function to validate API responses
export const validateApiResponse = (response: any, expectedFields: string[]): ValidationResult => {
  const errors: string[] = [];
  
  if (!response) {
    errors.push('No response received');
    return { isValid: false, errors };
  }

  if (!response.success) {
    errors.push(response.message || 'Request failed');
  }

  expectedFields.forEach(field => {
    if (!response.data || response.data[field] === undefined) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};
