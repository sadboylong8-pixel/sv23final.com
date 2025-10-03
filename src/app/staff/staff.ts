import { Component, signal } from '@angular/core';
import { Staffservice } from '../Services/staffservice';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-staff',
  imports: [FormsModule],
  templateUrl: './staff.html',
  styleUrl: '../customer/customer.css'
})
export class Staff {
  // logic
  constructor(private ser: Staffservice) { }
  selectedStaff: any;
  staffs: any[] = [];
  displayStaffs: any[] = [];
  updateId: string = '';
  checkUpdate: boolean = false;
  item: any = {
    name: '',
    gender: 'Male',
    imageUrl: '',
    position: '',
    status: true,
    startDate: '',
    contact: {
      phoneNumber: '',
      email: ''
    },
    address: {
      street: '',
      district: '',
      city: ''
    }
  }
  districtsList = [
  // Phnom Penh districts
  "Chamkar Mon",
  "Daun Penh",
  "Toul Kork",
  "Chroy Changvar",
  "Mean Chey",
  "Russey Keo",
  "Sen Sok",

  // Pailin districts
  "Sala Krau",
  "Pailin Municipality",

  // Kampot districts
  "Kampot Municipality",
  "Kampong Trach",
  "Chhuk",
  "Chum Kiri",
  "Teuk Chhou",
  "Dang Tong"
];

citiesList = [
  "Phnom Penh",
  "Pailin City",
  "Kampot City"
];
  ngOnInit(): void {
    this.Get();
  }
  edit(staff: any) {
    this.item = {
      name: staff.name,
      gender: staff.gender,
      imageUrl: staff.imageUrl,
      position: staff.position,
      status: staff.status,
      startDate: staff.startDate,
      contact: {
        phoneNumber: staff.contact.phoneNumber,
        email: staff.contact.email
      },
        address: {
        street: staff.address.street,
        district: staff.address.district,
        city: staff.address.city
      }
    }
    this.detail.set(0);
    this.updateId = staff.id;
    this.checkUpdate = true;
  }
  Save() {
    if((this.checkStep1() && this.checkStep2()) != 'stepper-completed'){
      alert('Please complet atleast step 1 and 2');
      return;
    }
    this.item.startDate = new Date();
    if (this.item.status == 'true') {
      this.item.status = true;
    } else {
      this.item.status = false;
    }
    this.ser.Create(this.item).subscribe((id: any) => {
      this.staffs.push({ id: id, ...this.item });
    });
    this.loading.set('flex');
    setTimeout(() => {
      this.loading.set('none');
      this.showCurrentDetail(this.item);
      this.detail.set(1);
    }, 1000);
  }
  Get() {
    this.ser.Get().subscribe((p) => {
      this.staffs = p;
      this.displayStaffs = p;
    });
  }
  Delete(id: string) {
    if (confirm('Do you want to delete this staff?')) {
      this.loading.set('flex');
      setTimeout(() => {
        this.loading.set('none')
        this.displayStaffs = this.displayStaffs.filter((i) => i.id !== id);
      }, 1000);
      this.ser.Delete(id).subscribe({
        next: () => this.Get()
      });
    }
  }
  Update() {
    if((this.checkStep1() && this.checkStep2()) != 'stepper-completed'){
      alert('Please complet atleast step 1 and 2');
      return;
    }
    if (this.item.status == 'true') {
      this.item.status = true;
    } else {
      this.item.status = false;
    }
    this.ser.Update(this.updateId, this.item).subscribe(() => {
      this.loading.set('flex');
    });
    for (let i = 0; i < this.displayStaffs.length; i++) {
      if (this.displayStaffs[i].id == this.updateId) {
        this.displayStaffs[i].name = this.item.name,
        this.displayStaffs[i].gender = this.item.gender,
        this.displayStaffs[i].imageUrl = this.item.imageUrl,
        this.displayStaffs[i].position = this.item.position,
        this.displayStaffs[i].status = this.item.status,
        this.displayStaffs[i].startDate = this.item.startDate,
        this.displayStaffs[i].contact = this.item.contact,
        this.displayStaffs[i].address = this.item.address
        break;
      }
    }
    setTimeout(() => {
      this.loading.set('none');
      this.showCurrentDetail(this.item);
      this.detail.set(1);
    }, 1000);
  }
  clearItem() {
    this.item = {
    name: '',
    gender: 'Male',
    imageUrl: '',
    position: '',
    status: true,
    startDate: '',
    contact: {
      phoneNumber: '',
      email: ''
    },
    address: {
      street: '',
      district: '',
      city: ''
    }
  }
  }
  search(text: string){
    if(!text){
      this.Get();
      this.displayStaffs = this.staffs;
      return;
    }
    this.displayStaffs = this.staffs.filter(pro => pro.name.toLowerCase().includes(text.toLowerCase()));
  }
  filterByGender(gender: string){
    if(gender=='All'){
      this.displayStaffs = this.staffs;
    } else {
      this.displayStaffs = this.staffs.filter(pro => pro.gender == gender);
    }
  }
  filterByAddress(district: string, city: string){
    if(district=='All' && city == 'All'){
      this.displayStaffs = this.staffs;
    } else if(district=='All') {
      this.displayStaffs = this.staffs.filter(pro => pro.address.city == city);
    } else if(city=='All'){
      this.displayStaffs = this.staffs.filter(pro => pro.address.district == district);
    } else {
      this.displayStaffs = this.staffs.filter(pro => (pro.address.district == district && pro.address.city == city));
    }
  }
  filterByPosition(position: string){
    if(position=='All'){
      this.displayStaffs = this.staffs;
    } else {
      this.displayStaffs = this.staffs.filter(pro => pro.position == position);
    }
    console.log(this.staffs[0].position, '==', position);
  }




  // design
  isviewDetil: boolean = false;
  detail = signal(0);
  currentStep = 0;
  currentDetail: any;
  currentIngredient: any = [];
  loading = signal('none');
  nextStep() {
    this.currentStep++;
    if (this.currentStep > 2) {
      this.currentStep = 2;
    }
  }
  backStep() {
    this.currentStep--;
    if (this.currentStep < 0) {
      this.currentStep = 0;
    }
  }
  showCurrentDetail(current: any) {
    this.currentIngredient = [];
    this.currentDetail = current;
    this.openModal(1);
  }
  openModal(num: number) {
    this.detail.set(num);
    this.checkUpdate = false;
    this.currentStep = 0;
    this.clearItem();
  }
  newUpdate() {
    this.checkUpdate = true;
    this.detail.set(0);
    this.item = this.currentDetail;
  }
  checkStep1() {
    let check = 'stepper-pending'
    if ((this.item.name && this.item.gender && this.item.position) != '') {
      check = 'stepper-completed';
    } else {
      if (this.currentStep == 0) {
        check = 'stepper-active';
      }
    }
    return check;
  }
  checkStep2() {
    let check = 'stepper-pending'
    if ((this.item.address.street && this.item.address.district && this.item.address.city) != '') {
      check = 'stepper-completed';
    } else {
      if (this.currentStep == 1) {
        check = 'stepper-active';
      } else {
        check = 'stepper-pending'
      }
    }
    return check;
  }
  checkStep3() {
    let check = 'stepper-pending'
    if (this.item.contact.phoneNumber != '' && this.item.contact.email != '' && this.item.imageUrl != '') {
      check = 'stepper-completed';
    } else {
      if (this.currentStep == 2) {
        check = 'stepper-active';
      } else {
        check = 'stepper-pending'
      }
    }
    return check;
  }
}
