import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'socket.io-client';
import { Subscription } from 'rxjs';
import { SocketService } from '../services/socket.service';
import { WebrtcpeerService } from '../services/webrtcpeer.service';
import Peer from 'peerjs';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.page.html',
  styleUrls: ['./watch.page.scss'],
})
export class WatchPage implements OnInit {
  constructor(private acRoute: ActivatedRoute, private router: Router, private webrtcpeerService: WebrtcpeerService, private socketService: SocketService) {
  }

  socketConnected: Socket;

  roomId: string;
  myPeer: Peer;

  ngOnInit(): void {
    this.acRoute.paramMap.subscribe(async (paramMap) => {
      this.roomId = paramMap.get('id');  // room id to connect
      // connect to server
      this.socketConnected = await this.socketService.startStream();
      // wait for connection status
      this.socketService.listenToServer('connected').subscribe((res) => {
        console.log(res)
        // create peer connection
        this.webrtcpeerService.createPeer().then((peer) => {
          this.myPeer = peer;
          peer.on('open', (id) => {
            // send room id to server
            console.log("peerId roomId", id, this.roomId)
            this.socketService.emitToServer('join-room', this.roomId, id);
          })

          this.myPeer.on('call', call => {
            console.log("is calling", call)
            // answer call
            call.answer();
            // create video element
            const video = document.querySelector('video');
            // get call stream
            call.on('stream', stream => {
              // display stream
              this.addVideoStream(video, stream);
            })
          })
        })
      })
    })
  }

  // show my stream
  addVideoStream(video: HTMLVideoElement, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
  }
}
