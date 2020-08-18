import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

interface MoneyIn {
  deposit: string;
  fees: string;
  renovations: string;
  furniture: string;
}

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
  purchase: number;
  fees: number;
  management: number;
  maintainance: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  totalMoneyIn: number;
  totalMoneyOut: number;
  totalMoneyROI: number;
  achieveableRent: number;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.totalMoneyIn = 0;
    this.totalMoneyOut = 0;
    this.totalMoneyROI = 0;

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

    /*
      The following dual sections of code detect changes to the purchase-value and achieveable-rent fields,
      then trigger a function call which populates other fields with percentages of their respective values
    */
    this.analysisForm.get(['market', 'purchase_value']).valueChanges.subscribe((data) => {
      this.setPercentages(1);
      this.sum();
    });

    this.analysisForm.get(['market', 'achieveable_rent']).valueChanges.subscribe((data) => {
      this.setPercentages(1);
      this.sum();
    });

    // this.setPercentages(1);
    // this.sum();
  }

  sum() {
    let totalIn = 0;
    let totalOut = 0;
    const totalROI = 0;
    setTimeout(() => {
      Object.keys(this.analysisForm.value.moneyIn).forEach(key => {
        totalIn += this.analysisForm.value.moneyIn[key];
        this.totalMoneyIn = totalIn;
      });

      Object.keys(this.analysisForm.value.moneyOut).forEach(key => {
        totalOut += this.analysisForm.value.moneyOut[key];
        this.totalMoneyOut = totalOut;
      });

      // console.log(this.analysisForm.get(['ROI', 'monthly_cashFlow']).value + '/' + this.totalMoneyIn);
      this.totalMoneyROI = ( this.analysisForm.get(['market', 'purchase_value']).value && this.analysisForm.get(['market', 'achieveable_rent']).value )
                            ? (this.analysisForm.get(['ROI', 'annual_cashFlow']).value / this.totalMoneyIn) * 100
                            : 0;

    }, 500);
  }

  setPercentages(step: number) {
    setTimeout(() => {
      if ( step === 1 ) {
        this.analysisForm.patchValue({
          market: {
            outstanding_mortgage: this.analysisForm.value.market.purchase_value * 0.75,
          }
        });
    //   }
    // }, 250);

    // setTimeout(() => {
    //   if ( step === 2 ) {
        this.analysisForm.patchValue({
          moneyIn: {
            deposit: this.analysisForm.value.market.purchase_value * 0.25,
            fees: this.analysisForm.value.market.purchase_value * 0.04
          },
          moneyOut: {
            mortgage_payments: (this.analysisForm.value.market.outstanding_mortgage * 0.03) / 12,
            management: this.analysisForm.value.market.achieveable_rent * 0.12,
            maintainance: this.analysisForm.value.market.achieveable_rent * 0.10
          }
        });

        this.analysisForm.patchValue({
          ROI: {
            monthly_cashFlow: ( this.analysisForm.get(['market', 'purchase_value']).value && this.analysisForm.get(['market', 'achieveable_rent']).value )
                            ? this.analysisForm.get(['market', 'achieveable_rent']).value - this.totalMoneyOut
                            : 0,
            annual_cashFlow: ( this.analysisForm.get(['market', 'purchase_value']).value && this.analysisForm.get(['market', 'achieveable_rent']).value )
                            ? this.analysisForm.get(['ROI', 'monthly_cashFlow']).value * 12
                            : 0,
          }
        });

      }
    }, 500);

  }

  submit() {
    /* Object.keys(this.analysisForm.value.moneyIn).forEach(key => {
      console.log(this.analysisForm.value.moneyIn[key]);
    }); */
  }

}
