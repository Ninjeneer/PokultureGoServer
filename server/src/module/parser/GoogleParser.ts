import { parse } from 'node-html-parser';
import axios from 'axios';

export default class GoogleParser {
  private baseUrl = "https://www.google.com/search?client=ubuntu&hs=16P&channel=fs&biw=1920&bih=977&gbv=1&tbm=isch&sxsrf=ALeKk02X5gNTeqi99FXVKFg3gHsOESzYFQ%3A1612375548470&oq=&aqs=&q="

  constructor() { }

  public async getImageForKeywords(keywords: string, limit?: number) {
    const page = parse((await (axios.get(this.baseUrl + keywords.replace(' ', '+')))).data);
    const imgs = page.querySelectorAll(".t0fcAb");
    const imgUrls = imgs.map((element) => element.getAttribute("src"));
    if (limit) {
      return imgUrls.slice(0, limit);
    }
    return imgUrls;
  }
}
