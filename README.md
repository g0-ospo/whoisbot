# WhoisBot

A GitHub Action and CLI tool for researching individuals using Azure's Bing Search and OpenAI services. Generate comprehensive reports about people to prepare for meetings or collaborations.

## Features

- Automated web research using Bing Search API
- AI-powered analysis using Azure OpenAI
- Multiple output formats (PDF, Markdown, plain text)
- GitHub Actions integration
- Command-line interface

## GitHub Actions Usage

You can use WhoisBot directly through GitHub Actions:

1. Go to the "Actions" tab in your repository
2. Select the "Who is Bot" workflow
3. Click "Run workflow"
4. Enter the person's details (name, email, etc.)
5. The workflow will generate an analysis report

Example workflow usage:
```yaml
name: Research Team Member
on:
  workflow_dispatch:
    inputs:
      contactDetails:
        description: 'Contact details of the person'
        required: true

jobs:
  analyze_person:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run WhoisBot
        env:
          BING_API_KEY: ${{ secrets.BING_API_KEY }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: node dist/index.js -c "${{ github.event.inputs.contactDetails }}"
```

## Local Installation

```bash
git clone https://github.com/g0-ospo/whoisbot.git
cd whoisbot
npm install
```

## Configuration

1. Set up Azure Bing Search:
   - Create a Bing Search resource in Azure
   - Get your API key
   - Set as `BING_API_KEY` in environment or secrets

2. Set up Azure OpenAI:
   - Create an OpenAI resource in Azure
   - Get your API key
   - Set as `OPENAI_API_KEY` in environment or secrets

## CLI Usage

```bash
# Basic usage (plain text output)
node index.js -c "John Doe"

# Generate PDF report
node index.js -c "John Doe" -f pdf

# Generate Markdown report
node index.js -c "John Doe" -f markdown
```

## Development

```bash
# Run tests
npm test

# Run tests in CI environment
npm run test-ci

# Build distribution
npm run build
```

## License

[MIT License](LICENSE)
