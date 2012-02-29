var http = require('http')
	, path = require('path')
	, fs = require('fs')

function getContentPath(requestUrl) {
	var filePath = './content' + requestUrl
	if (filePath == './content/') {
		filePath = './content/index.html'
	}
	return filePath
}

http.createServer(function (request, response) {
	console.log(request.method, request.url)
	
	filePath = getContentPath(request.url)
	
	path.exists(filePath, function(exists) {
		if (exists) {
			fs.readFile(filePath, function(error, content) {
				if (error) {
					response.writeHead(500)
					response.end()
				} else {
					response.writeHead(200, { 'Content-Type': 'text/html'})
					response.end(content, 'utf-8')
				}
			})
		} else {
			response.writeHead(404)
			response.end()
		}
	})

}).listen(1337, "192.168.1.71")

console.log('Server running at http://192.168.1.71:1337/')