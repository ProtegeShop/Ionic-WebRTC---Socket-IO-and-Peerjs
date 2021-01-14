import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import * as io from 'socket.io-client';
import { Socket } from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private http: HttpClient, private router: Router) {
  }

  readonly APIURL = "https://webrtcstestserver.herokuapp.com";

  private clientSocket: Socket;

  getPeerkey() {
    return this.http.get(this.APIURL + '/newId').toPromise();
  }

  async startStream() {
    return this.clientSocket = io.io(this.APIURL);
  }

  // not required in the plugin
  listenToServer(eventName): Observable<any> {
    return new Observable((subscribe) => {
      this.clientSocket.on(eventName, (data) => {
        subscribe.next(data);
      })
    })
  }

  stopStream() {
  }

  emitToServer(eventName, roomId, userId) {
    this.clientSocket.emit(eventName, roomId, userId);
  }

  emitToVideo(eventName, roomId, dataStream) {
    this.clientSocket.emit(eventName, roomId, dataStream);
  }
}
