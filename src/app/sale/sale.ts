import { Component, signal } from '@angular/core';
import { Saleservice } from '../Services/saleservice';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../Services/customerservice';
import { Staffservice } from '../Services/staffservice';
import { ProductService } from '../Services/productservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sale',
  imports: [FormsModule, CommonModule],
  templateUrl: './sale.html',
  styleUrl: '../product/product.css'
})
export class Sale {
  // logic
  constructor(private ser: Saleservice,
    private cus: CustomerService,
    private staf: Staffservice,
    private pro: ProductService) { }
  customer: any[] = [];
  staff: any[] = [];
  product: any[] = [];
  selectedSale: any;
  sales: any[] = [];
  displaysales: any[] = [];
  updateId: string = '';
  checkUpdate: boolean = false;
  item: any = {
    customerId: '',
    staffId: '',
    saleDate: '',
    total: 0,
    orders: <orderObj[]>[]
  }
  customerItem: any = {
    name: '',
    gender: 'Male',
    imageUrl: '',
    contact: {
      phoneNumber: '',
      email: ''
    }
  }
  productList: any[] = [];
  ngOnInit(): void {
    this.Getsales();
     this.cus.Get().subscribe((i: any) => {
      this.customer = i
    });
    this.pro.GetProduct().subscribe(pro => {
      this.product = pro;
      this.FillProductList();
    });
    this.staf.Get().subscribe(sta => this.staff = sta);
  }
  getIngredients(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      if (Array.isArray(this.item.ingredients)) {
        this.item.ingredients.push(input.value);
      }
    } else {
      const newIngre = this.item.ingredients.filter((i: any) => i != input.value);
      this.item.ingredients = newIngre;
    }
  }
  edit(sale: any) {
    this.item = {
      customerId: sale.customerId,
      staffId: sale.staffId,
      saleDate: sale.saleDate,
      total: sale.total,
      orders: sale.orders
    }
    for(let i = 0; i < this.productList.length; i++){
      let order = this.item.orders.find((ord: any) => ord.productId == this.productList[i].id);
      if(order != undefined){
        if(order.quantity > 0){
          this.productList[i].quantity = order.quantity;
          this.productList[i].selected = true;
        }
      }
    }
    this.detail.set(0);
    this.updateId = sale.id;
    this.checkUpdate = true;
  }
  Save() {
    if ((this.checkStep1() && this.checkStep2()) != 'stepper-completed') {
      alert('Please complet atleast step 1 and 2');
      return;
    }
    this.item.saleDate = new Date();
    this.item.total = 0;
    this.item.orders.forEach((ord: any) => {
      const price = (this.product.find(pro => pro.id == ord.productId)).sellPrice;
      this.item.total += (price * ord.quantity);
    });
    this.ser.Create(this.item).subscribe((id: any) => {
      this.sales.push({ id: id, ...this.item });
    });
    this.loading.set('flex');
    setTimeout(() => {
      this.loading.set('none');
      this.showCurrentDetail(this.item);
      this.clearItem();
      this.detail.set(1);
    }, 1000);
  }
  Getsales() {
    this.ser.Get().subscribe((p) => {
      this.sales = p    
      this.displaysales = p;
    });
  }
  Delete(id: string) {
    if (confirm('Do you want to delete this sale?')) {
      this.loading.set('flex');
      setTimeout(() => {
        this.loading.set('none')
        this.displaysales = this.displaysales.filter((i) => i.id !== id);
      }, 1000);
      this.ser.Delete(id).subscribe({
        next: () => this.Getsales()
      });
    }
  }
  Update() {
    if ((this.checkStep1() && this.checkStep2()) != 'stepper-completed') {
      alert('Please complet at least step 1 and 2');
      return;
    }
    this.item.total = 0;
    this.item.orders.forEach((ord: any) => {
      const price = (this.product.find(pro => pro.id == ord.productId)).sellPrice;
      this.item.total += (price * ord.quantity);
    });
    this.ser.Update(this.updateId, this.item).subscribe(() => {
      this.loading.set('flex');
    });
    for (let i = 0; i < this.displaysales.length; i++) {
      if (this.displaysales[i].id == this.updateId) {
        this.displaysales[i].customerId = this.item.customerId;
        this.displaysales[i].staffId = this.item.staffId;
        this.displaysales[i].saleDate = this.item.saleDate;
        this.displaysales[i].total = this.item.total;
        this.displaysales[i].orders = this.item.orders
        break;
      }
    }
    setTimeout(() => {
      this.loading.set('none');
      this.showCurrentDetail(this.item);
      this.detail.set(1);
    }, 1000);
  }
  addNewCustomer(){
    this.cus.Create(this.customerItem).subscribe((cu) => {
      this.item.customerId = cu;
      this.cus.Get().subscribe((i: any) => this.customer = i);
    });
    this.loading.set('flex');
      setTimeout(() => {
        this.loading.set('none');
        this.closeSecondModal();
      }, 1000);
  }
  clearItem() {
    this.item = {
      customerId: '',
      staffId: '',
      saleDate: '',
      total: 0,
      orders: <orderObj[]>[]
    }
  }
  search(text: string) {
    if (!text) {
      this.Getsales();
      this.displaysales = this.sales;
      return;
    }
    let newCus = this.customer.filter(cus => cus.name.toLowerCase().includes(text.toLowerCase()));
    this.displaysales = [];
    this.sales.forEach((sale) => {
      for(let i = 0; i < newCus.length; i++){
        if(newCus[i].id == sale.customerId){
          this.displaysales.push(sale);
          break;
        }
      }
    });
  }
  filterByCustomer(id: string) {
    if (id == 'All') {
      this.displaysales = this.sales;
    } else {
      this.displaysales = this.sales.filter(pro => pro.customerId == id);
    }
  }
  filterByStaff(id: any) {
    if (id == 'All') {
      this.displaysales = this.sales;
    } else {
      this.displaysales = this.sales.filter(pro => pro.staffId == id);
    }
  }
  filterByProduct(id: string) {
    let newfilter: any = [];
    if (id == 'All') {
      this.displaysales = this.sales;
      return;
    }
    this.sales.forEach(pro => {
      pro.orders.forEach((ingre: any) => {
        if (ingre.productId == id) {
          newfilter.push(pro);
        }
      });
    });
    this.displaysales = newfilter;
  }
  filterByPrice(price1: any, price2: any) {
    if (Number(price1) == null) {
      price1 = 0;
    }
    if (Number(price2) == null || Number(price2) < Number(price1)) {
      this.displaysales = this.sales.filter(pro => pro.total >= Number(price1));
    } else {
      this.displaysales = this.sales.filter(pro => (pro.total >= Number(price1) && pro.total <= Number(price2)));
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
  checkIngredientStatus(id: string) {
    let check = false;
    this.item.ingredients.forEach((ing: string) => {
      if (ing == id) {
        check = true;
      }
    });
    return check;
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
    this.FillProductList();
  }
  newUpdate() {
    this.checkUpdate = true;
    this.detail.set(0);
    this.item = this.currentDetail;
    for(let i = 0; i < this.productList.length; i++){
      let order = this.item.orders.find((ord: any) => ord.productId == this.productList[i].id);
      if(order != undefined){
        if(order.quantity > 0){
          this.productList[i].quantity = order.quantity;
          this.productList[i].selected = true;
        }
      }
    }
  }
  checkStep1() {
    let check = 'stepper-pending'
    if ((this.item.orders) != '') {
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
    if (this.item.customerId != '') {
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
    if (this.item.staffId != '') {
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
  findCustomer(id: string, condition: number){
    let getCustomer: any;
    let code = '';
    if(id=='' || id==null)return;
    getCustomer = this.customer.find(i => i.id == id);
    if(condition === 0){
      code = getCustomer.imageUrl;
    } else{
      code = getCustomer.name;
    }
    return code;
  }
  findProduct(id: string,condition: number){
    let getProduct: any;
    let code = '';
    if(id=='' || id==null)return;
    getProduct = this.product.find(pro => pro.id == id);
    if(getProduct==undefined)return;
    if(condition === 0){
      code = getProduct.imageUrl;
    } else{
      code = getProduct.name;
    }
    return code;
  }
  findStaff(id: string,condition: number){
    let getStaff: any;
    let code = '';
    if(id=='' || id==null)return;
    getStaff = this.staff.find(pro => pro.id == id);
    if(condition === 0){
      code = getStaff.imageUrl;
    } else{
      code = getStaff.name;
    }
    return code;
  }
  showSecondModal = false;
  openSecondModal() {
    this.showSecondModal = true;
  }

  closeSecondModal() {
    this.showSecondModal = false;
  }
  toggleSelect(product: any) {
    if (!product.selected) {
      product.selected = true;
      product.quantity = 1;
      this.item.orders.push({productId: product.id, quantity: product.quantity});
    } else {
      product.selected = false;
      product.quantity = 0;
      this.item.orders = this.item.orders.filter((i: any) => i.productId != product.id);
    }
  }

  increase(product: any) {
    product.quantity++;
    if (!product.selected) {
      product.selected = true;
      this.item.orders.push({productId: product.id, quantity: product.quantity});
    }
    for(let i = 0; i < this.item.orders.length; i++){
      if(this.item.orders[i].productId == product.id){
        this.item.orders[i].quantity = product.quantity;
        break;
      }
    }
  }

  decrease(product: any) {
    if (product.quantity > 0) {
      product.quantity--;
      for(let i = 0; i<this.item.orders.length; i++){
        if(this.item.orders[i].productId == product.id){
          this.item.orders[i].quantity = product.quantity;
          break;
        }
      }
    }
    if (product.quantity === 0) {
      product.selected = false;
      this.item.orders = this.item.orders.filter((i: any) => i.productId != product.id);
    }
  }
  FillProductList(){
    this.productList = [];
    this.product.forEach((pro) => {
      this.productList.push({id: pro.id, name: pro.name, quantity: 0, selected: false});
    });
  }
}

export interface orderObj{
    productId: string,
    quantity: number
  }
