import type { NextApiRequest, NextApiResponse } from 'next'

// ! Library
import { JSDOM } from "jsdom";
import { chromium } from 'playwright';

export default async (_: NextApiRequest, res: NextApiResponse) => {
  const url = "http://feeds.bbci.co.uk/news/rss.xml"
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.goto(url);
    const htmlContent = await page.content();
    const domContent = new JSDOM(htmlContent).window.document;
    const rssEntries = Array.from(domContent.querySelectorAll("#item"));

    const rssJson = rssEntries.map(entry => {
      const rssAnchorTag = entry.querySelector("a");

      return {
        title: rssAnchorTag?.textContent,
        href: rssAnchorTag?.getAttribute("href"),
        description: entry.querySelector("div")?.textContent
      }
    })

    res.status(200).json({ results: rssJson, error: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ results: [], error: true });
  } finally {
    await browser.close();
  }
}
