import { NgHoverscrollPage } from './app.po';

describe('ng-hoverscroll App', function() {
  let page: NgHoverscrollPage;

  beforeEach(() => {
    page = new NgHoverscrollPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('demo works!');
  });
});
