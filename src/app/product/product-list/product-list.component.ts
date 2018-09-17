import { Component, OnInit } from "@angular/core";
import { Product } from "../../shared/models/product";
import { AuthService } from "../../shared/services/auth.service";
import { ProductService } from "../../shared/services/product.service";
import { LoaderSpinnerService } from "../../shared/loader-spinner/loader-spinner";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"]
})
export class ProductListComponent implements OnInit {
  productList: Product[];

  brands = ["All", "Mink Blankets", "Polar Blankets", "Flano Blankets", "Fleece Blankets", "Woolen Blankets"];

  selectedBrand: "All";

  page = 1;
  constructor(
    public authService: AuthService,
    private productService: ProductService,
    private spinnerService: LoaderSpinnerService
  ) {}

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.spinnerService.show();
    this.productList = this.productService.getAllProducts();
    const x = this.productService.getProducts();
    // x.snapshotChanges().subscribe(product => {
    //   this.spinnerService.hide();
    //   this.productList = [];
    //   product.forEach(element => {
    //     const y = element.payload.toJSON();
    //     y["$key"] = element.key;
    //     this.productList.push(y as Product);
    //   });
    // });
  }

  removeProduct(key: string) {
    this.productService.deleteProduct(key);
  }

  addFavourite(product: Product) {
    this.productService.addFavouriteProduct(product);
  }

  addToCart(product: Product) {
    this.productService.addToCart(product);
  }
}
