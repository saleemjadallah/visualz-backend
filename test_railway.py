#!/usr/bin/env python3
"""Ultra-minimal test to see if Railway can run Python at all"""
import os
import sys

print("=== Railway Python Test ===")
print(f"Python version: {sys.version}")
print(f"Working directory: {os.getcwd()}")
print(f"PORT: {os.getenv('PORT', 'NOT SET')}")
print(f"Files in directory: {os.listdir('.')[:10]}...")

# Try to start a basic HTTP server
try:
    import http.server
    import socketserver
    
    PORT = int(os.getenv('PORT', 8000))
    
    class Handler(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            if self.path == '/health':
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(b'OK - Railway Python Test')
            else:
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(b'Railway Python Test Running')
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"✅ Server running on port {PORT}")
        httpd.serve_forever()
        
except Exception as e:
    print(f"❌ Failed to start server: {e}")
    sys.exit(1)