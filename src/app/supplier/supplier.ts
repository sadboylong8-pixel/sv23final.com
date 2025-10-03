import { Component, signal } from '@angular/core';
import { Supplierservice } from '../Services/supplierservice';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier',
  imports: [FormsModule],
  templateUrl: './supplier.html',
  styleUrl: '../customer/customer.css'
})
export class Supplier {
  // logic
  constructor(private ser: Supplierservice) { }
  selectedsupplier: any;
  suppliers: any[] = [];
  displaySuppliers: any[] = [];
  updateId: string = '';
  checkUpdate: boolean = false;
  item: any = {
    name: '',
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
    this.GetSuppliers();
  }
  edit(supplier: any) {
    this.item = {
    name: supplier.name,
    contact: {
      phoneNumber: supplier.contact.phoneNumber,
      email: supplier.contact.email
    },
    address: {
      street: supplier.address.street,
      district: supplier.address.district,
      city: supplier.address.city
    }
  }
    this.detail.set(0);
    this.updateId = supplier.id;
    this.checkUpdate = true;
  }
  Save() {
    if((this.checkStep1() && this.checkStep2()) != 'stepper-completed'){
      alert('Please complet atleast step 1 and 2');
      return;
    }
    this.ser.Create(this.item).subscribe((id: any) => {
      this.suppliers.push({ id: id, ...this.item });
    });
    this.loading.set('flex');
    setTimeout(() => {
      this.loading.set('none');
      this.showCurrentDetail(this.item);
      this.detail.set(1);
    }, 1000);
  }
  GetSuppliers() {
    this.ser.Get().subscribe((p) => {
      this.suppliers = p;
      this.displaySuppliers = p;
    });
  }
  Delete(id: string) {
    if (confirm('Do you want to delete this supplier?')) {
      this.loading.set('flex');
      setTimeout(() => {
        this.loading.set('none')
        this.displaySuppliers = this.displaySuppliers.filter((i) => i.id !== id);
      }, 1000);
      this.ser.Delete(id).subscribe({
        next: () => this.GetSuppliers()
      });
    }
  }
  Update() {
    if((this.checkStep1() && this.checkStep2()) != 'stepper-completed'){
      alert('Please complet atleast step 1 and 2');
      return;
    }
    this.ser.Update(this.updateId, this.item).subscribe(() => {
      this.loading.set('flex');
    });
    for (let i = 0; i < this.displaySuppliers.length; i++) {
      if (this.displaySuppliers[i].id == this.updateId) {
        this.displaySuppliers[i].name = this.item.name;
        this.displaySuppliers[i].contact.phoneNumber = this.item.contact.phoneNumber;
        this.displaySuppliers[i].contact.email = this.item.contact.email;
        this.displaySuppliers[i].address.street = this.item.address.street;
        this.displaySuppliers[i].address.district = this.item.address.district;
        this.displaySuppliers[i].address.city = this.item.address.city;
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
      this.GetSuppliers();
      this.displaySuppliers = this.suppliers;
      return;
    }
    this.displaySuppliers = this.suppliers.filter(pro => pro.name.toLowerCase().includes(text.toLowerCase()));
  }
  filterByAddress(district: string, city: string){
    if(district=='All' && city == 'All'){
      this.displaySuppliers = this.suppliers;
    } else if(district=='All') {
      this.displaySuppliers = this.suppliers.filter(pro => pro.address.city == city);
    } else if(city=='All'){
      this.displaySuppliers = this.suppliers.filter(pro => pro.address.district == district);
    } else {
      this.displaySuppliers = this.suppliers.filter(pro => (pro.address.district == district && pro.address.city == city));
    }
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
    if ((this.item.name) != '') {
      check = 'stepper-completed';
    } else {
      if (this.currentStep == 0) {
        check = 'stepper-active';
      } else {
        check = 'stepper-pending'
      }
    }
    return check;
  }
  checkStep2() {
    let check = 'stepper-pending'
    if (this.item.contact.phoneNumber != '' && this.item.contact.email != '') {
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
    if ((this.item.address.street && this.item.address.district && this.item.address.city) != '') {
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
