from websocket import create_connection


wx = create_connection("ws://127.0.0.1:8000/ws/chat/aaa/")

print(wx)
