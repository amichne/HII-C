/*
    Description: This file defines the data display for the careplans component
    Date: 3/19/18
    Version: 1.0
    Creator: Steven Tran
*/
import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';

import { ScratchPadService } from '../../services/scratchPad.service';

import { ContextMenuComponent } from '../contextMenu/contextMenu.component';

import { CarePlan } from '../../models/carePlan.model';

@Component({
  selector: 'careplanDisplay',
  templateUrl: './carePlanDisplay.html'
})
export class CarePlanDisplay {
  // The currently selected careplan in the list.
  selected: CarePlan;

  // Whether the checkbox for checking all conditions is currently checked or not.
  isAllChecked: boolean = false;

  // This is the array of careplans to be displayed
  @Input() carePlans: Array<CarePlan>;
  @Output() careplanSelected: EventEmitter<CarePlan> = new EventEmitter();

  @ViewChild('menu', { static: false }) menu !: ContextMenuComponent;


  // ===============================================================================================================================================
  // ================================================================== EVENT METHODS ==============================================================
  // ==================================================================---------------==============================================================

  constructor(private scratchPadService: ScratchPadService) { }

  ngOnInit() { }

  //=================================================================== CONTEXT MENU ==============================================================

  // Can only access view child after the view has been initialized.
  ngAfterViewInit() {
    // NOTE: 'exec' functions must be bound to 'this' to access scratchPadService.
    // This is a strange behavior with scoping in Typescript/Javascript.

    // Add options to the context menu shown when right clicking careplans.
    this.menu.addOption({
      'icon': 'glyphicon-pencil',
      'text': 'Add to Scratch Pad',
      'exec': function (plan) {
        this.scratchPadService.addCarePlan(plan);
      }.bind(this)
    });

    this.menu.addOption({
      'icon': 'glyphicon-stats',
      'text': 'Add to Trend Tool',
      'exec': function (plan) {
        console.log(plan);
      }.bind(this)
    });

    this.menu.addOption({
      'icon': 'glyphicon-random',
      'text': 'Open Association Tool',
      'exec': function (plan) {
        console.log(plan);
      }.bind(this)
    });
  }

  // FOR MAINTAINING CHECK STATE AFTER LOSING FOCUS

  //whenver a line is selected
  selectCarePlan(carePlan: CarePlan) {
    this.selected = carePlan;
    this.careplanSelected.emit(this.selected);
    for (let c of this.scratchPadService.totalCareplans) {
      c['selected'] = (c.id == this.selected.id);
    }
  }

  checkClicked(carePlan: CarePlan) {
    if (this.scratchPadService.checkedMapCareplans.get(carePlan)) {
      return true;
    }

    return false;
  }

  // WHENEVER A CHECKBOX IS CLICKED OR UNCLICKED, IT REGISTERS IT IN THE SCRATCHPADSERVICE (not actually the scratch pad yet)
  checkCarePlan(checked: boolean, checkedCarePlan: CarePlan) {
    this.scratchPadService.checkCarePlan(checked, checkedCarePlan);
  }

  expand(parent: string) {
    /*
    for (let c of this.carePlans) {
        if (c.parent == parent) {
            c.isVisible = true;
            c.parent = "";
            c.isParent = false;
        }
    }
    */
  }

  // Check or uncheck all conditions.
  checkAllCarePlans(checked: boolean) {
    this.isAllChecked = checked;
    for (let carePlan of this.carePlans) {
      this.scratchPadService.checkCarePlan(checked, carePlan);
    }
  }

}
