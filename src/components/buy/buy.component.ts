import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { MatChipsModule } from '@angular/material/chips';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    FlexLayoutModule,
    RouterModule,
    MatChipsModule,
    HttpClientModule
  ]
})
export class BuyComponent implements OnInit {
  products: any[] = [];
  private apiUrl = 'http://localhost:1337/api/products'; // Replace with your API URL

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) { }

  ngOnInit(): void {
    // Check if the platform is a browser
    if (isPlatformBrowser(this.platformId)) {
      const cachedProducts = sessionStorage.getItem('products');
      if (cachedProducts) {
        this.products = JSON.parse(cachedProducts);
      } else {
        this.fetchProducts();
      }

      // Listen for page show event to handle bfcache
      window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
          const cachedProducts = sessionStorage.getItem('products');
          if (cachedProducts) {
            this.products = JSON.parse(cachedProducts);
          }
        }
      });
    } else {
      // You can handle server-side rendering logic here if needed
      this.fetchProducts(); // Optionally fetch products on server
    }
  }

  fetchProducts(): void {
    sessionStorage.clear();
    const url = `${this.apiUrl}?populate=*`; // Adjust the URL as needed
    this.http.get(url).subscribe(
      (response: any) => {
        console.log("Fetched products:", response.data);
        this.products = response.data.map((item: any) => {
          let obj = {
            id: item.id,
            ProductName: item.attributes.ProductName,
            Price: item.attributes.Price,
            Description: item.attributes.Description,
            Category: item.attributes.Category,
            Size: item.attributes.Size,
            Discount: item.attributes.Discount,
            ProductImg: item?.attributes?.ProductImg?.data
            ? item.attributes.ProductImg.data.attributes.formats?.thumbnail?.url 
              ? item.attributes.ProductImg.data.attributes.formats.thumbnail.url 
              : item.attributes.ProductImg.data.attributes.url
            : ''
          };
          return obj;
        });
        
        // Save the fetched products to sessionStorage
        if (isPlatformBrowser(this.platformId)) {
          sessionStorage.setItem('products', JSON.stringify(this.products));
        }
      },
      error => {
        console.error('Error loading products:', error);
      }
    );
  }

  deleteProduct(productId: string): void {
    const url = `${this.apiUrl}/${productId}`; // Adjust the URL as needed
    this.http.delete(url).subscribe(
      () => {
        // Successfully deleted the product, now remove it from the products array
        this.products = this.products.filter(product => product.id !== productId);
        // Update sessionStorage after deletion
        if (isPlatformBrowser(this.platformId)) {
          sessionStorage.setItem('products', JSON.stringify(this.products));
        }
      },
      error => {
        console.error('Error deleting product:', error);
      }
    );
  }
}
