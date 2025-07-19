import React from 'react'

export const Badge = ({ className = '', variant = 'default', ...props }) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
  
  const variants = {
    default: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    destructive: 'bg-red-100 text-red-800 hover:bg-red-200',
    outline: 'text-gray-600 border border-gray-300',
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${className}`
  
  return (
    <div className={classes} {...props} />
  )
}
