'use strict';
// 载入模块
var Segment = require('segment');
// 创建实例
var segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();


function delHtmlTag(str) {
    return str.replace(/<[^>]+>/g, "");//去掉所有的html标记
}

function tokenize(seg, text) {
    return seg.doSegment(
        delHtmlTag(text),
        {
            simple: true,
            stripPunctuation: true,
            stripStopword: true,
            convertSynonym: true
        }
    )
}

module.exports = function (locals) {
    var config = this.config;
    var searchConfig = config.search;
    var searchfield = searchConfig.field;

    var posts;
    var pages;

    if (searchfield.trim() != '') {
        searchfield = searchfield.trim();
        if (searchfield == 'post') {
            posts = locals.posts.sort('-date');
        } else if (searchfield == 'page') {
            pages = locals.pages;
        } else {
            posts = locals.posts.sort('-date');
            pages = locals.pages;
        }
    } else {
        posts = locals.posts.sort('-date');
    }

    var data = [];

    posts.forEach(function (post) {
        var item = {
            title: post.title,
            url: post.permalink,
            content: delHtmlTag(post.content),
            title_tokenize: tokenize(segment, post.title),
            content_tokenize: tokenize(segment, post.content)
        };
        data.push(item);
    });

    return {
        path: searchConfig.path,
        data: JSON.stringify(data)
    };
};
