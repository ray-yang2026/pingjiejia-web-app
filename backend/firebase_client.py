"""
Firebase Admin SDK 初始化模块
"""
import os
import firebase_admin
from firebase_admin import credentials, firestore

# 获取密钥（优先尝试环境变量，适配 Vercel）
_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_CRED_PATH = os.path.join(_BASE_DIR, "serviceAccountKey.json")

if not firebase_admin._apps:
    cert = None
    # 1. 尝试环境变量 (Production / Vercel)
    env_creds = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
    if env_creds:
        try:
            import json
            # 处理可能的 JSON 字符串
            cred_dict = json.loads(env_creds)
            cert = credentials.Certificate(cred_dict)
        except Exception as e:
            print(f"Warning: Failed to load credentials from env: {e}")

    # 2. 尝试本地文件 (Local Development)
    if not cert and os.path.exists(_CRED_PATH):
        cert = credentials.Certificate(_CRED_PATH)

    if cert:
        firebase_admin.initialize_app(cert)
    else:
        # 在没有凭证的情况下初始化（可能依赖 GCP 环境自动认证），但在 Vercel 上通常需要凭证
        try:
            firebase_admin.initialize_app()
        except Exception:
            print("Warning: No credentials provided for Firebase.")

# 导出 Firestore 客户端
db = firestore.client()
