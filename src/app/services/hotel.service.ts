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
  //host = 'http://luciferwilling.ddns.net/appnhatro/';
  host = 'https://nhatroservice.000webhostapp.com/';
  getAllHotels() {
    let URL = this.host + "getAllPhong.php";
    return this.http.get(URL).map(res => res.json());
  }
  getUserID(id) {
    let URL =  this.host + "getuserid.php?id=" + id;
    return this.http.get(URL).map(res => res.json());
  }
  getImgID(id) {
    let URL = this.host + "getImgID.php?id=" + id;
    return this.http.get(URL).map(res => res.json());
  }
  deleteID(id) {
    let URL = this.host + "deleteID.php?id=" + id;
    return this.http.get(URL).map(res => res.text());
  }
  getCity(): Observable<ObjectJson> {
    return this.httpClient.get('./assets/json/thanhpho.json');
  }
  getDistrict(): Observable<ObjectJson> {
    return this.httpClient.get('./assets/json/quanhuyen.json');
  }
  getDescHotels() {
    let URL = this.host + "getAcsPhong.php";
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
  addNews(data){
    let URL = this.host + "addNews.php";
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.post(URL, JSON.stringify({ data: data }), options).map(res => res.text());
  }
  uploadImgNews(id, arr){
    let URL = this.host + "uploadImage.php";
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.post(URL, JSON.stringify({ id: id, arr: arr}), options).map(res => res.text());
  }
}
