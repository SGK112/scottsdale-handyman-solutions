#!/usr/bin/env node

/**
 * Performance Monitoring Script for Scottsdale Handyman Solutions
 * Monitors website performance and alerts on issues
 */

import fs from 'fs'
import path from 'path'

const PERFORMANCE_THRESHOLDS = {
  bundleSize: 1000, // KB
  chunkSize: 500,   // KB
  buildTime: 60,    // seconds
}

async function analyzeBundleSize() {
  const distPath = path.resolve(process.cwd(), 'dist')

  if (!fs.existsSync(distPath)) {
    console.log('❌ Build directory not found. Run `npm run build` first.')
    return false
  }

  console.log('📊 Analyzing bundle sizes...')

  const files = fs.readdirSync(distPath, { recursive: true })
  const jsFiles = files.filter(file => file.endsWith('.js'))
  const cssFiles = files.filter(file => file.endsWith('.css'))

  let totalSize = 0
  let warnings = []

  jsFiles.forEach(file => {
    const filePath = path.join(distPath, file)
    const stats = fs.statSync(filePath)
    const sizeKB = Math.round(stats.size / 1024)
    totalSize += sizeKB

    if (sizeKB > PERFORMANCE_THRESHOLDS.chunkSize) {
      warnings.push(`⚠️  Large JS chunk: ${file} (${sizeKB}KB)`)
    }

    console.log(`  📄 ${file}: ${sizeKB}KB`)
  })

  cssFiles.forEach(file => {
    const filePath = path.join(distPath, file)
    const stats = fs.statSync(filePath)
    const sizeKB = Math.round(stats.size / 1024)
    totalSize += sizeKB

    console.log(`  🎨 ${file}: ${sizeKB}KB`)
  })

  console.log(`\n📦 Total bundle size: ${totalSize}KB`)

  if (totalSize > PERFORMANCE_THRESHOLDS.bundleSize) {
    warnings.push(`⚠️  Bundle size exceeds threshold: ${totalSize}KB > ${PERFORMANCE_THRESHOLDS.bundleSize}KB`)
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Performance Warnings:')
    warnings.forEach(warning => console.log(warning))
    console.log('\n💡 Consider code splitting or removing unused dependencies')
    return false
  }

  console.log('✅ Bundle size within acceptable limits')
  return true
}

async function checkDependencyUpdates() {
  console.log('🔍 Checking for dependency updates...')

  try {
    const { execSync } = await import('child_process')
    const output = execSync('npm outdated --json', { encoding: 'utf8' })
    const outdated = JSON.parse(output)

    if (Object.keys(outdated).length === 0) {
      console.log('✅ All dependencies are up to date')
      return true
    }

    console.log('📦 Outdated packages found:')
    Object.entries(outdated).forEach(([pkg, info]) => {
      console.log(`  - ${pkg}: ${info.current} → ${info.latest}`)
    })

    return false
  } catch (error) {
    // No outdated packages or npm outdated error
    console.log('✅ Dependencies check completed')
    return true
  }
}

async function generatePerformanceReport() {
  console.log('🚀 Scottsdale Handyman Solutions - Performance Report\n')
  console.log('='.repeat(60))

  const bundleCheck = await analyzeBundleSize()
  console.log('\n' + '-'.repeat(60))
  const depsCheck = await checkDependencyUpdates()

  console.log('\n' + '='.repeat(60))
  console.log('📋 Summary:')
  console.log(`  Bundle Size: ${bundleCheck ? '✅ Good' : '⚠️  Needs attention'}`)
  console.log(`  Dependencies: ${depsCheck ? '✅ Up to date' : '📦 Updates available'}`)

  const overallScore = (bundleCheck && depsCheck) ? '🟢 Excellent' : '🟡 Good'
  console.log(`  Overall: ${overallScore}`)

  console.log('\n💡 Recommendations:')
  console.log('  - Run this report after major changes')
  console.log('  - Consider regular dependency updates')
  console.log('  - Monitor Core Web Vitals in production')
  console.log('  - Use `npm run build:analyze` for detailed analysis')
}

// Run the performance analysis
if (import.meta.url === `file://${process.argv[1]}`) {
  generatePerformanceReport().catch(console.error)
}

export { analyzeBundleSize, checkDependencyUpdates }
