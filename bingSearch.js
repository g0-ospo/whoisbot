import axios from "axios";
import { load } from "cheerio";

export async function bingSearch(contactDetails, apiKey) {
  const url = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(contactDetails)}`;
  const headers = { 'Ocp-Apim-Subscription-Key': apiKey };

  try {
    const response = await axios.get(url, { headers });
    const searchResults = response.data.webPages.value.slice(0, 5);

    const results = [];

    for (const result of searchResults) {
      const pageUrl = result.url;
      console.log(`Fetching page content for: ${pageUrl}`);

      try {
        const pageResponse = await axios.get(pageUrl);
        const html = pageResponse.data;
        const $ = load(html);

        // Remove unwanted tags altogether:
        $('script, style, noscript').remove();

        // This `.text()` call extracts *only* the human-readable text from the HTML.
        // Then, we do some cleanup so we don’t have large blocks of whitespace.
        let pageText = $('body').text()
          .replace(/\s+/g, ' ')
          .trim();

        results.push({
          title: result.name,
          url: pageUrl,
          description: result.snippet,
          content: pageText
        });
      } catch (error) {
        console.error(`Error fetching page content: ${error}\n`);
      }
    }

    // Concatenate all results into a single string
    const results_str = results
      .map(result => `Title: ${result.title}, URL: ${result.url}, Description: ${result.description}, Content: ${result.content}`)
      .join(', ');

    return results_str;   

  } catch (error) {
    console.error('Error during Bing search:', error);
    throw error;
  }
}
