var http = require('http')
var queryString = require('querystring')

// request holds the request to an API Call
var request = {
  host: '',
  method: '',
  path: '',
  headers: {},
  body: {},
  queryParams: {},
  test: false, // use this to allow for http calls
  port: ''     // set the port for http calls
}

var emptyRequest = JSON.parse(JSON.stringify(request));

var response = {
  'statusCode': '',
  'body': {},
  'headers': {}
}
