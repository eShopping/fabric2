import { Injectable } from "@angular/core";
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject
} from "angularfire2/database";
import { ToastOptions, ToastyService, ToastyConfig } from "ng2-toasty";
import { Product } from "../models/product";
import { AuthService } from "./auth.service";

@Injectable()
export class ProductService {
  products: AngularFireList<Product>;
  product1: AngularFireObject<Product>;
  product: Product;
  // favouriteProducts
  favouriteProducts: AngularFireList<FavouriteProduct>;
  cartProducts: AngularFireList<FavouriteProduct>;

  // NavbarCounts
  navbarCartCount = 0;
  navbarFavProdCount = 0;

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
  ) {
    // Toaster Config
    this.toastyConfig.position = "top-right";
    this.toastyConfig.theme = "material";

    if (this.authService.isLoggedIn()) {
      this.calculateFavProductCounts();
      this.calculateCartProductCounts();
    } else {
      this.calculateLocalFavProdCounts();
      this.calculateLocalCartProdCounts();
    }
  }

  getProducts() {
    this.products = this.db.list("products");
    return this.products;
  }

  createProduct(data: Product) {
    this.products.push(data);
  }

  getProductById(key: string) {
    this.product = this.getAllProducts().find(x => x.$key === key);
    return this.product;
  }

  updateProduct(data: Product) {
    this.products.update(data.$key, data);
  }

  deleteProduct(key: string) {
    this.products.remove(key);
  }
  getAllProducts() {
    return [
      {
        $key: "1", productId: 1, productName: "Mink Blankets", productCategory: "Mink Blankets",
        productPrice: 1775,
        productDescription: "These Mink blankets are luxuriously soft and are cozy to the core. The subtle colour scheme give these ...",
        productImageUrl: "../../assets/images/Capture.PNG",
        productAdded: 9, productQuatity: 1000, ratings: 1, favourite: true, productSeller: "Mink Blankets"
      },
      {
        $key: "2", productId: 2, productName: "Polar Blankets", productCategory: "Polar Blankets",
        productPrice: 150, productDescription: "Our assortments of Polar Blankets are manufactured from superior quality raw material that makes the blankets soft, comfortable",
        productImageUrl: "../../assets/images/polar.jpg",
        productAdded: 2, productQuatity: 4000, ratings: 1, favourite: true, productSeller: "Polar Blankets"
      },
      {
        $key: "3", productId: 3, productName: "Flano Blankets", productCategory: "Flano Blankets",
        productPrice: 280, productDescription: "Available in various patterns, colors and designs. The light weighted Flano Blankets provide extreme warmth and cozy feel ...",
        productImageUrl: "../../assets/images/Flano.jpg",
        productAdded: 2, productQuatity: 1500, ratings: 1, favourite: true, productSeller: "Flano Blankets"
      },
      {
        $key: "4", productId: 4, productName: "Fleece Blankets", productCategory: "Fleece Blankets",
        productPrice: 250, productDescription: "Our Fleece Blankets are widely appreciated for their finish with smooth or velvety texture. Fabricated using high quality ...",
        productImageUrl: "../../assets/images/fleece.jpeg",
        productAdded: 2, productQuatity: 1500, ratings: 1, favourite: true, productSeller: "Fleece Blankets"
      },
      {
        $key: "5", productId: 4, productName: "Woolen Blankets", productCategory: "Woolen Blankets",
        productPrice: 400, productDescription: "Our Woolen Blankets are widely appreciated for their finish with smooth or velvety texture. Fabricated using high quality ...",
        productImageUrl: "../../assets/images/woolen.jpg",
        productAdded: 2, productQuatity: 2000, ratings: 1, favourite: true, productSeller: "Woolen Blankets"
      },
      {
        $key: "6", productId: 4, productName: "Relief Blankets", productCategory: "Relief Blankets",
        productPrice: 400, productDescription: "Our Relief Blankets are widely appreciated for their finish with smooth or velvety texture. Fabricated using high quality",
        productImageUrl: "../../assets/images/relief.jpg",
        productAdded: 2, productQuatity: 2000, ratings: 1, favourite: true, productSeller: "Relief Blankets"
      }
    ];
  }
  /*
   ----------  Favourite Product Function  ----------
  */

  // Get Favourite Product based on userId
  getUsersFavouriteProduct() {
    const user = this.authService.getLoggedInUser();
    this.favouriteProducts = this.db.list("favouriteProducts", ref =>
      ref.orderByChild("userId").equalTo(user.$key)
    );
    return this.favouriteProducts;
  }

  // Adding New product to favourite if logged else to localStorage
  addFavouriteProduct(data: Product): void {
    // Toast Product Already exists
    const toastAlreadyExists: ToastOptions = {
      title: "Product Already Added",
      msg: "You have already added this product to favourite list",
      showClose: true,
      timeout: 5000,
      theme: "material"
    };

    // Toaster Adding
    const toastAdd: ToastOptions = {
      title: "Adding Product",
      msg: "Adding Product as Favourite",
      showClose: true,
      timeout: 5000,
      theme: "material"
    };

    let a: Product[];
    a = JSON.parse(localStorage.getItem("avf_item")) || [];
    a.push(data);
    this.toastyService.wait(toastAdd);
    setTimeout(() => {
      localStorage.setItem("avf_item", JSON.stringify(a));
      this.calculateLocalFavProdCounts();
    }, 1500);
  }

  // Fetching unsigned users favourite proucts
  getLocalFavouriteProducts(): Product[] {
    const products: Product[] =
      JSON.parse(localStorage.getItem("avf_item")) || [];

    return products;
  }

  // Removing Favourite Product from Database
  removeFavourite(key: string) {
    this.favouriteProducts.remove(key);
  }

  // Removing Favourite Product from localStorage
  removeLocalFavourite(product: Product) {
    const products: Product[] = JSON.parse(localStorage.getItem("avf_item"));

    for (let i = 0; i < products.length; i++) {
      if (products[i].productId === product.productId) {
        products.splice(i, 1);
        break;
      }
    }
    // ReAdding the products after remove
    localStorage.setItem("avf_item", JSON.stringify(products));

    this.calculateLocalFavProdCounts();
  }

  // Returning Local Products Count
  calculateLocalFavProdCounts() {
    this.navbarFavProdCount = this.getLocalFavouriteProducts().length;
  }

  // Calculating FavProductsCount and storing it in variable
  calculateFavProductCounts() {
    const x = this.getUsersFavouriteProduct()
      .snapshotChanges()
      .subscribe(data => {
        this.navbarFavProdCount = data.length;
      });
  }

  /*
   ----------  Cart Product Function  ----------
  */

  // Fetching Cart Products based on userId
  getUsersCartProducts() {
    const user = this.authService.getLoggedInUser();
    this.cartProducts = this.db.list("cartProducts", ref =>
      ref.orderByChild("userId").equalTo(user.$key)
    );
    return this.cartProducts;
  }

  // Adding new Product to cart db if logged in else localStorage
  addToCart(data: Product): void {
    let a: Product[];

    a = JSON.parse(localStorage.getItem("avct_item")) || [];

    a.push(data);

    const toastOption: ToastOptions = {
      title: "Adding Product to Cart",
      msg: "Product Adding to the cart",
      showClose: true,
      timeout: 1000,
      theme: "material"
    };
    this.toastyService.wait(toastOption);
    setTimeout(() => {
      localStorage.setItem("avct_item", JSON.stringify(a));
      this.calculateLocalCartProdCounts();
    }, 500);
  }

  // Removing Cart product from db
  removeCart(key: string) {
    this.cartProducts.remove(key);
  }

  // Removing cart from local
  removeLocalCartProduct(product: Product) {
    const products: Product[] = JSON.parse(localStorage.getItem("avct_item"));

    for (let i = 0; i < products.length; i++) {
      if (products[i].productId === product.productId) {
        products.splice(i, 1);
        break;
      }
    }
    // ReAdding the products after remove
    localStorage.setItem("avct_item", JSON.stringify(products));

    this.calculateLocalCartProdCounts();
  }

  // Fetching Locat CartsProducts
  getLocalCartProducts(): Product[] {
    const products: Product[] =
      JSON.parse(localStorage.getItem("avct_item")) || [];

    return products;
  }

  // returning LocalCarts Product Count
  calculateLocalCartProdCounts() {
    this.navbarCartCount = this.getLocalCartProducts().length;
  }

  // Calculating Cart products count and assigning to variable
  calculateCartProductCounts() {
    const x = this.getUsersCartProducts()
      .snapshotChanges()
      .subscribe(data => {
        this.navbarCartCount = data.length;
      });
  }
}

export class FavouriteProduct {
  product: Product;
  productId: string;
  userId: string;
}
