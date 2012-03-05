window.onload = function(){
	if (navigator.userAgent && (~navigator.userAgent.indexOf('iPhone') || ~navigator.userAgent.indexOf('iPad'))) {
		Picup.convertFileInput(document.getElementById('image'), {
			referrername: escape('Picup plus node.js'),
			purpose: escape('Testing'),
			postURL: escape('http://192.168.1.71:1337/images/'),
			returnServerResponse: true
		})
	}
}