import os
import pandas as pd
from openpyxl import load_workbook

def create_export_folder(export_folder):
    """Create export directory if it doesn't exist."""
    if not os.path.exists(export_folder):
        os.makedirs(export_folder)

def load_salesforce_file(file_path):
    """Load Salesforce Excel file without headers."""
    try:
        return pd.read_excel(file_path, header=None)
    except Exception as e:
        raise IOError(f"Error loading Salesforce file {file_path}: {e}")

def read_column_assignments(assignments_path):
    """Read and parse column assignments from text file."""
    column_assignments = {}
    try:
        with open(assignments_path, "r") as file:
            for line in file:
                line = line.strip()
                if "=" in line:
                    key, mappings = line.split("=", 1)
                    column_assignments[key.strip()] = [
                        mapping.strip() for mapping in mappings.split(",")
                    ]
        return column_assignments
    except Exception as e:
        raise IOError(f"Error reading column assignments: {e}")