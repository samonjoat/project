import pytest
import os
import yaml
from src.config.config_loader import load_config, _validate_config

def test_load_config_missing_file():
    with pytest.raises(FileNotFoundError):
        load_config("nonexistent.yaml")

def test_load_config_invalid_yaml(tmp_path):
    config_file = tmp_path / "invalid.yaml"
    config_file.write_text("invalid: yaml: content")
    
    with pytest.raises(ValueError):
        load_config(str(config_file))

def test_validate_config_missing_fields():
    incomplete_config = {
        "salesforce_folder": "/path/to/folder",
        "master_file": "/path/to/master.xlsx"
    }
    
    with pytest.raises(ValueError) as exc_info:
        _validate_config(incomplete_config)
    assert "Missing required configuration fields" in str(exc_info.value)

def test_validate_config_valid():
    valid_config = {
        "salesforce_folder": "/path/to/folder",
        "master_file": "/path/to/master.xlsx",
        "export_folder": "/path/to/export",
        "fuzzy_threshold": 80,
        "column_assignments": "/path/to/assignments.txt"
    }
    
    # Should not raise any exception
    _validate_config(valid_config)