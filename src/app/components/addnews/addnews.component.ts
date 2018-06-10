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

  title = '';
  typeHotel = '';
  peopleMin = '1';
  peopleMax = '10';
  hotelPrice = '';
  priorPrice = '';
  widthHotel = '';
  heigthHotel = '';
  elecPrice = '';
  elecUnit = '';
  waterPrice = '';
  waterUnit = '';
  hotelTime = '';
  gender = '';
  detailAdress = '';
  nameBoss = '';
  facebookBoss = '';
  phoneBoss = '';
  hotelComfortable = '';
  hotelDescribe = '';
  hotellat = '';
  hotellng = '';
  idtp = '1';// giá trị mặc định
  idquanhuyen = '1';// giá trị mặc định

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
  }
  onSelectionChange(event) {
    let value = event.target.getAttribute('value');
    this.typeHotel = value;
  }
  myOnChange(event) {
    this.peopleMin = event.from;
    this.peopleMax = event.to;
  }
  Gender(event) {
    const value = event.target.getAttribute('value');
    switch(value){
      case 'male':
        this.gender = '1';
        break;
      case 'female':
      this.gender = '2';
        break;
      case 'all':
      this.gender = '3';
        break;
    }
  }
  onChangeCity(value) {
    this.idtp = value;
    let len = this.quanhuyen.length;
    this.district = [];
    for (var i = 0; i < len; i++) {
      if (this.quanhuyen[i].idtp == value) {
        this.district.push(this.quanhuyen[i]);
      }
    }
  }
  onChangeDistrict(value){
    this.idquanhuyen = value;
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
  makeMarker(lat, lng) {
    this.hotellat = lat;
    this.hotellng = lng;
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
  //loại bỏ 1 ảnh khỏi list ảnh
  removeImg(ev){
    const id = ev.path[1].lastElementChild.getAttribute('name');
    for(var i=0; i<this.listImg.length; i++){
      if(this.listImg[i].id == id){
       this.listImg.splice(i, 1);
      }
    }
  }
  //đơn vị điện
  onChangeElecUnit(value){
    switch(value){
      case '1':
        this.elecUnit = 'VND/Tháng';
        break;
      case '2':
      this.elecUnit = 'VND/Kwh';
        break;
      case '3':
      this.elecUnit = 'VND/Người';
        break;
      default:
        this.elecUnit = 'VND/Tháng';
        break;
    }
  }
  //đơn vị nước
  onChangeWaterUnit(value){
    switch(value){
      case '1':
        this.waterUnit = 'VND/Tháng';
        break;
      case '2':
      this.waterUnit = 'VND/Khối';
        break;
      case '3':
      this.waterUnit = 'VND/Người';
        break;
      default:
        this.waterUnit = 'VND/Tháng';
        break;
    }
  }
  // giờ giấc
  isTime = false;
  onSelectionChangeTimes(ev){
    let value = ev.target.getAttribute('value');
    switch(value){
      case '1':
        this.isTime = false;
        break;
      case '2':
        this.isTime = true;
        break;
    }
  }
  //
  checkTitle(){
    if(this.title.length === 0){
      alert('Vui lòng nhập tiêu đề!');
      return false;
    }
    return true;
  }
  checkTypeHotel(){
    if(this.typeHotel.length === 0){
      alert('Vui lòng chọn loại nhà ở!');
      return false;
    }
    return true;
  }
  checkPeople(){
    if(this.peopleMin.length === 0 || this.peopleMax.length === 0){
      alert('Vui lòng chọn số người ở!');
      return false;
    }
    return true;
  }
  checkHotelPrice(){
    if(this.hotelPrice.length === 0 || Number(this.hotelPrice) < 500000){
      alert('Vui lòng nhập giá phù hợp!');
      return false;
    }
    return true;
  }
  checkPriorPrice(){
    if(this.priorPrice.length === 0){
      alert('Vui lòng nhập tiền cọc!');
      return false;
    }
    return true;
  }
  checkWidthHotel(){
    if(this.widthHotel.length === 0 || Number(this.widthHotel) < 1){
      alert('Vui lòng nhập chiều rộng!');
      return false;
    }
    return true;
  }
  checkHeigthHotel(){
    if(this.heigthHotel.length === 0 || Number(this.heigthHotel) < 1){
      alert('Vui lòng nhập chiều dài!');
      return false;
    }
    return true;
  }
  checkElecPrice(){
    if(this.elecPrice.length === 0 || Number(this.elecPrice) < 1000){
      alert('Vui lòng nhập giá điện thích hợp!');
      return false;
    }
    return true;
  }
  checkWaterPrice(){
    if(this.waterPrice.length === 0 || Number(this.waterPrice) < 1000){
      alert('Vui lòng nhập giá nước thích hợp!');
      return false;
    }
    return true;
  }
  checkGender(){
    if(this.gender.length === 0){
      alert('Vui lòng chọn giới tính!');
      return false;
    }
    return true;
  }
  checkHomeNumber(){
    if(this.detailAdress.length === 0){
      alert('Vui lòng nhập số nhà!');
      return false;
    }
    return true;
  }
  checkLocation(){
    if(this.hotellat.length === 0 || this.hotellng.length === 0){
      alert('Vui lòng chọn vị trí chính xác trên bản đồ!');
      return false;
    }
    return true;
  }
  checkNameBoss(){
    if(this.nameBoss.length === 0){
      alert('Vui lòng họ tên chủ nhà!');
      return false;
    }
    return true;
  }
  checkPhoneBoss(){
    if(this.phoneBoss.length === 0){
      alert('Vui lòng số điện thoại chủ nhà!');
      return false;
    }
    return true;
  }
  //set biến tiện nghi
  setComfortable(){
    //wifi,gac,toilet,phongtam,giuong,tv,tulanh,bepga,quat,tudo,maylanh,den,baove,camera,khudexe
    this.hotelComfortable = '';
    if(this.wifi){
      this.hotelComfortable = 'wifi,';
    }
    if(this.gac){
      this.hotelComfortable += 'gac,';
    }
    if(this.toalet){
      this.hotelComfortable += 'toilet,'; 
    }
    if(this.phongtam){
      this.hotelComfortable += 'phongtam,';
    }
    if(this.giuong){
      this.hotelComfortable += 'giuong,';
    }
    if(this.tivi){
      this.hotelComfortable += 'tv,';
    }
    if(this.tulanh){
      this.hotelComfortable += 'tulanh,';
    }
    if(this.bepga){
      this.hotelComfortable += 'bepga,';
    }
    if(this.quat){
      this.hotelComfortable += 'quat,';
    }
    if(this.tudo){
      this.hotelComfortable += 'tudo,';
    }
    if(this.dieuhoa){
      this.hotelComfortable += 'maylanh,';
    }
    if(this.bongden){
      this.hotelComfortable += 'den,';
    }
    if(this.baove){
      this.hotelComfortable += 'baove,';
    }
    if(this.camera){
      this.hotelComfortable += 'camera,';
    }
    if(this.doxe){
      this.hotelComfortable += 'khudexe,';
    }
    this.hotelComfortable = this.hotelComfortable.slice(0, this.hotelComfortable.length-1);// xóa dấu phẩy ở cuối cùng
  }
  //thêm số 0 trước các số < 10
  AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
  }
  Submit(){
    // kiểm tra dữ liệu

    if(!this.checkTitle()){
      return false;// stop
    }
    if(!this.checkTypeHotel()){
      return false;
    }
    if(!this.checkPeople()){
      return false;
    }
    if(!this.checkHotelPrice()){
      return false;
    }
    if(!this.checkPriorPrice()){
      return false;
    }
    if(!this.checkWidthHotel()){
      return false;
    }
    if(!this.checkHeigthHotel()){
      return false;
    }
    if(!this.checkElecPrice()){
      return false;
    }
    if(!this.checkWaterPrice()){
      return false;
    }
    if(!this.checkGender()){
      return false;
    }
    if(!this.checkHomeNumber()){
      return false;
    }
    if(!this.checkLocation()){
      return false;
    }
    if(!this.checkNameBoss()){
      return false;
    }
    if(!this.checkPhoneBoss()){
      return false;
    }

    //xử lý lại mảng hình ảnh trước khi gửi đi
    const img_lst = [];
    for(var i=0; i<this.listImg.length; i++){
      img_lst.push(this.listImg[i].img);// mảng chỉ chứa dữ liệu ảnh dạng base64
    }
    //Khởi tạo id tin theo tg và người đăng(ở đây là admin)
    var d = new Date();
    const id = 'admin' + d.getFullYear().toString() + this.AddZero(d.getMonth()).toString() + this.AddZero(d.getDate()).toString() +
              this.AddZero(d.getHours()).toString() + this.AddZero(d.getMinutes()).toString() + this.AddZero(d.getSeconds()).toString();
    this.setComfortable();// tiện nghi
    var data = {
      id: id,
      tieude: this.title,
      gia: this.hotelPrice,
      diachi: this.detailAdress,
      dientich: Number(this.widthHotel)*Number(this.heigthHotel),
      chieudai: this.heigthHotel,
      chieurong: this.widthHotel,
      loaitintuc: this.typeHotel,
      songuoimin: this.peopleMin,
      songuoimax: this.peopleMax,
      tiennghi: this.hotelComfortable,
      doituong: this.gender,
      lat: this.hotellat,
      lng: this.hotellng,
      iduser: 0, //admin
      motathem: this.hotelDescribe,
      giadien: this.elecPrice,
      donvidien: this.elecUnit,
      gianuoc: this.waterPrice,
      donvinuoc: this.waterUnit,
      tiencoc: this.priorPrice,
      donvicoc: 'VND/Phòng',
      giogiac: this.isTime ? this.hotelTime : '-1',
      idtp: this.idtp,
      idquanhuyen: this.idquanhuyen,
      soreport: '0',
      hoten: this.nameBoss,
      sdt: this.phoneBoss,
      facebook: this.facebookBoss
    }
    //B1: Tiến hành lưu tin xuống csdl và trả về thông báo thành công thất bại
    //B2: Tiến hành lưu ảnh lên host đồng thời lưu địa chỉ ảnh vào csdl theo id(khi tin đã lưu thành công)
    //B3: Thông báo lưu thành công

    //Lọc lấy mảng chứa ảnh
    var arr = [];
    for(var i=0; i<this.listImg.length; i++){
      arr.push(this.listImg[i].img.split('data:image/png;base64,')[1]);
    }

    this.hotelService.addNews(data).subscribe(res =>{
      if(res === 'success'){
        // tiến hành up ảnh lên host và lưu vào csdl
        this.hotelService.uploadImgNews(id, arr).subscribe(rs => {
          if(rs === 'ok'){
            alert('Đăng tin thành công!');
            window.location.reload();// reload lại page để đăng tin khác
          }else{
            //xóa tin về vì quá trình up ảnh có lỗi
            this.hotelService.deleteID(id).subscribe(respone => console.log('KOKOKO!'));
            alert('Đăng tin không thành công!');
          }
        })
      }else{
        alert('Thêm tin thất bại!');
      }
    });
    //tiến hành gửi dữ liệu
  }
}
