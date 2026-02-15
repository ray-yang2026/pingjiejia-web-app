"""
初始化种子数据 — 将前端 MOCK 数据写入 Firestore

运行方式: python seed_data.py
"""
from firebase_client import db

MOCK_DISHES = [
    {
        "id": "1",
        "name": "鲜肉包子",
        "description": "皮薄馅大，每日现包",
        "price": 2.5,
        "category": "主食点心",
        "imageUrl": "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=400&auto=format&fit=crop",
        "ingredients": [
            {"name": "猪肉", "amount": "50g", "category": "肉类", "detail": "前夹肉"},
            {"name": "面粉", "amount": "30g", "category": "其他", "detail": "高筋面粉"},
            {"name": "大葱", "amount": "5g", "category": "菜类"},
            {"name": "生抽", "amount": "2g", "category": "佐料类"},
        ],
    },
    {
        "id": "2",
        "name": "养生小米粥",
        "description": "五谷杂粮，暖胃首选",
        "price": 3.0,
        "category": "汤菜",
        "imageUrl": "https://images.unsplash.com/photo-1594968973184-9140fa307769?q=80&w=400&auto=format&fit=crop",
        "ingredients": [
            {"name": "小米", "amount": "100g", "category": "其他"},
            {"name": "白糖", "amount": "5g", "category": "佐料类"},
        ],
    },
    {
        "id": "3",
        "name": "秘制卤蛋",
        "description": "秘方卤制，入味十足",
        "price": 1.5,
        "category": "小食",
        "imageUrl": "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400&auto=format&fit=crop",
        "ingredients": [
            {"name": "鸡蛋", "amount": "1个", "category": "肉类"},
            {"name": "八角桂皮", "amount": "1g", "category": "佐料类"},
        ],
    },
    {
        "id": "4",
        "name": "秘制红烧肉",
        "description": "精选上等五花肉，慢火细炖，口感软糯。",
        "price": 128.0,
        "category": "肉菜",
        "imageUrl": "https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?q=80&w=400&auto=format&fit=crop",
        "ingredients": [
            {"name": "猪肉", "amount": "500g", "category": "肉类", "detail": "上等五花"},
            {"name": "蔬菜", "amount": "100g", "category": "菜类", "detail": "时令配菜"},
            {"name": "老抽", "amount": "10g", "category": "佐料类"},
            {"name": "冰糖", "amount": "20g", "category": "佐料类"},
            {"name": "料酒", "amount": "5g", "category": "佐料类"},
        ],
    },
    {
        "id": "5",
        "name": "现磨豆浆",
        "description": "醇厚浓郁，富含植物蛋白",
        "price": 4.0,
        "category": "饮品",
        "imageUrl": "https://images.unsplash.com/photo-1461344577544-4e5dc9487184?q=80&w=400&auto=format&fit=crop",
        "ingredients": [
            {"name": "黄豆", "amount": "200g", "category": "其他"},
            {"name": "纯净水", "amount": "500ml", "category": "其他"},
        ],
    },
]

MOCK_ORDERS = [
    {
        "id": "ord1",
        "orderNumber": "#CRT-90234",
        "customerName": "张美玲",
        "customerPhone": "13812345678",
        "eventReason": "企业周年庆",
        "address": "某科技园A座",
        "daysCount": 1,
        "startDate": "2023-10-24",
        "status": "待执行",
        "plans": [
            {
                "date": "2023-10-24",
                "slots": {
                    "lunch": {
                        "type": "lunch",
                        "tableCount": 20,
                        "dishes": [
                            {"dishId": "4", "quantity": 1},
                            {"dishId": "1", "quantity": 2},
                        ],
                    },
                    "dinner": {
                        "type": "dinner",
                        "tableCount": 15,
                        "dishes": [
                            {"dishId": "4", "quantity": 1},
                            {"dishId": "2", "quantity": 1},
                        ],
                    },
                },
            }
        ],
    }
]


def seed():
    """将种子数据写入 Firestore"""
    print("🔥 开始写入菜品数据...")
    for dish in MOCK_DISHES:
        db.collection("dishes").document(dish["id"]).set(dish)
        print(f"  ✅ 菜品: {dish['name']}")

    print("\n📦 开始写入订单数据...")
    for order in MOCK_ORDERS:
        db.collection("orders").document(order["id"]).set(order)
        print(f"  ✅ 订单: {order['customerName']} - {order['orderNumber']}")

    print("\n🎉 种子数据写入完成！")


if __name__ == "__main__":
    seed()
