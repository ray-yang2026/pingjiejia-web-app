"""
Firebase Admin SDK 初始化模块
"""
import os
import firebase_admin
from firebase_admin import credentials, firestore

# 获取密钥文件路径（相对于本文件所在目录）
_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_CRED_PATH = os.path.join(_BASE_DIR, "serviceAccountKey.json")

# 初始化 Firebase App（只执行一次）
if not firebase_admin._apps:
    cred = credentials.Certificate(_CRED_PATH)
    firebase_admin.initialize_app(cred)

# 导出 Firestore 客户端
db = firestore.client()
