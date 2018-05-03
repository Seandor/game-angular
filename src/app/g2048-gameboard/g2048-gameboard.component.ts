import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'g2048-gameboard',
  templateUrl: './g2048-gameboard.component.html',
  styleUrls: ['./g2048-gameboard.component.css']
})
export class G2048GameboardComponent implements OnInit {
  @ViewChild('gameboard') canvasRef: ElementRef;
  ctx: CanvasRenderingContext2D;

  TILESIZE = 100;
  PADDING = Math.round(this.TILESIZE / 7);
  RADIUS = 10;
  BACKGROUNDCOLOR = '#BBADA0';

  oriWidth;
  oriHeight;

  constructor() { }

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    let size = { width: 4, height: 4 };
    this.setCanvasSize(size);
    this.drawBoard();
  }

  drawBoard = () => {
    let ctx = this.ctx;
    ctx.save();
    this.drawRoundRect(0, 0, this.oriWidth, this.oriHeight, this.RADIUS);
    ctx.fillStyle = this.BACKGROUNDCOLOR;
    ctx.fill();
    ctx.restore();
  };

  setCanvasSize = function (size) {
    const cols = size.width;
    const rows = size.height;

    const canvas = this.canvasRef.nativeElement;
    // set original size
    this.oriWidth = cols * this.TILESIZE + (cols + 1) * this.PADDING;
    this.oriHeight = rows * this.TILESIZE + (rows + 1) * this.PADDING;

    // query the various pixel ratios
    let devicePixelRatio = Math.ceil(window.devicePixelRatio) || 1,
      backingStoreRatio = this.ctx.webkitBackingStorePixelRatio ||
        this.ctx.mozBackingStorePixelRatio ||
        this.ctx.msBackingStorePixelRatio ||
        this.ctx.oBackingStorePixelRatio ||
        this.ctx.backingStorePixelRatio || 1,
      ratio = devicePixelRatio / backingStoreRatio;

    canvas.width = this.oriWidth * ratio;
    canvas.height = this.oriHeight * ratio;
    // upscale the canvas if the two ratios don't match
    if (devicePixelRatio !== backingStoreRatio) {
      canvas.style.width = this.oriWidth + 'px';
      canvas.style.height = this.oriHeight + 'px';

      // now scale the context to counter
      // the fact that we've manually scaled
      // our canvas element
      this.ctx.scale(ratio, ratio);
    }
  };

  drawRoundRect = (startX, startY, width, height, radius) => {
    let ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(startX + radius, startY + radius, radius, Math.PI, Math.PI * 3 / 2);
    ctx.lineTo(startX + width - radius, startY);
    ctx.arc(startX + width - radius, startY + radius, radius, Math.PI * 3 / 2, 0);
    ctx.lineTo(startX + width, startY + height - radius);
    ctx.arc(startX + width - radius, startY + height - radius, radius, 0, Math.PI / 2);
    ctx.lineTo(startX + radius, startY + height);
    ctx.arc(startX + radius, startY + height - radius, radius, Math.PI / 2, Math.PI);
    ctx.lineTo(startX, startY + radius);
  };
}
