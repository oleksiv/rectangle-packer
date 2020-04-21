import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MaxRectsPacker} from 'maxrects-packer';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {filter, map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('wrapper', {read: ElementRef, static: false}) wrapper: ElementRef;
  form: FormGroup;
  packer$: Observable<MaxRectsPacker>;
  lines$: Observable<any>;
  length$: Observable<any>;

  constructor(private fb: FormBuilder, private renderer2: Renderer2) {
    this.form = this.fb.group({
      width: this.fb.control(500),
      height: this.fb.control(500),
      items: this.fb.array([
        this.fb.group({
          width: 100,
          height: 100,
          left: true,
          right: true,
          top: true,
          bottom: true,
        }),
        this.fb.group({
          width: 100,
          height: 100,
          left: false,
          right: false,
          top: false,
          bottom: false,
        }),
        this.fb.group({
          width: 200,
          height: 200,
          left: false,
          right: false,
          top: false,
          bottom: false,
        }),
        this.fb.group({
          width: 290,
          height: 490,
          left: false,
          right: true,
          top: true,
          bottom: false,
        }),
      ])
    });
  }

  ngOnInit(): void {
    const options = {
      smart: false,
      pot: false,
      square: false,
      allowRotation: false,
      tag: false,
      border: 5
    }; // Set packing options


    this.packer$ = this.form.valueChanges.pipe(
      startWith(this.form.value),
      filter(form => form.width && form.height),
      map(form => {
        const packer = new MaxRectsPacker(
          parseInt(form.width, 10),
          parseInt(form.height, 10),
          0,
          options
        ); // width, height, padding, options
        const items = form.items;
        // packer.reset()
        items.filter(item => item.width && item.height).forEach(item => {
          packer.add({
            width: parseInt(item.width, 10),
            height: parseInt(item.height, 10),
            left: item.left,
            right: item.right,
            top: item.top,
            bottom: item.bottom
          } as any);
        });
        console.log(packer.bins);
        while (packer.bins.map(bin => bin.freeRects).flat().length) {
          const rects = packer.bins.map(bin => bin.freeRects).flat();
          // get the larges rect
          const sizes = rects.map(rect => rect.width * rect.height);
          const maxValue = Math.max(...sizes);
          const maxSizeIndex = sizes.indexOf(maxValue);
          const maxRect = rects[maxSizeIndex];
          packer.add({width: maxRect.width, height: maxRect.height, shred: true} as any);
        }
        return packer;
      })
    );

    this.lines$ = this.packer$.pipe(
      map(packer => {
        const rects = packer.bins.map(bin => bin.rects.filter((rect: any) => !rect.shred)).flat();


        const arr2 = [];

        rects.forEach(a => {
          // horizontal top
          arr2.push({
            x: a.x,
            y: a.y,
            x1: a.x + a.width,
            y1: a.y,
          });
          // horizontal bottom
          arr2.push({
            x: a.x,
            y: a.y + a.height,
            x1: a.x + a.width,
            y1: a.y + a.height,
          });

          // vertical left
          arr2.push({
            x: a.x,
            y: a.y,
            x1: a.x,
            y1: a.y + a.height,
          });

          // vertical right
          arr2.push({
            x: a.x + a.width,
            y: a.y,
            x1: a.x + a.width,
            y1: a.y + a.height,
          });
        });


        const arr3 = [];

        arr2.forEach(a => {
          const res = arr3.find(c => Array.isArray(c) ? c.some(b => {

            // vertical
            if (b.x === b.x1 && a.x === a.x1) {
              if (a.x === b.x) {
                if ((a.y <= b.y1) && (a.y1 >= b.y)) {
                  return true;
                }
              }
            } else if (b.y === b.y1 && a.y === a.y1) {
              if (a.y === b.y) {
                if ((a.x <= b.x1) && (a.x1 >= b.x)) {
                  return true;
                }
              }
            }

            return false;
          }) : false);

          if (res) {
            res.push(a);
          } else {
            arr3.push([a]);
          }
        });


        return arr3.map(a => a.reduce((acc, curr) => {
          if (Object.keys(acc).length === 0) {
            acc = {...curr};
          }

          if (acc.x > curr.x) {
            acc.x = curr.x;
          }

          if (acc.y > curr.y) {
            acc.y = curr.y;
          }

          if (acc.x1 < curr.x1) {
            acc.x1 = curr.x1;
          }

          if (acc.y1 < curr.y1) {
            acc.y1 = curr.y1;
          }

          return acc;
        }, {}));
      })
    );

    this.length$ = this.lines$.pipe(
      map(lines => lines.map(b => {
        // vertical
        if (b.x === b.x1) {
          return b.y1 - b.y;
        }

        return b.x1 - b.x;
      }).reduce((acc, curr) => {
        return acc + curr;
      }, 0))
    );
  }

  addMore() {
    this.items.push(this.fb.group({
      width: this.fb.control(null),
      height: this.fb.control(null),
      left: false,
      right: false,
      top: false,
      bottom: false,
    }));
  }

  get items() {
    return this.form.get('items') as FormArray;
  }
}
