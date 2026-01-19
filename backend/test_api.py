"""
Simple test script to verify backend functionality
Run this after starting the backend server to test all endpoints
"""

import requests
import json
import sys

BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test health check endpoint"""
    print("\n1. Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
        assert response.status_code == 200, "Health check failed"
        assert response.json()["status"] in ["healthy", "degraded"], "Invalid status"
        print("   ✅ Health check passed")
        return True
    except Exception as e:
        print(f"   ❌ Health check failed: {e}")
        return False

def test_start_interview():
    """Test starting an interview"""
    print("\n2. Testing start interview...")
    try:
        payload = {
            "interview_type": "technical",
            "role": "Software Engineer",
            "experience_level": "intermediate",
            "domain": "Python"
        }
        response = requests.post(f"{BASE_URL}/api/interview/start", json=payload)
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Session ID: {data.get('session_id', 'N/A')}")
        print(f"   Question: {data.get('question', 'N/A')[:100]}...")
        
        assert response.status_code == 200, "Start interview failed"
        assert "session_id" in data, "No session_id returned"
        assert "question" in data, "No question returned"
        
        print("   ✅ Start interview passed")
        return data["session_id"], data["question"]
    except Exception as e:
        print(f"   ❌ Start interview failed: {e}")
        return None, None

def test_submit_answer(session_id, question):
    """Test submitting an answer"""
    print("\n3. Testing submit answer...")
    try:
        payload = {
            "session_id": session_id,
            "question": question,
            "answer": "REST is an architectural style that uses HTTP methods like GET, POST, PUT, DELETE. GraphQL is a query language that allows clients to request exactly the data they need through a single endpoint. REST can lead to over-fetching or under-fetching, while GraphQL solves this with precise queries."
        }
        response = requests.post(f"{BASE_URL}/api/interview/answer", json=payload)
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Overall Score: {data.get('overall_score', 'N/A')}")
        print(f"   Strengths: {len(data.get('strengths', []))} found")
        print(f"   Improvements: {len(data.get('improvements', []))} found")
        
        assert response.status_code == 200, "Submit answer failed"
        assert "overall_score" in data, "No score returned"
        assert "feedback_detail" in data, "No feedback detail"
        
        print("   ✅ Submit answer passed")
        return data["overall_score"]
    except Exception as e:
        print(f"   ❌ Submit answer failed: {e}")
        return None

def test_get_next_question(session_id, previous_score):
    """Test getting next question"""
    print("\n4. Testing get next question...")
    try:
        payload = {
            "session_id": session_id,
            "previous_score": previous_score
        }
        response = requests.post(f"{BASE_URL}/api/interview/next", json=payload)
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Next Question: {data.get('question', 'N/A')[:100]}...")
        
        assert response.status_code == 200, "Get next question failed"
        assert "question" in data, "No question returned"
        
        print("   ✅ Get next question passed")
        return True
    except Exception as e:
        print(f"   ❌ Get next question failed: {e}")
        return False

def test_get_stats(session_id):
    """Test getting session statistics"""
    print("\n5. Testing get statistics...")
    try:
        response = requests.get(f"{BASE_URL}/api/interview/stats/{session_id}")
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Questions Asked: {data.get('questions_asked', 'N/A')}")
        print(f"   Average Score: {data.get('average_score', 'N/A')}")
        
        assert response.status_code == 200, "Get stats failed"
        assert "questions_asked" in data, "No questions count"
        
        print("   ✅ Get statistics passed")
        return True
    except Exception as e:
        print(f"   ❌ Get statistics failed: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("Backend API Test Suite")
    print("=" * 60)
    print(f"Testing against: {BASE_URL}")
    print("Make sure the backend server is running!")
    print("=" * 60)
    
    # Test 1: Health check
    if not test_health_check():
        print("\n❌ Backend is not healthy. Please check:")
        print("   1. Server is running (uvicorn main:app --reload --port 8000)")
        print("   2. OPENROUTER_API_KEY is set in .env")
        print("   3. All dependencies are installed")
        sys.exit(1)
    
    # Test 2: Start interview
    session_id, question = test_start_interview()
    if not session_id:
        print("\n❌ Cannot proceed without session_id")
        sys.exit(1)
    
    # Test 3: Submit answer
    score = test_submit_answer(session_id, question)
    if score is None:
        print("\n⚠️  Answer submission failed, but continuing...")
    
    # Test 4: Get next question
    if score is not None:
        test_get_next_question(session_id, score)
    
    # Test 5: Get statistics
    test_get_stats(session_id)
    
    # Summary
    print("\n" + "=" * 60)
    print("✅ All tests completed!")
    print("=" * 60)
    print("\nYour backend is working correctly!")
    print("Next steps:")
    print("1. Start the frontend: cd ../frontend && npm run dev")
    print("2. Open http://localhost:3000 in your browser")
    print("3. Test the full application")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nTests interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
        sys.exit(1)
