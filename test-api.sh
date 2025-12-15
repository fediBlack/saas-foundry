#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API base URL
API_URL="http://localhost:5000/api"

# Test counter
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to print test results
test_result() {
  local name=$1
  local status=$2
  
  TESTS_RUN=$((TESTS_RUN + 1))
  
  if [ "$status" = "pass" ]; then
    echo -e "${GREEN}✓${NC} $name"
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo -e "${RED}✗${NC} $name"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
}

# Test 1: Health Check
echo -e "\n${YELLOW}Testing Health Check...${NC}"
HEALTH=$(curl -s "$API_URL/health" | grep -c "ok")
[ $HEALTH -eq 1 ] && test_result "Server health check" "pass" || test_result "Server health check" "fail"

# Test 2: Register User
echo -e "\n${YELLOW}Testing User Registration...${NC}"
EMAIL="test_$(date +%s)@example.com"
REGISTER=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"TestPass123!\",\"name\":\"Test User\"}")

USER_ID=$(echo "$REGISTER" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
[ ! -z "$USER_ID" ] && test_result "User registration" "pass" || test_result "User registration" "fail"

# Test 3: Login
echo -e "\n${YELLOW}Testing User Login...${NC}"
LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"TestPass123!\"}" \
  -c cookies.txt)

LOGIN_CHECK=$(echo "$LOGIN" | grep -c "\"email\"")
[ $LOGIN_CHECK -eq 1 ] && test_result "User login" "pass" || test_result "User login" "fail"

# Test 4: Get Current User
echo -e "\n${YELLOW}Testing Get Current User...${NC}"
ME=$(curl -s "$API_URL/auth/me" -b cookies.txt)
ME_CHECK=$(echo "$ME" | grep -c "$EMAIL")
[ $ME_CHECK -eq 1 ] && test_result "Get current user" "pass" || test_result "Get current user" "fail"

# Test 5: Create Task
echo -e "\n${YELLOW}Testing Task Creation...${NC}"
CREATE_TASK=$(curl -s -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Integration Test Task","description":"Testing task creation","priority":"HIGH"}')

TASK_ID=$(echo "$CREATE_TASK" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
[ ! -z "$TASK_ID" ] && test_result "Create task" "pass" || test_result "Create task" "fail"

# Test 6: List Tasks
echo -e "\n${YELLOW}Testing List Tasks...${NC}"
LIST_TASKS=$(curl -s "$API_URL/tasks" -b cookies.txt)
LIST_CHECK=$(echo "$LIST_TASKS" | grep -c "Integration Test Task")
[ $LIST_CHECK -eq 1 ] && test_result "List tasks" "pass" || test_result "List tasks" "fail"

# Test 7: Get Single Task
echo -e "\n${YELLOW}Testing Get Single Task...${NC}"
GET_TASK=$(curl -s "$API_URL/tasks/$TASK_ID" -b cookies.txt)
SINGLE_CHECK=$(echo "$GET_TASK" | grep -c "Integration Test Task")
[ $SINGLE_CHECK -eq 1 ] && test_result "Get single task" "pass" || test_result "Get single task" "fail"

# Test 8: Update Task
echo -e "\n${YELLOW}Testing Update Task...${NC}"
UPDATE=$(curl -s -X PUT "$API_URL/tasks/$TASK_ID" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Updated Task","priority":"LOW"}')

UPDATE_CHECK=$(echo "$UPDATE" | grep -c "Updated Task")
[ $UPDATE_CHECK -eq 1 ] && test_result "Update task" "pass" || test_result "Update task" "fail"

# Test 9: Toggle Task
echo -e "\n${YELLOW}Testing Toggle Task...${NC}"
TOGGLE=$(curl -s -X PATCH "$API_URL/tasks/$TASK_ID/toggle" \
  -b cookies.txt)

TOGGLE_CHECK=$(echo "$TOGGLE" | grep -c "task")
[ $TOGGLE_CHECK -eq 1 ] && test_result "Toggle task" "pass" || test_result "Toggle task" "fail"

# Test 10: Delete Task
echo -e "\n${YELLOW}Testing Delete Task...${NC}"
DELETE=$(curl -s -X DELETE "$API_URL/tasks/$TASK_ID" -b cookies.txt)
DELETE_CHECK=$(echo "$DELETE" | grep -c "deleted successfully")
[ $DELETE_CHECK -eq 1 ] && test_result "Delete task" "pass" || test_result "Delete task" "fail"

# Test 11: Logout
echo -e "\n${YELLOW}Testing User Logout...${NC}"
LOGOUT=$(curl -s -X POST "$API_URL/auth/logout" -b cookies.txt)
LOGOUT_CHECK=$(echo "$LOGOUT" | grep -c "logged out successfully")
[ $LOGOUT_CHECK -eq 1 ] && test_result "User logout" "pass" || test_result "User logout" "fail"

# Summary
echo -e "\n${YELLOW}═══════════════════════════════════${NC}"
echo -e "${YELLOW}Test Summary${NC}"
echo -e "${YELLOW}═══════════════════════════════════${NC}"
echo -e "Total Tests:  $TESTS_RUN"
echo -e "${GREEN}Passed:       $TESTS_PASSED${NC}"
echo -e "${RED}Failed:       $TESTS_FAILED${NC}"
echo -e "${YELLOW}═══════════════════════════════════${NC}"

# Clean up
rm -f cookies.txt

# Exit with proper code
[ $TESTS_FAILED -eq 0 ] && exit 0 || exit 1
