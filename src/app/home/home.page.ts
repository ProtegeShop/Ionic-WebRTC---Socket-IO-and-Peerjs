import Peer from 'peerjs';
import { Socket } from 'socket.io-client';
import { SocketService } from './../services/socket.service';
import { WebrtcpeerService } from './../services/webrtcpeer.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoCapturePlus, VideoCapturePlusOptions, MediaFile } from '@ionic-native/video-capture-plus/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private webrtcpeerService: WebrtcpeerService, private socketService: SocketService) {
  }

  socketConnected: Socket;

  feedRoute: boolean = false;
  watchAt: string;

  mediaStream: MediaStream;

  myPeer: Peer;
  peers: any = {}; // list of connected peers

  videoTrack;
  capabilities;
  settings;

  min
  max
  step
  value

  ngOnInit(): void { }

  async startStream() {
    this.socketConnected = await this.socketService.startStream();
    // wait for connection status
    this.socketService.listenToServer('connected').subscribe((res) => {
      if (res) this.getMedia();

    })
  }

  stopStream() {
    this.socketConnected.disconnect();
    this.watchAt = "";
    this.mediaStream.getTracks();
    const stream = this.mediaStream;
    const tracks = stream.getTracks();
    tracks.forEach(t => t.stop())
    // document.querySelector('video')
    this.feedRoute = false;
  }

  getMedia() {
    const myVideo = document.querySelector('video');
    myVideo.muted = true;

    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment'
      },
      audio: true
    }).then(stream => {
      this.mediaStream = stream;

      // set camera controls
      this.cameraControls(stream);
      // show my stream locally
      this.addVideoStream(myVideo, stream);

      console.log(stream)

      // create a room for others to join
      this.webrtcpeerService.createPeer().then((peer) => {
        this.myPeer = peer;
        console.log(this.myPeer)
        // on peer connection established 
        peer.on('open', (id) => {
          console.log(id)
          // send room id to server
          this.socketService.emitToServer('join-room', 'room' + id, id);
          this.feedRoute = true;
          // res will be used as room
          this.watchAt = `https://192.168.0.115:8100/watch/room${id}`;
        })
      }).catch((e) => {
        console.log(e)
      })

      // listen to connection event
      this.socketService.listenToServer('user-connected').subscribe((userId) => {
        console.log(userId)
        const call = this.myPeer.call(userId, stream);
        call.on('close', () => {
          // remove peer from this.peers 
        })
        // add new user
        this.peers[userId] = call;
        console.log(this.peers)
      })
    })
  }

  // show my stream
  addVideoStream(video: HTMLVideoElement, stream: MediaStream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
  }

  // Get video track capabilities and settings.
  cameraControls(stream: MediaStream) {
    [this.videoTrack] = stream.getVideoTracks();
    this.capabilities = this.videoTrack.getCapabilities();
    this.settings = this.videoTrack.getSettings();


    console.log(this.videoTrack)
    console.log(this.capabilities)
    console.log(this.settings)

    // Check whether zoom is supported or not.
    if (!('zoom' in this.settings)) {
      return Promise.reject('Zoom is not supported by ' + this.videoTrack.label);
    }

    // Map zoom to a slider element.
    this.min = this.capabilities.zoom.min;
    this.max = this.capabilities.zoom.max;
    this.step = this.capabilities.zoom.step;
    this.value = this.settings.zoom;

  }

  onZoom(event) {
    this.videoTrack.applyConstraints({ advanced: [{ zoom: event.target.value }] });
  }

}



