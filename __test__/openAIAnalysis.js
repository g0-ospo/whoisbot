import { jest } from '@jest/globals';
import openAIAnalysis from '../openAIAnalysis';

jest.mock('@azure-rest/ai-inference');
jest.mock('@azure/core-auth');

describe('openAIAnalysis', () => {
  const bingResults = [{ name: 'John Doe', url: 'https://example.com/johndoe' }];
  const apiKey = 'test-api-key';
  const analysis = 'Detailed analysis of John Doe';

  it('should return detailed analysis from OpenAI model', async () => {
    const ModelClient = require('@azure-rest/ai-inference').ModelClient;
    const AzureKeyCredential = require('@azure/core-auth').AzureKeyCredential;

    ModelClient.mockImplementation(() => ({
      analyze: jest.fn().mockResolvedValue({
        data: {
          choices: [{ text: analysis }],
        },
      }),
    }));

    const client = new ModelClient(new AzureKeyCredential(apiKey));
    const response = await openAIAnalysis(bingResults, apiKey);

    expect(client.analyze).toHaveBeenCalledWith({
      body: {
        prompt: `Analyze the following Bing search results for detailed information about the person:\n${bingResults}`,
        max_tokens: 1000,
      },
    });
    expect(response).toEqual(analysis);
  });

  it('should handle errors gracefully', async () => {
    const ModelClient = require('@azure-rest/ai-inference').ModelClient;
    const AzureKeyCredential = require('@azure/core-auth').AzureKeyCredential;

    const error = new Error('Something went wrong');
    ModelClient.mockImplementation(() => ({
      analyze: jest.fn().mockRejectedValue(error),
    }));

    await expect(openAIAnalysis(bingResults, apiKey)).rejects.toThrow(error);
  });
});
