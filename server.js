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


function processPost(request, response, callback) {
	var form = new formidable.IncomingForm()
		, filename
	form.parse(request, function(error, fields, files){
		if (error) {
			response.writeHead(500)
			response.end()
		} else {
			console.log(request, fields, files)
			
			filename = "images/" + files.image.name
			
			fs.readFile(files.image.path, function(error, data){
				if (error) throw error
				
				fs.writeFile(filename, data, function(error) {
					if (error) throw error
					response.writeHead(201, { 
						'Content-Type': 'application/json', 
						'Location': '/' + filename
					})
					response.end('{"image":"/' + filename + '"}', 'utf-8')
				})
			})
		}
	})
	if(callback) {
		callback(request, response)
	}
}

function processGet(request, response, callback) {
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
	if(callback) {
		callback(request, response)
	}
}

http.createServer(function (request, response) {
	console.log(request.method, request.url)
	
	switch(request.method.toLowerCase()){
		case 'post':
			processPost(request, response)
			break
		
		default:
			processGet(request, response)
			break
	}

}).listen(1337, "192.168.1.71")

console.log('Server running at http://192.168.1.71:1337/')