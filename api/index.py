import os
import sys

# Ensure backend directory is in sys.path so imports like 'from routers import ...' work
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

try:
    from backend.main import app
except Exception as e:
    import traceback
    from fastapi import FastAPI
    from fastapi.responses import PlainTextResponse

    app = FastAPI()

    @app.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    async def catch_all(path_name: str):
        error_msg = f"Application Startup Error:\\n{traceback.format_exc()}"
        print(error_msg)
        return PlainTextResponse(error_msg, status_code=500)
