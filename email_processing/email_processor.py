# email_processor.py

import os
import json
import re
import random
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

import httpx
from dotenv import load_dotenv
from ms_graph import get_access_token, MS_GRAPH_BASE_URL

import spacy
from spacy.pipeline import EntityRuler

# ==========================
# Config
# ==========================

EMAIL_JSON_PATH = "emails.json"
EMAILS_PATH = Path("emails.json")
TASKS_PATH = Path("tasks.json")
ATTACHMENTS_PATH = Path("attachments.json")
PRIORITIES = ["low", "normal", "high", "urgent"]
STATUS_DEFAULT = "pending"

# ==========================
# NER model + patterns
# ==========================

# Load base NER model
nlp = spacy.load("en_core_web_sm")

# Add custom EntityRuler
ruler = nlp.add_pipe("entity_ruler", before="ner")

patterns = [
    # --- Organisations / Sources (ORG) ---
    {"label": "ORG", "pattern": "IRAS"},
    {"label": "ORG", "pattern": "Inland Revenue Authority of Singapore"},
    {"label": "ORG", "pattern": "ICA"},
    {"label": "ORG", "pattern": "Immigration & Checkpoints Authority"},
    {"label": "ORG", "pattern": "CPF Board"},
    {"label": "ORG", "pattern": "SP Services"},
    {"label": "ORG", "pattern": "SingHealth"},
    {"label": "ORG", "pattern": "NHG"},
    {"label": "ORG", "pattern": "NUHS"},
    {"label": "ORG", "pattern": "DBS"},
    {"label": "ORG", "pattern": "POSB"},
    {"label": "ORG", "pattern": "OCBC"},
    {"label": "ORG", "pattern": "UOB"},

    # --- Email Type / Category ---
    {"label": "EMAIL_TYPE", "pattern": "Notice of Assessment"},
    {"label": "EMAIL_TYPE", "pattern": "tax filing"},
    {"label": "EMAIL_TYPE", "pattern": "tax return"},
    {"label": "EMAIL_TYPE", "pattern": "passport renewal"},
    {"label": "EMAIL_TYPE", "pattern": "passport expiring"},
    {"label": "EMAIL_TYPE", "pattern": "clinic appointment"},
    {"label": "EMAIL_TYPE", "pattern": "medical appointment"},
    {"label": "EMAIL_TYPE", "pattern": "utility bill"},
    {"label": "EMAIL_TYPE", "pattern": "billing statement"},
    {"label": "EMAIL_TYPE", "pattern": "CPF contribution"},
    {"label": "EMAIL_TYPE", "pattern": "e-statement"},
    {"label": "EMAIL_TYPE", "pattern": "bank statement"},
    {"label": "EMAIL_TYPE", "pattern": "license renewal"},
    {"label": "EMAIL_TYPE", "pattern": "contract renewal"},
    {"label": "EMAIL_TYPE", "pattern": "offer letter"},
    {"label": "EMAIL_TYPE", "pattern": "HR update"},

    # --- Renewal / Expiry (RENEWAL) ---
    {"label": "RENEWAL", "pattern": "renew"},
    {"label": "RENEWAL", "pattern": "renewal"},
    {"label": "RENEWAL", "pattern": "expiring"},
    {"label": "RENEWAL", "pattern": "expiry"},
    {"label": "RENEWAL", "pattern": "expires on"},
    {"label": "RENEWAL", "pattern": "valid until"},
    {"label": "RENEWAL", "pattern": "due for renewal"},

    # --- Appointments (APPOINTMENT) ---
    {"label": "APPOINTMENT", "pattern": "appointment"},
    {"label": "APPOINTMENT", "pattern": "scheduled"},
    {"label": "APPOINTMENT", "pattern": "appointment date"},
    {"label": "APPOINTMENT", "pattern": "consultation"},

    # --- Billing / Payment (BILLING) ---
    {"label": "BILLING", "pattern": "payment due"},
    {"label": "BILLING", "pattern": "due date"},
    {"label": "BILLING", "pattern": "invoice"},
    {"label": "BILLING", "pattern": "bill"},
    {"label": "BILLING", "pattern": "amount payable"},
    {"label": "BILLING", "pattern": "outstanding balance"},
    {"label": "BILLING", "pattern": "total charges"},

    # --- Documents required (DOC_REQUIRED) ---
    {"label": "DOC_REQUIRED", "pattern": "documents required"},
    {"label": "DOC_REQUIRED", "pattern": "required documents"},
    {"label": "DOC_REQUIRED", "pattern": "please submit"},
    {"label": "DOC_REQUIRED", "pattern": "supporting documents"},

    # --- Verification (VERIFICATION) ---
    {"label": "VERIFICATION", "pattern": "verification needed"},
    {"label": "VERIFICATION", "pattern": "verify your identity"},
    {"label": "VERIFICATION", "pattern": "please verify"},
    {"label": "VERIFICATION", "pattern": "account verification"},

    # --- CTAs / Links (ACTION_LINK) ---
    {"label": "ACTION_LINK", "pattern": "click here"},
    {"label": "ACTION_LINK", "pattern": "log in to"},
    {"label": "ACTION_LINK", "pattern": "view statement"},
    {"label": "ACTION_LINK", "pattern": "view details"},
    {"label": "ACTION_LINK", "pattern": "access your account"},
]

