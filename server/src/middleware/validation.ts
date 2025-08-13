import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name is required'),
  body('university')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('University name cannot be empty'),
  body('role')
    .optional()
    .isIn(['student', 'faculty'])
    .withMessage('Role must be either student or faculty'),
  handleValidationErrors
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required'),
  handleValidationErrors
];

// Problem validation rules
export const validateProblem = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('excerpt')
    .trim()
    .isLength({ min: 10, max: 300 })
    .withMessage('Excerpt must be between 10 and 300 characters'),
  body('description')
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage('Description must be between 50 and 5000 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),
  body('background')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Background must not exceed 2000 characters'),
  body('scalability')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Scalability must not exceed 1000 characters'),
  body('marketSize')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Market size must not exceed 500 characters'),
  body('competitors')
    .optional()
    .isArray()
    .withMessage('Competitors must be an array'),
  body('currentGaps')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Current gaps must not exceed 2000 characters'),
  handleValidationErrors
];

// Idea validation rules
export const validateIdea = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage('Description must be between 50 and 5000 characters'),
  body('problemId')
    .isMongoId()
    .withMessage('Valid problem ID is required'),
  body('stage')
    .isInt({ min: 1, max: 9 })
    .withMessage('Stage must be between 1 and 9'),
  body('team')
    .isArray({ min: 1 })
    .withMessage('At least one team member is required'),
  body('team.*.name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Team member name is required'),
  body('team.*.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid team member email is required'),
  body('team.*.role')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Team member role is required'),
  body('contact')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid contact email is required'),
  body('mentor')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Mentor name cannot be empty'),
  handleValidationErrors
];

// Startup validation rules
export const validateStartup = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Startup name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage('Description must be between 50 and 5000 characters'),
  body('stage')
    .isInt({ min: 1, max: 9 })
    .withMessage('Stage must be between 1 and 9'),
  body('fundingStatus')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Funding status is required'),
  body('businessModel')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Business model must be between 10 and 2000 characters'),
  body('targetMarket')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Target market must be between 10 and 1000 characters'),
  body('competitiveAdvantage')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Competitive advantage must be between 10 and 1000 characters'),
  body('team')
    .isArray({ min: 1 })
    .withMessage('At least one team member is required'),
  body('team.*.name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Team member name is required'),
  body('team.*.role')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Team member role is required'),
  body('industry')
    .optional()
    .isArray()
    .withMessage('Industry must be an array'),
  handleValidationErrors
];

// Comment validation rules
export const validateComment = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Comment must be between 1 and 2000 characters'),
  body('targetType')
    .isIn(['Problem', 'Idea', 'Startup'])
    .withMessage('Target type must be Problem, Idea, or Startup'),
  body('targetId')
    .isMongoId()
    .withMessage('Valid target ID is required'),
  body('parentComment')
    .optional()
    .isMongoId()
    .withMessage('Valid parent comment ID is required'),
  handleValidationErrors
];

// MongoDB ObjectId validation
export const validateObjectId = (field: string = 'id') => [
  param(field)
    .isMongoId()
    .withMessage(`Valid ${field} is required`),
  handleValidationErrors
];

// Pagination validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isIn(['newest', 'oldest', 'popular', 'trending'])
    .withMessage('Sort must be newest, oldest, popular, or trending'),
  handleValidationErrors
];