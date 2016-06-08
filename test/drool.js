'use strict'





const assert = require('assert')
const drool = require('drool')
const path = require('path')
const webdriver = require('selenium-webdriver')





let driver = drool.start({
  chromeOptions: 'no-sandbox'
})





drool.flow({
  setup: () => {
    driver.get('file://' + path.join(__dirname, 'test.html'));
  },
  action: () => {
    driver.findElement(webdriver.By.css('#mocha'));
  },
  assert: (after, initial) => {
    assert.notEqual(initial.counts.nodes, after.counts.nodes, 'node count should not match');
  }
}, driver)

driver.quit()
