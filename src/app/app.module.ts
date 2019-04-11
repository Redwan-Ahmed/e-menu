import { ShoppingCartService } from './shopping-cart.service';
import { CategoryService } from './category.service';
import { AdminAuthGuard } from './admin-auth-guard.service';
import { UserService } from './user.service';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';

import { AppComponent } from './app.component';
import { BsNavbarComponent } from './bs-navbar/bs-navbar.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { MyOrderComponent } from './my-order/my-order.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { LoginComponent } from './login/login.component';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { ProductService } from './product.service';
import { ProductsFilterComponent } from './products/products-filter/products-filter.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { OrderService } from './order.service';

@NgModule({
/** All the components in the Project are listed bellow, some components may not have been used */
  declarations: [
    AppComponent,
    BsNavbarComponent,
    HomeComponent,
    ProductsComponent,
    ShoppingCartComponent,
    CheckOutComponent,
    OrderSuccessComponent,
    MyOrderComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    LoginComponent,
    ProductFormComponent,
    ProductsFilterComponent,
    ProductCardComponent
  ],
/** Initialising the imports here, so that they can be accessed globally in this project */
  imports: [
    BrowserModule,
    FormsModule,
    CustomFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
/** Here we are set the routes for each page/component
  * We are also protecting the Routes which are sensitive (users cannot jump to a page by typing the URL Address)
  * Source: https://www.udemy.com/the-complete-angular-master-class/learn/v4/t/lecture/7805986?start=0 [Udemy, Section 20, Lecture 292]
 */
      { path: '', component: ProductsComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'shopping-cart/:id', component: ShoppingCartComponent },
      { path: 'login', component: LoginComponent },

      { path: 'check-out/:id', component: CheckOutComponent },
      { path: 'order-success', component: OrderSuccessComponent, canActivate: [AuthGuard] },
      { path: 'my/orders', component: MyOrderComponent, canActivate: [AuthGuard] },
      
      { path: 'admin/products/new', component: ProductFormComponent, canActivate: [AuthGuard, AdminAuthGuard] },
      { path: 'admin/products/:id', component: ProductFormComponent, canActivate: [AuthGuard, AdminAuthGuard] },
      { path: 'admin/products', component: AdminProductsComponent, canActivate: [AuthGuard, AdminAuthGuard] },
      { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AuthGuard, AdminAuthGuard] }
    ])
  ],
/** All the services used in the project are declared here as providers */
  providers: [
    AuthService, 
    AuthGuard,
    AdminAuthGuard,
    UserService,
    CategoryService,
    ProductService,
    ShoppingCartService,
    OrderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
