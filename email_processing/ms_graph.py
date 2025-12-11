import os
import webbrowser
import msal
from dotenv import load_dotenv

MS_GRAPH_BASE_URL = "https://graph.microsoft.com/v1.0"

def get_access_token(application_id, client_secret, scope):
    app = msal.ConfidentialClientApplication(
        client_id=application_id,
        authority="https://login.microsoftonline.com/consumers",
        client_credential=client_secret,
    )

    refresh_token = None
    if os.path.exists("refresh_token.txt"):
        with open("refresh_token.txt", "r") as f:
            refresh_token = f.read().strip()
    
    if refresh_token:
        result = app.acquire_token_by_refresh_token(refresh_token, scopes=scope)
        if "access_token" in result:
            return result["access_token"]
    else:
        auth_url = app.get_authorization_request_url(scope)
        auth_code = input("Enter Authorization Code from {}: ".format(auth_url))
        if not auth_code:
            raise ValueError("Authorization code is required.")
        token_response = app.acquire_token_by_authorization_code(
            code=auth_code,
            scopes=scope,
        )
    result = app.acquire_token_for_client(scopes=scope)

    if "access_token" in token_response:
        if 'refresh_token' in token_response:
            with open("refresh_token.txt", "w") as f:
                f.write(token_response['refresh_token'])
        return token_response["access_token"]
    else:
        raise Exception("Could not obtain access token: " + str(result.get("error_description")))
    
def main():
    load_dotenv()
    application_id = os.getenv("APPLICATION_ID")
    client_secret = os.getenv("CLIENT_SECRET")
    scope = ["User.Read", "Mail.ReadWrite"]

    try:
        access_token = get_access_token(application_id, client_secret, scope)
        print("Access Token:", access_token)
    except Exception as e:
        print("Error obtaining access token:", str(e))

if __name__ == "__main__":
    main()