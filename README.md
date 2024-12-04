# Excel Data Processor

A React and Python-based application for processing and consolidating Excel data from multiple Salesforce exports into a master sheet.

## Features

- Upload and process multiple Salesforce Excel files
- Intelligent column mapping with fuzzy name matching
- Interactive UI for file management and column configuration
- Progress tracking and detailed processing logs
- Download consolidated results

## Tech Stack

- Frontend: React + TypeScript + Vite
- UI Components: Material-UI
- State Management: Zustand
- Backend: Python + Flask
- Excel Processing: Pandas + OpenPyXL
- Testing: Vitest + React Testing Library

## Development

1. Install dependencies:
```bash
npm install
pip install -r requirements.txt
```

2. Start the development server:
```bash
# Start frontend
npm run dev

# Start backend (in a separate terminal)
python src/api/app.py
```

3. Run tests:
```bash
npm test
```

## Project Structure

```
excel-processor/
├── src/
│   ├── api/           # Python Flask backend
│   ├── components/    # React components
│   ├── config/        # Configuration management
│   ├── processors/    # Data processing logic
│   ├── services/      # API and backend services
│   ├── store/         # State management
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── tests/             # Python tests
└── ...
```

## Configuration

Edit `config.yaml` to customize:
- File paths and folders
- Fuzzy matching threshold
- Column mapping settings

## License

MIT