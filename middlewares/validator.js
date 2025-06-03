const {body, validationResult} = require('express-validator');
const validator = {
    validateSignup: [
        body('first_name').notEmpty().withMessage('First name is required'),
        body('last_name').notEmpty().withMessage('Last name is required'),
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Invalid email address')
            .normalizeEmail(),
        body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
        body('confirmPassword').custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
    ],
    
    validateLogin: [
        body('username').notEmpty().withMessage('Username is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],

    handleValidationErrors: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
};

module.exports = validator;