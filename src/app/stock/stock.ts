import { Component, signal } from '@angular/core';
import { Stockserivce } from '../Services/stockserivce';
import { Supplierservice } from '../Services/supplierservice';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock',
  imports: [FormsModule, CommonModule],
  templateUrl: './stock.html',
  styleUrl: '../customer/customer.css'
})
export class Stock {
  // logic
  constructor(private ser: Stockserivce, private sup: Supplierservice) { }
  supplier: any[] = [];
  selectedStock: any;
  stocks: any[] = [];
  displaystocks: any[] = [];
  updateId: string = '';
  checkUpdate: boolean = false;
  item: any = {
    ingredient: '',
    quantity: 0,
    costPerUnit: 0,
    imageUrl: '',
    total: 0,
    unit: '',
    supplierId: '',
    addStockDate: new Date()
  }
  ngOnInit(): void {
    this.Getstocks();
    this.sup.Get().subscribe(i => this.supplier = i);
  }
  edit(stock: any) {
    this.item = {
    ingredient: stock.ingredient,
    quantity: stock.quantity,
    costPerUnit: stock.costPerUnit,
    imageUrl: stock.imageUrl,
    total: stock.total,
    unit: stock.unit,
    supplierId: stock.supplierId
  }
    this.detail.set(0);
    this.updateId = stock.id;
    this.checkUpdate = true;
  }
  Save() {
    if((this.checkStep1() && this.checkStep2()) != 'stepper-completed'){
      alert('Please complet atleast step 1 and 2');
      return;
    }
    this.item.total = this.item.quantity * this.item.costPerUnit;
    this.item.addStockDate = new Date();
    this.ser.Create(this.item).subscribe((id: any) => {
      this.stocks.push({ id: id, ...this.item });
    });
    this.loading.set('flex');
    setTimeout(() => {
      this.loading.set('none');
      this.showCurrentDetail(this.item);
      this.detail.set(1);
    }, 1000);
  }
  Getstocks() {
    this.ser.GetAll().subscribe((p:any) => {
      this.stocks = p;
      this.displaystocks = p;
    });
  }
  Delete(id: string) {
    if (confirm('Do you want to delete this Product?')) {
      this.loading.set('flex');
      setTimeout(() => {
        this.loading.set('none')
        this.displaystocks = this.displaystocks.filter((i) => i.id !== id);
      }, 1000);
      this.ser.Delete(id).subscribe({
        next: () => this.Getstocks()
      });
    }
  }
  Update() {
    if((this.checkStep1() && this.checkStep2()) != 'stepper-completed'){
      alert('Please complet atleast step 1 and 2');
      return;
    }
    this.item.total = this.item.quantity * this.item.costPerUnit;
    this.ser.Update(this.updateId, this.item).subscribe(() => {
      this.loading.set('flex');
    });
    for (let i = 0; i < this.displaystocks.length; i++) {
      if (this.displaystocks[i].id == this.updateId) {
        this.displaystocks[i].ingredient = this.item.ingredient,
          this.displaystocks[i].quantity = this.item.quantity,
          this.displaystocks[i].costPerUnit = this.item.costPerUnit,
          this.displaystocks[i].imageUrl = this.item.imageUrl,
          this.displaystocks[i].total = this.item.total,
          this.displaystocks[i].unit = this.item.unit,
          this.displaystocks[i].supplierId = this.item.supplierId
          this.displaystocks[i].addStockDate = new Date();
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
      ingredient: '',
      quantity: 0,
      costPerUnit: 0,
      imageUrl: '',
      total: 0,
      unit: '',
      supplierId: '',
      addStockDate: new Date()
    }
  }
  search(text: string){
    if(!text){
      this.Getstocks();
      this.displaystocks = this.stocks;
      return;
    }
    this.displaystocks = this.stocks.filter(pro => pro.ingredient.toLowerCase().includes(text.toLowerCase()));
  }
  filterBySupplier(id: string){
    if(id=='All'){
      this.displaystocks = this.stocks;
    } else {
      this.displaystocks = this.stocks.filter(pro => pro.supplierId == id);
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
  supplierName(id: string){
    if(id == '' || id == null) return;
    const supp = (this.supplier.find(sup => sup.id == id));
    return supp.name;
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
    if ((this.item.ingredient && this.item.imageUrl) != '') {
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
    if ((this.item.costPerUnit != '' && this.item.costPerUnit != null) && (this.item.quantity != '' && this.item.quantity != null)) {
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
    if (this.item.supplierId != '' && this.item.unit != '') {
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
