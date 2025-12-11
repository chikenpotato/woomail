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

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
