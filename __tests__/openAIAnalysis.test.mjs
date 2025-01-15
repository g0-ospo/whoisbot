// __tests__/openAIAnalysis.test.mjs

import { jest } from '@jest/globals';
import openAIAnalysis from '../openAIAnalysis.js';
import ModelClient from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';

// Mock @azure-rest/ai-inference
jest.mock('@azure-rest/ai-inference', () => {
  return jest.fn().mockImplementation(() => ({
    path: jest.fn().mockReturnThis(),
    post: jest.fn(),
  }));
});

// Mock @azure/core-auth's AzureKeyCredential
jest.mock('@azure/core-auth', () => {
  return {
    AzureKeyCredential: jest.fn().mockImplementation((apiKey) => {
      return { apiKey }; // Mocked AzureKeyCredential instance
    }),
  };
});

describe('openAIAnalysis', () => {
  const contactDetails = 'Jane Doe';
  const bingResults = 'Sample Bing results';
  const apiKey = 'test-openai-api-key';

  let mockPost;

  beforeEach(() => {
    mockPost = jest.fn();

    // Mock the ModelClient constructor to return an object with path and post methods
    ModelClient.mockImplementation(() => ({
      path: jest.fn().mockReturnThis(),
      post: mockPost,
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return the analysis content on successful response', async () => {
    const mockResponse = {
      status: '200',
      body: {
        choices: [
          {
            message: {
              content: 'Mock analysis content.',
            },
          },
        ],
      },
    };

    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await openAIAnalysis(contactDetails, bingResults, apiKey);

    expect(ModelClient).toHaveBeenCalledWith(
      'https://models.inference.ai.azure.com',
      expect.objectContaining({ apiKey: 'test-openai-api-key' })
    );
    expect(mockPost).toHaveBeenCalledWith({
      body: {
        messages: [
          {
            role: 'user',
            content: `You are an expert in researching on individuals and preparing a report on them to prepare other members of the team for the meeting. You should investigate social media platforms, news articles, and any other public information about the individual and prepare a report on them. Anything that might indicate how to best communicate, work with or collaborate with them should be included in the report. You must include all references/source URL for any material you include in the report. Research on ${contactDetails} and prepare a report on them to prepare other members of the team for the meeting based on these search results: ${bingResults}`,
          },
        ],
        model: 'gpt-4o', 
      },
    });
    expect(result).toBe('Mock analysis content.');
  });

  it('should throw an error when response status is not 200', async () => {
    const mockError = { message: 'Azure OpenAI Error' };
    const mockResponse = {
      status: 400,
      body: {
        error: mockError,
      },
    };

    mockPost.mockResolvedValueOnce(mockResponse);

    await expect(openAIAnalysis(contactDetails, bingResults, apiKey)).rejects.toEqual(mockError);

    expect(mockPost).toHaveBeenCalled();
  });

  it('should handle exceptions thrown during the API call', async () => {
    const mockException = new Error('Azure OpenAI Error');
    mockPost.mockRejectedValueOnce(mockException);

    await expect(openAIAnalysis(contactDetails, bingResults, apiKey)).rejects.toThrow('');

    expect(mockPost).toHaveBeenCalled();
  });
});