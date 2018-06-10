import { Component, OnInit, ViewEncapsulation, ViewChild, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http'
import { map } from 'rxjs/operators';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap'
import { } from '@types/googlemaps';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  marker: google.maps.Marker;

  // khai báo các biến
  hotelService: any;
  hotelList;
  hotels;
  hotelsAsc;
  hotelsDesc;
  details;
  user;
  router;
  public imagesUrl;

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
  giogiac;
  doituong;
  tintuc;
  isDetail = false;

  tinhthanh;
  quanhuyen;
  district;
  isChooseCity = false;
  idCity = -1;
  isEmpty = true;
  idDistrict = -1;
  valueSort = -1;// -1 là mặc định

  static get parameters() {
    return [HotelService, Router];
  }

  constructor(hotelService, router, private httpService: HttpClient) {
    this.hotelService = hotelService;
    this.router = router;
  }
  ngOnInit() {
    //Lấy dữ liệu từ csdl
    this.hotelService.getAllHotels().subscribe(hotelList => {
      this.hotelList = hotelList;
      this.isEmpty = this.hotelList.length == 0;// xác nhận là có hay là không có dữ liệu
      this.hotels = hotelList;// để lưu lại thông tin toàn bộ khách sạn
    });
    // lấy danh sách phòng có giá giảm dần, tăng dần
    this.hotelService.getDescHotels().subscribe(data => {
      this.hotelsDesc = data;
      let len = this.hotelsDesc.length;
      let arr = [];
      for (var i = len - 1; i >= 0; i--) {
        arr.push(this.hotelsDesc[i]);
      }
      this.hotelsAsc = arr;
    });

    this.imagesUrl = [{ "id": "1", "link": "https:\/\/nhatroservice.000webhostapp.com\/images\/20180425223824df.jpg" }];
    //khởi tạo map
    const myLatlng = new google.maps.LatLng(10.8454899, 106.7945204)
    var mapOptions = {
      center: myLatlng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapOptions);
    
    //lấy dữ liệu tỉnh thành và quận huyện đưa vào combobox
    this.hotelService.getCity().subscribe(data => {
      this.tinhthanh = data.thanhpho;
    });

    this.hotelService.getDistrict().subscribe(data => {
      this.quanhuyen = data.quanhuyen;
    });
  }
  onChange(value) {
    switch (value) {
      case 'default':
        this.valueSort = 1;
        if (this.idCity == -1 && this.idDistrict == -1) {
          this.hotelList = this.hotels;
        } else {
          if (this.idCity != -1) {
            if (this.idDistrict != -1) {
              this.filterPhongFromIdDistrict(this.idDistrict);
            } else {
              this.filterPhongFromIdCity(this.idCity);
            }
          }
        }
        break;
      case 'increase':
        this.valueSort = 2;
        if (this.idCity == -1 && this.idDistrict == -1) {
          this.hotelList = this.hotelsAsc;
        } else {
          if (this.idCity != -1) {
            if (this.idDistrict != -1) {
              this.filterPhongFromIdDistrict(this.idDistrict);
            } else {
              this.filterPhongFromIdCity(this.idCity);
            }
          }
        }
        break;
      case 'decrease':
        this.valueSort = 3;
        if (this.idCity == -1 && this.idDistrict == -1) {
          this.hotelList = this.hotelsDesc;
        } else {
          if (this.idCity != -1) {
            if (this.idDistrict != -1) {
              this.filterPhongFromIdDistrict(this.idDistrict);
            } else {
              this.filterPhongFromIdCity(this.idCity);
            }
          }
        }
        break;
      default:
        //
        break;
    }
  }
  public visible = false;
  public visibleAnimate = false;

  public show(event): void {
    let id = event.target.getAttribute('name');
    this.visible = true;

    setTimeout(() => this.visibleAnimate = true, 100);

    // lấy thông tin phòng từ 
    var len = this.hotelList.length;
    for (var i = 0; i < len; i++) {
      if (this.hotelList[i].phong.id == id) {
        this.details = this.hotelList[i].phong;
        this.isDetail = true;

        let lat = this.details.lat;
        let lng = this.details.lng;
        //hiển thị marker
        this.showPosition(lat, lng);

        let tiengnhi = this.details.tiennghi;
        let arr_tmp = tiengnhi.split(',');
        //cập nhật tiện nghi
        for (let i = 0; i < arr_tmp.length; i++) {
          this.setTrueFalse(arr_tmp[i]);
        }
        //kiểm tra giờ giấc
        if (this.details.giogiac == '-1') {
          this.giogiac = 'Tự do';
        } else {
          this.giogiac = this.details.giogiac;
        }
        //kiểm tra loại tin tức
        let loaitintuc = this.details.loaitintuc;
        switch (loaitintuc) {
          case '1':
            this.tintuc = "Cho thuê phòng trọ";
            break;
          case '2':
            this.tintuc = "Tìm bạn ở ghép";
            break;
          case '3':
            this.tintuc = "Cho thuê nhà nguyên căn";
            break;
        }
        //đối tượng thuê trọ
        switch(this.details.doituong){
          case '1':
            this.doituong = 'Nam';
            break;
          case '2':
            this.doituong = 'Nữ';
            break;
          case '3':
            this.doituong = 'Cả Nam và Nữ'
            break;
        }

        // lấy danh sách hình về nhà trọ
        this.hotelService.getImgID(id).subscribe(lstimg => {
          this.imagesUrl = lstimg;
        });
        break;// dừng vòng lặp khi xuất hiện phần tử đầu tiên
      }
    }
  }
  setTrueFalse(nameComfor) {
    //wifi,gac,toilet,phongtam,giuong,tv,tulanh,bepga,quat,tudo,maylanh,den,baove,camera,khudexe
    switch (nameComfor) {
      case 'wifi':
        this.wifi = true;
        break;
      case 'gac':
        this.gac = true;
        break;
      case 'toilet':
        this.toalet = true;
        break;
      case 'phongtam':
        this.phongtam = true;
        break;
      case 'giuong':
        this.giuong = true;
        break;
      case 'tv':
        this.tivi = true;
        break;
      case 'tulanh':
        this.tulanh = true;
        break;
      case 'bepga':
        this.bepga = true;
        break;
      case 'quat':
        this.quat = true;
        break;
      case 'tudo':
        this.tudo = true;
        break;
      case 'maylanh':
        this.dieuhoa = true;
        break;
      case 'den':
        this.bongden = true;
        break;
      case 'baove':
        this.baove = true;
        break;
      case 'camera':
        this.camera = true;
        break;
      case 'khudexe':
        this.doxe = true;
        break;
    }
  }
  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }

  showPosition(lat, lng) {
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
  public idphong;
  //openmodal xóa
  delete(event) {
    this.idphong = event.target.getAttribute('name');
  }
  //xác nhận xóa
  confirmDelete() {
    this.hotelService.deleteID(this.idphong).subscribe(mess => {
      if (mess == 'Success') {
        for (var i = 0; i < this.hotelList.length; i++) {
          if (this.hotelList[i].phong.id == this.idphong) {//loại phòng vừa xóa ra khỏi danh sách
            this.hotelList.splice(i, 1);
          }
        }
      }
    });
  }
  //thay đổi tỉnh thành phố
  onChangeCity(value) {
    switch (value) {
      case 'default':
        this.hotelList = this.hotels;
        this.district = [];
        this.isChooseCity = false;// chưa chọn thành phố nên cb quận huyện sẽ bị disabled
        this.idCity = -1;
        break;
      default:
        this.filterPhongFromIdCity(value);
        this.isChooseCity = this.hotelList.length > 0;//nếu tỉnh này chưa có dữ liệu thì người dùng cũng không được chọn huyện
        this.idCity = value;
        //đổ dữ liệu huyện tương ứng
        let arr = [];
        let len = this.quanhuyen.length;
        for (var i = 0; i < len; i++) {
          if (this.quanhuyen[i].idtp == value) {
            arr.push(this.quanhuyen[i]);
          }
        }
        this.district = arr;
        break;
    }
  }
  //thay đổi quận huyện
  onChangeDistrict(value) {
    switch (value) {
      case 'default':
        this.filterPhongFromIdCity(this.idCity);
        this.idDistrict = -1;
        break;
      default:
        this.idDistrict = value;
        this.filterPhongFromIdDistrict(value);
        break;
    }
  }
  //tìm phòng trọ nằm trong tỉnh thành theo id
  filterPhongFromIdCity(id) {
    let arr, len, temp;
    arr = [];
    temp = [];
    len = this.hotels.length;
    switch (this.valueSort) {
      case 1:
        temp = this.hotels
        break;
      case 2:
        temp = this.hotelsAsc;
        break;
      case 3:
        temp = this.hotelsDesc;
        break;
      default:
        temp = this.hotels// giá trị khởi tạo
        break;
    }
    for (var i = 0; i < len; i++) {
      if (temp[i].phong.idtp == id) {
        arr.push(temp[i]);
      }
    }
    this.hotelList = arr;
    this.isEmpty = this.hotelList.length == 0;
  }
  //tìm phòng trọ nằm trong tỉnh thành theo id
  filterPhongFromIdDistrict(id) {
    let arr, len, temp;
    arr = [];
    temp = [];
    len = this.hotels.length;
    switch (this.valueSort) {
      case 1:
        temp = this.hotels
        break;
      case 2:
        temp = this.hotelsAsc;
        break;
      case 3:
        temp = this.hotelsDesc;
        break;
      default:
        temp = this.hotels// giá trị ban đầu
        break;
    }
    for (var i = 0; i < len; i++) {
      if (temp[i].phong.idquanhuyen == id) {
        arr.push(temp[i]);
      }
    }
    this.hotelList = arr;
    this.isEmpty = this.hotelList.length == 0;
  }
  pageChange(event){
    window.scrollTo(0, 0);
  }
}
