# api.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from email_processor import sync_emails

app = FastAPI(title="Email NER + Sync API")

# CORS so your TS frontend can call this from another origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # TODO: lock this down in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/emails")
def get_emails():
    """
    When your TypeScript page calls this:
    - We sync new emails from Graph
    - Update emails.json
    - Return the full list of processed emails as JSON
    """
    try:
        emails = sync_emails()
        return emails
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
