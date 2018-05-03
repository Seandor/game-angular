import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { G2048GameboardComponent } from './g2048-gameboard/g2048-gameboard.component';


@NgModule({
  declarations: [
    AppComponent,
    G2048GameboardComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
