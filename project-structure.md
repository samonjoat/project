# Excel Data Processor

## Project Structure
```
excel-processor/
├── src/
│   ├── api/
│   │   └── app.py
│   ├── components/
│   │   ├── ColumnMapping.tsx
│   │   ├── DownloadResults.tsx
│   │   ├── FileList.tsx
│   │   ├── FileUpload.tsx
│   │   ├── NavigationButtons.tsx
│   │   └── Steps.tsx
│   ├── config/
│   │   └── config_loader.py
│   ├── processors/
│   │   ├── excel_processor.py
│   │   └── name_matcher.py
│   ├── services/
│   │   ├── api.ts
│   │   └── mockBackend.ts
│   ├── store/
│   │   └── useStore.ts
│   ├── types/
│   │   └── mock.ts
│   ├── utils/
│   │   ├── downloadUtils.ts
│   │   └── file_operations.py
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── test_config_loader.py
│   └── test_name_matcher.py
├── config.yaml
├── index.html
├── package.json
├── requirements.txt
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

## Steps to Fork

1. Create a new chat

2. Copy and paste the project structure above

3. Share all file contents from the current chat to the new chat

4. Install dependencies and start the development server:
```bash
npm install
npm run dev
```

The project is now ready to be worked on in the new chat. All files, configurations, and dependencies will be preserved.