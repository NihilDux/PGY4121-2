import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from "rxjs/operators";
import { groups } from 'src/models/groups';

@Injectable({
  providedIn: 'root'
})
export class LocalapiService {


  constructor(public http: HttpClient) { }

  apiURL = 'http://localhost:3000'


  getGroups() {
    return this.http.get(`${this.apiURL}/groups`).pipe(
      retry(3)    
    );
  }

  geGroup(id: number) {
    return this.http.get(`${this.apiURL}/groups/${id}`).pipe(
      retry(3)
    );
  }



}