import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html', 
  styleUrls: ['./addproduct.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule]
})
export class AddProductComponent {
  
  productForm: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;
  successMessage: string | null = null;

  // Variables to track form control validity
  isProductNameInvalid: boolean = false;
  isProductDescriptionInvalid: boolean = false;
  isSizeInvalid: boolean = false;
  isCategoryInvalid: boolean = false;
  isPriceInvalid: boolean = false;
  isDiscountInvalid: boolean = false;

  categories: string[] = ['Men', 'Women', 'Kids'];
  sizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XLL', 'Free Size'];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.productForm = this.fb.group({
      ProductName: ['', Validators.required],
      Description: ['', Validators.required],
      Size: ['', Validators.required],
      Category: ['', Validators.required],
      Price: ['', [Validators.required, Validators.min(0)]],
      Discount: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      Image: [{}]
    });

    // Check validity whenever form value changes
    this.productForm.valueChanges.subscribe(() => {
      this.checkFormValidity();
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Method to check validity of form controls
  checkFormValidity(): void {
    this.isProductNameInvalid = this.productForm.get('ProductName')?.invalid ?? false;
    this.isProductDescriptionInvalid = this.productForm.get('Description')?.invalid ?? false;
    this.isSizeInvalid = this.productForm.get('Size')?.invalid ?? false;
    this.isCategoryInvalid = this.productForm.get('Category')?.invalid ?? false;
    this.isPriceInvalid = this.productForm.get('Price')?.invalid ?? false;
    this.isDiscountInvalid = this.productForm.get('Discount')?.invalid ?? false;
  }

  onSubmit(): void {
    this.checkFormValidity();
    if (this.productForm.valid) {
      const attributes = this.productForm.value;
      console.log(attributes)
      const apiUrl = `http://localhost:1337/api/products`; // Adjust the URL as needed  
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
  
      this.http.post(apiUrl, JSON.stringify({ data: this.productForm.value }), { headers }).subscribe(
        (response) => {
          console.log('Product successfully added:', response);
          alert('Product added successfully!');
          this.productForm.reset();
        },
        (error) => {
          alert('An error occurred while adding the product. Please try again.');
        }
      );  ;
    }    
    }
  }