ruler.add_patterns(patterns)

# -------------------------
# Regex helpers for dates / amounts / refs
# -------------------------

DATE_REGEXES = [
    r"\b\d{1,2}[-/ ](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*[-/ ]\d{2,4}\b",
    r"\b\d{4}-\d{2}-\d{2}\b",
    r"\b\d{1,2}/\d{1,2}/\d{2,4}\b",
]

AMOUNT_REGEX = r"\$[0-9,]+\.\d{2}"

REF_REGEX = r"(ref(?:erence)?|appointment|case)\s*[:#]?\s*[A-Za-z0-9-]+"


def extract_regex_entities(text: str) -> Dict[str, List[str]]:
    dates: List[str] = []
    for pattern in DATE_REGEXES:
        dates.extend(re.findall(pattern, text))

    amounts = re.findall(AMOUNT_REGEX, text)
    refs = re.findall(REF_REGEX, text, flags=re.IGNORECASE)

    return {
        "dates": dates,
        "amounts": amounts,
        "refs": refs,
    }


def analyze_email(text: str) -> Dict[str, Any]:
    """
    Run NER + regex to extract useful info from an email body.
    """
    doc = nlp(text)

    entities: List[Dict[str, str]] = []
    for ent in doc.ents:
        entities.append({
            "text": ent.text,
            "label": ent.label_
        })

    regex_entities = extract_regex_entities(text)

    # Rough categorisation: pick first EMAIL_TYPE / ORG we see
    email_type = next((e["text"] for e in entities if e["label"] == "EMAIL_TYPE"), None)
    org = next((e["text"] for e in entities if e["label"] == "ORG"), None)

    has_renewal = any(e["label"] == "RENEWAL" for e in entities)
    has_appointment = any(e["label"] == "APPOINTMENT" for e in entities)
    has_billing = any(e["label"] == "BILLING" for e in entities)
    docs_required = any(e["label"] == "DOC_REQUIRED" for e in entities)
    verification_needed = any(e["label"] == "VERIFICATION" for e in entities)
    has_action_link = any(e["label"] == "ACTION_LINK" for e in entities)

    return {
        "org": org,
        "email_type": email_type,
        "has_renewal": has_renewal,
        "has_appointment": has_appointment,
        "has_billing": has_billing,
        "docs_required": docs_required,
        "verification_needed": verification_needed,
        "has_action_link": has_action_link,
        "dates": regex_entities["dates"],
        "amounts": regex_entities["amounts"],
        "refs": regex_entities["refs"],
        "raw_entities": entities,
    }


def clean_html(raw_html: str) -> str:
    """
    Very simple HTML → text cleaner using regex.
    (You can swap this later for BeautifulSoup if you want.)
    """
    if not raw_html:
        return ""

    # Decode common HTML entities
    text = re.sub(r"&nbsp;", " ", raw_html)
    text = re.sub(r"&lt;", "<", text)
    text = re.sub(r"&gt;", ">", text)
    text = re.sub(r"&amp;", "&", text)

    # Remove HTML comments
    text = re.sub(r"<!--[\s\S]*?-->", "", text)

    # Replace <br> and <p> with newlines before stripping everything else
    text = re.sub(r"<\s*br\s*/?>", "\n", text, flags=re.IGNORECASE)
    text = re.sub(r"<\s*/?p\s*>", "\n", text, flags=re.IGNORECASE)

    # Strip all remaining tags
    text = re.sub(r"<.*?>", "", text)

    # Collapse multiple whitespace/newlines
    text = re.sub(r"\r\n", "\n", text)
    text = re.sub(r"\n+", "\n", text)
    text = re.sub(r"[ \t]+", " ", text)

    return text.strip()


def extract_sender_name(email: str) -> str:
    if not email or "@" not in email:
        return email or ""
    return email.split("@")[0]


# ==========================
# JSON file helpers
# ==========================

