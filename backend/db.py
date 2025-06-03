from sqlmodel import create_engine, Session, SQLModel
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "database.sqlite")
engine = create_engine(f"sqlite:///{DB_PATH}", echo=False)

def init_db():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
