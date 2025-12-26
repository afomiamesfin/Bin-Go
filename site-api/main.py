from typing import Union
# import os

from fastapi import FastAPI
from pydantic import BaseModel

# #import openai, if it doesn't work, then use manual sorting based on keywords
# i'm keeping any openai references commented out because we don't have access to an api key
# try:
#     from openai import OpenAI
#     _openai_available = True
# except Exception:
#     OpenAI = None
#     _openai_available = False

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

class AnalyzeRequest(BaseModel):
    text: str

@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    text = req.text.strip()
    print(f"[site-api] /analyze called with: {text}")

    # manual sorting based on specific keywords
    if any(word in text for word in ["bottle", "plastic", "can", "jar", "container", "paper", "cardboard", "newspaper", "magazine"]):
        bin_type = "recycling"
    elif any(word in text for word in ["banana", "apple", "peel", "food", "leftover", "compostable"]):
        bin_type = "compost"
    else:
        bin_type = "trash"

    return {"bin": bin_type}