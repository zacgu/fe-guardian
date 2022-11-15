import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import waitOn from 'wait-on';

/**
 * 判断 url 是否可达
 * @param url
 * @param upTimeout
 */
export async function checkURLIsAvailable(url, upTimeout) {
  // url 对象
  const u = new URL(url);
  // 获得 协议头
  const protocol = u.protocol.substring(0, u.protocol.length - 1);
  // 重新组装 url
  const urlToWaitOn = `${protocol}-get:${u.href.slice(u.protocol.length)}`;
  const waitOnOpts = {
    resources: [urlToWaitOn],
    timeout: upTimeout,
    auth: u.username
      ? { username: u.username, password: u.password }
      : undefined,
  };
  return await waitOn(waitOnOpts);
}

export async function triggerAudit(
  url: string,
  chromePort: number,
  chromePath?: string,
  lighthouseConfig: object = {}
) {
  // 测试性能
  // 初始化 puppeteer
  let result = {};
  let browser: puppeteer.Browser;
  try {
    // 获得 puppeteer options
    const puppeteerOptions: puppeteer.PuppeteerNodeLaunchOptions = {
      args: [`--remote-debugging-port=${chromePort}`, '--no-sandbox'],
    };

    // 判断是否使用外部 chrome
    if (chromePath) {
      puppeteerOptions.executablePath = chromePath;
    }

    // 开启浏览器
    browser = await puppeteer.launch(puppeteerOptions);
  } catch (err) {
    console.error(err);
    return 'error2';
  }

  // 运行 lighthouse
  try {
    const results = await lighthouse(
      url,
      {
        port: chromePort,
        disableStorageReset: true,
      },
      {
        extends: 'lighthouse:default',
        ...lighthouseConfig,
      }
    );

    // 获得 json 报告
    const { lhr } = results;
    if (!lhr) {
      throw new Error('Lighthouse audit did not return a valid report.');
    }
    result = lhr;
  } catch (err) {
    // 更新完成的时间
    console.info(err);
  } finally {
    // 关闭浏览器
    browser.close();
  }
  return JSON.stringify(result);
}
