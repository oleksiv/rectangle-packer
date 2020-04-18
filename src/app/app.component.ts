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
