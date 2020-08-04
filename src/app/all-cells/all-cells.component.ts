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
  @Input('resetGameHandler') resetGameHandler: boolean;
  @Input('stopTheGame') stopTheGame: boolean;
  public activeState: number;
  public overallCount = 0;
  public overallList: any;
  private lastRandom: number;
  private initialValue = 0;
  public previousStopValue: number;
  private currentActiveTimeout: any;
  private stopGameValue: boolean = false;
  private currentIndexClick: boolean = false;
  private initialValueSubject = new BehaviorSubject<number | null>(0);

  @Output() overallCountEmitter = new EventEmitter();
  @Output() resetEmitter = new EventEmitter();
  @Output() resetGameHandlerValue = new EventEmitter();
  @Output() emitTimerValue = new EventEmitter();

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
    if (this.initialValue < 120 && !this.stopGameValue) {
      this.currentIndexClick = false;
      this.activeState = this.randomInRange(1, this.noOfCells);
      this.currentActiveTimeout = setTimeout(this.setTimeoutRecursive.bind(this), 1000);
      this.initialValue++;
      this.emitTimerValue.emit(this.initialValue);
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
    if (this.activeState === index && !this.currentIndexClick) {
      this.overallCount += 1;
      this.currentIndexClick = true;
    } else {
      this.overallCount = this.overallCount > 0 ? this.overallCount - 1 : 0;
    }
    this.overallCountEmitter.emit(this.overallCount);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.noOfCells) {
      this.overallList = new Array(this.noOfCells).fill(0);
    }
    if (this.resetGameHandler) {
      clearTimeout(this.currentActiveTimeout);
      setTimeout(() => {
        // this.initialValue = 0;
        this.overallCount = 0;
        this.overallCountEmitter.emit(0);
        this.setTimeoutRecursive();
        this.resetGameHandlerValue.emit(false);
      }, 300);
    }
    if (this.stopTheGame) {
      this.stopGameHandler();
    } else {
      this.restartTheGame();
    }
  }

  stopGameHandler() {
    this.previousStopValue = this.initialValue;
    this.stopGameValue = true;
    this.initialValue = 0;
    this.overallCount = 0;
    this.activeState = -1;
    this.initialValueSubject.next(this.initialValue);
    this.emitTimerValue.emit(this.initialValue);
    this.overallCountEmitter.emit(this.overallCount)
    clearTimeout(this.currentActiveTimeout);
  }

  restartTheGame() {
    if (this.previousStopValue || this.previousStopValue == 0) {
      setTimeout(() => {
        this.stopGameValue = false;
        this.initialValue = this.previousStopValue;
        this.setTimeoutRecursive();
      }, 200);
    }
  }

}
