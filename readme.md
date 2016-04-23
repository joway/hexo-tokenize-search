# hexo-tokenize-search

[Website Demo](https://joway.wang/search/)

[Json Demo](https://joway.wang/search.json)

[中文: Hexo折腾记——静态站点搜索](https://joway.wang/posts/Hexo/2016-04-23-hexo-search.html) 

## Dependence

Tokenize Dependence: [Segment](https://github.com/leizongmin/node-segment)

Supports chinese and english tokenize .

## Installation

    $ npm install hexo-tokenize-search --save

## Usage :

### Config the search json

You can custom the json path in your global _config.xml

	search:
	  path: search.json

When the plugin is installed , it will auto generator search.json (by default) in your root context.

The json is a array and each element will be included 5 field like this :
``` json
[
{
"title": "xxxxxx",
"url": "xxxxxx" ,
"content": "xxxxxx" ,
"title_tokenize": "xx xx xx xx",
"content_tokenize": "xx xx xx xx"
},
{
...
}
]
```

I removed html tags in the content field and remove punctuations in the tokenize field .

### Use the search.json

You can use your query to custom sort the json array.

There is my simple example:

> search.html

``` html
<form action="/search" method="get" style="text-align: center">
    <input type="text" class="st-default-search-input search" id="search"
           placeholder=" Search..." name="query" style="height: 40px">
</form>
<div id='result'></div>
<script src='/js/search.js'></script>
```

> search.js

	function getParameterByName(name, url) {
	    if (!url) url = window.location.href;
	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
	
	function calcScore(key, tokenize) {
	    var score = 0;
	    for (var x = 0; x < tokenize.length; ++x) {
	        if (tokenize[x] == null) {
	            break;
	        }
	        for (var i = 0; i < key.length; ++i) {
	            for (var t = 0; t < tokenize[x].length; ++t) {
	                if (tokenize[x][t] == key[i]) {
	                    score++;
	                }
	            }
	
	        }
	    }
	    return score;
	}
	
	function addCountToJson(key, json) {
	    for (var i = 0; i < json.length; ++i) {
	        // 题目匹配权重100 , 内容匹配权重1 , 匹配算法: 单字匹配 (待优化)
	        json[i]['score'] = calcScore(key, json[i].content_tokenize) + calcScore(key, json[i].title_tokenize) * 100;
	    }
	}
	
	
	// 按 json 元素 score 值进行排序
	function quickSort(json) {
	    if (json.length <= 1) {
	        return json;
	    }
	    var pivotIndex = Math.floor(json.length / 2);
	    var pivot = json.splice(pivotIndex, 1)[0]; // 基准
	    var left = [];
	    var right = [];
	    for (var i = 0; i < json.length; i++) {
	        if (json[i].score < pivot.score) {
	            left.push(json[i]);
	        } else {
	            right.push(json[i]);
	        }
	    }
	    return quickSort(left).concat(pivot, quickSort(right));
	}
	
	window.onload = function () {
	
	    var query = getParameterByName('query');
	    if (query == null) {
	        query = '';
	    }
	
	    $(".st-default-search-input").val(query);
	    $.get("../search.json", function (result) {
	        addCountToJson(query, result);
	        result = quickSort(result);
	        for (var i = result.length - 1; i >= 0; --i) {
	            $("#result").append('<a href="' + result[i].url + '"' + ' target="_blank"' + '><li>' + result[i].title + ' 评分: ' + result[i].score + '</li></a>');
	        }
	    });
	};

## Thanks

[hexo-search](https://github.com/forsigner/hexo-search)