def load_emails_from_file() -> List[Dict[str, Any]]:
    if not os.path.exists(EMAIL_JSON_PATH):
        return []
    try:
        with open(EMAIL_JSON_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []


def save_emails_to_file(emails: List[Dict[str, Any]]) -> None:
    with open(EMAIL_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(emails, f, ensure_ascii=False, indent=2)


# ==========================
# Microsoft Graph integration
# ==========================

def fetch_emails_from_graph() -> List[Dict[str, Any]]:
    """
    Call Microsoft Graph /me/messages and return the raw messages list.
    NOTE: This currently fetches only the first page. You can add paging later.
    """
    load_dotenv()
    application_id = os.getenv("APPLICATION_ID")
    client_secret = os.getenv("CLIENT_SECRET")
    scope = ['User.Read', "Mail.ReadWrite"]

    if not application_id or not client_secret:
        raise RuntimeError("APPLICATION_ID or CLIENT_SECRET missing in environment")

    endpoint = f"{MS_GRAPH_BASE_URL}/me/messages"

    access_token = get_access_token(application_id, client_secret, scope)
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    response = httpx.get(endpoint, headers=headers)

    if response.status_code != 200:
        raise Exception(
            f"API request failed with status code {response.status_code}: {response.text}"
        )

    messages = response.json().get("value", [])
    print("=============RAW CONTENT================")
    print(messages)
    return messages


# ==========================
# Sync logic used by CLI
# ==========================

def sync_emails() -> List[Dict[str, Any]]:
    """
    - Load existing emails from emails.json
    - Fetch current messages from Graph
    - For any *new* email (by Graph id), run analyze_email and append
    - Assign a simple incremental id starting from 0
    - Save back to emails.json
    - Return the full list
    """
    existing = load_emails_from_file()

    # We use the Graph message id as the dedupe key
    existing_graph_ids = {e.get("graph_id") for e in existing}
    # Our own incremental id: continue from current length (0-based)
    next_id = len(existing)

    messages = fetch_emails_from_graph()

    for each_message in messages:
        graph_id = each_message.get("id")
        if not graph_id:
            continue

        if graph_id in existing_graph_ids:
            continue  # already processed

        subject = each_message.get("subject")
        sender = each_message.get("from", {}).get("emailAddress", {}).get("address")
        sender_name = extract_sender_name(sender)
        received = each_message.get("receivedDateTime")
        body_preview = each_message.get("bodyPreview", "")
        is_read = each_message.get("isRead", False)
        has_attachments = each_message.get("hasAttachments", False)
        raw_html = each_message.get("body", {}).get("content", "")

        text = clean_html(raw_html)

        try:
            summary = analyze_email(text)
            category = summary.get("email_type") or "Uncategorized"
            summary.update({
                "subject": subject,
                "category": category,
                "senderEmail": sender,
                "sender": sender_name,
                "receivedAt": received,
                "preview": body_preview,
                "isRead": is_read,
                "hasAttachments": has_attachments,
            })

            record: Dict[str, Any] = {
                "id": next_id,          # incremental id: 0,1,2,...
                "graph_id": graph_id,   # original Graph id
                "subject": subject,
                "senderEmail": sender,
                "receivedAt": received,
                "analysis": summary,
            }

            existing.append(record)
            existing_graph_ids.add(graph_id)
            next_id += 1

        except Exception as e:
            # Log and continue; don't crash the whole sync for one bad email
            print(f"Error calling NER analyzer for message {graph_id}: {e}")

    save_emails_to_file(existing)
    return existing


# ==========================
# ==== NEW: Task / attachment generation helpers
# ==========================

def parse_iso(dt_str: str) -> datetime:
    """Parse ISO-style datetime like 2025-12-10T14:39:10Z."""
    if not dt_str:
        return datetime.utcnow()
    try:
        if dt_str.endswith("Z"):
            dt_str = dt_str[:-1] + "+00:00"
        return datetime.fromisoformat(dt_str)
    except Exception:
        return datetime.utcnow()


def parse_human_date(date_str: str) -> Optional[datetime]:
    """Parse human date like '10 Apr 2025'."""
    if not date_str:
        return None
    for fmt in ("%d %b %Y", "%d %B %Y"):
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return None


def infer_category(analysis: Dict[str, Any], subject: str) -> str:
    org = (analysis.get("org") or "").lower()
    email_type = (analysis.get("email_type") or "").lower()
    subject_lower = (subject or "").lower()
    existing_cat = (analysis.get("category") or "").lower()

    # If analysis already gave something non-uncategorized, prefer it
    if existing_cat and existing_cat != "uncategorized":
        return existing_cat

    if any(x in org for x in ["iras", "cpf", "authority", "ministry", "ica"]):
        return "government"
    if any(x in org for x in ["dbs", "ocbc", "uob", "posb", "bank"]):
        return "finance"
    if "bill" in subject_lower or "utility" in email_type:
        return "bills"
    if analysis.get("has_appointment"):
        return "healthcare"
    if analysis.get("has_renewal"):
        return "government"  # e.g., LTA license renewal

    return "uncategorized"


def parse_amount_from_string(amount_str: str) -> Optional[float]:
    """Parse '$3,245.00' into 3245.00."""
    if not amount_str:
        return None
    s = amount_str.strip()
    if s.startswith("$"):
        s = s[1:]
    s = s.replace(",", "")
    try:
        return float(s)
    except ValueError:
        return None


def infer_amount(analysis: Dict[str, Any]) -> Optional[float]:
    """Try to infer amount from analysis.amounts (e.g. ['$127.45'])."""
    amounts = analysis.get("amounts") or []
    if not amounts:
        return None
    return parse_amount_from_string(amounts[0])


def make_quick_action(email: Dict[str, Any], analysis: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Build quickActionType from analysis, matching your Task type structure.
    """
    text = (analysis.get("preview") or "").lower()
    amount = infer_amount(analysis)

    # Payment-related
    if analysis.get("has_billing") or "payment due" in text or "amount payable" in text:
        return {
            "type": "pay",
            "label": "Pay now",
            "url": None,
            "amount": amount,
        }

    # Renewal / documents
    if analysis.get("has_renewal") or analysis.get("docs_required"):
        return {
            "type": "renew",
            "label": "Renew / submit documents",
            "url": None,
            "amount": amount,
        }

    # Generic view action
    if analysis.get("has_action_link") or "click here" in text:
        return {
            "type": "open",
            "label": "View details",
            "url": None,
            "amount": amount,
        }

    return None


def generate_tasks_and_attachments() -> None:
    """
    Read emails.json and generate:
      - tasks.json with Task[] matching your mockTasks shape
      - attachments.json with Attachment[] matching your mockAttachments shape
    """
    if not EMAILS_PATH.exists():
        print(f"{EMAILS_PATH} not found; skipping task/attachment generation.")
        return

    with EMAILS_PATH.open("r", encoding="utf-8") as f:
        emails = json.load(f)

    tasks: List[Dict[str, Any]] = []
    attachments: List[Dict[str, Any]] = []
    attachment_id_counter = 1

    for email in emails:
        email_id = email.get("id")
        subject = email.get("subject") or ""
        received_at_str = email.get("receivedAt") or email.get("received") or ""
        analysis = email.get("analysis") or {}

        received_dt = parse_iso(received_at_str)
        created_at = received_dt

        # dueDate: from first analysis date, else +7 days
        dates_list = analysis.get("dates") or []
        due_dt: Optional[datetime] = None
        if dates_list:
            due_dt = parse_human_date(dates_list[0])
        if due_dt is None:
            due_dt = received_dt + timedelta(days=7)

        preview = analysis.get("preview") or ""
        description = preview if len(preview) <= 200 else preview[:197] + "..."

        category = infer_category(analysis, subject)
        priority = random.choice(PRIORITIES)
        status = STATUS_DEFAULT

        quick_action = make_quick_action(email, analysis)

        # Task: match your mockTasks TypeScript shape
        task: Dict[str, Any] = {
            "id": str(email_id),
            "title": subject or "Follow up email",
            "description": description,
            "emailId": str(email_id),
            "category": category,
            "priority": priority,                  # 'low' | 'normal' | 'high' | 'urgent'
            "status": status,                      # 'pending'
            "dueDate": due_dt.isoformat(),         # TS: new Date(...)
            "createdAt": created_at.isoformat(),   # TS: new Date(...)
        }

        if quick_action:
            task["quickActionType"] = quick_action

        tasks.append(task)

        # Attachment: generate dummy PDF if hasAttachments true
        has_attachments = analysis.get("hasAttachments") or email.get("hasAttachments")
        if has_attachments:
            file_name_base = subject.strip() or f"email_{email_id}"
            file_name = file_name_base.replace(" ", "_") + ".pdf"
            file_size = random.randint(80_000, 300_000)

            attachment = {
                "id": str(attachment_id_counter),
                "fileName": file_name,
                "fileType": "pdf",
                "fileSize": file_size,
                "category": category,
                "uploadedAt": received_dt.isoformat(),  # TS: new Date(...)
                "emailId": str(email_id),
            }
            attachments.append(attachment)
            attachment_id_counter += 1

    with TASKS_PATH.open("w", encoding="utf-8") as f:
        json.dump(tasks, f, ensure_ascii=False, indent=2)

    with ATTACHMENTS_PATH.open("w", encoding="utf-8") as f:
        json.dump(attachments, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(tasks)} tasks to {TASKS_PATH}")
    print(f"Wrote {len(attachments)} attachments to {ATTACHMENTS_PATH}")


# ==========================
# CLI entrypoint
# ==========================

if __name__ == "__main__":
    emails = sync_emails()
    print(json.dumps(emails, indent=2, ensure_ascii=False))
    generate_tasks_and_attachments()
