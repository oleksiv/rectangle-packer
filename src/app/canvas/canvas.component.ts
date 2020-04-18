import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('canvasElement', {static: false}) canvasElement: ElementRef;
  @Input() width: number;
  @Input() height: number;
  @Input() rects: any[];
  @Input() freeRects: any[];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // this.renderCanvas();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
  //
  // renderCanvas() {
  //   const canvas = this.canvasElement.nativeElement;
  //   canvas.width = this.width;
  //   canvas.height = this.height;
  //   const ctx = this.canvasElement.nativeElement.getContext('2d');
  //   ctx.lineWidth = 10;
  //   this.rects.forEach(rect => {
  //     ctx.lineWidth = 1;
  //     ctx.strokeStyle = '#000000';
  //     ctx.fillStyle = '#fff';
  //     ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  //     ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  //
  //     if (rect.shred) {
  //       ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  //       ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  //     }
  //     ctx.font = '25px Arial';
  //     ctx.fillStyle = '#000000';
  //     ctx.fillText(rect.width + '/' + rect.height + (rect.shred ? ' - Обрізок' : ''), rect.x + (rect.width / 2) - 100, rect.y + 25);
  //
  //     ctx.lineWidth = 30;
  //     ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  //
  //     if (rect.left) {
  //       ctx.beginPath();
  //       ctx.moveTo(rect.x + (ctx.lineWidth / 2 + 1), rect.y + 1);
  //       ctx.lineTo(rect.x + (ctx.lineWidth / 2 + 1), rect.y + rect.height - 2);
  //       ctx.stroke();
  //     }
  //
  //     if (rect.right) {
  //       ctx.beginPath();
  //       ctx.moveTo(rect.x + rect.width - (ctx.lineWidth / 2 + 1), rect.y + 1);
  //       ctx.lineTo(rect.x + rect.width - (ctx.lineWidth / 2 + 1), rect.y + rect.height - 2);
  //       ctx.stroke();
  //     }
  //
  //     if (rect.top) {
  //       ctx.beginPath();
  //       ctx.moveTo(rect.x + 1, rect.y + (ctx.lineWidth / 2 + 1));
  //       ctx.lineTo(rect.x + rect.width - 2, rect.y + (ctx.lineWidth / 2 + 1));
  //       ctx.stroke();
  //     }
  //
  //     if (rect.bottom) {
  //       ctx.beginPath();
  //       ctx.moveTo(rect.x + 1, rect.height + rect.y - (ctx.lineWidth / 2 + 1));
  //       ctx.lineTo(rect.x + rect.width - 2, rect.height + rect.y - (ctx.lineWidth / 2 + 1));
  //       ctx.stroke();
  //     }
  //   });
  //
  //   // ctx.save();
  //   //
  //   // this.rects.forEach(rect => {
  //   //   ctx.fillText(rect.height + 'mm', rect.y + (rect.height / 2), rect.x);
  //   // });
  //   // ctx.restore();
  // }

  getWidthPercentage(width) {
    return width * 100 / this.width;
  }

  getHeightPercentage(height) {
    return height * 100 / this.height;
  }
}
