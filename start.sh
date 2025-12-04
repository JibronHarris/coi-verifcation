#!/bin/bash

# COI Verification - Start Script
# This script starts both the backend and frontend applications

echo "🚀 Starting COI Verification System..."
echo ""

# Check if we're in the right directory
if [ ! -d "server" ] || [ ! -d "client" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    exit
}

# Trap Ctrl+C and call cleanup
trap cleanup INT TERM

# Start backend server
echo "📦 Starting backend server..."
cd server
npm run dev > ../server.log 2>&1 &
SERVER_PID=$!
cd ..

# Wait a moment for server to start
sleep 2

# Start frontend server
echo "🎨 Starting frontend server..."
cd client
npm run dev > ../client.log 2>&1 &
CLIENT_PID=$!
cd ..

echo ""
echo "✅ Both servers are starting..."
echo "📝 Backend logs: tail -f server.log"
echo "📝 Frontend logs: tail -f client.log"
echo ""
echo "🌐 Backend: http://localhost:3000"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $SERVER_PID $CLIENT_PID

