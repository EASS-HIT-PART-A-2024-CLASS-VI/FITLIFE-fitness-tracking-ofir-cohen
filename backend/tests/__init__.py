# tests/__init__.py

"""
Test package for the fitness tracker application.

This package contains:
- Unit tests: tests for individual components
- Integration tests: tests for API endpoints and database interactions
"""

# Import commonly used testing modules to make them available
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Test database URL - use in-memory SQLite for testing
TEST_DATABASE_URL = "sqlite:///./test_fitness_tracker.db"