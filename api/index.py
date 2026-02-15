import os
import sys

# Ensure backend directory is in sys.path so imports like 'from routers import ...' work
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

from backend.main import app
