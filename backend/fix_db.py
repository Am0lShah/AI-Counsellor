import sys
import os
from sqlalchemy import text

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine, init_db
from models.user import ChatHistory  # Import to ensure metadata is registered

def fix_db():
    print("Connecting to database...")
    with engine.connect() as connection:
        print("Dropping chat_history table...")
        connection.execute(text("DROP TABLE IF EXISTS chat_history CASCADE;"))
        connection.commit()
        print("Table dropped.")
    
    print("Re-initializing database...")
    init_db()
    print("Database fixed!")

if __name__ == "__main__":
    fix_db()
