import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { ChartModel } from './chart-model';
import { HttpHeaders } from '@angular/common/http';

const headers: HttpHeaders = new HttpHeaders()
  .set('Content-Type', 'application/json');

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public data: ChartModel[];
  public bradcastedData: ChartModel[];

  private hubConnection: signalR.HubConnection

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44311/chart/', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }).configureLogging(signalR.LogLevel.Information)
        .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public addTransferChartDataListener = () => {
    this.hubConnection.on('transferchartdata', (data) => {
      this.data = data;
    });
  }
}
