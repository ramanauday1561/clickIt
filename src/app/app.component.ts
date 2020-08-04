import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public noOfCells: number;
  public timerValue: number;
  public buttonStatus: boolean = true;
  public stopTheGame: boolean = false;

  allTypes = [{
    level: 'Easy',
    grids: 3
  }, {
    level: 'Medium',
    grids: 4
  }, {
    level: 'Hard',
    grids: 5
  }];
  public overallCount: number = 0;
  showChoose: boolean;
  resetGameValue: boolean = false;

  ngOnInit(): void {
    this.showChoose = true;
  }

  noOfCellsHandler(grids: number) {
    this.showChoose = false;
    this.noOfCells = grids * grids;
  }

  resetApp() {
    this.showChoose = true;
    this.noOfCells = 0;
  }

  resetGame() {
    if (this.buttonStatus) {
      this.resetGameValue = true;
      this.stopTheGame = true;
    } else {
      this.stopTheGame = false;
    }
    this.buttonStatus = !this.buttonStatus;
  }

  getHighScore() {
    if (localStorage.getItem('high-score')) {
      return +localStorage.getItem('high-score');
    }
    return 0
  }
}
