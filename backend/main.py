from typing import List
from pydantic import ValidationError
from pathlib import Path
import os
from model import DB, Store

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

DB_PATH = os.environ.get("DB_PATH", "./db.json")
PORT = int(os.environ.get("PORT", "8000"))


class ArrayDatabase:
    def __init__(self, path: str):
        self.path = path

    def startup(self):
        fp = Path(self.path)

        try:
            db_json = fp.read_text()
            model = DB.model_validate_json(db_json)
            self.model = model
        except (ValidationError, FileNotFoundError):
            default = DB()
            fp.write_text(default.model_dump_json())
            self.model = default

    def save(self):
    
        fp = Path(self.path)
        fp.write_text(self.model.model_dump_json()) 
            
    def fetchall(self):
        return self.model.model_dump()
    
    def append(self, cat: Store, text: str):
        values: List[str] = self.model.__getattribute__(cat.value)
        values = sorted(set(values) | {text})
        self.model.__setattr__(cat.value, sorted(values))
        self.save()
        return text

    def delete(self, cat: Store, text: str):
        values: List[str] = self.model.__getattribute__(cat.value)
        values.remove(text)
        self.model.__setattr__(cat.value, sorted(values))
        self.save()
        return text
        

db = ArrayDatabase(path = DB_PATH)
db.startup()
async def get_db() ->ArrayDatabase:
    return db

app = FastAPI()
# ponytail: allow all origins, tighten when frontend has a real origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/data")
async def list_stored_data(database: ArrayDatabase = Depends(get_db)):
    return database.fetchall()

@app.put("/data/{type}")
async def append(type: Store, text: str , database: ArrayDatabase = Depends(get_db)):
    database.append(type, text)
    return {"type": type, "text": text}


@app.delete("/data/{type}")
async def delete_item(type: Store, text: str, database: ArrayDatabase = Depends(get_db)):
    database.delete(type, text)
    return {"deleted": text}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=PORT)
