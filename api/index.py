import os
import sys

# Ensure root directory is in sys.path so 'backend' package can be imported
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

try:
    from backend.main import app
except Exception:
    import traceback
    from http.server import BaseHTTPRequestHandler
    
    class handler(BaseHTTPRequestHandler):
        def do_GET(self):
            self.send_response(500)
            self.send_header('Content-type', 'text/plain; charset=utf-8')
            self.end_headers()
            error_msg = f"Application Startup Error (Import Failed):\n{traceback.format_exc()}"
            self.wfile.write(error_msg.encode('utf-8'))
        
        def do_POST(self): self.do_GET()
        def do_PUT(self): self.do_GET()
        def do_DELETE(self): self.do_GET()
        def do_OPTIONS(self): self.do_GET()
