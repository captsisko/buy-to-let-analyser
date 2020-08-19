import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

/* interface MoneyIn {
  deposit: string;
  fees: string;
  renovations: string;
  furniture: string;
} */

@Component({
  selector: 'app-analyser',
  templateUrl: './analyser.component.html',
  styleUrls: ['./analyser.component.scss']
})

export class AnalyserComponent implements OnInit {
  analysisForm: FormGroup;
  mortgage: number;
  mortgagePayments: number;
  deposit: number;
  // purchase: number;
  fees: number;
  management: number;
  // maintainance: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  totalMoneyIn: number;
  totalMoneyOut: number;
  totalMoneyROI: number;
  achieveableRent: number;
  purchaseValue: number;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.totalMoneyIn = 0;
    this.totalMoneyOut = 0;
    this.totalMoneyROI = 0;
    this.purchaseValue = 0;
    this.achieveableRent = 0;

    /*
      setting up the reactive form
    */
    this.analysisForm  = new FormGroup({
      market : new FormGroup({
        market_value: new FormControl({value: 0}, Validators.required),
        purchase_value: new FormControl(0, Validators.required),
        achieveable_rent: new FormControl(0, Validators.required),
        outstanding_mortgage: new FormControl({value: 0})
      }),
      moneyIn : new FormGroup({
        deposit: new FormControl(0),
        fees: new FormControl(0),
        renovations: new FormControl(0),
        furniture: new FormControl(0)
      }),
      moneyOut : new FormGroup({
        mortgage_payments: new FormControl(0),
        management: new FormControl(0),
        maintainance: new FormControl(0),
        bills: new FormControl(0)
      }),
      ROI: new FormGroup({
        monthly_cashFlow: new FormControl(0),
        annual_cashFlow: new FormControl(0)
      })
    });
  }

  trigger() {
    this.sum();
  }

  sum() {
    let totalIn = 0;
    let totalOut = 0;

    setTimeout(() => {
      Object.keys(this.analysisForm.value.moneyIn).forEach(key => {
        totalIn += this.analysisForm.value.moneyIn[key];
        this.totalMoneyIn = totalIn;
      });

      Object.keys(this.analysisForm.value.moneyOut).forEach(key => {
        totalOut += this.analysisForm.value.moneyOut[key];
        this.totalMoneyOut = totalOut;
      });
    }, 500);
  }

  setPercentages(section: string) {

    if ( section === 'purchase_value' ) {
      this.analysisForm.get(['market', 'purchase_value']).valueChanges.subscribe((value) => {
        this.analysisForm.patchValue({
          market: {
            outstanding_mortgage: value * 0.75,
          },
          moneyIn: {
            deposit: value * 0.25,
            fees: value * 0.04,
          },
          moneyOut: {
            mortgage_payments: ((value * 0.75) * 0.03) / 12,
          }
        });

        this.purchaseValue = value;
      });
    }

    if ( section === 'achieveable_rent' ) {
      this.analysisForm.get(['market', 'achieveable_rent']).valueChanges.subscribe((value) => {
        this.analysisForm.patchValue({
          moneyOut: {
            management: value * 0.12,
            maintainance: value * 0.10
          }
        });

        this.achieveableRent = value;
      });
    }

    // set the ROI values
    this.ROI();

    // set the summations
    this.sum();

  }

  ROI() {
    setTimeout(() => {

      if ( this.purchaseValue && this.achieveableRent ) {
        console.log('GOT BOTH!');
        this.analysisForm.patchValue({
          ROI: {
            monthly_cashFlow: this.purchaseValue && this.achieveableRent
              ? this.analysisForm.get(['market', 'achieveable_rent']).value - this.totalMoneyOut
              : 0,
            annual_cashFlow: this.purchaseValue && this.achieveableRent
              ? this.analysisForm.get(['ROI', 'monthly_cashFlow']).value * 12
              : 0,
          }
        });
      }

      // this sets the annual return-on-investment percentage
      this.totalMoneyROI = (this.analysisForm.get(['ROI', 'annual_cashFlow']).value / this.totalMoneyIn) * 100;

    }, 2000);

  }

  submit() {
    /* Object.keys(this.analysisForm.value.moneyIn).forEach(key => {
      console.log(this.analysisForm.value.moneyIn[key]);
    }); */
  }

}
