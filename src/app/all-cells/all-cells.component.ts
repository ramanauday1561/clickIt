import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../dialog/dialog.component";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: 'app-all-cells',
  templateUrl: './all-cells.component.html',
  styleUrls: ['./all-cells.component.scss']
})
export class AllCellsComponent implements OnInit, OnChanges {

  @Input('noOfCells') noOfCells: number;
  public activeState: number;
  public overallCount = 0;
  public overallList: any;
  private lastRandom: number;
  private initialValue = 0;
  private initialValueSubject = new BehaviorSubject<number | null>(0);

  @Output() overallCountEmitter = new EventEmitter();
  @Output() resetEmitter = new EventEmitter();

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.setTimeoutRecursive();
    }, 300);
    this.initialValueSubject.subscribe(res => {
      if (res === 120) {
        if (localStorage.getItem('high-score')) {
          if (+localStorage.getItem('high-score') < this.overallCount) {
            localStorage.setItem('high-score', String(this.overallCount));
          }
        } else {
          localStorage.setItem('high-score', String(this.overallCount));
        }
        this.openDialog();
      }
    })
  }

  setTimeoutRecursive() {
    this.initialValueSubject.next(this.initialValue);
    if (this.initialValue !== 120) {
      this.activeState = this.randomInRange(1, this.noOfCells);
      setTimeout(this.setTimeoutRecursive.bind(this), 1000);
      this.initialValue++;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      disableClose: true,
      data: { count: this.overallCount }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.resetEmitter.emit(true);
      this.overallCount = 0;
      this.overallCountEmitter.emit(this.overallCount);
    });
  }

  randomInRange(from: number, to: number) {
    let random: number;
    do {
      random = Math.floor(Math.random() * (to - from)) + from;
    } while (random === this.lastRandom);
    this.lastRandom = random;
    return random;
  }

  clickListener(index: number) {
    if (this.activeState === index) {
      this.overallCount += 1;
    } else {
      this.overallCount = this.overallCount > 0 ? this.overallCount - 1 : 0;
    }
    this.overallCountEmitter.emit(this.overallCount);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.noOfCells) {
      this.overallList = new Array(this.noOfCells).fill(0);
    }
  }

}
