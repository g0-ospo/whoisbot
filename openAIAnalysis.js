/**
 * Azure OpenAI Analysis Module
 * 
 * This module interfaces with Azure OpenAI to analyze information about individuals
 * and generate comprehensive reports. It processes search results and creates
 * structured insights about communication preferences and professional background.
 * 
 * @module openAIAnalysis
 * @requires dotenv
 * @requires @azure-rest/ai-inference
 * @requires @azure/core-auth
 */

import dotenv from 'dotenv';
dotenv.config();
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

/** Model identifier for GPT-4 */
const model = "gpt-4o";

/**
 * Analyzes contact details and search results using Azure OpenAI
 * 
 * @param {string} contactDetails - Name or identifier of the person to analyze
 * @param {string} bingResults - Aggregated search results from Bing
 * @param {string} apiKey - Azure OpenAI API key
 * @returns {Promise<string>} Analysis results and insights
 * @throws {Error} When API call fails or returns non-200 status
 */
async function openAIAnalysis(contactDetails, bingResults, apiKey) {
  const client = new ModelClient(
    "https://models.inference.ai.azure.com", 
    new AzureKeyCredential(apiKey)
  );

  console.log(`Contact Details ${contactDetails}`)
  console.log(`Bing Results ${bingResults}`) 

  const messages = [
    {role: "user",
    content: `You are an expert in researching on individuals and preparing a report on them to prepare other members of the team for the meeting. You should investigate social media platforms, news articles, and any other public information about the individual and prepare a report on them. Anything that might indicate how to best communicate, work with or collaborate with them should be included in the report. You must include all references/source URL for any material you include in the report. Research on ${contactDetails} and prepare a report on them to prepare other members of the team for the meeting based on these search results: ${bingResults}`},
  ];

  try {
      console.log('Sending request to Azure OpenAI...');
      const response = await client.path("/chat/completions").post({
          body: {
              messages: messages,
              model: model
          }
      });
      console.log('Received response from Azure OpenAI.');

      if (response.status !== "200") {
          throw response.body.error;
      }
      console.log(response.body.choices[0].message.content);

      return response.body.choices[0].message.content;
  } catch (error) {
      console.error('Azure OpenAI Error:', error);
      throw error;
  }
}

export default openAIAnalysis;