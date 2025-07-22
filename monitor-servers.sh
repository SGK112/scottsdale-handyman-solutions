#!/bin/bash

# Server Monitoring and Auto-Restart Script for Scottsdale Handyman Solutions
# This script ensures the servers never go down by monitoring and restarting them

FRONTEND_PORT=5173
BACKEND_PORT=3002
PROJECT_DIR="/Users/homepc/Desktop/Scottsdale Handyman Solutions LLC Website Design Request/scottsdale-handyman-solutions-1"
PYTHON_PATH="$PROJECT_DIR/backend_env/bin/python"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Check if port is in use
check_port() {
    local port=$1
    lsof -i :$port > /dev/null 2>&1
    return $?
}

# Start frontend server
start_frontend() {
    log "Starting frontend server on port $FRONTEND_PORT..."
    cd "$PROJECT_DIR"
    npm run dev > /dev/null 2>&1 &
    FRONTEND_PID=$!
    sleep 3
    
    if check_port $FRONTEND_PORT; then
        log "Frontend server started successfully (PID: $FRONTEND_PID)"
        return 0
    else
        error "Failed to start frontend server"
        return 1
    fi
}

# Start backend server
start_backend() {
    log "Starting backend server on port $BACKEND_PORT..."
    cd "$PROJECT_DIR"
    "$PYTHON_PATH" main.py > /dev/null 2>&1 &
    BACKEND_PID=$!
    sleep 3
    
    if check_port $BACKEND_PORT; then
        log "Backend server started successfully (PID: $BACKEND_PID)"
        return 0
    else
        error "Failed to start backend server"
        return 1
    fi
}

# Stop all servers
stop_servers() {
    log "Stopping all servers..."
    pkill -f "vite" > /dev/null 2>&1
    pkill -f "main.py" > /dev/null 2>&1
    sleep 2
}

# Monitor and restart servers
monitor_servers() {
    while true; do
        # Check frontend
        if ! check_port $FRONTEND_PORT; then
            warn "Frontend server is down! Restarting..."
            start_frontend
        fi
        
        # Check backend
        if ! check_port $BACKEND_PORT; then
            warn "Backend server is down! Restarting..."
            start_backend
        fi
        
        # Wait before next check
        sleep 10
    done
}

# Main execution
case "$1" in
    start)
        log "Starting Scottsdale Handyman Solutions servers..."
        stop_servers
        start_frontend
        start_backend
        log "Servers started! Frontend: http://localhost:$FRONTEND_PORT | Backend: http://localhost:$BACKEND_PORT"
        log "Pro Portal login: Add ?pro=true to URL"
        ;;
    stop)
        stop_servers
        log "All servers stopped"
        ;;
    restart)
        log "Restarting servers..."
        stop_servers
        start_frontend
        start_backend
        log "Servers restarted!"
        ;;
    monitor)
        log "Starting server monitoring..."
        log "This will keep servers running and automatically restart them if they go down"
        log "Press Ctrl+C to stop monitoring"
        
        # Initial start
        stop_servers
        start_frontend
        start_backend
        
        # Start monitoring
        monitor_servers
        ;;
    status)
        echo "=== Server Status ==="
        if check_port $FRONTEND_PORT; then
            echo -e "Frontend (port $FRONTEND_PORT): ${GREEN}RUNNING${NC}"
        else
            echo -e "Frontend (port $FRONTEND_PORT): ${RED}DOWN${NC}"
        fi
        
        if check_port $BACKEND_PORT; then
            echo -e "Backend (port $BACKEND_PORT): ${GREEN}RUNNING${NC}"
        else
            echo -e "Backend (port $BACKEND_PORT): ${RED}DOWN${NC}"
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|monitor|status}"
        echo ""
        echo "Commands:"
        echo "  start   - Start both frontend and backend servers"
        echo "  stop    - Stop all servers"
        echo "  restart - Restart both servers"
        echo "  monitor - Start servers and monitor them (auto-restart if they go down)"
        echo "  status  - Check if servers are running"
        echo ""
        echo "After starting, visit:"
        echo "  Website: http://localhost:$FRONTEND_PORT"
        echo "  Pro Portal: http://localhost:$FRONTEND_PORT?pro=true"
        echo "  API: http://localhost:$BACKEND_PORT/api/"
        exit 1
        ;;
esac
