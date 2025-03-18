const { logger } = require('./logger');

const validateEmail = (email) => {
  try {
    if (!email) {
      logger.warn('Email validation failed: Email is empty');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    if (!isValid) {
      logger.warn(`Email validation failed for: ${email}`);
    }
    return isValid;
  } catch (error) {
    logger.error('Error in email validation:', error);
    return false;
  }
};

const validatePassword = (password) => {
  try {
    if (!password) {
      logger.warn('Password validation failed: Password is empty');
      return false;
    }
    
    const requirements = {
      minLength: 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const { minLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar } = requirements;
    
    const isValid = password.length >= minLength && 
                    hasUpperCase && 
                    hasLowerCase && 
                    hasNumber && 
                    hasSpecialChar;

    if (!isValid) {
      logger.warn('Password validation failed:', {
        length: password.length >= minLength ? 'valid' : 'invalid',
        uppercase: hasUpperCase ? 'present' : 'missing',
        lowercase: hasLowerCase ? 'present' : 'missing',
        number: hasNumber ? 'present' : 'missing',
        specialChar: hasSpecialChar ? 'present' : 'missing'
      });
    }

    return isValid;
  } catch (error) {
    logger.error('Error in password validation:', error);
    return false;
  }
};

const validateProductData = (data) => {
  try {
    const errors = [];
    const validationRules = {
      name: {
        minLength: 3,
        maxLength: 100,
        required: true
      },
      price: {
        min: 0,
        required: true
      },
      description: {
        minLength: 10,
        maxLength: 1000,
        required: true
      },
      category: {
        required: true,
        allowedValues: ['electronics', 'clothing', 'books', 'home', 'other']
      },
      stock: {
        min: 0,
        required: true
      }
    };

    // Validate name
    if (!data.name) {
      errors.push('Product name is required');
    } else if (data.name.trim().length < validationRules.name.minLength) {
      errors.push(`Product name must be at least ${validationRules.name.minLength} characters long`);
    } else if (data.name.trim().length > validationRules.name.maxLength) {
      errors.push(`Product name cannot exceed ${validationRules.name.maxLength} characters`);
    }

    // Validate price
    if (!data.price) {
      errors.push('Product price is required');
    } else if (isNaN(data.price) || data.price < validationRules.price.min) {
      errors.push('Product price must be a positive number');
    }

    // Validate description
    if (!data.description) {
      errors.push('Product description is required');
    } else if (data.description.trim().length < validationRules.description.minLength) {
      errors.push(`Product description must be at least ${validationRules.description.minLength} characters long`);
    } else if (data.description.trim().length > validationRules.description.maxLength) {
      errors.push(`Product description cannot exceed ${validationRules.description.maxLength} characters`);
    }

    // Validate category
    if (!data.category) {
      errors.push('Product category is required');
    } else if (!validationRules.category.allowedValues.includes(data.category.toLowerCase())) {
      errors.push(`Invalid category. Allowed values are: ${validationRules.category.allowedValues.join(', ')}`);
    }

    // Validate stock
    if (data.stock === undefined) {
      errors.push('Product stock is required');
    } else if (isNaN(data.stock) || data.stock < validationRules.stock.min) {
      errors.push('Product stock must be a non-negative number');
    }

    const result = {
      isValid: errors.length === 0,
      errors
    };

    if (!result.isValid) {
      logger.warn('Product validation failed:', { errors });
    }

    return result;
  } catch (error) {
    logger.error('Error in product validation:', error);
    return {
      isValid: false,
      errors: ['Internal validation error occurred']
    };
  }
};

// Validate user data
const validateUserData = (data) => {
  try {
    const errors = [];
    
    // Validate name
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Validate email
    if (!validateEmail(data.email)) {
      errors.push('Invalid email address');
    }

    // Validate password
    if (!validatePassword(data.password)) {
      errors.push('Password does not meet security requirements');
    }

    const result = {
      isValid: errors.length === 0,
      errors
    };

    if (!result.isValid) {
      logger.warn('User validation failed:', { errors });
    }

    return result;
  } catch (error) {
    logger.error('Error in user validation:', error);
    return {
      isValid: false,
      errors: ['Internal validation error occurred']
    };
  }
};

module.exports = {
  validateEmail,
  validatePassword,
  validateProductData,
  validateUserData
}; 