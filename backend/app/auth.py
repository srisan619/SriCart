from jose import JWTError, jwt
from datetime import datetime, timedelta

SECRET_KEY = 'secret_key'
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now()+timedelta(minues=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# def admin_only(current_user=Depends(get_current_user)):
#     if current_user.role.name != 'admin':
#         raise HttpException(status_code=403, detail="Not authorized")