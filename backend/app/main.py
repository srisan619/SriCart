from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
# from .database import engine, Base
from . import models, schemas, crud
from .auth import create_access_token, verify_password
from .dependencies import get_db, get_current_user, require_roles

# Base.metadata.create_all(bind=engine)
app = FastAPI(title="SriCart API")

@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_username(db, user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="username already exists")
    
    return crud.create_user(db, user)

@app.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": db_user.username})

    return{
        "access_token": token,
        "token_type": "bearer"
    }

@app.get("/users", response_model=list[schemas.UserResponse])
def list_users(db: Session=Depends(get_db)):
    return crud.get_all_users(db)

@app.post("/roles", response_model=schemas.RoleResponse)
def create_role(role: schemas.RoleCreate, db: Session = Depends(get_db), current_user=Depends(require_roles(["admin"]))):
    existing_role = db.query(models.Role).filter(models.Role.name == role.name).first()

    if existing_role:
        raise HTTPException(status_code=400, detail="Role already exists")
    
    return crud.create_role(db, role.name)

@app.get("/roles", response_model=list[schemas.RoleResponse])
def list_roles(db: Session = Depends(get_db), current_user = Depends(require_roles(["admin"]))):
    return crud.get_all_roles(db)

@app.put("/roles/{role_id}", response_model=schemas.RoleResponse)
def update_role(role_id: int,
                role: schemas.RoleCreate,
                db: Session = Depends(get_db),
                current_user=Depends(require_roles(["admin"]))):

    updated = crud.update_role(db, role_id, role.name)

    if not updated:
        raise HTTPException(status_code=404, detail="Role not found")

    return updated

@app.delete("/roles/{role_id}")
def delete_role(role_id: int,
                db: Session = Depends(get_db),
                current_user=Depends(require_roles(["admin"]))):

    deleted = crud.delete_role(db, role_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Role not found")

    return {"message": "Role deleted successfully"}

@app.post("/users/{user_id}/assign-role/{role_id}")
def assign_role(user_id: int,
                role_id: int,
                db: Session = Depends(get_db),
                current_user=Depends(require_roles(["admin"]))
                ):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    role = db.query(models.Role).filter(models.Role.id == role_id).first()

    if not user or not role:
        return HTTPException(status_code = 404, detail="User or Role not found")

    user.roles.append(role)
    db.commit()

    return {"message": "Role assigned successfully"}