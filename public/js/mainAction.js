/**
 * http://usejsdoc.org/
 */

var socket = io().connect('http:192.168.2.8:3720/NIndex');
var clients=0;
var localStream=null;
var connection;
var mediaConstraints = {
		"mandatory": {
		OfferToReceiveAudio: true,
		OfferToReceiveVideo: true
}
};
socket.on('clients',function(data){
	clients=data.clients;
	document.getElementById('clients').value=clients;
});
socket.on('offer',function(data){
	console.log(data);
	connection.setRemoteDescription(new RTCSessionDescription(data),function(){},handleCreateAnswerError);
	connection.createAnswer(setLocalDescriptionAnswer,null,mediaConstraints);	
});
socket.on('answer',function(data){
	connection.setRemoteDescription(new RTCSessionDescription(data));

});
socket.on('candidate',function(data){
	var signal = JSON.parse(data);
	var candidate=new RTCIceCandidate(signal.ice);
	connection.addIceCandidate(candidate);
	console.log('candidate recived');
});
window.getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
//window.getUserMedia = navigator.getUserMedia.bind(navigator) || navigator.mozGetUserMedia.bind(navigator) || navigator.webkitGetUserMedia.bind(navigator);
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.iceServers = {
		iceServers: [
		             {url: "stun:23.21.150.121"},
		             {url: "stun:stun.1.google.com:19302"}
		             ]   
};

var onUserMediaSuccess=function(stream){
	localStream=stream;
	document.getElementById('localVideo').src=window.URL.createObjectURL(stream);

	createPeerConnection();
}
var onUserMediaFailure=function(error){
	console.log(error);
}
var setLocalDescription=function(sessionDescription){
	connection.setLocalDescription(sessionDescription);
	console.log(sessionDescription);
	console.log('offer recieved');
	socket.emit('offer',sessionDescription);
}
var setLocalDescriptionAnswer=function(sessionDescription){
	console.log('answer recieved');
	connection.addStream(localStream);
	connection.setLocalDescription(sessionDescription);
	socket.emit('answer',sessionDescription);
}
var createPeerConnection=function(){
	window.connection=new RTCPeerConnection(window.iceServers);
	connection.addStream(localStream);
	connection.onaddstream=function(event){
		document.getElementById('remoteVideo').src=window.URL.createObjectURL(event.stream);
		document.getElementById('remoteVideo').play();
		console.log('video streamed');
	}
	connection.onicecandidate=function(event){
		if (!event || !event.candidate) return;
		socket.emit('candidate',JSON.stringify({'ice': event.candidate}));
			console.log(event);
			
		
	}
	

	console.log(connection)
}
function handleCreateAnswerError(error) {
	  console.log('createAnswer() error: ', e);
	}
function doCall(){

	if(clients==2){
		//console.log(setLocalDescription);
		connection.createOffer(setLocalDescription,handleCreateAnswerError,mediaConstraints);

	}

}
getUserMedia({audio:true,video:true},onUserMediaSuccess,onUserMediaFailure);
