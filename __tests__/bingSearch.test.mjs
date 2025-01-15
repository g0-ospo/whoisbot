// __tests__/bingSearch.test.mjs
import axios from 'axios';
import { bingSearch } from '../bingSearch.js';
import { jest } from '@jest/globals';

jest.mock('axios');

describe('bingSearch', () => {
  const contactDetails = 'John Doe';
  const apiKey = 'test-api-key';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return concatenated search results', async () => {
    const mockBingResponse = {
      data: {
        webPages: {
          value: [
            {
              name: 'Example Site 1',
              url: 'https://example.com/1',
              snippet: 'Description 1',
            },
            {
              name: 'Example Site 2',
              url: 'https://example.com/2',
              snippet: 'Description 2',
            },
          ],
        },
      },
    };

    const mockPageResponse = {
      data: '<html><body><p>Content 1</p></body></html>',
    };

    // Mock the Bing Search API response and subsequent page fetches
    axios.get
      .mockResolvedValueOnce(mockBingResponse) // First call: Bing Search
      .mockResolvedValueOnce(mockPageResponse) // Second call: Page 1
      .mockResolvedValueOnce(mockPageResponse); // Third call: Page 2

    const result = await bingSearch(contactDetails, apiKey);

    expect(axios.get).toHaveBeenCalledTimes(3);
    expect(axios.get).toHaveBeenCalledWith(
      `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(contactDetails)}`,
      { headers: { 'Ocp-Apim-Subscription-Key': apiKey } }
    );
    expect(result).toContain('Title: Example Site 1');
    expect(result).toContain('Title: Example Site 2');
  });

  it('should handle empty search results', async () => {
    const mockBingResponse = {
      data: {
        webPages: {
          value: [],
        },
      },
    };

    axios.get.mockResolvedValueOnce(mockBingResponse);

    const result = await bingSearch(contactDetails, apiKey);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(result).toBe('');
  });

  it('should handle errors from Bing API', async () => {
    const mockError = new Error('Bing API Error');
    axios.get.mockRejectedValueOnce(mockError);

    await expect(bingSearch(contactDetails, apiKey)).rejects.toThrow('Bing API Error');

    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it('should handle errors when fetching page content', async () => {
    const mockBingResponse = {
      data: {
        webPages: {
          value: [
            {
              name: 'Example Site 1',
              url: 'https://example.com/1',
              snippet: 'Description 1',
            },
          ],
        },
      },
    };

    const mockError = new Error('Page Fetch Error');

    axios.get
      .mockResolvedValueOnce(mockBingResponse) // First call: Bing Search
      .mockRejectedValueOnce(mockError); // Second call: Page fetch fails

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await bingSearch(contactDetails, apiKey);

    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error fetching page content: ${mockError}\n`);
    expect(result).toBe('');

    consoleErrorSpy.mockRestore();
  });

  it('should limit results to top 5', async () => {
    const mockBingResponse = {
      data: {
        webPages: {
          value: Array.from({ length: 10 }, (_, i) => ({
            name: `Example Site ${i + 1}`,
            url: `https://example.com/${i + 1}`,
            snippet: `Description ${i + 1}`,
          })),
        },
      },
    };

    const mockPageResponse = {
      data: '<html><body><p>Content</p></body></html>',
    };

    // Mock the Bing Search API response and subsequent page fetches (only top 5)
    axios.get
      .mockResolvedValueOnce(mockBingResponse) // First call: Bing Search
      .mockResolvedValueOnce(mockPageResponse) // Page 1
      .mockResolvedValueOnce(mockPageResponse) // Page 2
      .mockResolvedValueOnce(mockPageResponse) // Page 3
      .mockResolvedValueOnce(mockPageResponse) // Page 4
      .mockResolvedValueOnce(mockPageResponse) // Page 5
      .mockResolvedValueOnce(mockPageResponse); // Page 6 (should not be called)

    const result = await bingSearch(contactDetails, apiKey);

    expect(axios.get).toHaveBeenCalledTimes(6); // 1 Bing API call + 5 page fetches
    expect(result.match(/Title: Example Site/g).length).toBe(5);
  });
});