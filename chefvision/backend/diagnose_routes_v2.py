
import requests
import sys

def check_routes():
    try:
        # Check debug routes
        print("Checking debug routes...")
        resp = requests.get("http://localhost:8000/debug/routes")
        if resp.status_code == 200:
            routes = resp.json().get("routes", [])
            print("Found routes:")
            for r in routes:
                if "pantry" in r:
                    print(f"  {r}")
        else:
            print(f"Failed to get routes:Status {resp.status_code}")
            
        # Check pantry endpoint specifically with and without slash
        print("\nChecking /api/v1/pantry (POST) behavior...")
        
        # Test 1: No slash
        url_no_slash = "http://localhost:8000/api/v1/pantry"
        print(f"Requesting {url_no_slash}...")
        try:
            r1 = requests.post(url_no_slash, json={}, allow_redirects=False)
            print(f"  Status: {r1.status_code}")
            if r1.is_redirect:
                print(f"  Redirects to: {r1.headers.get('Location')}")
        except Exception as e:
            print(f"  Error: {e}")

        # Test 2: With slash
        url_slash = "http://localhost:8000/api/v1/pantry/"
        print(f"Requesting {url_slash}...")
        try:
            r2 = requests.post(url_slash, json={}, allow_redirects=False)
            print(f"  Status: {r2.status_code}")
            if r2.is_redirect:
                print(f"  Redirects to: {r2.headers.get('Location')}")
        except Exception as e:
                print(f"  Error: {e}")

    except Exception as e:
        print(f"Global Error: {e}")

if __name__ == "__main__":
    check_routes()
