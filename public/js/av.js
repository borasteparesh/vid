/**
 * http://usejsdoc.org/
 */

var socket = io();
var mediaConstraints = {

		OfferToReceiveAudio : true,
		OfferToReceiveVideo : true

};
var offerer, answerer;
var offererToAnswerer = document.getElementById('peer1-to-peer2');
var answererToOfferer = document.getElementById('peer2-to-peer1');

window.RTCPeerConnection = window.mozRTCPeerConnection
|| window.webkitRTCPeerConnection;
window.RTCSessionDescription = window.mozRTCSessionDescription
|| window.RTCSessionDescription;
window.RTCIceCandidate = window.mozRTCIceCandidate
|| window.RTCIceCandidate;

navigator.getUserMedia = navigator.mozGetUserMedia
|| navigator.webkitGetUserMedia;
window.URL = window.webkitURL || window.URL;

window.iceServers = {
		iceServers : [ {
			url : 'stun:23.21.150.121'
		} ]
};

function createOffererPeer(stream) {
	offerer = new RTCPeerConnection(window.iceServers);
	console.log('offerer created');

	offerer.addStream(stream);
	socket.emit('newAnswere', 'nothing');
	offerer.onaddstream = function(event) {

		offererToAnswerer.src = URL.createObjectURL(event.stream);
		offererToAnswerer.play();

	}};

	function oniceCandidateAnswerer(candidate){
		offerer.onicecandidate = answerer.addIceCandidate(event.candidate);
	};


	function createOffer(offer){
		/*offerer.createOffer(function(offer) {
			offerer.setLocalDescription(offer);
			console.log("Creating of offerer ,stream to answererPeer");
			answererPeer(offer, stream); //call answerer peer socket broadcast here
		}, onSdpError, mediaConstraints);*/
		socket.emit('offer','offer');
	};
	function createAnswer(answer){
		/*offerer.createOffer(function(offer) {
			offerer.setLocalDescription(offer);
			console.log("Creating of offerer ,stream to answererPeer");
			answererPeer(offer, stream); //call answerer peer socket broadcast here
		}, onSdpError, mediaConstraints);*/
		socket.emit('answer','answer');
	};

	socket.on('newOffer', function(data) {
		log(data.username + ' new offeer recieved');

	});
	socket.on('newAnswere', function(data) {
		log(data.username + ' new ans recieved');

	});

	function getUserMedia(callback) {
		navigator.getUserMedia({
			audio: true,
			video: true
		}, callback, onerror);

		function onerror(e) {
			console.error(e);
		}
	}

	getUserMedia(function (stream) {
		offererPeer(stream);
	});

	function onSdpError(e) {
		console.error('onSdpError', e);
	}

	function onSdpSucces() {
		console.log('onSdpSucces');
	}