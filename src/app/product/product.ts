import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../Services/productservice';
import { Stockserivce } from '../Services/stockserivce';

@Component({
  selector: 'app-product',
  imports: [FormsModule],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class Product {
  // logic
  constructor(private ser: ProductService,
    private ingre: Stockserivce) { }
  ingredient: any[] = [];
  selectedProduct: any;
  products: any[] = [];
  displayProducts: any[] = [];
  updateId: string = '';
  checkUpdate: boolean = false;
  item: any = {
    name: '',
    barcode: '',
    category: '',
    imageUrl: '',
    sellPrice: '',
    status: 1,
    ingredients: []
  }
  ngOnInit(): void {
    this.GetProducts();
    this.ingre.GetAll().subscribe((i: any) => {
      this.ingredient = i
    });
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
  edit(product: any) {
    this.item = {
      name: product.name,
      barcode: product.barcode,
      category: product.category,
      imageUrl: product.imageUrl,
      sellPrice: product.sellPrice,
      status: product.status,
      ingredients: product.ingredients
    }
    this.detail.set(0);
    this.updateId = product.id;
    this.checkUpdate = true;
  }
  SaveProduct() {
    if ((this.checkStep1() && this.checkStep2()) != 'stepper-completed') {
      alert('Please complet atleast step 1 and 2');
      return;
    }
    if (this.item.status == 'true') {
      this.item.status = true;
    } else {
      this.item.status = false;
    }
    this.ser.CreateProduct(this.item).subscribe((id: any) => {
      this.products.push({ id: id, ...this.item });
    });
    this.loading.set('flex');
    setTimeout(() => {
      this.loading.set('none');
      this.showCurrentDetail(this.item);
      this.detail.set(1);
    }, 1000);
  }
  GetProducts() {
    this.ser.GetProduct().subscribe((p) => {
      this.products = p
      this.displayProducts = p;
    });
  }
  Delete(id: string) {
    if (confirm('Do you want to delete this Product?')) {
      this.loading.set('flex');
      setTimeout(() => {
        this.loading.set('none')
        this.displayProducts = this.displayProducts.filter((i) => i.id !== id);
      }, 1000);
      this.ser.DeleteProduct(id).subscribe({
        next: () => this.GetProducts()
      });
    }
  }
  Update() {
    if ((this.checkStep1() && this.checkStep2()) != 'stepper-completed') {
      alert('Please complet atleast step 1 and 2');
      return;
    }
    if (this.item.status == 'true') {
      this.item.status = true;
    } else {
      this.item.status = false;
    }
    this.ser.UpdateProduct(this.updateId, this.item).subscribe(() => {
      this.loading.set('flex');
    });
    for (let i = 0; i < this.displayProducts.length; i++) {
      if (this.displayProducts[i].id == this.updateId) {
        this.displayProducts[i].name = this.item.name,
          this.displayProducts[i].barcode = this.item.barcode,
          this.displayProducts[i].category = this.item.category,
          this.displayProducts[i].imageUrl = this.item.imageUrl,
          this.displayProducts[i].sellPrice = this.item.sellPrice,
          this.displayProducts[i].status = this.item.status,
          this.displayProducts[i].ingredients = this.item.ingredients
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
      barcode: '',
      category: '',
      imageUrl: '',
      sellPrice: '',
      status: 1,
      ingredients: []
    }
  }
  search(text: string) {
    if (!text) {
      this.GetProducts();
      this.displayProducts = this.products;
      return;
    }
    this.displayProducts = this.products.filter(pro => pro.name.toLowerCase().includes(text.toLowerCase()));
  }
  filterByCategory(category: string) {
    if (category == 'All') {
      this.displayProducts = this.products;
    } else {
      this.displayProducts = this.products.filter(pro => pro.category == category);
    }
  }
  filterByStatus(status: any) {
    if (status == 'null') {
      this.displayProducts = this.products;
    } else {
      this.displayProducts = this.products.filter(pro => pro.status.toString() == status);
    }
  }
  filterByIngredient(i: string) {
    let newfilter: any = [];
    if (i == 'All') {
      this.displayProducts = this.products;
      return;
    }
    this.products.forEach(pro => {
      pro.ingredients.forEach((ingre: any) => {
        if (ingre == i) {
          newfilter.push(pro);
        }
      });
    });
    this.displayProducts = newfilter;
  }
  filterByPrice(price1: any, price2: any) {
    if (Number(price1) == null) {
      price1 = 0;
    }
    if (Number(price2) == null || Number(price2) < Number(price1)) {
      this.displayProducts = this.products.filter(pro => pro.sellPrice >= Number(price1));
    } else {
      this.displayProducts = this.products.filter(pro => (pro.sellPrice >= Number(price1) && pro.sellPrice <= Number(price2)));
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
    current.ingredients.forEach((cu: any) => {
      this.currentIngredient.push(this.ingredient.find(i => i.id == cu));
    });
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
    if ((this.item.name && this.item.barcode && this.item.category) != '') {
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
    if (this.item.sellPrice != '' && this.item.sellPrice != null) {
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
    if (this.item.imageUrl != '' && this.item.ingredients != '') {
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
