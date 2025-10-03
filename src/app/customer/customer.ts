import { Component, signal } from '@angular/core';
import { CustomerService } from '../Services/customerservice';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer',
  imports: [FormsModule],
  templateUrl: './customer.html',
  styleUrl: './customer.css'
})
export class Customer {
  // logic
  constructor(private ser: CustomerService) { }
  selectedCustomer: any;
  customers: any[] = [];
  displaycustomers: any[] = [];
  updateId: string = '';
  checkUpdate: boolean = false;
  item: any = {
    name: '',
    gender: 'Male',
    imageUrl: '',
    contact: {
      phoneNumber: '',
      email: ''
    }
  }
  ngOnInit(): void {
    this.Getcustomers();
  }
  edit(customer: any) {
    this.item = {
      name: customer.name,
      gender: customer.gender,
      imageUrl: customer.imageUrl,
      contact: {
        phoneNumber: customer.contact.phoneNumber,
        email: customer.contact.email
      }
    }
    this.detail.set(0);
    this.updateId = customer.id;
    this.checkUpdate = true;
  }
  Save() {
    if((this.checkStep1() && this.checkStep2()) != 'stepper-completed'){
      alert('Please complet atleast step 1 and 2');
      return;
    }
    if (this.item.status == 'true') {
      this.item.status = true;
    } else {
      this.item.status = false;
    }
    this.ser.Create(this.item).subscribe((id: any) => {
      this.customers.push({ id: id, ...this.item });
    });
    this.loading.set('flex');
    setTimeout(() => {
      this.loading.set('none');
      this.showCurrentDetail(this.item);
      this.detail.set(1);
    }, 1000);
  }
  Getcustomers() {
    this.ser.Get().subscribe((p) => {
      this.customers = p
      this.displaycustomers = p;
    });
  }
  Delete(id: string) {
    if (confirm('Do you want to delete this customer?')) {
      this.loading.set('flex');
      setTimeout(() => {
        this.loading.set('none')
        this.displaycustomers = this.displaycustomers.filter((i) => i.id !== id);
      }, 1000);
      this.ser.Delete(id).subscribe({
        next: () => this.Getcustomers()
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
    for (let i = 0; i < this.displaycustomers.length; i++) {
      if (this.displaycustomers[i].id == this.updateId) {
        this.displaycustomers[i].name = this.item.name,
        this.displaycustomers[i].gender = this.item.gender,
        this.displaycustomers[i].imageUrl = this.item.imageUrl,
        this.displaycustomers[i].contact.phoneNumber = this.item.contact.phoneNumber,
        this.displaycustomers[i].contact.email = this.item.contact.email
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
    contact: {
      phoneNumber: '',
      email: ''
    }
  }
  }
  search(text: string){
    if(!text){
      this.Getcustomers();
      this.displaycustomers = this.customers;
      return;
    }
    this.displaycustomers = this.customers.filter(pro => pro.name.toLowerCase().includes(text.toLowerCase()));
  }
  filterByGender(gender: string){
    if(gender=='All'){
      this.displaycustomers = this.customers;
    } else {
      this.displaycustomers = this.customers.filter(pro => pro.gender == gender);
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
    if ((this.item.name && this.item.gender) != '') {
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
    if (this.item.imageUrl != '') {
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
    if (this.item.contact.phoneNumber != '' && this.item.contact.email != '') {
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
