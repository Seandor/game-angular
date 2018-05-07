import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { G2048GameboardComponent } from './g2048-gameboard/g2048-gameboard.component';
import { WindowRefService } from './window-ref.service';

@NgModule({
  declarations: [
    AppComponent,
    G2048GameboardComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    WindowRefService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
