import sys
import jwt
token = sys.argv[1]
try:
    decoded = jwt.decode(token, options={"verify_signature": False})
    print(decoded)
except Exception as e:
    print(e)
