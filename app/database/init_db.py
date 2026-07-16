from app.database.database import engine
from app.database.database import Base
# Import all models here
from app.models.document import Document
def init_db():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")