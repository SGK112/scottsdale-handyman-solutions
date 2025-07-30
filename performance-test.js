#!/usr/bin/env node

import puppeteer from 'puppeteer';
import chalk from 'chalk';

async function testWebsitePerformance() {
    console.log(chalk.blue('🚀 Starting Website Performance Test\n'));
    
    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Test configurations
    const tests = [
        {
            name: 'Desktop',
            viewport: { width: 1920, height: 1080 },
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        {
            name: 'Mobile',
            viewport: { width: 375, height: 667 },
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        },
        {
            name: 'Tablet',
            viewport: { width: 768, height: 1024 },
            userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        }
    ];

    const urls = [
        'http://localhost:5177',
        'http://localhost:5174'
    ];

    for (const url of urls) {
        console.log(chalk.yellow(`Testing ${url}:`));
        
        for (const test of tests) {
            const page = await browser.newPage();
            
            // Set device parameters
            await page.setViewport(test.viewport);
            await page.setUserAgent(test.userAgent);
            
            // Enable request interception to measure resource loading
            await page.setRequestInterception(true);
            
            const resources = [];
            let totalSize = 0;
            
            page.on('request', (request) => {
                request.continue();
            });
            
            page.on('response', (response) => {
                const url = response.url();
                const status = response.status();
                const headers = response.headers();
                const contentLength = parseInt(headers['content-length'] || '0');
                
                totalSize += contentLength;
                resources.push({
                    url: url.replace('http://localhost:5177', '').replace('http://localhost:5174', '') || '/',
                    status,
                    size: contentLength,
                    type: response.request().resourceType()
                });
            });

            try {
                const startTime = Date.now();
                
                // Navigate to page and wait for load
                await page.goto(url, { 
                    waitUntil: 'networkidle2',
                    timeout: 30000 
                });
                
                const loadTime = Date.now() - startTime;
                
                // Get performance metrics
                const performanceMetrics = await page.evaluate(() => {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    return {
                        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                        totalTime: navigation.loadEventEnd - navigation.navigationStart,
                        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
                        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
                    };
                });

                // Test contractor signup functionality
                let contractorSignupTest = 'Not tested';
                if (url.includes('5177')) {
                    try {
                        await page.waitForSelector('button[aria-label="Open Contractor Application"]', { timeout: 3000 });
                        contractorSignupTest = '✅ Available';
                    } catch (e) {
                        contractorSignupTest = '❌ Not found';
                    }
                }

                // Test pro portal functionality
                let proPortalTest = 'Not tested';
                if (url.includes('5174')) {
                    try {
                        await page.waitForSelector('.pro-portal', { timeout: 3000 });
                        proPortalTest = '✅ Loading';
                    } catch (e) {
                        proPortalTest = '❌ Error';
                    }
                }

                // Display results
                console.log(chalk.green(`  ${test.name} (${test.viewport.width}x${test.viewport.height}):`));
                console.log(`    Load Time: ${loadTime}ms`);
                console.log(`    DOM Content Loaded: ${Math.round(performanceMetrics.domContentLoaded)}ms`);
                console.log(`    First Paint: ${Math.round(performanceMetrics.firstPaint)}ms`);
                console.log(`    First Contentful Paint: ${Math.round(performanceMetrics.firstContentfulPaint)}ms`);
                console.log(`    Total Size: ${(totalSize / 1024).toFixed(2)} KB`);
                console.log(`    Resources Loaded: ${resources.length}`);
                
                if (contractorSignupTest !== 'Not tested') {
                    console.log(`    Contractor Signup: ${contractorSignupTest}`);
                }
                if (proPortalTest !== 'Not tested') {
                    console.log(`    Pro Portal: ${proPortalTest}`);
                }

                // Performance assessment
                let assessment = '';
                if (loadTime < 2000) {
                    assessment = chalk.green('🚀 Excellent');
                } else if (loadTime < 3000) {
                    assessment = chalk.yellow('⚡ Good');
                } else if (loadTime < 5000) {
                    assessment = chalk.orange('⚠️  Average');
                } else {
                    assessment = chalk.red('🐌 Needs Improvement');
                }
                
                console.log(`    Performance: ${assessment}`);
                console.log('');

            } catch (error) {
                console.log(chalk.red(`    Error: ${error.message}`));
                console.log('');
            } finally {
                await page.close();
            }
        }
    }

    await browser.close();
    
    console.log(chalk.blue('✅ Performance testing complete!'));
    console.log(chalk.gray('Recommendations:'));
    console.log(chalk.gray('• Load times under 2s are excellent for user experience'));
    console.log(chalk.gray('• Mobile optimization is crucial for contractor signups'));
    console.log(chalk.gray('• Ensure API responses are under 500ms for best UX'));
}

// Check if required packages are installed
async function checkDependencies() {
    try {
        await import('puppeteer');
        await import('chalk');
        return true;
    } catch (error) {
        console.log(chalk.red('Missing dependencies. Please install:'));
        console.log('npm install puppeteer chalk');
        return false;
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    checkDependencies().then(hasDepends => {
        if (hasDepends) {
            testWebsitePerformance().catch(console.error);
        }
    });
}

export { testWebsitePerformance };
