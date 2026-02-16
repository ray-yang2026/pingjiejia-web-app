"""
Firebase Admin SDK 初始化模块
"""
import os
import firebase_admin
from firebase_admin import credentials, firestore, storage

# 获取密钥（优先尝试环境变量，适配 Vercel）
_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_CRED_PATH = os.path.join(_BASE_DIR, "serviceAccountKey.json")
_STORAGE_BUCKET = os.environ.get("FIREBASE_STORAGE_BUCKET", "")

if not firebase_admin._apps:
    cert = None
    # 1. 尝试环境变量 (Production / Vercel)
    env_creds = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
    if env_creds:
        try:
            import json
            # 处理 Vercel 环境变量中可能的转义换行符
            env_creds = env_creds.replace("\\n", "\n")
            # 处理可能的 JSON 字符串
            cred_dict = json.loads(env_creds)
            cert = credentials.Certificate(cred_dict)
            print("Successfully loaded Firebase credentials from environment.")
        except json.JSONDecodeError as e:
            # 调试信息：打印错误和数据特征
            raise ValueError(f"JSON Decode Error: {e} | Content len: {len(env_creds)} | Start: {env_creds[:20]}...")
        except Exception as e:
            raise ValueError(f"Firebase Init Error: {e}")

    # 2. 尝试本地文件 (Local Development)
    if not cert and os.path.exists(_CRED_PATH):
        cert = credentials.Certificate(_CRED_PATH)

    init_opts = {}
    if _STORAGE_BUCKET:
        init_opts["storageBucket"] = _STORAGE_BUCKET

    if cert:
        firebase_admin.initialize_app(cert, init_opts)
    else:
        # 在 Vercel 环境下，如果没有凭证则直接报错，避免后续 ADC 错误
        if os.environ.get("VERCEL"): 
             raise ValueError("Fatal: No Firebase credentials found in Vercel environment.")
        
        # 本地可能依赖 ADC
        try:
            firebase_admin.initialize_app(options=init_opts)
        except Exception:
            print("Warning: No credentials provided for Firebase.")

# 导出 Firestore 客户端
db = firestore.client()

# 导出 Storage bucket（可能为 None 如果未配置）
try:
    bucket = storage.bucket() if _STORAGE_BUCKET else None
except Exception:
    bucket = None

