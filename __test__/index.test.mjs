import { jest } from '@jest/globals';
import bingSearch from '../bingSearch';
import openAIAnalysis from '../openAIAnalysis';
import whoisbot from '../index';

jest.mock('../bingSearch');
jest.mock('../openAIAnalysis');

describe('whoisbot', () => {
  const contactDetails = 'John Doe';
  const bingResults = [{ name: 'John Doe', url: 'https://example.com/johndoe' }];
  const analysis = 'Detailed analysis of John Doe';

  beforeEach(() => {
    bingSearch.mockClear();
    openAIAnalysis.mockClear();
  });

  it('should return plain text analysis by default', async () => {
    bingSearch.mockResolvedValue(bingResults);
    openAIAnalysis.mockResolvedValue(analysis);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await whoisbot(contactDetails, 'plain');

    expect(bingSearch).toHaveBeenCalledWith(contactDetails, process.env.BING_API_KEY);
    expect(openAIAnalysis).toHaveBeenCalledWith(bingResults, process.env.OPENAI_API_KEY);
    expect(consoleSpy).toHaveBeenCalledWith(analysis);

    consoleSpy.mockRestore();
  });

  it('should return markdown analysis when format is markdown', async () => {
    bingSearch.mockResolvedValue(bingResults);
    openAIAnalysis.mockResolvedValue(analysis);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await whoisbot(contactDetails, 'markdown');

    expect(bingSearch).toHaveBeenCalledWith(contactDetails, process.env.BING_API_KEY);
    expect(openAIAnalysis).toHaveBeenCalledWith(bingResults, process.env.OPENAI_API_KEY);
    expect(consoleSpy).toHaveBeenCalledWith(`# Analysis\n\n${analysis}`);

    consoleSpy.mockRestore();
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('Something went wrong');
    bingSearch.mockRejectedValue(error);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await whoisbot(contactDetails, 'plain');

    expect(bingSearch).toHaveBeenCalledWith(contactDetails, process.env.BING_API_KEY);
    expect(consoleSpy).toHaveBeenCalledWith('Error in whoisbot:', error);

    consoleSpy.mockRestore();
  });
});
