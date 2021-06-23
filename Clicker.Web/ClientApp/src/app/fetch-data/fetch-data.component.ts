import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public forecasts: Bindigs[];

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.get<Bindigs[]>(baseUrl + 'GetBinding').subscribe(result => {
      this.forecasts = result;
    }, error => console.error(error));
  }
}

interface Bindigs {
  DisplayName: string;
  DNS: string;
  IP: string;
}
