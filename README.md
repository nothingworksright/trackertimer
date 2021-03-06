# ⏱ trackerTimer API Server  

Network analysis of tracking elements.  

This is the source code repository for the [trackerTimer API Server](https://trackertimerapi.herokuapp.com/).  
This API is consumed by the [trackerTimer Web App](https://trackertimerwebapp.herokuapp.com/).  

## Getting Started  

[Click here to visit the trackerTimer API Server](https://trackertimerapi.herokuapp.com/).  

Simply and easily deploy this API to Heroku using this button:  

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)  

## About  

### Network Analysis  

The trackerTimer API uses [PhantomJS](http://phantomjs.org/) with [confess.js](https://github.com/jamesgpearce/confess) to generate [network analysis](http://phantomjs.org/network-monitoring.html) waterfall diagrams.  

To generate a report, make an http call to the API that includes a ```url``` query string parameter.  

For example, if the API lives at ```https://trackertimerapi.herokuapp.com/``` and the URL being analyzed is ```https://www.github.com``` then the http call could be something like this:  

```
const request = require('request')
const url = 'https://trackertimerapi.herokuapp.com/?url=https://www.github.com'
request(url, (err, res, body) => console.log(body))

```

ℹ **Note**: *trackerTimer is an alpha, open-source project.*  
