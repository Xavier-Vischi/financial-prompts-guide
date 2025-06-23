// DOM Elements
const leadForm = document.getElementById('lead-form');
const successMessage = document.getElementById('success-message');
const submitButton = leadForm.querySelector('button[type="submit"]');
const buttonText = submitButton.querySelector('.btn-text');
const loadingSpinner = submitButton.querySelector('.loading-spinner');

// Form validation patterns
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializeSmoothScrolling();
    loadStoredEmails();
});

// Initialize form functionality
function initializeForm() {
    leadForm.addEventListener('submit', handleFormSubmit);
    
    // Add real-time validation
    const inputs = leadForm.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Email specific validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', validateEmail);
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Get form data
    const formData = new FormData(leadForm);
    const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        company: formData.get('company') || '',
        role: formData.get('role') || '',
        timestamp: new Date().toISOString()
    };
    
    try {
        // Simulate API call delay
        await simulateSubmission();
        
        // Store user data
        storeUserData(userData);
        
        // Show success message
        showSuccessMessage();
        
        // Track conversion (in a real app, you'd send this to analytics)
        trackConversion(userData);
        
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage('Something went wrong. Please try again.');
    } finally {
        setLoadingState(false);
    }
}

// Validate entire form
function validateForm() {
    let isValid = true;
    
    // Validate required fields
    const requiredFields = leadForm.querySelectorAll('input[required]');
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    // Validate email format
    const emailInput = document.getElementById('email');
    if (!validateEmail({ target: emailInput })) {
        isValid = false;
    }
    
    return isValid;
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (field.required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

// Validate email field
function validateEmail(e) {
    const emailField = e.target;
    const email = emailField.value.trim();
    
    if (!email) {
        if (emailField.required) {
            showFieldError(emailField, 'Email is required');
            return false;
        }
        return true;
    }
    
    if (!emailPattern.test(email)) {
        showFieldError(emailField, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(emailField);
    return true;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--color-error)';
    errorElement.style.fontSize = 'var(--font-size-xs)';
    errorElement.style.marginTop = 'var(--space-4)';
    
    field.parentNode.appendChild(errorElement);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Set loading state
function setLoadingState(isLoading) {
    if (isLoading) {
        submitButton.disabled = true;
        buttonText.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');
    } else {
        submitButton.disabled = false;
        buttonText.classList.remove('hidden');
        loadingSpinner.classList.add('hidden');
    }
}

// Simulate form submission
function simulateSubmission() {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(resolve, 1500);
    });
}

// Store user data in localStorage
function storeUserData(userData) {
    try {
        let storedEmails = JSON.parse(localStorage.getItem('financial-prompts-leads') || '[]');
        storedEmails.push(userData);
        localStorage.setItem('financial-prompts-leads', JSON.stringify(storedEmails));
    } catch (error) {
        console.error('Error storing user data:', error);
    }
}

// Load stored emails for demo purposes
function loadStoredEmails() {
    try {
        const storedEmails = JSON.parse(localStorage.getItem('financial-prompts-leads') || '[]');
        console.log(`Total leads collected: ${storedEmails.length}`);
    } catch (error) {
        console.error('Error loading stored emails:', error);
    }
}

// Show success message
function showSuccessMessage() {
    leadForm.style.display = 'none';
    successMessage.classList.remove('hidden');
    
    // Scroll to success message
    successMessage.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
    
    // Add celebration effect
    setTimeout(() => {
        successMessage.style.transform = 'scale(1.02)';
        setTimeout(() => {
            successMessage.style.transform = 'scale(1)';
        }, 200);
    }, 100);
}

// Show error message
function showErrorMessage(message) {
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: rgba(var(--color-error-rgb), 0.1);
        border: 2px solid var(--color-error);
        border-radius: var(--radius-base);
        padding: var(--space-16);
        margin-top: var(--space-16);
        text-align: center;
        color: var(--color-error);
        font-weight: var(--font-weight-medium);
    `;
    errorDiv.textContent = message;
    
    // Remove existing error messages
    const existingError = leadForm.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    leadForm.appendChild(errorDiv);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Track conversion
function trackConversion(userData) {
    // In a real application, you would send this data to your analytics service
    console.log('Conversion tracked:', {
        event: 'lead_generated',
        email: userData.email,
        company: userData.company,
        role: userData.role,
        timestamp: userData.timestamp
    });
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
    const ctaButtons = document.querySelectorAll('a[href="#email-form"]');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.getElementById('email-form');
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Focus on first input after scrolling
                setTimeout(() => {
                    const firstInput = targetElement.querySelector('input');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 800);
            }
        });
    });
}

// Add entrance animations when elements come into view
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.level, .benefit, .stat');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeScrollAnimations);

// Add form field focus effects
document.addEventListener('DOMContentLoaded', function() {
    const formControls = document.querySelectorAll('.form-control');
    
    formControls.forEach(control => {
        control.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        control.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// Add keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // Allow form submission with Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const form = document.activeElement.closest('form');
        if (form === leadForm) {
            handleFormSubmit(e);
        }
    }
});

// Export functions for testing (in a real app, you might not need this)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        validateForm,
        storeUserData,
        trackConversion
    };
}