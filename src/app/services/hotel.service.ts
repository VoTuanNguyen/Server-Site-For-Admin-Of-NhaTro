import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable'

import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http'
interface ObjectJson {
  nameAttr: string[]
}
@Injectable()
export class HotelService {
  //khai báo và khởi tạo các biến
  http: any;
  httpClient: any;
  static get parameters() {
    return [Http, HttpClient];
  }

  constructor(http, httpClient) {
    this.http = http;
    this.httpClient = httpClient;
  }
  //lấy danh sách hotel
  getAllHotels() {
    let URL = "http://luciferwilling.ddns.net/appnhatro/getAllPhong.php";
    return this.http.get(URL).map(res => res.json());
  }
  getUserID(id) {
    let URL = "http://luciferwilling.ddns.net/appnhatro/getuserid.php?id=" + id;
    return this.http.get(URL).map(res => res.json());
  }
  getImgID(id) {
    let URL = "http://luciferwilling.ddns.net/appnhatro/getImgID.php?id=" + id;
    return this.http.get(URL).map(res => res.json());
  }
  deleteID(id) {
    let URL = "http://luciferwilling.ddns.net/appnhatro/deleteID.php?id=" + id;
    return this.http.get(URL).map(res => res.text());
  }
  getCity(): Observable<ObjectJson> {
    return this.httpClient.get('./assets/json/thanhpho.json');
  }
  getDistrict(): Observable<ObjectJson> {
    return this.httpClient.get('./assets/json/quanhuyen.json');
  }
  getDescHotels() {
    let URL = "http://luciferwilling.ddns.net/appnhatro/getAcsPhong.php";
    return this.http.get(URL).map(res => res.json());
  }
  getLocation(key) {
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    let options = new RequestOptions({
      headers: headers
    });
    let URL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?placeid=" + key + "&key=AIzaSyC9hXBNhK5zuePc2RftV09n3Ao9IPE2tRA"
    return this.http.post(URL, options).map(res => res.json());
  }
  getAddress(key) {
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    let options = new RequestOptions({
      headers: headers
    });
    let url = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+key+"&types=geocode&language=vi&key=AIzaSyC9hXBNhK5zuePc2RftV09n3Ao9IPE2tRA";
    return this.http.post(url, options)
    .map(res => res.json());
  }
}
