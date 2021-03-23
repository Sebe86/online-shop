import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

interface Inventory {
  amount: number,
  box: string
}

interface InventoryItem {
  itemId: string,
  productId: string,
  inventory: Inventory[]
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  colors = [
    'weiss', 'weisskoenigsblau', 'weissanthrazit',
    'schwarz', 'schwarzrot',
    'marine', 'marinehellblau', 'marineblau',
    'anthrazit', 'anthrazitweiss', 'anthrazithellblau',
    'hellblau', 'hellblauanthrazit', 'hellblaumarine',
    'koenigsblau', 'koenigsblauweiss',
    'blau', 'blaumarine',
    'rot', 'rotschwarz',
    'violett', 'rosa'
  ];

  sizes = [
    '52V', '54V', '56V', '58V', '60V', '62V', '64V', '66V', '68V', '70V', '72V'
  ];

  lengths = [
    '75', '80', '85'
  ];

  colorSelectForm!: FormGroup;
  sizeSelectForm!: FormGroup;
  lengthSelectForm!: FormGroup;

  selectedColor = '';
  selectedSize = '';
  selectedLength = '';

  inventoryForm!: FormGroup;
  inventoryFormArray!: FormArray;

  inventoryItem!: InventoryItem;
  newInventoryItem = true;

  subscription!: Subscription;

  constructor(
    private firestore: AngularFirestore,
    private formBuilder: FormBuilder) {}

  ngOnInit(){
    this.initForm();
  }


  onSelectColor() {
    this.selectedColor = this.colorSelectForm.value.colorSelected;
    if (this.selectedSize && this.selectedLength) {
      const itemId = `rippd2019${this.selectedColor}${this.selectedSize}${this.selectedLength}`;
      this.loadInventoryItem(itemId);
    }
  }
 
  
  onSelectSize() {
    this.selectedSize = this.sizeSelectForm.value.sizeSelected;
    if (this.selectedColor && this.selectedLength) {
      const itemId = `rippd2019${this.selectedColor}${this.selectedSize}${this.selectedLength}`;
      this.loadInventoryItem(itemId);
    }
  }


  onSelectLength() {
    this.selectedLength = this.lengthSelectForm.value.lengthSelected;
    if (this.selectedSize && this.selectedColor) {
      const itemId = `rippd2019${this.selectedColor}${this.selectedSize}${this.selectedLength}`;
      this.loadInventoryItem(itemId);
    }
  }


  onAddInventoryFormGroup() {
    this.inventoryFormArray.push(
      this.formBuilder.group({
        amount: [0],
        box: ['']
      }));
  }


  onDeleteFormArrayControl(formArray: FormArray, index: number) {
    formArray.removeAt(index);
  }


  onCreateInventoryItem() {
    if (!this.inventoryItem) {
      const docId = `rippd2019${this.selectedColor}${this.selectedSize}${this.selectedLength}`;
      const data = {
        itemId: docId,
        productId: `rippd2019${this.selectedColor}`,
        inventory: this.inventoryFormArray.value
      }
      this.firestore.collection('inventory').doc(docId).set(data)
      .then(() => {
        this.resetInventoryItem();
      });
    }
  }


  onSaveInventoryItem() {
    this.inventoryItem.inventory = this.inventoryFormArray.value;
    this.subscription.unsubscribe();
    this.firestore.collection('inventory').doc(this.inventoryItem.itemId).update(this.inventoryItem)
      .then(() => {
        this.resetInventoryItem();
      });
  }


  initForm() {
    this.colorSelectForm = this.formBuilder.group({colorSelected: ['']});
    this.sizeSelectForm = this.formBuilder.group({sizeSelected: ['']});
    this.lengthSelectForm = this.formBuilder.group({lengthSelected: ['']});

    this.inventoryFormArray = this.formBuilder.array([
      this.formBuilder.group({
        amount: [0],
        box: ['']
      })
    ]);
    this.inventoryForm = this.formBuilder.group({
      inventory: this.inventoryFormArray
    });
  }

  resetInventoryItem() {
    this.newInventoryItem = true;
    this.inventoryItem = {itemId: '', productId: '', inventory: []};
    this.selectedColor = '';
    this.selectedSize = '';
    this.selectedLength = '';
    this.initForm();
  }


  loadInventoryItem(itemId: string) {
    this.subscription = this.firestore.collection('inventory').doc(itemId).valueChanges()
    .subscribe(data => {
      if (data) {
        this.newInventoryItem = false;
        this.inventoryItem = data as InventoryItem;

        if (this.inventoryItem.inventory.length > this.inventoryFormArray.length) {
          for (let i = 0; i < this.inventoryItem.inventory.length - 1; i++) {
            this.onAddInventoryFormGroup();
          }
        }

        this.inventoryForm.patchValue({inventory: this.inventoryItem.inventory});
      }
    });
  }
}
