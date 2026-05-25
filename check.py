import bcrypt

hashed = bcrypt.hashpw(b"123456", bcrypt.gensalt()).decode('utf-8')
print(hashed)
