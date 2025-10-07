import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .tts import tts_route

app = FastAPI()

app.include_router(tts_route)

origins = [
    "http://localhost:5173",      # local dev
    "https://notblossom.com",     # production domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,        # cookies, Authorization headers, etc.
    allow_methods=["*"],
    allow_headers=["*"],
)

# setup health route for health check
@app.get("/health")
def health():
    return {"message": "Hello World"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=80)
