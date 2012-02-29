var http = require('http')
	, path = require('path')
	, fs = require('fs')
	, formidable = require('formidable')

function getContentPath(requestUrl) {
	var filePath = './content' + requestUrl
	if (filePath == './content/') {
		filePath = './content/index.html'
	}
	return filePath
}

function getContentType(filePath) {
	var extname = path.extname(filePath)
		, contentType
	switch (extname) {
		case '.js':
			contentType = 'text/javascript'
			break
		default:
			contentType = 'text/html; charset=utf-8'
			break
	}
	return contentType
}

function processGet(request, response) {
	filePath = getContentPath(request.url)

	path.exists(filePath, function(exists) {
		if (exists) {
			fs.readFile(filePath, function(error, content) {
				if (error) {
					response.writeHead(500)
					response.end()
				} else {
					response.writeHead(200, { 'Content-Type': getContentType(filePath)})
					response.end(content, 'utf-8')
				}
			})
		} else {
			response.writeHead(404)
			response.end()
		}
	})
}

http.createServer(function (request, response) {
	console.log(request.method, request.url)
	
	switch(request.method.toLowerCase()){
		case 'post':
			var form = new formidable.IncomingForm()
			form.parse(request, function(error, fields, files){
				console.log(request, fields, files);
			})
			break
		
		default:
			processGet(request, response)
			break
	}

}).listen(1337, "192.168.1.71")

console.log('Server running at http://192.168.1.71:1337/')