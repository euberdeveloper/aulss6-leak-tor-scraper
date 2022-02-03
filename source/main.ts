import './utils/moduleAlias';

import * as puppeteer from 'puppeteer';
import logger from 'euberlog';

async function main() {
    logger.info('Starting');
    const args = ['--proxy-server=socks5://127.0.0.1:9050'];
    const browser = await puppeteer.launch({ args });
    const page = await browser.newPage();
    await page.goto('https://check.torproject.org/');
    const isUsingTor = await page.$eval('body', el =>
        el.innerHTML.includes('Congratulations. This browser is configured to use Tor')
    );

    if (!isUsingTor) {
        logger.warning('Not using Tor. Closing...');
    }
    else {
        logger.info('Using Tor. Continuing... ');

        await page.goto('http://lockbitapt6vx57t3eeqjofwgcglmutr3a35nygvokja5uuccip4ykyd.onion/post/kmhWMR1nQDm7vn6Q61d085f0902a9');

        const titleSelector = 'div.post-big-title';
        await page.waitForSelector(titleSelector);

        const title = await page.$eval(titleSelector, (el: any) => el.innerText);
        logger.success(title);
    }
    await browser.close();
}
main();

/*
var $folder_id = $('.file-listing__content').attr('data-file-path');
  
  $.ajax({
    url: '/ajax/listing-post',
    type: 'post',
    data: 'explorer=true&root_dir=true' + '&folder_id=' + $folder_id,
    dataType: 'json',
    sync: true,
    success: function (response) {
      $(".file__back[data-listing='3']").attr('data-full-path', response['full_path']);
      $(".file-listing__content[data-listing='3']").children().remove();
      $(".file-listing__content[data-listing='3']").append(response['file_list']);
      $(".file-listing__content[data-listing='3']").attr('data-file-path', $folder_id);
      
      $(".publication-timer").attr('data-timer', response['timer']);
      
      var $timer_count = 1;
      let timerBlock = $('.publication-timer');
      let date = timerBlock.attr('data-timer');
      timer(date, timerBlock, $timer_count);
      $(".post-company-content .desc").text(response['description']);
      $(".post-download-btn").addClass('nonactive');
      if (response['can_download']) {
        $("button.post-archive-download-btn").removeClass('nonactive').attr('folder_id', $folder_id);
      } else {
        $("button.post-archive-download-btn").addClass('nonactive').removeAttr('folder_id');
      }
    }
  });
  */

  // response: {"full_path":"NYNOZ\/NODOMAIN\/","status":"good","msg":"Goood","file_list":["\r\n      <div class=\"file-listing__item \" data-dir=\"user\">\r\n      <div class=\"file-listing__name file__name--folder\">user<\/div>\r\n                <div class=\"file-listing__date\">7 Dec, 2021<\/div><div class=\"file-listing__size \">\u2014<\/div><\/div>\r\n              <\/div>\r\n              "],"folder_id":945,"timer":"Jan 15, 2022 21:42:00","description":"Scopri di pi\u00f9. marted\u00ec 21 Dicembre 2021 Variazioni orarie punti tampone dell'Ulss 6 Euganea il 25 dicembre e il 1 gennaio 2022 i punti tamponi sono chiusi.","can_download":"1"}

  // formdata: post http://lockbitapt6vx57t3eeqjofwgcglmutr3a35nygvokja5uuccip4ykyd.onion/ajax/listing-post explorer=true&child_dir=true&folder_id=945&path=user/C
  // res: {"full_path":"NYNOZ\/NODOMAIN\/user\/C","status":"good","msg":"Goood","file_list":["\r\n          <div class=\"file-listing__item \" data-dir=\"user\/C\/Users\">\r\n          <div class=\"file-listing__name file__name--folder\">Users<\/div>\r\n                    <div class=\"file-listing__date\">7 Dec, 2021<\/div><div class=\"file-listing__size \">\u2014<\/div><\/div><\/div>"],"folder_id":945,"back_dir":"user\/C","files_amount":1}

  // download: http://lockbitapt6vx57t3eeqjofwgcglmutr3a35nygvokja5uuccip4ykyd.onion/ajax/listing-post?file-download=true&folder-id=945&data-dir=user%2FC%2FUsers%2FAdmin%2FDocuments%2Faulss%2Fulss2%2Fdata%2Fulss17.it.c061dpssa%2F01.01.2021.docx

  /*
    1. Get folder id
    2. Get root and parse result
    3. iterate: get root and parse result
    4. The parse result creates a tree and leafs are just file names (node(path, type, children))
    5. Recursively, pass the whole tree, mkdir and download files
    */