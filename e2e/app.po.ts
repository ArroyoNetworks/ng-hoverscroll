import { browser, element, by } from 'protractor';

export class NgHoverscrollPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('demo-root h1')).getText();
  }
}
