# AI Counsellor - Testing Guide

We have included an automated test suite to verify the core functionality of the API.

## Running Tests

1. **Activate Backend Environment:**
   ```bash
   cd backend
   source venv/bin/activate
   ```

2. **Install Test Dependencies:**
   ```bash
   pip install pytest httpx bcrypt email-validator
   ```

3. **Run the Test Suite:**
   ```bash
   # Using SQLite (Mock DB)
   export DATABASE_URL="sqlite:///./test.db"
   PYTHONPATH=. pytest tests/test_flow.py -v
   ```

## What is Tested?

The `tests/test_flow.py` script simulates a complete user journey:
1. **Signup**: Creates a new user account
2. **Onboarding Check**: Verifies access is blocked before onboarding
3. **Onboarding**: Submits profile data
4. **Stage 2 Verification**: Checks if dashboard updates to "University Discovery"
5. **Recommendations**: Fetches AI tailored universities
6. **Shortlisting**: Adds a university to shortlist
7. **Stage 3 Verification**: Checks if dashboard updates to "University Finalization"
8. **Locking**: Locks a university
9. **Stage 4 Verification**: Checks if dashboard updates to "Application Preparation"

## Troubleshooting

- If you see `database` import errors, ensure `PYTHONPATH=.` is set.
- If you see `bcrypt` errors, ensure `pip install bcrypt` is run.
