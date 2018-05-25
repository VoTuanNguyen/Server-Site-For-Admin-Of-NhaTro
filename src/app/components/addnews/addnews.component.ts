import { Component, OnInit, ViewChild } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-addnews',
  templateUrl: './addnews.component.html',
  styleUrls: ['./addnews.component.css']
})
@Injectable()
export class AddnewsComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  marker: google.maps.Marker;
  file: File = null;
  listImg = [];
  dem = 0;
  tinhthanh;
  quanhuyen;
  district;
  constructor(private hotelService: HotelService, private http: HttpClient) { }

  ngOnInit() {
    //lấy dữ liệu tỉnh thành và quận huyện đưa vào combobox
    this.hotelService.getCity().subscribe(data => {
      this.tinhthanh = data;
      this.tinhthanh = this.tinhthanh.thanhpho;
    });

    this.hotelService.getDistrict().subscribe(data => {
      this.quanhuyen = data;
      this.quanhuyen = this.quanhuyen.quanhuyen;
      //Đổ dữ liệu cho cbb quận huyện
      let l = this.quanhuyen.length;
      this.district = [];
      for (var i = 0; i < l; i++) {
        if (this.quanhuyen[i].idtp == '1') {// Các quận huyện ở Hà Nội
          this.district.push(this.quanhuyen[i]);
        }
      }
    });
    // khởi tạo map
    const myLatlng = new google.maps.LatLng(10.8454899, 106.7945204)
    var mapOptions = {
      center: myLatlng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapOptions);
    this.map.addListener('click', function (event) {
      localStorage.setItem('lat', event.latLng.lat());
      localStorage.setItem('lng', event.latLng.lng());
      localStorage.setItem('flag', 'true');
    });
  }
  clickMap() {
    if(localStorage.getItem('flag') == 'true'){
      localStorage.removeItem('flag');
      setTimeout(this.makeMarker(localStorage.getItem('lat'), localStorage.getItem('lng')), 500);
    }
  }
  onFileSelect(event: FileList) {
    let arr = this.listImg.length > 0 ? this.listImg : [];
    let len = event.length;
    for (var i = 0; i < len; i++) {
      this.file = event.item(i);
      var reader = new FileReader();
      reader.onload = (ev: any) => {
        //console.log(ev.target.result);
        let temp = {
          id: '',
          img: ''
        };
        temp.id = this.dem.toString();
        temp.img = ev.target.result;
        arr.push(temp);
        this.dem++;
      }
      reader.readAsDataURL(this.file);
    }
    this.listImg = arr;
    console.log(arr);
  }
  onSelectionChange(event) {
    console.log(event.target.getAttribute('value'));
  }
  myOnChange(event) {
    //
  }
  Gender(event) {
    console.log(event);
  }
  onChangeCity(value) {
    let len = this.quanhuyen.length;
    this.district = [];
    for (var i = 0; i < len; i++) {
      if (this.quanhuyen[i].idtp == value) {
        this.district.push(this.quanhuyen[i]);
      }
    }
  }
  address = [];
  onSearchChange(value) {
    this.address = [];
    let temp = [];
    let arr = {
      text: '',
      placeid: ''
    }
    if(value.length !== 0){
      this.hotelService.getAddress(value).subscribe(data => {
        temp = data.predictions;
        for(var i=0; i< temp.length; i++){
          arr.text = temp[i].description;
          arr.placeid = temp[i].place_id;
          this.address.push(arr);
        }
      });
    }
  }
  // showPosition(lat, lng) {
  //   let location = new google.maps.LatLng(Number(lat), Number(lng));
  //   this.map.panTo(location);// di chuyển tới vị trí marker
  //   //khởi tạo marker
  //   if (!this.marker) {
  //     this.marker = new google.maps.Marker({
  //       position: location,
  //       map: this.map,
  //       title: 'Đây là vị trí phòng trọ!'
  //     });
  //   } else {
  //     this.marker.setPosition(location);
  //   }
  // }
  makeMarker(lat, lng) {
    let location = new google.maps.LatLng(Number(lat), Number(lng));
    this.map.panTo(location);// di chuyển tới vị trí marker
    //khởi tạo marker
    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: 'Đây là vị trí phòng trọ!'
      });
    } else {
      this.marker.setPosition(location);
    }
  }
  keysearch;
  clickSearch(event){
    let key = event.target.getAttribute('id');
    this.keysearch = key.split('&text=')[1];
    this.address = [];
    let id = key.split('&text=')[0];
    this.hotelService.getLocation(id).subscribe(data => {
      this.makeMarker(data.result.geometry.location.lat, data.result.geometry.location.lng);
    });
  }

  //biến tiện nghi
  wifi = false;
  gac = false;
  toalet = false;
  phongtam = false;
  giuong = false;
  tivi = false;
  tulanh = false;
  bepga = false;
  quat = false;
  tudo = false;
  dieuhoa = false;
  bongden = false;
  baove = false;
  camera = false;
  doxe = false;
  removeImg(){
    alert("Click remove!");
  }
}
