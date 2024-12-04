import pytest
from src.processors.name_matcher import find_closest_name

def test_find_closest_name_exact_match():
    master_names = ["John Doe", "Jane Smith", "Bob Wilson"]
    result = find_closest_name("John Doe", master_names, 80)
    assert result == "John Doe"

def test_find_closest_name_fuzzy_match():
    master_names = ["John Doe", "Jane Smith", "Bob Wilson"]
    result = find_closest_name("Jon Doe", master_names, 80)
    assert result == "John Doe"

def test_find_closest_name_no_match():
    master_names = ["John Doe", "Jane Smith", "Bob Wilson"]
    result = find_closest_name("Alexander Hamilton", master_names, 80)
    assert result is None

def test_find_closest_name_empty_input():
    master_names = ["John Doe", "Jane Smith", "Bob Wilson"]
    result = find_closest_name("", master_names, 80)
    assert result is None

def test_find_closest_name_non_string_input():
    master_names = ["John Doe", "Jane Smith", "Bob Wilson"]
    result = find_closest_name(None, master_names, 80)
    assert result is None