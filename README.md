# Who is Bot

An Actions workflow for determining information about a person based on contact details provided.

## Usage Instructions

1. Provide the contact details of the person as input to the workflow.
2. The workflow will use Azure Bing API to search for the person.
3. The workflow will use GitHub OpenAI Azure model to analyze the search results.
4. The detailed analysis of the person will be outputted.

## Configuring Azure Bing API

1. Sign up for an Azure account if you don't have one.
2. Create a new Bing Search resource in the Azure portal.
3. Obtain the API key for the Bing Search resource.
4. Add the API key as a secret in your GitHub repository with the name `BING_API_KEY`.

## Configuring GitHub OpenAI Azure Model

1. Sign up for an Azure account if you don't have one.
2. Create a new OpenAI resource in the Azure portal.
3. Obtain the API key for the OpenAI resource.
4. Add the API key as a secret in your GitHub repository with the name `OPENAI_API_KEY`.

## Running the Bot Locally

To run the bot locally, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/g0-ospo/whoisbot.git
   cd whoisbot
   ```

2. Install the dependencies:
   ```sh
   npm install
   ```

3. Set the environment variables for the API keys:
   ```sh
   export BING_API_KEY=your_bing_api_key
   export OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the bot with the contact details and desired output format:
   ```sh
   node index.js -c "<contact details>" -f "plain"
   ```

   The available output formats are `plain`, `markdown`, and `pdf`. The default format is `plain`.
