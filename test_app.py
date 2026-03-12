#!/usr/bin/env python3
"""
Simple test script to verify Random Quest functionality
"""

import requests
import json
import time

def test_api():
    base_url = "http://localhost:8000"
    
    print("Testing Random Quest API...")
    print("=" * 50)
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/api/health", timeout=5)
        if response.status_code == 200:
            print("✓ Health check passed")
        else:
            print(f"✗ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"✗ Health check error: {str(e)}")
        return False
    
    # Test categories endpoint
    try:
        response = requests.get(f"{base_url}/api/categories", timeout=5)
        if response.status_code == 200:
            categories = response.json()
            print(f"✓ Categories loaded: {len(categories)} categories")
        else:
            print(f"✗ Categories failed: {response.status_code}")
    except Exception as e:
        print(f"✗ Categories error: {str(e)}")
    
    # Test quest endpoint
    try:
        response = requests.get(f"{base_url}/api/quest", timeout=5)
        if response.status_code == 200:
            data = response.json()
            quest = data.get('quest', {})
            print(f"✓ Random quest: {quest.get('title', 'N/A')}")
        else:
            print(f"✗ Quest failed: {response.status_code}")
    except Exception as e:
        print(f"✗ Quest error: {str(e)}")
    
    # Test AI quest generation
    try:
        response = requests.post(
            f"{base_url}/api/generate",
            json={"category": "explore", "level": 4},
            timeout=10
        )
        if response.status_code == 200:
            ai_quest = response.json()
            print(f"✓ AI quest: {ai_quest.get('title', 'N/A')}")
        else:
            print(f"✗ AI quest failed: {response.status_code}")
    except Exception as e:
        print(f"✗ AI quest error: {str(e)}")
    
    print("=" * 50)
    print("API Test Complete!")
    return True

if __name__ == "__main__":
    test_api()
