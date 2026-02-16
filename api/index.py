from http.server import BaseHTTPRequestHandler
import json
import os
import sys
import traceback

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        # Diagnostic logic
        status = {}
        try:
            # 1. Check path
            backend_path = os.path.join(os.path.dirname(__file__), '../backend')
            if not os.path.exists(backend_path):
                status['path_exists'] = False
                status['error'] = f"Backend path not found: {backend_path}"
            else:
                status['path_exists'] = True
                sys.path.append(backend_path)
                
                # 2. Try import
                import backend.main
                status['import'] = "Success"
                status['backend_file'] = backend.main.__file__
        except Exception:
            status['import'] = "Failed"
            status['traceback'] = traceback.format_exc()
            
        self.wfile.write(json.dumps(status).encode('utf-8'))

    def do_POST(self): self.do_GET()
    def do_PUT(self): self.do_GET()
    def do_DELETE(self): self.do_GET()
    def do_OPTIONS(self): self.do_GET()
