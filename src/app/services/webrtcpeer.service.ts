import { SocketService } from './socket.service';
import { Injectable, OnInit } from '@angular/core';
import Peer from 'peerjs';

@Injectable({
  providedIn: 'root'
})
export class WebrtcpeerService implements OnInit {
  constructor(private socketService: SocketService) { }

  peer: Peer;
  peerId
  myStream: MediaStream;
  myEl: HTMLMediaElement;

  ngOnInit() { }

  async createPeer() {
    this.peer = new Peer(undefined);
    return this.peer;
  }



}
