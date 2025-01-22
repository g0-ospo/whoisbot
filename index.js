/**
 * WhoisBot - A tool for gathering and analyzing information about individuals
 * 
 * This tool combines Bing Search and Azure OpenAI to create comprehensive reports
 * about individuals based on publicly available information. It supports multiple
 * output formats including PDF, Markdown, and plain text.
 * 
 * Environment variables required:
 * - BING_API_KEY: API key for Bing Search
 * - OPENAI_API_KEY: API key for Azure OpenAI
 * 
 * Usage:
 * node index.js -c "Person Email or Name" [-f <format>]
 * where format can be: pdf, markdown, plain (default)
 */

import { bingSearch } from './bingSearch.js';
import openAIAnalysis from './openAIAnalysis.js';
import { Command } from 'commander';
import PDFDocument from 'pdfkit'; // Added import for PDFKit
import fs from 'fs'; // Added import for filesystem

const program = new Command();

program
  .option('-f, --format <type>', 'output format: pdf, markdown, plain', 'plain')
  .option('-c, --contact <details>', 'contact details of the person');

program.parse(process.argv);

const options = program.opts();

/**
 * Main WhoisBot function that orchestrates the information gathering and analysis
 * @param {string} contactDetails - Name or identifier of the person to research
 * @param {string} format - Output format (pdf, markdown, plain)
 */
async function whoisbot(contactDetails, format) {
  const bingApiKey = process.env.BING_API_KEY;
  const openAiApiKey = process.env.OPENAI_API_KEY;

  try {
    const bingResults = await bingSearch(contactDetails, bingApiKey);
    const analysis = await openAIAnalysis(contactDetails, bingResults, openAiApiKey);

    let output;
    switch (format) {
      case 'pdf':
        const doc = new PDFDocument();
        const filePath = `./${contactDetails.replace(/\s+/g, '_')}_analysis.pdf`;
        doc.pipe(fs.createWriteStream(filePath));
        doc.text(`Analysis Report for ${contactDetails}\n\n${analysis}`);
        doc.end();
        output = `PDF report generated at ${filePath}`;
        break;
      case 'markdown':
        output = `# Analysis\n\n${analysis}`;
        break;
      case 'plain':
      default:
        output = analysis;
        break;
    }

    console.log(output);
  } catch (error) {
    console.error('Error in whoisbot:', error);
  }
}

// CLI argument handling
if (options.contact) {
  whoisbot(options.contact, options.format);
} else {
  console.error('Please provide contact details using the -c or --contact option.');
}
