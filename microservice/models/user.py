
from sqlmodel import SQLModel ,Field
import bcrypt

# Define the User model
class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str
    email: str = Field(index=True, unique=True)
    password: str

    # Password hashing 
    def set_password(self, raw_password: str):
        hashed = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt())
        self.password = hashed.decode('utf-8')

    # Password verification
    def check_password(self, raw_password: str) -> bool:
        return bcrypt.checkpw(raw_password.encode('utf-8'), self.password.encode('utf-8'))

