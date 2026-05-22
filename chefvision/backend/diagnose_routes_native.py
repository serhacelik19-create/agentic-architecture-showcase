
import urllib.request
import urllib.error
import json
import sys

def check_url(url, method="GET", data=None):
    print(f"\nScanning: {url} [{method}]")
    try:
        req = urllib.request.Request(url, method=method)
        if data:
            req.add_header('Content-Type', 'application/json')
            req.data = json.dumps(data).encode('utf-8')
        
        with urllib.request.urlopen(req) as response:
            print(f"  Status: {response.status}")
            print(f"  URL: {response.geturl()}")
            return True
    except urllib.error.HTTPError as e:
        print(f"  Status: {e.code}")
        print(f"  Reason: {e.reason}")
        if e.code in [301, 302, 303, 307, 308]:
            print(f"  Location: {e.headers.get('Location')}")
        return False
    except urllib.error.URLError as e:
        print(f"  Error: {e.reason}")
        return False
    except Exception as e:
        print(f"  Exception: {e}")
        return False

def main():
    base_url = "http://localhost:8000"
    
    # 1. Check Debug Routes
    print("--- Checking Server Routes ---")
    try:
        with urllib.request.urlopen(f"{base_url}/debug/routes") as r:
             if r.status == 200:
                 data = json.loads(r.read())
                 routes = data.get("routes", [])
                 pantry_routes = [x for x in routes if "pantry" in x]
                 print(f"Found {len(pantry_routes)} pantry routes:")
                 for pr in pantry_routes:
                     print(f"  {pr}")
    except Exception as e:
        print(f"Failed to fetch debug routes: {e}")

    # 2. Check Pantry POST (No Slash)
    check_url(f"{base_url}/api/v1/pantry", "POST", {"ingredient_name": "Test", "quantity": 1})

    # 3. Check Pantry POST (With Slash)
    check_url(f"{base_url}/api/v1/pantry/", "POST", {"ingredient_name": "Test", "quantity": 1})

    # 4. Check Expiring Soon
    check_url(f"{base_url}/api/v1/pantry/expiring-soon?days=3", "GET")

if __name__ == "__main__":
    main()
