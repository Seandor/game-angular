import { WindowRefService } from './../window-ref.service';
import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

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

  constructor(private winRef: WindowRefService) {
    console.log('Native window obj', winRef.nativeWindow);
   }

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    // this.ctx.imageSmoothingEnabled = true;
    let size = { width: 4, height: 4 };
    this.setCanvasSize(size);
    this.drawBoard();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown($event) {
    console.log('keyCode: ' + $event.keyCode);
  }

  drawBoard () {
    let ctx = this.ctx;
    ctx.save();
    this.drawRoundRect(0, 0, this.oriWidth, this.oriHeight, this.RADIUS);
    ctx.fillStyle = this.BACKGROUNDCOLOR;
    ctx.fill();
    ctx.restore();
  };

  setCanvasSize (size) {
    const cols = size.width;
    const rows = size.height;

    const canvas = this.canvasRef.nativeElement;
    // set original size
    this.oriWidth = cols * this.TILESIZE + (cols + 1) * this.PADDING;
    this.oriHeight = rows * this.TILESIZE + (rows + 1) * this.PADDING;

    // query the various pixel ratios
    let devicePixelRatio = Math.ceil(this.winRef.nativeWindow.devicePixelRatio) || 1;
    // let backingStoreRatio = this.ctx.webkitBackingStorePixelRatio ||
    //     this.ctx.mozBackingStorePixelRatio ||
    //     this.ctx.msBackingStorePixelRatio ||
    //     this.ctx.oBackingStorePixelRatio ||
    //     this.ctx.backingStorePixelRatio || 1;
    let backingStoreRatio = 1;
    let ratio = devicePixelRatio / backingStoreRatio;

    canvas.width = this.oriWidth * ratio;
    canvas.height = this.oriHeight * ratio;
    // // upscale the canvas if the two ratios don't match
    if (devicePixelRatio !== backingStoreRatio) {
      canvas.style.width = this.oriWidth + 'px';
      canvas.style.height = this.oriHeight + 'px';

      // now scale the context to counter
      // the fact that we've manually scaled
      // our canvas element
      this.ctx.scale(ratio, ratio);
    }
  };

  drawRoundRect (startX, startY, width, height, radius) {
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

interface Position {
  row: number,
  col: number
}

class Tile {
  private row: number;
  private col: number;
  private value: number;
  private previousPosition: Position;

  constructor(position: Position, value: number) {
    this.row = position.row;
    this.col = position.col;
    this.value = value || 2;

    // for animation
    // mergedFrom saves the other tile's position which has merged to the tile.
    // this.previousPosition = null;
    // this.mergedFrom = null;
  }

  getPosition () {
    return { row: this.row, col: this.col };
  }

  savePosition () {
    this.previousPosition = { row: this.row, col: this.col };
  }

  updatePostion (position) {
    this.row = position.row;
    this.col = position.col;
  };

  serialize () {
    return {
      position: {
        row: this.row,
        col: this.col
      },
      value: this.value
    };
  };
}

class Grid {
  gridWidth: number;
  gridHeight: number;
  cells;

  constructor (gridWidth, gridHeight) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.cells = this.init();
  }

  // this.cells is just a 2-D Array
  init () {
    var row, idx, jdx;
    var cells = [];
    for (idx = 0; idx < this.gridHeight; idx++) {
      row = [];
      for (jdx = 0; jdx < this.gridWidth; jdx++) {
        row[jdx] = null;
      }
      cells[idx] = row;
    }
    return cells;
  };

  getWidth () {
    return this.gridWidth;
  };

  getHeight () {
    return this.gridHeight;
  };

  // Given a direction vector and start cell to traverse the grid
  // return a list of tiles
  traverseAndSetTile (startPos, directionVector, numSteps, mergedLine) {
    // 0: UP 1: RIGHT 2: DOWN 3: LEFT
    var row, col;
    var traversal = [];
    var position;
    for (var i = 0; i < numSteps; i++) {
      row = startPos.row + i * directionVector.row;
      col = startPos.col + i * directionVector.col;
      if (mergedLine === undefined) {
        // only traverse
        traversal.push(this.cells[row][col]);
      } else {
        // set tile
        if (mergedLine[i] !== null) {
          position = { row: row, col: col };
          mergedLine[i].savePosition();
          mergedLine[i].updatePostion(position);
          this.setTile(mergedLine[i]);
        } else {
          this.cells[row][col] = null;
        }
      }
    }
    return traversal;
  };

  // Find an available random cell position
  randomAvailableCells () {
    var cells = this.availableCells();
    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)];
    }
  };

  // Return a list of available cell index
  availableCells () {
    var cells = [];
    this.eachCell(function (row, col, tile) {
      if (tile === null) {
        cells.push({ row: row, col: col });
      }
    });
    return cells;
  };

  // Return true if there is cell available
  cellsAvailable () {
    for (var row = 0; row < this.gridHeight; row++) {
      for (var col = 0; col < this.gridWidth; col++) {
        if (!this.cells[row][col]) {
          return true;
        }
      }
    }
  };

  // iteration of the grid
  eachCell (callback) {
    for (var row = 0; row < this.gridHeight; row++) {
      for (var col = 0; col < this.gridWidth; col++) {
        callback(row, col, this.cells[row][col]);
      }
    }
  };

  setTile (tile) {
    this.cells[tile.row][tile.col] = tile;
  };

  // return null if there is no tile
  getTile (position) {
    if (this.withinBounds(position)) {
      return this.cells[position.row][position.col];
    } else {
      return null;
    }
  };

  withinBounds (position) {
    return position.row >= 0 && position.row < this.gridHeight &&
      position.col >= 0 && position.col < this.gridWidth;
  };

  serialize () {
    var row, idx, jdx;
    var cells = [];
    for (idx = 0; idx < this.gridHeight; idx++) {
      row = [];
      for (jdx = 0; jdx < this.gridWidth; jdx++) {
        row.push(this.cells[idx][jdx] ? this.cells[idx][jdx].serialize() : null);
      }
      cells[idx] = row;
    }
    return {
      width: this.gridWidth,
      height: this.gridHeight,
      cells: this.cells
    };
  };
}


