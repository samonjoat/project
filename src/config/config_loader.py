import yaml
import logging
import os

def load_config(config_path="config.yaml"):
    """Load and validate configuration from YAML file."""
    try:
        with open(config_path, "r") as file:
            config = yaml.safe_load(file)
            _validate_config(config)
            return config
    except FileNotFoundError:
        raise FileNotFoundError(f"Configuration file not found: {config_path}")
    except yaml.YAMLError as e:
        raise ValueError(f"Invalid YAML configuration: {e}")

def _validate_config(config):
    """Validate required configuration parameters."""
    required_fields = [
        "salesforce_folder",
        "master_file",
        "export_folder",
        "fuzzy_threshold",
        "column_assignments"
    ]
    
    missing_fields = [field for field in required_fields if field not in config]
    if missing_fields:
        raise ValueError(f"Missing required configuration fields: {', '.join(missing_fields)}")

def setup_logging(export_folder):
    """Configure logging with file and console handlers."""
    log_file = os.path.join(export_folder, "process_log.txt")
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler()
        ]
    )