# woomail
HackRift


Email PoC

pip install -r requirements.txt
python -m spacy download en_core_web_sm

Add in your own CLIENT_SECRET and APPLICATION_ID from Azure
- http://portal.azure.com/ - log in with an Azure account (use free trial)
- App Registration
- "Supported Account Types" - select "Accounts in any organisational directory"
- Set redirect to web https://localhost:8000 - this redirection logs the authorisation code for subsequent outlook access

- CLIENT_SECRET - click "Manage", "Certificates & Secrets", and create "New client secret"
- APPLICATION_ID - Copy from "Overview" page

First execution
- python ms_graph.py
    - Access the link provided, which requests for permission to access the outlook
    - Once accepted, it redirects to https://localhost:8000 with the authorisation code in the GET request (part of the URL)
    - Copy the authorisation code from the url and paste it into the terminal

Subsequent executions
- python api.py
    - Access by performing GET request to API endpoint
    - i.e. curl http://127.0.0.1/emails
    - generates json file used as data source for the PoC (subsequently SQL database for better management)