import logging
from openpyxl.utils import column_index_from_string
from concurrent.futures import ThreadPoolExecutor
from ..utils.file_operations import load_salesforce_file

class ExcelProcessor:
    def __init__(self, config, master_df):
        self.config = config
        self.master_df = master_df

    def validate_mapping(self, file_name, mappings, salesforce_df):
        """Validate column mappings for a Salesforce file."""
        invalid_mappings = []
        for mapping in mappings:
            name_col, source_col, destination_col = mapping.split(":")
            name_idx = column_index_from_string(name_col.strip()) - 1
            source_idx = column_index_from_string(source_col.strip()) - 1

            if name_idx >= salesforce_df.shape[1]:
                invalid_mappings.append(name_col)
            if source_idx >= salesforce_df.shape[1]:
                invalid_mappings.append(source_col)

        if invalid_mappings:
            logging.warning(f"Invalid columns in {file_name}: {', '.join(invalid_mappings)}")
            return False
        return True

    def process_file(self, file_name, mappings):
        """Process a single Salesforce file."""
        try:
            file_path = os.path.join(self.config["salesforce_folder"], file_name)
            salesforce_df = load_salesforce_file(file_path)

            if not self.validate_mapping(file_name, mappings, salesforce_df):
                logging.warning(f"Skipping file due to invalid mappings: {file_name}")
                return

            self._update_master_sheet(salesforce_df, mappings, file_name)
            logging.info(f"Processed file: {file_name}")

        except Exception as e:
            logging.error(f"Error processing {file_name}: {e}")

    def _update_master_sheet(self, salesforce_df, mappings, file_name):
        """Update master sheet with data from Salesforce file."""
        from .name_matcher import find_closest_name

        for mapping in mappings:
            name_col, source_col, destination_col = mapping.split(":")
            name_idx = column_index_from_string(name_col.strip()) - 1
            source_idx = column_index_from_string(source_col.strip()) - 1
            dest_idx = column_index_from_string(destination_col.strip()) - 1

            master_names = self.master_df.iloc[:, 2].astype(str).str.strip().tolist()
            
            for _, row in salesforce_df.iterrows():
                person_name = str(row[name_idx]).strip()
                closest_match = find_closest_name(
                    person_name,
                    master_names,
                    self.config["fuzzy_threshold"]
                )
                
                if closest_match:
                    self._update_master_row(
                        closest_match,
                        row[source_idx] if source_idx < salesforce_df.shape[1] else "N/A",
                        dest_idx
                    )
                else:
                    logging.warning(f"No match for '{person_name}' in {file_name}")

    def _update_master_row(self, match_name, value, dest_idx):
        """Update a specific row in the master sheet."""
        mask = self.master_df.iloc[:, 2].astype(str).str.strip() == match_name
        self.master_df.loc[mask, self.master_df.columns[dest_idx]] = value