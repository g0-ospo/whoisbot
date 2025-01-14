import { jest } from '@jest/globals';
import bingSearch from '../bingSearch';

jest.mock('axios');

describe('bingSearch', () => {
  const contactDetails = 'John Doe';
  const apiKey = 'test-api-key';
  const bingResults = [{ name: 'John Doe', url: 'https://example.com/johndoe' }];

  it('should return search results from Bing API', async () => {
    const axios = require('axios');
    axios.get.mockResolvedValue({ data: { webPages: { value: bingResults } } });

    const results = await bingSearch(contactDetails, apiKey);

    expect(axios.get).toHaveBeenCalledWith(
      `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(contactDetails)}`,
      { headers: { 'Ocp-Apim-Subscription-Key': apiKey } }
    );
    expect(results).toEqual(bingResults);
  });

  it('should handle errors gracefully', async () => {
    const axios = require('axios');
    const error = new Error('Something went wrong');
    axios.get.mockRejectedValue(error);

    await expect(bingSearch(contactDetails, apiKey)).rejects.toThrow(error);
  });
});
