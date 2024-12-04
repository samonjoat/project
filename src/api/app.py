from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import pandas as pd
from werkzeug.utils import secure_filename
import json
import traceback
import logging
from logging.handlers import RotatingFileHandler

app = Flask(__name__)
CORS(app)

# Configure logging
if not os.path.exists('logs'):
    os.makedirs('logs')

handler = RotatingFileHandler('logs/app.log', maxBytes=10000, backupCount=3)
handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
))
handler.setLevel(logging.INFO)
app.logger.addHandler(handler)
app.logger.setLevel(logging.INFO)
app.logger.info('Excel Processor startup')

UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'xlsx', 'xls'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    app.logger.info(f'Created upload folder: {UPLOAD_FOLDER}')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

@app.route('/api/preview', methods=['POST'])
def preview_file():
    try:
        if 'file' not in request.files:
            app.logger.warning('No file part in request')
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            app.logger.warning('No selected file')
            return jsonify({'error': 'No file selected'}), 400
            
        if not allowed_file(file.filename):
            app.logger.warning(f'Invalid file type: {file.filename}')
            return jsonify({'error': 'Invalid file type. Only Excel files (.xlsx, .xls) are allowed'}), 400
        
        df = pd.read_excel(file)
        if df.empty:
            app.logger.warning('Uploaded file is empty')
            return jsonify({'error': 'The uploaded file is empty'}), 400
                
        preview_data = {
            'columns': df.columns.tolist(),
            'data': df.head(5).to_dict('records')
        }
        app.logger.info(f'Successfully processed file: {file.filename}')
        return jsonify(preview_data)
    except Exception as e:
        error_message = f"Error processing file: {str(e)}"
        app.logger.error(f"File preview error: {error_message}\n{traceback.format_exc()}")
        return jsonify({'error': error_message}), 500

@app.route('/api/mapping', methods=['POST'])
def save_mapping():
    try:
        mapping_data = request.json
        if not mapping_data:
            app.logger.warning('No mapping data provided')
            return jsonify({'error': 'No mapping data provided'}), 400
            
        with open('column_mappings.json', 'w') as f:
            json.dump(mapping_data, f)
        app.logger.info('Mapping saved successfully')
        return jsonify({'message': 'Mapping saved successfully'})
    except Exception as e:
        error_message = f"Error saving mapping: {str(e)}"
        app.logger.error(f"Mapping error: {error_message}\n{traceback.format_exc()}")
        return jsonify({'error': error_message}), 500

@app.route('/api/process', methods=['POST'])
def process_files():
    try:
        if 'masterFile' not in request.files or 'salesforceFiles' not in request.files:
            app.logger.warning('Missing required files')
            return jsonify({'error': 'Missing required files'}), 400

        master_file = request.files['masterFile']
        salesforce_files = request.files.getlist('salesforceFiles')
        mapping = request.form.get('mapping')

        if not mapping:
            app.logger.warning('Missing column mapping')
            return jsonify({'error': 'Missing column mapping'}), 400
            
        if not allowed_file(master_file.filename):
            app.logger.warning(f'Invalid master file type: {master_file.filename}')
            return jsonify({'error': 'Invalid master file type'}), 400
            
        for file in salesforce_files:
            if not allowed_file(file.filename):
                app.logger.warning(f'Invalid file type: {file.filename}')
                return jsonify({'error': f'Invalid file type: {file.filename}'}), 400

        # Save files
        master_path = os.path.join(UPLOAD_FOLDER, secure_filename(master_file.filename))
        master_file.save(master_path)
        app.logger.info(f'Saved master file: {master_path}')

        salesforce_paths = []
        for file in salesforce_files:
            path = os.path.join(UPLOAD_FOLDER, secure_filename(file.filename))
            file.save(path)
            salesforce_paths.append(path)
            app.logger.info(f'Saved Salesforce file: {path}')

        app.logger.info('Processing complete')
        return jsonify({'message': 'Processing complete'})
    except Exception as e:
        error_message = f"Error processing files: {str(e)}"
        app.logger.error(f"Processing error: {error_message}\n{traceback.format_exc()}")
        return jsonify({'error': error_message}), 500

if __name__ == '__main__':
    app.logger.info('Starting Flask application')
    app.run(debug=True, port=5000)