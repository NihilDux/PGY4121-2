import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LocalapiService } from 'src/services/localapi.service';
import { groups } from 'src/models/groups';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  groups: any[] = [];


  constructor(
    private http: HttpClient,
    private api : LocalapiService,
  ) {}

  ngOnInit() {
    this.api.getGroups().subscribe((data: any) => {
      this.groups = data;
      console.log(this.groups);
    });
  }
  

}
