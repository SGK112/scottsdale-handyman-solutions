import React from 'react'

// Performance optimization utilities

// Debounce function for search and form inputs
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  const ref = React.useRef(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [options])

  return { ref, isIntersecting }
}

// CSS-in-JS optimization for dynamic styles
export const memoizedStyles = React.memo(({ children, styles }) => {
  const styleElement = React.useMemo(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style')
      style.textContent = styles
      return style
    }
    return null
  }, [styles])

  React.useEffect(() => {
    if (styleElement) {
      document.head.appendChild(styleElement)
      return () => {
        if (document.head.contains(styleElement)) {
          document.head.removeChild(styleElement)
        }
      }
    }
  }, [styleElement])

  return children
})

// Optimized form validation
export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = React.useState(initialValues)
  const [errors, setErrors] = React.useState({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const validate = React.useCallback((fieldValues = values) => {
    const newErrors = {}
    
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field]
      const value = fieldValues[field]
      
      if (rule.required && !value) {
        newErrors[field] = `${field} is required`
      } else if (rule.pattern && value && !rule.pattern.test(value)) {
        newErrors[field] = rule.message || `${field} is invalid`
      } else if (rule.minLength && value && value.length < rule.minLength) {
        newErrors[field] = `${field} must be at least ${rule.minLength} characters`
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [values, validationRules])

  const handleInputChange = React.useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }, [errors])

  return {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
    validate,
    setValues
  }
}
